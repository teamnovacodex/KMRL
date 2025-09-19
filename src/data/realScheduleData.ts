// Real KMRL Train Schedule Data
// Based on actual operational schedule provided

export interface RealTrainSchedule {
  serialNo: number;
  trainName: string;
  trainNo: string;
  trainId: string;
  timing: string;
  station: string;
  serviceType: 'Weekday' | 'Weekend';
  passengerLoad: number; // Expected passenger count
  priority: number; // 1-15 for weekdays, 1-12 for weekends
}

// Weekday Schedule (15 trains)
export const weekdaySchedule: RealTrainSchedule[] = [
  {
    serialNo: 1,
    trainName: 'KRISHNA',
    trainNo: '012',
    trainId: 'PS001',
    timing: '06:00',
    station: 'ALUVA',
    serviceType: 'Weekday',
    passengerLoad: 8500,
    priority: 1
  },
  {
    serialNo: 2,
    trainName: 'TAPTI',
    trainNo: '008',
    trainId: 'PS002',
    timing: '06:08',
    station: 'MUTTOM',
    serviceType: 'Weekday',
    passengerLoad: 7800,
    priority: 2
  },
  {
    serialNo: 3,
    trainName: 'NILA',
    trainNo: '004',
    trainId: 'PS003',
    timing: '06:00',
    station: 'TRIPUNITHURA',
    serviceType: 'Weekday',
    passengerLoad: 8200,
    priority: 3
  },
  {
    serialNo: 4,
    trainName: 'SARAYU',
    trainNo: '010',
    trainId: 'PS004',
    timing: '05:00',
    station: 'MUTTOM DEPOT',
    serviceType: 'Weekday',
    passengerLoad: 9200,
    priority: 4
  },
  {
    serialNo: 5,
    trainName: 'ARUTH',
    trainNo: '015',
    trainId: 'PS005',
    timing: '05:05',
    station: 'MUTTOM DEPOT',
    serviceType: 'Weekday',
    passengerLoad: 8900,
    priority: 5
  },
  {
    serialNo: 6,
    trainName: 'VAIGAI',
    trainNo: '013',
    trainId: 'PS006',
    timing: '05:10',
    station: 'MUTTOM DEPOT',
    serviceType: 'Weekday',
    passengerLoad: 8700,
    priority: 6
  },
  {
    serialNo: 7,
    trainName: 'JHANAVI',
    trainNo: '007',
    trainId: 'PS007',
    timing: '05:15',
    station: 'MUTTOM DEPOT',
    serviceType: 'Weekday',
    passengerLoad: 8600,
    priority: 7
  },
  {
    serialNo: 8,
    trainName: 'DHWANIL',
    trainNo: '002',
    trainId: 'PS008',
    timing: '05:20',
    station: 'MUTTOM DEPOT',
    serviceType: 'Weekday',
    passengerLoad: 8400,
    priority: 8
  },
  {
    serialNo: 9,
    trainName: 'BHAVANI',
    trainNo: '001',
    trainId: 'PS009',
    timing: '05:25',
    station: 'MUTTOM DEPOT',
    serviceType: 'Weekday',
    passengerLoad: 8300,
    priority: 9
  },
  {
    serialNo: 10,
    trainName: 'PADMA',
    trainNo: '003',
    trainId: 'PS010',
    timing: '05:30',
    station: 'MUTTOM DEPOT',
    serviceType: 'Weekday',
    passengerLoad: 8100,
    priority: 10
  },
  {
    serialNo: 11,
    trainName: 'MANDAKINI',
    trainNo: '005',
    trainId: 'PS011',
    timing: '05:35',
    station: 'MUTTOM DEPOT',
    serviceType: 'Weekday',
    passengerLoad: 7900,
    priority: 11
  },
  {
    serialNo: 12,
    trainName: 'YAMUNA',
    trainNo: '011',
    trainId: 'PS012',
    timing: '05:40',
    station: 'MUTTOM DEPOT',
    serviceType: 'Weekday',
    passengerLoad: 7700,
    priority: 12
  },
  {
    serialNo: 13,
    trainName: 'PERIYAR',
    trainNo: '014',
    trainId: 'PS013',
    timing: '05:45',
    station: 'MUTTOM DEPOT',
    serviceType: 'Weekday',
    passengerLoad: 7500,
    priority: 13
  },
  {
    serialNo: 14,
    trainName: 'KABANI',
    trainNo: '006',
    trainId: 'PS014',
    timing: '05:50',
    station: 'MUTTOM DEPOT',
    serviceType: 'Weekday',
    passengerLoad: 7300,
    priority: 14
  },
  {
    serialNo: 15,
    trainName: 'VAAYU',
    trainNo: '009',
    trainId: 'PS015',
    timing: '05:55',
    station: 'MUTTOM DEPOT',
    serviceType: 'Weekday',
    passengerLoad: 7100,
    priority: 15
  }
];

// Weekend Schedule (12 trains) - Reduced service based on lower passenger count
export const weekendSchedule: RealTrainSchedule[] = weekdaySchedule.slice(0, 12).map(train => ({
  ...train,
  serviceType: 'Weekend',
  passengerLoad: Math.floor(train.passengerLoad * 0.7), // 30% reduction for weekends
  timing: train.timing === '05:00' ? '06:00' : // Later start on weekends
           train.timing === '05:05' ? '06:05' :
           train.timing === '05:10' ? '06:10' :
           train.timing === '05:15' ? '06:15' :
           train.timing === '05:20' ? '06:20' :
           train.timing === '05:25' ? '06:25' :
           train.timing === '05:30' ? '06:30' :
           train.timing === '05:35' ? '06:35' :
           train.timing === '05:40' ? '06:40' :
           train.timing === '05:45' ? '06:45' :
           train.timing === '05:50' ? '06:50' :
           train.timing === '05:55' ? '06:55' :
           train.timing
}));

// Dynamic schedule based on passenger count
export const getDynamicSchedule = (
  currentPassengerCount: number,
  baselinePassengerCount: number = 120000, // Daily baseline
  serviceType: 'Weekday' | 'Weekend' = 'Weekday'
): RealTrainSchedule[] => {
  const baseSchedule = serviceType === 'Weekday' ? weekdaySchedule : weekendSchedule;
  const passengerRatio = currentPassengerCount / baselinePassengerCount;
  
  // Determine number of trains needed based on passenger count
  let trainsNeeded: number;
  
  if (passengerRatio > 1.2) {
    // High passenger count - use all available trains
    trainsNeeded = serviceType === 'Weekday' ? 15 : 12;
  } else if (passengerRatio > 1.0) {
    // Normal to high passenger count
    trainsNeeded = serviceType === 'Weekday' ? 14 : 11;
  } else if (passengerRatio > 0.8) {
    // Normal passenger count
    trainsNeeded = serviceType === 'Weekday' ? 13 : 10;
  } else if (passengerRatio > 0.6) {
    // Low passenger count
    trainsNeeded = serviceType === 'Weekday' ? 12 : 9;
  } else {
    // Very low passenger count
    trainsNeeded = serviceType === 'Weekday' ? 10 : 8;
  }
  
  // Return the required number of trains with adjusted passenger loads
  return baseSchedule.slice(0, trainsNeeded).map(train => ({
    ...train,
    passengerLoad: Math.floor(train.passengerLoad * passengerRatio)
  }));
};

// Station mapping for depot operations
export const stationMapping = {
  'ALUVA': 'Aluva Terminal',
  'MUTTOM': 'Muttom Station',
  'TRIPUNITHURA': 'Tripunithura Terminal',
  'MUTTOM DEPOT': 'Muttom Depot'
};

// Service patterns based on real data
export const realServicePatterns = {
  weekday: {
    totalTrains: 15,
    serviceStart: '05:00',
    serviceEnd: '22:00',
    peakHours: ['07:00-09:00', '17:00-19:00'],
    frequency: '6-8 minutes',
    expectedPassengers: 120000,
    depotTrains: 12, // Trains starting from Muttom Depot
    terminalTrains: 3 // Trains starting from terminals
  },
  weekend: {
    totalTrains: 12,
    serviceStart: '06:00',
    serviceEnd: '22:00',
    peakHours: ['10:00-12:00', '18:00-20:00'],
    frequency: '8-10 minutes',
    expectedPassengers: 85000,
    depotTrains: 9,
    terminalTrains: 3
  }
};

// Real depot bay configuration
export const realDepotBays = {
  sbl: {
    description: 'Service Bay Light - Two Entry Lines',
    totalBays: 12,
    entryLines: 2,
    bays: [
      { number: 1, entryLine: 'LINE 1', canStable: true },
      { number: 2, entryLine: 'LINE 2', canStable: true },
      { number: 3, entryLine: 'LINE 1', canStable: true },
      { number: 4, entryLine: 'LINE 2', canStable: false }, // No stabling
      { number: 5, entryLine: 'LINE 1', canStable: false }, // No stabling
      { number: 6, entryLine: 'LINE 2', canStable: true },
      { number: 7, entryLine: 'LINE 1', canStable: true },
      { number: 8, entryLine: 'LINE 2', canStable: true },
      { number: 9, entryLine: 'LINE 1', canStable: true },
      { number: 10, entryLine: 'LINE 2', canStable: true },
      { number: 11, entryLine: 'LINE 1', canStable: true },
      { number: 12, entryLine: 'LINE 2', canStable: true }
    ]
  },
  ibl: {
    description: 'Inspection Bay Light - One Entry Line',
    totalBays: 3,
    entryLines: 1,
    bays: [
      { number: 1, entryLine: 'SINGLE ENTRY', purpose: 'Minor Inspection' },
      { number: 2, entryLine: 'SINGLE ENTRY', purpose: 'Minor Maintenance' },
      { number: 3, entryLine: 'SINGLE ENTRY', purpose: 'Component Check' }
    ]
  },
  hibl: {
    description: 'Heavy Inspection Bay Light - One Entry Line',
    totalBays: 3,
    entryLines: 1,
    bays: [
      { number: 1, entryLine: 'SINGLE ENTRY', purpose: 'Major Overhaul' },
      { number: 2, entryLine: 'SINGLE ENTRY', purpose: 'System Replacement' },
      { number: 3, entryLine: 'SINGLE ENTRY', purpose: 'Heavy Maintenance', currentTrain: 'VAAYU' }
    ]
  },
  hicl: {
    description: 'Heavy Inspection & Cleaning - Rack Option',
    totalBays: 1,
    entryLines: 1,
    bays: [
      { number: 1, entryLine: 'RACK OPTION', purpose: 'Heavy Inspection & Cleaning', currentTrain: 'INDUS' }
    ]
  },
  terminal: {
    description: 'Terminal & Utility Bays',
    totalBays: 3,
    bays: [
      { code: 'ETU', purpose: 'Empty Train Unit', currentTrain: 'MAARUT' },
      { code: 'ERL', purpose: 'Emergency Relief', currentTrain: 'SABARMATHI' },
      { code: 'UBL', purpose: 'Utility Bay', currentTrain: 'GODHAVARI' }
    ]
  }
};

// Passenger count based scheduling logic
export const getOptimalTrainCount = (
  expectedPassengers: number,
  serviceType: 'Weekday' | 'Weekend'
): number => {
  const baseline = serviceType === 'Weekday' ? 120000 : 85000;
  const maxTrains = serviceType === 'Weekday' ? 15 : 12;
  const minTrains = serviceType === 'Weekday' ? 10 : 8;
  
  const ratio = expectedPassengers / baseline;
  
  if (ratio > 1.3) return maxTrains; // Very high demand
  if (ratio > 1.1) return maxTrains - 1; // High demand
  if (ratio > 0.9) return maxTrains - 2; // Normal demand
  if (ratio > 0.7) return maxTrains - 3; // Low demand
  return Math.max(minTrains, maxTrains - 5); // Very low demand
};

// Real-time schedule adjustment
export const adjustScheduleForDemand = (
  baseSchedule: RealTrainSchedule[],
  currentPassengers: number,
  forecastedPassengers: number
): RealTrainSchedule[] => {
  const demandRatio = forecastedPassengers / currentPassengers;
  const optimalTrainCount = getOptimalTrainCount(forecastedPassengers, baseSchedule[0].serviceType);
  
  // Select trains based on priority and demand
  const adjustedSchedule = baseSchedule
    .slice(0, optimalTrainCount)
    .map(train => ({
      ...train,
      passengerLoad: Math.floor(train.passengerLoad * demandRatio),
      timing: adjustTimingForDemand(train.timing, demandRatio)
    }));
  
  return adjustedSchedule;
};

// Adjust timing based on demand
const adjustTimingForDemand = (originalTiming: string, demandRatio: number): string => {
  if (demandRatio > 1.2) {
    // High demand - start earlier
    const [hours, minutes] = originalTiming.split(':').map(Number);
    const adjustedMinutes = Math.max(0, minutes - 5);
    const adjustedHours = adjustedMinutes === minutes ? hours : hours - (minutes < 5 ? 1 : 0);
    return `${adjustedHours.toString().padStart(2, '0')}:${adjustedMinutes.toString().padStart(2, '0')}`;
  } else if (demandRatio < 0.8) {
    // Low demand - start later
    const [hours, minutes] = originalTiming.split(':').map(Number);
    const adjustedMinutes = (minutes + 10) % 60;
    const adjustedHours = hours + Math.floor((minutes + 10) / 60);
    return `${adjustedHours.toString().padStart(2, '0')}:${adjustedMinutes.toString().padStart(2, '0')}`;
  }
  return originalTiming;
};

// Export current schedule based on day type
export const getCurrentSchedule = (): RealTrainSchedule[] => {
  const today = new Date();
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;
  return isWeekend ? weekendSchedule : weekdaySchedule;
};