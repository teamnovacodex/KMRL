const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'kmrl_secret_key_2024';

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'kmrl_train_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// 1. Authentication Routes
app.post('/api/auth/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Update last login
    await pool.execute(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Train Management Routes
app.get('/api/trains', authenticateToken, async (req, res) => {
  try {
    const [trains] = await pool.execute(`
      SELECT t.*, 
             fc.status as fitness_status, fc.expiry_date as fitness_expiry,
             COUNT(jc.id) as open_job_cards,
             SUM(CASE WHEN jc.priority = 'Critical' THEN 1 ELSE 0 END) as critical_job_cards,
             bc.advertiser, bc.campaign_name, bc.required_exposure_hours, bc.current_exposure_hours
      FROM trains t
      LEFT JOIN fitness_certificates fc ON t.id = fc.train_id
      LEFT JOIN job_cards jc ON t.id = jc.train_id AND jc.status IN ('Open', 'In Progress')
      LEFT JOIN branding_contracts bc ON t.id = bc.train_id AND bc.status = 'Active'
      GROUP BY t.id
      ORDER BY t.train_number
    `);

    res.json(trains);
  } catch (error) {
    console.error('Get trains error:', error);
    res.status(500).json({ error: 'Failed to fetch trains' });
  }
});

app.get('/api/trains/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [trains] = await pool.execute(`
      SELECT t.*, 
             fc.status as fitness_status, fc.expiry_date as fitness_expiry, fc.score as fitness_score,
             iot.engine_health, iot.brake_health, iot.door_health, iot.ac_health, iot.battery_level,
             iot.vibration_level, iot.temperature, iot.recorded_at as iot_timestamp
      FROM trains t
      LEFT JOIN fitness_certificates fc ON t.id = fc.train_id
      LEFT JOIN iot_data iot ON t.id = iot.train_id
      WHERE t.id = ?
      ORDER BY iot.recorded_at DESC
      LIMIT 1
    `, [id]);

    if (trains.length === 0) {
      return res.status(404).json({ error: 'Train not found' });
    }

    res.json(trains[0]);
  } catch (error) {
    console.error('Get train error:', error);
    res.status(500).json({ error: 'Failed to fetch train details' });
  }
});

// 3. Job Cards Routes
app.get('/api/job-cards', authenticateToken, async (req, res) => {
  try {
    const { trainId, status, priority } = req.query;
    let query = `
      SELECT jc.*, t.train_number 
      FROM job_cards jc
      JOIN trains t ON jc.train_id = t.id
      WHERE 1=1
    `;
    const params = [];

    if (trainId) {
      query += ' AND jc.train_id = ?';
      params.push(trainId);
    }
    if (status) {
      query += ' AND jc.status = ?';
      params.push(status);
    }
    if (priority) {
      query += ' AND jc.priority = ?';
      params.push(priority);
    }

    query += ' ORDER BY jc.created_date DESC';

    const [jobCards] = await pool.execute(query, params);
    res.json(jobCards);
  } catch (error) {
    console.error('Get job cards error:', error);
    res.status(500).json({ error: 'Failed to fetch job cards' });
  }
});

app.post('/api/job-cards', authenticateToken, [
  body('trainId').notEmpty().withMessage('Train ID is required'),
  body('type').isIn(['Preventive', 'Corrective', 'Emergency', 'Inspection']).withMessage('Invalid job card type'),
  body('priority').isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Invalid priority'),
  body('description').notEmpty().withMessage('Description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { trainId, workOrderNumber, type, priority, description, estimatedHours, assignedTechnician, dueDate } = req.body;

    const [result] = await pool.execute(`
      INSERT INTO job_cards (train_id, work_order_number, type, priority, status, description, 
                           estimated_hours, assigned_technician, due_date, created_by, created_date)
      VALUES (?, ?, ?, ?, 'Open', ?, ?, ?, ?, ?, NOW())
    `, [trainId, workOrderNumber, type, priority, description, estimatedHours, assignedTechnician, dueDate, req.user.userId]);

    res.status(201).json({ id: result.insertId, message: 'Job card created successfully' });
  } catch (error) {
    console.error('Create job card error:', error);
    res.status(500).json({ error: 'Failed to create job card' });
  }
});

// 4. IoT Data Routes
app.get('/api/iot-data/:trainId', authenticateToken, async (req, res) => {
  try {
    const { trainId } = req.params;
    const { limit = 100 } = req.query;

    const [iotData] = await pool.execute(`
      SELECT * FROM iot_data 
      WHERE train_id = ? 
      ORDER BY recorded_at DESC 
      LIMIT ?
    `, [trainId, parseInt(limit)]);

    res.json(iotData);
  } catch (error) {
    console.error('Get IoT data error:', error);
    res.status(500).json({ error: 'Failed to fetch IoT data' });
  }
});

app.post('/api/iot-data', authenticateToken, async (req, res) => {
  try {
    const { trainId, mileage, engineHealth, brakeHealth, doorHealth, acHealth, batteryLevel, vibrationLevel, temperature } = req.body;

    await pool.execute(`
      INSERT INTO iot_data (train_id, mileage, engine_health, brake_health, door_health, ac_health, 
                          battery_level, vibration_level, temperature, recorded_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [trainId, mileage, engineHealth, brakeHealth, doorHealth, acHealth, batteryLevel, vibrationLevel, temperature]);

    res.status(201).json({ message: 'IoT data recorded successfully' });
  } catch (error) {
    console.error('Record IoT data error:', error);
    res.status(500).json({ error: 'Failed to record IoT data' });
  }
});

// 5. Branding Contracts Routes
app.get('/api/branding-contracts', authenticateToken, async (req, res) => {
  try {
    const [contracts] = await pool.execute(`
      SELECT bc.*, t.train_number 
      FROM branding_contracts bc
      JOIN trains t ON bc.train_id = t.id
      ORDER BY bc.start_date DESC
    `);

    res.json(contracts);
  } catch (error) {
    console.error('Get branding contracts error:', error);
    res.status(500).json({ error: 'Failed to fetch branding contracts' });
  }
});

// 6. Optimization Routes
app.post('/api/optimization/run', authenticateToken, async (req, res) => {
  try {
    const { objectives, constraints } = req.body;

    // Get all trains with current status
    const [trains] = await pool.execute(`
      SELECT t.*, 
             fc.status as fitness_status, fc.expiry_date as fitness_expiry,
             COUNT(jc.id) as open_job_cards,
             SUM(CASE WHEN jc.priority = 'Critical' THEN 1 ELSE 0 END) as critical_job_cards
      FROM trains t
      LEFT JOIN fitness_certificates fc ON t.id = fc.train_id
      LEFT JOIN job_cards jc ON t.id = jc.train_id AND jc.status IN ('Open', 'In Progress')
      GROUP BY t.id
    `);

    // Simple optimization logic (can be replaced with ML model)
    const optimizationResult = {
      timestamp: new Date().toISOString(),
      totalScore: 0.85,
      selectedTrains: [],
      standbyTrains: [],
      maintenanceTrains: [],
      reasoning: []
    };

    trains.forEach(train => {
      let score = 1.0;
      let decision = 'Service';
      let reasons = [];

      // Apply business rules
      if (train.fitness_status === 'Expired') {
        decision = 'Maintenance';
        score = 0.2;
        reasons.push('Expired fitness certificate');
      } else if (train.critical_job_cards > 0) {
        decision = 'Maintenance';
        score = 0.3;
        reasons.push('Critical job cards pending');
      } else if (train.open_job_cards > 0) {
        decision = 'Standby';
        score = 0.6;
        reasons.push('Open job cards');
      } else if (train.cleaning_status === 'Pending') {
        decision = 'Standby';
        score = 0.7;
        reasons.push('Cleaning required');
      }

      if (decision === 'Service') {
        optimizationResult.selectedTrains.push(train.id);
      } else if (decision === 'Standby') {
        optimizationResult.standbyTrains.push(train.id);
      } else {
        optimizationResult.maintenanceTrains.push(train.id);
      }

      optimizationResult.reasoning.push({
        trainId: train.id,
        decision,
        score,
        primaryReasons: reasons,
        secondaryFactors: []
      });
    });

    // Store optimization result
    const [result] = await pool.execute(`
      INSERT INTO optimization_results (timestamp, total_score, selected_trains, standby_trains, 
                                      maintenance_trains, reasoning, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      optimizationResult.timestamp,
      optimizationResult.totalScore,
      JSON.stringify(optimizationResult.selectedTrains),
      JSON.stringify(optimizationResult.standbyTrains),
      JSON.stringify(optimizationResult.maintenanceTrains),
      JSON.stringify(optimizationResult.reasoning),
      req.user.userId
    ]);

    res.json({ ...optimizationResult, id: result.insertId });
  } catch (error) {
    console.error('Optimization error:', error);
    res.status(500).json({ error: 'Optimization failed' });
  }
});

// 7. Analytics Routes
app.get('/api/analytics/performance', authenticateToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const [performance] = await pool.execute(`
      SELECT DATE(timestamp) as date,
             AVG(total_score) as avg_score,
             COUNT(*) as optimizations_run
      FROM optimization_results 
      WHERE timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
    `, [parseInt(days)]);

    res.json(performance);
  } catch (error) {
    console.error('Get performance analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch performance analytics' });
  }
});

app.get('/api/analytics/trains', authenticateToken, async (req, res) => {
  try {
    const [analytics] = await pool.execute(`
      SELECT 
        COUNT(*) as total_trains,
        SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active_trains,
        SUM(CASE WHEN status = 'Maintenance' THEN 1 ELSE 0 END) as maintenance_trains,
        AVG(total_mileage) as avg_mileage,
        AVG(health_score) as avg_health_score
      FROM trains
    `);

    res.json(analytics[0]);
  } catch (error) {
    console.error('Get train analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch train analytics' });
  }
});

// 8. Historical Data Routes
app.get('/api/historical/performance', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = `
      SELECT date, on_time_performance, passenger_count, revenue, operational_cost, efficiency
      FROM daily_performance
      WHERE 1=1
    `;
    const params = [];

    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY date DESC LIMIT 90';

    const [historical] = await pool.execute(query, params);
    res.json(historical);
  } catch (error) {
    console.error('Get historical data error:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
});

// 9. Reports Routes
app.get('/api/reports/daily', authenticateToken, async (req, res) => {
  try {
    const { date = new Date().toISOString().split('T')[0] } = req.query;

    const [report] = await pool.execute(`
      SELECT 
        COUNT(DISTINCT t.id) as total_trains,
        SUM(CASE WHEN t.status = 'Active' THEN 1 ELSE 0 END) as active_trains,
        SUM(CASE WHEN jc.priority = 'Critical' AND jc.status IN ('Open', 'In Progress') THEN 1 ELSE 0 END) as critical_issues,
        AVG(t.health_score) as avg_health_score,
        SUM(t.total_mileage) as total_fleet_mileage
      FROM trains t
      LEFT JOIN job_cards jc ON t.id = jc.train_id
    `);

    res.json(report[0]);
  } catch (error) {
    console.error('Get daily report error:', error);
    res.status(500).json({ error: 'Failed to generate daily report' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`KMRL Train System API server running on port ${PORT}`);
});

module.exports = app;