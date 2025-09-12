-- KMRL Train Induction Planning System Database Schema
-- MySQL Database Schema for AI/ML Training Data Collection

CREATE DATABASE IF NOT EXISTS kmrl_train_system;
USE kmrl_train_system;

-- 1. Users and Authentication
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Supervisor', 'Operator', 'Viewer') NOT NULL,
    department VARCHAR(100),
    permissions JSON,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- 2. Stations Master Data
CREATE TABLE stations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    station_code VARCHAR(10) UNIQUE NOT NULL,
    station_name VARCHAR(100) NOT NULL,
    sequence_number INT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    zone VARCHAR(50),
    is_terminal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Trains Master Data
CREATE TABLE trains (
    id INT PRIMARY KEY AUTO_INCREMENT,
    train_number VARCHAR(20) UNIQUE NOT NULL,
    train_name VARCHAR(50) NOT NULL, -- KRISHNA, TAPTI, etc.
    model VARCHAR(50) NOT NULL,
    manufacturing_year INT NOT NULL,
    manufacturer VARCHAR(100),
    last_major_overhaul DATE,
    current_location VARCHAR(100),
    status ENUM('Active', 'Maintenance', 'Standby', 'Out of Service') DEFAULT 'Active',
    depot_bay INT,
    stabling_position_x INT,
    stabling_position_y INT,
    total_mileage BIGINT DEFAULT 0,
    health_score INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Fitness Certificates (Problem 1)
CREATE TABLE fitness_certificates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    train_id INT NOT NULL,
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status ENUM('Valid', 'Expired', 'Expiring Soon') NOT NULL,
    score INT DEFAULT 100,
    issued_by VARCHAR(100),
    inspection_details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE,
    INDEX idx_train_fitness (train_id, status),
    INDEX idx_expiry_date (expiry_date)
);

-- 5. Job Cards - IBM Maximo Integration (Problem 2)
CREATE TABLE job_cards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    train_id INT NOT NULL,
    work_order_number VARCHAR(50) UNIQUE NOT NULL,
    type ENUM('Preventive', 'Corrective', 'Emergency', 'Inspection') NOT NULL,
    priority ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL,
    status ENUM('Open', 'In Progress', 'Closed', 'On Hold') NOT NULL,
    description TEXT NOT NULL,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    assigned_technician VARCHAR(100),
    created_date DATE NOT NULL,
    due_date DATE,
    completed_date DATE,
    cost DECIMAL(10,2) DEFAULT 0,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_train_status (train_id, status),
    INDEX idx_priority_status (priority, status),
    INDEX idx_due_date (due_date)
);

-- 6. Job Card Parts
CREATE TABLE job_card_parts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_card_id INT NOT NULL,
    part_number VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    quantity INT NOT NULL,
    unit_cost DECIMAL(10,2),
    availability ENUM('In Stock', 'Low Stock', 'Out of Stock', 'On Order') DEFAULT 'In Stock',
    FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE CASCADE
);

-- 7. Branding Contracts (Problem 3)
CREATE TABLE branding_contracts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    train_id INT NOT NULL,
    contract_number VARCHAR(50) UNIQUE NOT NULL,
    advertiser VARCHAR(100) NOT NULL,
    campaign_name VARCHAR(200) NOT NULL,
    contract_value DECIMAL(12,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    required_exposure_hours INT NOT NULL,
    current_exposure_hours INT DEFAULT 0,
    daily_target INT NOT NULL,
    penalty_clause DECIMAL(10,2) DEFAULT 0,
    status ENUM('Active', 'Expired', 'Pending', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE,
    INDEX idx_train_status (train_id, status),
    INDEX idx_contract_dates (start_date, end_date)
);

-- 8. Daily Branding Exposure Tracking
CREATE TABLE branding_exposure_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contract_id INT NOT NULL,
    train_id INT NOT NULL,
    date DATE NOT NULL,
    exposure_hours DECIMAL(4,2) NOT NULL,
    route_covered TEXT,
    passenger_count INT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES branding_contracts(id) ON DELETE CASCADE,
    FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE,
    UNIQUE KEY unique_contract_date (contract_id, date)
);

-- 9. Mileage Tracking (Problem 4)
CREATE TABLE mileage_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    train_id INT NOT NULL,
    date DATE NOT NULL,
    daily_mileage INT NOT NULL,
    route_details JSON,
    fuel_consumption DECIMAL(8,2),
    driver_id VARCHAR(50),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE,
    UNIQUE KEY unique_train_date (train_id, date),
    INDEX idx_date_mileage (date, daily_mileage)
);

-- 10. Cleaning Schedule and Slots (Problem 5)
CREATE TABLE cleaning_schedule (
    id INT PRIMARY KEY AUTO_INCREMENT,
    train_id INT NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    cleaning_type ENUM('Basic', 'Deep', 'Exterior', 'Interior') NOT NULL,
    bay_number INT,
    estimated_duration INT NOT NULL, -- minutes
    actual_duration INT,
    status ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    assigned_crew VARCHAR(100),
    completion_score INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE,
    INDEX idx_schedule_date (scheduled_date, status),
    INDEX idx_train_schedule (train_id, scheduled_date)
);

-- 11. Depot Layout and Stabling Geometry (Problem 6)
CREATE TABLE depot_bays (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bay_number INT UNIQUE NOT NULL,
    bay_type ENUM('Service', 'Maintenance', 'Cleaning', 'Storage') NOT NULL,
    capacity INT DEFAULT 1,
    position_x INT NOT NULL,
    position_y INT NOT NULL,
    facilities JSON, -- ['Power Supply', 'Compressed Air', etc.]
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Stabling History and Shunting Records
CREATE TABLE stabling_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    train_id INT NOT NULL,
    from_bay INT,
    to_bay INT NOT NULL,
    movement_time TIMESTAMP NOT NULL,
    shunting_distance INT, -- meters
    energy_consumed DECIMAL(8,2), -- kWh
    movement_reason VARCHAR(200),
    operator_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE,
    FOREIGN KEY (from_bay) REFERENCES depot_bays(bay_number),
    FOREIGN KEY (to_bay) REFERENCES depot_bays(bay_number),
    FOREIGN KEY (operator_id) REFERENCES users(id),
    INDEX idx_train_movement (train_id, movement_time)
);

-- 13. IoT Sensor Data
CREATE TABLE iot_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    train_id INT NOT NULL,
    mileage BIGINT,
    engine_health INT, -- 0-100
    brake_health INT, -- 0-100
    door_health INT, -- 0-100
    ac_health INT, -- 0-100
    battery_level INT, -- 0-100
    vibration_level DECIMAL(5,2),
    temperature DECIMAL(5,2),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE,
    INDEX idx_train_time (train_id, recorded_at),
    INDEX idx_health_scores (engine_health, brake_health, door_health)
);

-- 14. Optimization Results (AI/ML Output)
CREATE TABLE optimization_results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    timestamp TIMESTAMP NOT NULL,
    total_score DECIMAL(5,4) NOT NULL,
    selected_trains JSON NOT NULL, -- Array of train IDs
    standby_trains JSON NOT NULL,
    maintenance_trains JSON NOT NULL,
    reasoning JSON NOT NULL, -- Detailed AI reasoning
    constraints_applied JSON,
    alternatives JSON,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_score (total_score)
);

-- 15. Business Rules Configuration
CREATE TABLE business_rules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    rule_id VARCHAR(50) UNIQUE NOT NULL,
    rule_name VARCHAR(200) NOT NULL,
    category ENUM('Safety', 'Operational', 'Commercial', 'Regulatory') NOT NULL,
    priority INT NOT NULL, -- 1-10
    is_active BOOLEAN DEFAULT TRUE,
    conditions JSON NOT NULL,
    actions JSON NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 16. Rule Evaluation History
CREATE TABLE rule_evaluations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    rule_id VARCHAR(50) NOT NULL,
    train_id INT NOT NULL,
    evaluation_time TIMESTAMP NOT NULL,
    passed BOOLEAN NOT NULL,
    score DECIMAL(5,4),
    message TEXT,
    evaluation_data JSON,
    FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE,
    INDEX idx_rule_train (rule_id, train_id),
    INDEX idx_evaluation_time (evaluation_time)
);

-- 17. Daily Performance Metrics
CREATE TABLE daily_performance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE UNIQUE NOT NULL,
    selected_trains INT NOT NULL,
    standby_trains INT NOT NULL,
    maintenance_trains INT NOT NULL,
    on_time_performance DECIMAL(5,2) NOT NULL,
    breakdowns INT DEFAULT 0,
    passenger_count INT NOT NULL,
    revenue DECIMAL(12,2) NOT NULL,
    operational_cost DECIMAL(12,2) NOT NULL,
    efficiency DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_date (date),
    INDEX idx_performance (on_time_performance, efficiency)
);

-- 18. Breakdown Records
CREATE TABLE breakdown_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    train_id INT NOT NULL,
    breakdown_date TIMESTAMP NOT NULL,
    type ENUM('Mechanical', 'Electrical', 'Software', 'External') NOT NULL,
    severity ENUM('Minor', 'Major', 'Critical') NOT NULL,
    downtime_minutes INT NOT NULL,
    cause TEXT NOT NULL,
    resolution TEXT,
    cost DECIMAL(10,2) DEFAULT 0,
    resolved_at TIMESTAMP,
    technician_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE,
    FOREIGN KEY (technician_id) REFERENCES users(id),
    INDEX idx_train_breakdown (train_id, breakdown_date),
    INDEX idx_severity_type (severity, type)
);

-- 19. Manual Overrides
CREATE TABLE manual_overrides (
    id INT PRIMARY KEY AUTO_INCREMENT,
    train_id INT NOT NULL,
    supervisor_id INT NOT NULL,
    override_type ENUM('Force Include', 'Exclude', 'Priority Change') NOT NULL,
    reason TEXT NOT NULL,
    original_recommendation VARCHAR(50),
    new_recommendation VARCHAR(50),
    expiry_time TIMESTAMP NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE,
    FOREIGN KEY (supervisor_id) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    INDEX idx_train_override (train_id, expiry_time)
);

-- 20. System Logs (for audit and ML training)
CREATE TABLE system_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    log_type ENUM('Optimization', 'Rule_Evaluation', 'Data_Integration', 'User_Action') NOT NULL,
    entity_type VARCHAR(50), -- 'train', 'job_card', 'contract', etc.
    entity_id INT,
    action VARCHAR(100) NOT NULL,
    old_values JSON,
    new_values JSON,
    user_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_log_type_time (log_type, created_at),
    INDEX idx_entity (entity_type, entity_id)
);

-- Insert Sample Data

-- Sample Users
INSERT INTO users (username, email, password, role, department, permissions) VALUES
('admin', 'admin@kmrl.co.in', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'Operations Control Center', '["view_all", "edit_all", "run_optimization", "manage_users", "export_data"]'),
('supervisor', 'supervisor@kmrl.co.in', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Supervisor', 'Train Operations', '["view_all", "edit_trains", "run_optimization", "override_decisions"]'),
('operator', 'operator@kmrl.co.in', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Operator', 'Depot Operations', '["view_trains", "update_status", "view_reports"]'),
('viewer', 'viewer@kmrl.co.in', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Viewer', 'Management', '["view_dashboard", "view_reports"]');

-- Sample Stations
INSERT INTO stations (station_code, station_name, sequence_number) VALUES
('ALV', 'Aluva', 1), ('PLD', 'Pulinchodu', 2), ('CPD', 'Companypady', 3), ('AMB', 'Ambattukavu', 4),
('MTM', 'Muttom', 5), ('KLM', 'Kalamassery', 6), ('CUN', 'Cochin University', 7), ('PTD', 'Pathadipalam', 8),
('EDP', 'Edapally', 9), ('CGP', 'Changampuzha Park', 10), ('PLR', 'Palarivattom', 11), ('JLN', 'JLN Stadium', 12),
('KLR', 'Kaloor', 13), ('TNH', 'Town Hall', 14), ('MGR', 'M.G Road', 15), ('MHC', 'Maharajas College', 16),
('EKS', 'Ernakulam South', 17), ('KDV', 'Kadavanthra', 18), ('ELK', 'Elamkulam', 19), ('VYT', 'Vyttila', 20),
('THK', 'Thaikoodam', 21), ('PET', 'Petta', 22), ('VDK', 'Vadakkekotta', 23), ('SNJ', 'SN Junction Thrippunithura', 24);

-- Sample Trains with actual names
INSERT INTO trains (train_number, train_name, model, manufacturing_year, depot_bay, stabling_position_x, stabling_position_y, total_mileage, health_score) VALUES
('KMRL-001', 'KRISHNA', 'Alstom Metropolis', 2017, 1, 50, 100, 145780, 94),
('KMRL-002', 'TAPTI', 'Alstom Metropolis', 2017, 2, 150, 100, 152100, 85),
('KMRL-003', 'SARAW', 'Alstom Metropolis', 2018, 3, 250, 100, 167890, 62),
('KMRL-004', 'ARUTH', 'Alstom Metropolis', 2018, 4, 350, 100, 134560, 88),
('KMRL-005', 'VAIGAI', 'Alstom Metropolis', 2018, 5, 450, 100, 178920, 76),
('KMRL-006', 'JHANAVI', 'BEML Standard', 2019, 6, 50, 200, 123450, 91),
('KMRL-007', 'DHWANIL', 'BEML Standard', 2019, 7, 150, 200, 156780, 83),
('KMRL-008', 'BHAVANI', 'BEML Standard', 2019, 8, 250, 200, 189340, 79),
('KMRL-009', 'PADMA', 'BEML Standard', 2019, 9, 350, 200, 142670, 87),
('KMRL-010', 'MANDAKINI', 'BEML Standard', 2019, 10, 450, 200, 165890, 82),
('KMRL-011', 'YAMUNA', 'Alstom Metropolis', 2017, 11, 50, 300, 198760, 74),
('KMRL-012', 'PERIYAR', 'Alstom Metropolis', 2017, 12, 150, 300, 134890, 89),
('KMRL-013', 'KABANI', 'Alstom Metropolis', 2018, 13, 250, 300, 176540, 78),
('KMRL-014', 'VAAW', 'Alstom Metropolis', 2018, 14, 350, 300, 145670, 86),
('KMRL-015', 'KAVERI', 'Alstom Metropolis', 2018, 15, 450, 300, 187230, 81),
('KMRL-016', 'SHIRIYA', 'BEML Standard', 2019, 16, 50, 400, 156780, 84),
('KMRL-017', 'PAMPA', 'BEML Standard', 2019, 17, 150, 400, 143560, 88),
('KMRL-018', 'NARMADA', 'BEML Standard', 2019, 18, 250, 400, 169870, 77),
('KMRL-019', 'MAARUT', 'BEML Standard', 2019, 19, 350, 400, 154320, 85),
('KMRL-020', 'SABARMATHI', 'BEML Standard', 2019, 20, 450, 400, 172450, 80),
('KMRL-021', 'GODHAVARI', 'Alstom Metropolis', 2017, 21, 50, 500, 189670, 75),
('KMRL-022', 'GANGA', 'Alstom Metropolis', 2017, 22, 150, 500, 167890, 83),
('KMRL-023', 'PAVAN', 'Alstom Metropolis', 2018, 23, 250, 500, 145780, 87);

-- Sample Depot Bays
INSERT INTO depot_bays (bay_number, bay_type, position_x, position_y, facilities) VALUES
(1, 'Service', 50, 100, '["Power Supply", "Compressed Air"]'),
(2, 'Service', 150, 100, '["Power Supply", "Compressed Air"]'),
(3, 'Service', 250, 100, '["Power Supply", "Compressed Air"]'),
(4, 'Service', 350, 100, '["Power Supply", "Compressed Air"]'),
(5, 'Service', 450, 100, '["Power Supply", "Compressed Air"]'),
(16, 'Maintenance', 50, 400, '["Lifting Equipment", "Tool Access", "Parts Storage"]'),
(17, 'Maintenance', 150, 400, '["Lifting Equipment", "Tool Access", "Parts Storage"]'),
(18, 'Maintenance', 250, 400, '["Lifting Equipment", "Tool Access", "Parts Storage"]'),
(19, 'Maintenance', 350, 400, '["Lifting Equipment", "Tool Access", "Parts Storage"]'),
(20, 'Maintenance', 450, 400, '["Lifting Equipment", "Tool Access", "Parts Storage"]'),
(21, 'Cleaning', 50, 500, '["Water Supply", "Drainage", "Cleaning Equipment"]'),
(22, 'Cleaning', 150, 500, '["Water Supply", "Drainage", "Cleaning Equipment"]'),
(23, 'Storage', 250, 500, '["Long-term Storage"]');

-- Create indexes for better performance
CREATE INDEX idx_trains_status ON trains(status);
CREATE INDEX idx_trains_health ON trains(health_score);
CREATE INDEX idx_iot_data_composite ON iot_data(train_id, recorded_at, engine_health, brake_health);
CREATE INDEX idx_optimization_timestamp ON optimization_results(timestamp, total_score);
CREATE INDEX idx_performance_date ON daily_performance(date, on_time_performance, efficiency);