import { 
  LiveTrainTracking, 
  StationStatus, 
  DailyInductionPlan, 
  ControlCenterData, 
  SystemAlert,
  AISchedulingBot 
} from '../types/controlCenter';

// Kochi Metro Stations (24 stations)
export const metroStations = [
  { code: 'ALV', name: 'Aluva', km: 0.0 },
  { code: 'PLD', name: 'Pulinchodu', km: 2.1 },
  { code: 'CPD', name: 'Companypady', km: 3.8 },
  { code: 'AMB', name: 'Ambattukavu', km: 5.2 },
  { code: 'MTM', name: 'Muttom', km: 6.8 },
  { code: 'KLM', name: 'Kalamassery', km: 8.4 },
  { code: 'CUN', name: 'Cochin University', km: 10.1 },
  { code: 'PTD', name: 'Pathadipalam', km: 11.7 },
  { code: 'EDP', name: 'Edapally', km: 13.2 },
  { code: 'CGP', name: 'Changampuzha Park', km: 14.8 },
  { code: 'PLR', name: 'Palarivattom', km: 16.3 },
  { code: 'JLN', name: 'JLN Stadium', km: 17.9 },
  { code: 'KLR', name: 'Kaloor', km: 19.4 },
  { code: 'TNH', name: 'Town Hall', km: 20.8 },
  { code: 'MGR', name: 'M.G Road', km: 22.1 },
  { code: 'MHC', name: 'Maharajas College', km: 23.4 },
  { code: 'EKS', name: 'Ernakulam South', km: 24.7 },
  { code: 'KDV', name: 'Kadavanthra', km: 26.2 },
  { code: 'ELK', name: 'Elamkulam', km: 27.8 },
  { code: 'VYT', name: 'Vyttila', km: 29.3 },
  { code: 'THK', name: 'Thaikoodam', km: 30.9 },
  { code: 'PET', name: 'Petta', km: 32.4 },
  { code: 'VDK', name: 'Vadakkekotta', km: 33.8 },
  { code: 'TRP', name: 'Tripunithura', km: 35.2 }
];

// Real KMRL Train Names (25 trains)
export const kmrlTrainNames = [
  'GANGA', 'KAVRI', 'KRISHNA', 'TAPTI', 'SARAW', 'ARUTH', 'VAIGAI', 'JHANAVI', 
  'DHWANIL', 'BHAVANI', 'PADMA', 'MANDAKINI', 'YAMUNA', 'PERIYAR', 'KABANI', 
  'VAAW', 'KAVERI', 'SHIRIYA', 'PAMPA', 'NARMADA', 'MAARUT', 'SABARMATHI', 
  'GODHAVARI', 'PAVAN', 'INDUS'
];

// Generate live train tracking data (simulating real-time positions)
export const liveTrainTracking: LiveTrainTracking[] = [
  {
    trainId: '001',
    trainName: 'GANGA',
    currentStation: 'Palarivattom',
    nextStation: 'JLN Stadium',
    speed: 45,
    direction: 'DOWN',
    status: 'RUNNING',
    passengerLoad: 78,
    delay: 0,
    coordinates: { x: 320, y: 180 },
    lastUpdate: new Date().toISOString()
  },
  {
    trainId: '003',
    trainName: 'KAVRI',
    currentStation: 'Kaloor',
    nextStation: 'Town Hall',
    speed: 0,
    direction: 'DOWN',
    status: 'STOPPED',
    passengerLoad: 85,
    delay: 2,
    coordinates: { x: 340, y: 220 },
    lastUpdate: new Date().toISOString()
  },
  {
    trainId: '005',
    trainName: 'KRISHNA',
    currentStation: 'Vyttila',
    nextStation: 'Thaikoodam',
    speed: 52,
    direction: 'DOWN',
    status: 'RUNNING',
    passengerLoad: 92,
    delay: 0,
    coordinates: { x: 380, y: 320 },
    lastUpdate: new Date().toISOString()
  },
  {
    trainId: '007',
    trainName: 'TAPTI',
    currentStation: 'Edapally',
    nextStation: 'Changampuzha Park',
    speed: 48,
    direction: 'UP',
    status: 'RUNNING',
    passengerLoad: 65,
    delay: 1,
    coordinates: { x: 280, y: 140 },
    lastUpdate: new Date().toISOString()
  },
  {
    trainId: '009',
    trainName: 'SARAW',
    currentStation: 'Aluva',
    nextStation: 'Pulinchodu',
    speed: 0,
    direction: 'DOWN',
    status: 'DEPARTING',
    passengerLoad: 45,
    delay: 0,
    coordinates: { x: 100, y: 50 },
    lastUpdate: new Date().toISOString()
  }
];

// Tomorrow's Daily Induction Plan (Generated once per day)
export const tomorrowInductionPlan: DailyInductionPlan = {
  planDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  planGenerated: new Date().toISOString(),
  validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
  totalTrainsRequired: 15,
  inductionSlots: [
    {
      slotNumber: 1,
      trainId: '001',
      trainName: 'GANGA',
      inductionTime: '04:30',
      departureTime: '05:00',
      fromTerminal: 'ALUVA',
      assignedRoute: 'ALUVA → TRIPUNITHURA',
      estimatedPassengers: 8500,
      revenueTarget: 125000,
      fitnessValid: true,
      bayPosition: 'SBL1'
    },
    {
      slotNumber: 2,
      trainId: '003',
      trainName: 'KAVRI',
      inductionTime: '04:45',
      departureTime: '05:15',
      fromTerminal: 'TRIPUNITHURA',
      assignedRoute: 'TRIPUNITHURA → ALUVA',
      estimatedPassengers: 7800,
      revenueTarget: 118000,
      fitnessValid: true,
      bayPosition: 'SBL2'
    },
    {
      slotNumber: 3,
      trainId: '005',
      trainName: 'KRISHNA',
      inductionTime: '05:00',
      departureTime: '05:30',
      fromTerminal: 'ALUVA',
      assignedRoute: 'ALUVA → TRIPUNITHURA',
      estimatedPassengers: 9200,
      revenueTarget: 135000,
      fitnessValid: true,
      bayPosition: 'SBL3'
    },
    // Continue with remaining 12 trains...
  ],
  standbyTrains: [
    {
      trainId: '031',
      trainName: 'VAAW',
      location: 'ALUVA_TERMINAL',
      readyTime: '05:00',
      deploymentPriority: 1,
      estimatedResponseTime: 10
    },
    {
      trainId: '033',
      trainName: 'KAVERI',
      location: 'TRIPUNITHURA_TERMINAL',
      readyTime: '05:00',
      deploymentPriority: 2,
      estimatedResponseTime: 12
    }
  ],
  maintenanceSchedule: [
    {
      trainId: '041',
      trainName: 'MAARUT',
      maintenanceType: 'PREVENTIVE',
      bayAssignment: 'IBL1',
      estimatedDuration: 8,
      scheduledStart: '22:00',
      estimatedCompletion: '06:00',
      priority: 'MEDIUM'
    }
  ],
  riskAssessment: 'LOW',
  approvalStatus: 'APPROVED',
  approvedBy: 'Chief Controller'
};

// Control Center Status
export const controlCenterData: ControlCenterData = {
  systemTime: new Date().toISOString(),
  operationalStatus: 'NORMAL',
  activeTrains: 15,
  totalPassengers: 45230,
  systemAlerts: [
    {
      id: 'ALT-001',
      type: 'INFO',
      message: 'Daily induction plan generated for tomorrow',
      timestamp: new Date().toISOString(),
      acknowledged: true,
      source: 'SYSTEM'
    },
    {
      id: 'ALT-002',
      type: 'WARNING',
      message: 'Train KAVRI delayed by 2 minutes at Kaloor',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      acknowledged: false,
      source: 'TRAIN'
    }
  ],
  powerStatus: {
    depot: 'ENERGIZED',
    mainline: 'ENERGIZED',
    thirdRail: 'ENERGIZED'
  }
};

// AI Scheduling Bot Status
export const aiSchedulingBot: AISchedulingBot = {
  isActive: true,
  lastOptimization: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  nextOptimization: new Date(Date.now() + 82800000).toISOString(), // Tomorrow 23:00
  confidence: 96.8,
  recommendations: [
    'Tomorrow\'s induction plan optimized for 96.8% efficiency',
    'All 15 trains scheduled with balanced load distribution',
    'Standby trains positioned at both terminals',
    'No conflicts detected in schedule'
  ],
  currentTask: 'Monitoring real-time operations',
  processingStatus: 'IDLE'
};

// Station Status (Live)
export const stationStatus: StationStatus[] = metroStations.map((station, index) => ({
  stationCode: station.code,
  stationName: station.name,
  platform1: {
    trainPresent: Math.random() > 0.8,
    trainId: Math.random() > 0.8 ? `00${Math.floor(Math.random() * 9) + 1}` : undefined,
    dwellTime: Math.random() > 0.8 ? Math.floor(Math.random() * 60) + 30 : undefined,
    passengerCount: Math.random() > 0.8 ? Math.floor(Math.random() * 200) + 50 : undefined
  },
  platform2: {
    trainPresent: Math.random() > 0.8,
    trainId: Math.random() > 0.8 ? `00${Math.floor(Math.random() * 9) + 1}` : undefined,
    dwellTime: Math.random() > 0.8 ? Math.floor(Math.random() * 60) + 30 : undefined,
    passengerCount: Math.random() > 0.8 ? Math.floor(Math.random() * 200) + 50 : undefined
  },
  signalStatus: ['GREEN', 'RED', 'YELLOW'][Math.floor(Math.random() * 3)] as any,
  powerStatus: 'ENERGIZED'
}));