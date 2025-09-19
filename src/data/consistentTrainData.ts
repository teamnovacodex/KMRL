// Consistent KMRL Train Data Across All Pages
// This ensures all pages show the same train data and status

export interface ConsistentTrain {
  id: string;
  trainName: string;
  trainNumber: string;
  trainId: string;
  status: 'Service' | 'Standby' | 'Maintenance' | 'Cleaning';
  currentBay: {
    type: 'SBL' | 'IBL' | 'HIBL' | 'HICL' | 'Terminal';
    number: number;
    location: string;
  };
  fitnessStatus: 'Valid' | 'Invalid' | 'Expiring Soon';
  healthScore: number;
  mileage: number;
  lastMaintenance: string;
  nextMaintenance: string;
  canGoToService: boolean;
  scheduleTiming?: string;
  fromStation?: string;
  passengerLoad?: number;
  estimatedRevenue?: number;
}

// Real KMRL Train Names and Schedule (15 trains for weekday service)
export const kmrlTrainSchedule = [
  { serialNo: 1, trainName: 'KRISHNA', trainNo: '012', trainId: 'PS001', timing: '06:00', station: 'ALUVA' },
  { serialNo: 2, trainName: 'TAPTI', trainNo: '008', trainId: 'PS002', timing: '06:08', station: 'MUTTOM' },
  { serialNo: 3, trainName: 'NILA', trainNo: '004', trainId: 'PS003', timing: '06:00', station: 'TRIPUNITHURA' },
  { serialNo: 4, trainName: 'SARAYU', trainNo: '010', trainId: 'PS004', timing: '05:00', station: 'MUTTOM DEPOT' },
  { serialNo: 5, trainName: 'ARUTH', trainNo: '015', trainId: 'PS005', timing: '05:05', station: 'MUTTOM DEPOT' },
  { serialNo: 6, trainName: 'VAIGAI', trainNo: '013', trainId: 'PS006', timing: '05:10', station: 'MUTTOM DEPOT' },
  { serialNo: 7, trainName: 'JHANAVI', trainNo: '007', trainId: 'PS007', timing: '05:15', station: 'MUTTOM DEPOT' },
  { serialNo: 8, trainName: 'DHWANIL', trainNo: '002', trainId: 'PS008', timing: '05:20', station: 'MUTTOM DEPOT' },
  { serialNo: 9, trainName: 'BHAVANI', trainNo: '001', trainId: 'PS009', timing: '05:25', station: 'MUTTOM DEPOT' },
  { serialNo: 10, trainName: 'PADMA', trainNo: '003', trainId: 'PS010', timing: '05:30', station: 'MUTTOM DEPOT' },
  { serialNo: 11, trainName: 'MANDAKINI', trainNo: '005', trainId: 'PS011', timing: '05:35', station: 'MUTTOM DEPOT' },
  { serialNo: 12, trainName: 'YAMUNA', trainNo: '011', trainId: 'PS012', timing: '05:40', station: 'MUTTOM DEPOT' },
  { serialNo: 13, trainName: 'PERIYAR', trainNo: '014', trainId: 'PS013', timing: '05:45', station: 'MUTTOM DEPOT' },
  { serialNo: 14, trainName: 'KABANI', trainNo: '006', trainId: 'PS014', timing: '05:50', station: 'MUTTOM DEPOT' },
  { serialNo: 15, trainName: 'VAAYU', trainNo: '009', trainId: 'PS015', timing: '05:55', station: 'MUTTOM DEPOT' }
];

// Additional trains for complete fleet (25 total)
export const additionalTrains = [
  { trainName: 'KAVERI', trainNo: '016', status: 'Standby', bay: { type: 'SBL', number: 16 } },
  { trainName: 'SHIRIYA', trainNo: '017', status: 'Standby', bay: { type: 'SBL', number: 17 } },
  { trainName: 'PAMPA', trainNo: '018', status: 'Maintenance', bay: { type: 'IBL', number: 1 } },
  { trainName: 'NARMADA', trainNo: '019', status: 'Maintenance', bay: { type: 'IBL', number: 2 } },
  { trainName: 'MAARUT', trainNo: '020', status: 'Maintenance', bay: { type: 'IBL', number: 3 } },
  { trainName: 'SABARMATHI', trainNo: '021', status: 'Maintenance', bay: { type: 'HIBL', number: 1 } },
  { trainName: 'GODHAVARI', trainNo: '022', status: 'Maintenance', bay: { type: 'HIBL', number: 2 } },
  { trainName: 'GANGA', trainNo: '023', status: 'Maintenance', bay: { type: 'HIBL', number: 3 } },
  { trainName: 'PAVAN', trainNo: '024', status: 'Cleaning', bay: { type: 'HICL', number: 1 } },
  { trainName: 'INDUS', trainNo: '025', status: 'Maintenance', bay: { type: 'Terminal', number: 1 } }
];

// Generate consistent train data for all pages
export const consistentTrains: ConsistentTrain[] = [
  // 15 Service trains (from schedule)
  ...kmrlTrainSchedule.map((train, index) => ({
    id: (index + 1).toString(),
    trainName: train.trainName,
    trainNumber: train.trainNo,
    trainId: train.trainId,
    status: 'Service' as const,
    currentBay: {
      type: 'SBL' as const,
      number: index + 1,
      location: 'Muttom Depot'
    },
    fitnessStatus: 'Valid' as const,
    healthScore: Math.floor(Math.random() * 20) + 80,
    mileage: Math.floor(Math.random() * 50000) + 100000,
    lastMaintenance: '2024-12-15',
    nextMaintenance: '2025-01-15',
    canGoToService: true,
    scheduleTiming: train.timing,
    fromStation: train.station,
    passengerLoad: Math.floor(Math.random() * 2000) + 7000,
    estimatedRevenue: Math.floor(Math.random() * 50000) + 100000
  })),
  
  // 2 Standby trains
  ...additionalTrains.slice(0, 2).map((train, index) => ({
    id: (16 + index).toString(),
    trainName: train.trainName,
    trainNumber: train.trainNo,
    trainId: `PS${(16 + index).toString().padStart(3, '0')}`,
    status: 'Standby' as const,
    currentBay: {
      type: 'SBL' as const,
      number: 16 + index,
      location: index === 0 ? 'Aluva Terminal' : 'Tripunithura Terminal'
    },
    fitnessStatus: 'Valid' as const,
    healthScore: Math.floor(Math.random() * 15) + 75,
    mileage: Math.floor(Math.random() * 40000) + 80000,
    lastMaintenance: '2024-12-10',
    nextMaintenance: '2025-01-10',
    canGoToService: true
  })),
  
  // 8 Maintenance trains (3 IBL + 3 HIBL + 1 HICL + 1 Terminal)
  ...additionalTrains.slice(2).map((train, index) => ({
    id: (18 + index).toString(),
    trainName: train.trainName,
    trainNumber: train.trainNo,
    trainId: `PS${(18 + index).toString().padStart(3, '0')}`,
    status: 'Maintenance' as const,
    currentBay: {
      type: train.bay.type as any,
      number: train.bay.number,
      location: 'Muttom Depot'
    },
    fitnessStatus: Math.random() > 0.7 ? 'Valid' : 'Invalid' as any,
    healthScore: Math.floor(Math.random() * 30) + 50,
    mileage: Math.floor(Math.random() * 60000) + 120000,
    lastMaintenance: '2024-11-20',
    nextMaintenance: '2024-12-25',
    canGoToService: false
  }))
];

// Fleet statistics for consistent display
export const fleetStats = {
  total: consistentTrains.length,
  service: consistentTrains.filter(t => t.status === 'Service').length,
  standby: consistentTrains.filter(t => t.status === 'Standby').length,
  maintenance: consistentTrains.filter(t => t.status === 'Maintenance').length,
  cleaning: consistentTrains.filter(t => t.status === 'Cleaning').length,
  validFitness: consistentTrains.filter(t => t.fitnessStatus === 'Valid').length,
  avgHealthScore: Math.round(consistentTrains.reduce((sum, t) => sum + t.healthScore, 0) / consistentTrains.length)
};

// Live tracking data for 15 service trains
export const liveTrackingTrains = kmrlTrainSchedule.map((train, index) => ({
  id: train.trainId,
  name: train.trainName,
  trainNumber: train.trainNo,
  currentStation: ['Aluva', 'Pulinchodu', 'Muttom', 'Kalamassery', 'Edapally', 'Palarivattom', 'Kaloor', 'M.G Road', 'Vyttila', 'Thaikoodam', 'Petta', 'Tripunithura'][index % 12],
  nextStation: ['Pulinchodu', 'Companypady', 'Kalamassery', 'Cochin University', 'Changampuzha Park', 'JLN Stadium', 'Town Hall', 'Maharajas College', 'Thaikoodam', 'Petta', 'Vadakkekotta', 'Aluva'][index % 12],
  speed: Math.floor(Math.random() * 20) + 35, // 35-55 km/h
  direction: index % 2 === 0 ? 'DOWN' : 'UP',
  status: Math.random() > 0.8 ? 'STOPPED' : 'RUNNING',
  delay: Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0,
  passengerLoad: Math.floor(Math.random() * 40) + 60, // 60-100%
  trackLine: index % 2 === 0 ? 2 : 1,
  x: 100 + (index * 120), // Spread trains across the line
  y: index % 2 === 0 ? 220 : 180,
  progress: Math.random() * 0.8 // Random initial progress
}));

// Depot bay assignments for consistent display
export const depotBayAssignments = {
  sbl: consistentTrains.filter(t => t.currentBay.type === 'SBL'),
  ibl: consistentTrains.filter(t => t.currentBay.type === 'IBL'),
  hibl: consistentTrains.filter(t => t.currentBay.type === 'HIBL'),
  hicl: consistentTrains.filter(t => t.currentBay.type === 'HICL'),
  terminal: consistentTrains.filter(t => t.currentBay.type === 'Terminal')
};