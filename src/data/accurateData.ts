import { Train, FleetOperations, InductionSchedule, AutomatedSystem } from '../types/train';

// KMRL Train Names (25 trains as shown in reference)
export const trainNames = [
  'GANGA', 'KAVRI', 'KRISHNA', 'TAPTI', 'SARAW', 'ARUTH', 'VAIGAI', 'JHANAVI', 
  'DHWANIL', 'BHAVANI', 'PADMA', 'MANDAKINI', 'YAMUNA', 'PERIYAR', 'KABANI', 
  'VAAW', 'KAVERI', 'SHIRIYA', 'PAMPA', 'NARMADA', 'MAARUT', 'SABARMATHI', 
  'GODHAVARI', 'PAVAN', 'INDUS'
];

// Kochi Metro Stations
export const stations = [
  'Aluva', 'Pulinchodu', 'Companypady', 'Ambattukavu', 'Muttom', 'Kalamassery',
  'Cochin University', 'Pathadipalam', 'Edapally', 'Changampuzha Park', 'Palarivattom',
  'JLN Stadium', 'Kaloor', 'Town Hall', 'M.G Road', 'Maharajas College', 'Ernakulam South',
  'Kadavanthra', 'Elamkulam', 'Vyttila', 'Thaikoodam', 'Petta', 'Vadakkekotta', 'Tripunithura'
];

// Generate accurate train data based on reference images
export const accurateTrains: Train[] = trainNames.map((name, index) => {
  const trainId = (index + 1).toString().padStart(3, '0');
  const isServiceReady = index < 15; // 15 trains for weekday service
  const isStandby = index >= 15 && index < 17; // 2 standby trains
  const isMaintenance = index >= 17; // Rest in maintenance
  
  // Determine position based on status
  let positionId: string;
  let bayType: 'SBL' | 'IBL' | 'HIBL';
  let bayNumber: number;
  
  if (isServiceReady) {
    bayType = 'SBL';
    bayNumber = (index % 12) + 1;
    positionId = `SBL${bayNumber}`;
  } else if (isStandby) {
    bayType = 'IBL';
    bayNumber = (index - 15) + 1;
    positionId = `IBL${bayNumber}`;
  } else {
    bayType = 'HIBL';
    bayNumber = (index - 17) + 1;
    positionId = `HIBL${bayNumber}`;
  }
  
  // Station assignment (alternating between terminals)
  const fromStation = index % 3 === 0 ? 'Aluva' : 
                     index % 3 === 1 ? 'Tripunithura' : 'Muttom';
  
  // Induction times (early morning 04:30 - 05:30)
  const inductionHour = 4;
  const inductionMinute = 30 + (index * 5) % 60;
  const inductionTime = `${inductionHour.toString().padStart(2, '0')}:${inductionMinute.toString().padStart(2, '0')}`;
  
  // Scheduled departure (30 minutes after induction)
  const depHour = inductionMinute >= 30 ? 5 : 4;
  const depMinute = (inductionMinute + 30) % 60;
  const scheduledDeparture = `${depHour.toString().padStart(2, '0')}:${depMinute.toString().padStart(2, '0')}`;
  
  // Fitness validation (mostly valid, some invalid for realism)
  const isValid = Math.random() > 0.2; // 80% valid
  const fitnessValidation = {
    mechanical: isValid,
    electrical: isValid,
    brakeSystem: isValid || Math.random() > 0.1,
    doorSystem: isValid || Math.random() > 0.1,
    communication: isValid,
    safety: isValid,
    cleanliness: isValid || Math.random() > 0.2,
    documentation: isValid
  };
  
  return {
    id: trainId,
    trainNumber: trainId,
    trainName: name,
    trainId: trainId,
    positionId,
    fromStation,
    status: isServiceReady ? 'Active' : isStandby ? 'Standby' : 'Maintenance',
    fitnessExpiry: '2025-09-21',
    nextDayStart: fromStation,
    fitnessValidation,
    inductionTime,
    scheduledDeparture,
    currentBay: {
      type: bayType,
      number: bayNumber,
      location: 'Muttom_Depot'
    },
    aiDecision: isServiceReady ? 'Service' : isStandby ? 'Standby' : 'Maintenance',
    confidenceScore: Math.floor(Math.random() * 20) + 80,
    validationStatus: isValid ? 'Valid' : 'Invalid',
    totalMileage: Math.floor(Math.random() * 100000) + 50000,
    healthScore: Math.floor(Math.random() * 30) + 70,
    lastMaintenance: '2024-12-15',
    nextMaintenance: '2025-01-15'
  };
});

// Fleet Operations Data
export const fleetOperations: FleetOperations = {
  totalFleet: 25,
  runningToday: 15,
  standbyTrains: 2,
  maintenance: 8,
  serviceStatus: 'Active',
  serviceHours: '05:00 - 22:00',
  weekdayOperations: 15,
  weekendOperations: 12,
  standbyLocations: ['Aluva', 'Tripunithura'],
  depotLocation: 'Muttom Depot',
  weekdayService: '05:00 - 22:00',
  holidayService: '08:00 - 22:00',
  currentStatus: 'Active',
  serviceType: 'Weekday Schedule'
};

// Induction Schedule
export const inductionSchedule: InductionSchedule[] = accurateTrains
  .filter(train => train.status === 'Active')
  .map(train => ({
    trainName: train.trainName,
    trainId: train.trainId,
    positionId: train.positionId,
    fromStation: train.fromStation,
    inductionTime: train.inductionTime,
    scheduledDeparture: train.scheduledDeparture,
    status: train.status
  }));

// Automated System Data
export const automatedSystem: AutomatedSystem = {
  fitnessValidation: {
    validCertificates: accurateTrains.filter(t => t.validationStatus === 'Valid').length,
    invalidCertificates: accurateTrains.filter(t => t.validationStatus === 'Invalid').length,
    expiringSoon: accurateTrains.filter(t => t.validationStatus === 'Expiring Soon').length,
    totalTrains: accurateTrains.length
  },
  inductionScheduling: {
    scheduledTrains: accurateTrains.filter(t => t.status === 'Active'),
    firstTrain: '04:30 AM',
    lastTrain: '08:00 AM',
    serviceStart: '05:00 AM',
    serviceEnd: '10:00 PM',
    holidayStart: '08:00 AM'
  }
};

// Daily Operations Cycle
export const operationalFlow = {
  dailyCycle: [
    'Train completes last trip of the day',
    'Train halts at designated station (Aluva or Tripunithura)',
    'Next day, train starts from the same station',
    'Fitness certificate valid for 2 days',
    'Standby trains ready for immediate deployment'
  ],
  sampleActiveTrains: [
    { name: 'GANGA', id: '001', position: 'PS012', station: 'Tripunithura' },
    { name: 'KAVRI', id: '003', position: 'PS014', station: 'Aluva' },
    { name: 'KRISHNA', id: '005', position: 'PS016', station: 'Tripunithura' },
    { name: 'TAPTI', id: '007', position: 'PS018', station: 'Aluva' },
    { name: 'SARAW', id: '009', position: 'PS020', station: 'Tripunithura' }
  ],
  inductionSchedule: [
    { time: '04:30 AM', description: 'First Train' },
    { time: '08:00 AM', description: 'Last Train' },
    { time: '05:00 AM', description: 'Service Start' },
    { time: '10:00 PM', description: 'Service End' },
    { time: '08:00 AM', description: 'Holiday Start' }
  ],
  fleetDistribution: [
    { category: 'Total Fleet', count: 25, description: 'trains' },
    { category: 'Weekday Running', count: 15, description: 'trains' },
    { category: 'Holiday Running', count: 12, description: 'trains' },
    { category: 'Standby', count: 2, description: 'trains' },
    { category: 'Maintenance', count: 8, description: 'trains' }
  ]
};