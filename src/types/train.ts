export interface Train {
  id: string;
  trainNumber: string;
  trainName: string;
  trainId: string; // 001, 002, etc.
  positionId: string; // SBL1, SBL2, IBL1, HIBL1, etc.
  fromStation: string;
  status: 'Active' | 'Maintenance' | 'Standby' | 'Out of Service';
  fitnessExpiry: string;
  nextDayStart: string;
  
  // Fitness Certificates with exact validation
  fitnessValidation: {
    mechanical: boolean;
    electrical: boolean;
    brakeSystem: boolean;
    doorSystem: boolean;
    communication: boolean;
    safety: boolean;
    cleanliness: boolean;
    documentation: boolean;
  };
  
  // Induction scheduling
  inductionTime: string; // 04:30, 04:45, 05:00, etc.
  scheduledDeparture: string; // 05:00, 05:15, 05:30, etc.
  
  // Current operational status
  currentBay: {
    type: 'SBL' | 'IBL' | 'HIBL';
    number: number;
    location: 'Muttom_Depot' | 'Aluva_Terminal' | 'Tripunithura_Terminal';
  };
  
  // AI Decision factors
  aiDecision: 'Service' | 'Standby' | 'Maintenance' | 'Induction';
  confidenceScore: number;
  validationStatus: 'Valid' | 'Invalid' | 'Expiring Soon';
  
  // Operational metrics
  totalMileage: number;
  healthScore: number;
  lastMaintenance: string;
  nextMaintenance: string;
}

export interface FleetOperations {
  totalFleet: number;
  runningToday: number;
  standbyTrains: number;
  maintenance: number;
  serviceStatus: 'Active' | 'Holiday' | 'Weekend';
  serviceHours: string;
  
  // Fleet distribution
  weekdayOperations: number;
  weekendOperations: number;
  standbyLocations: string[];
  depotLocation: string;
  
  // Revenue service hours
  weekdayService: string;
  holidayService: string;
  currentStatus: string;
  serviceType: string;
}

export interface InductionSchedule {
  trainName: string;
  trainId: string;
  positionId: string;
  fromStation: string;
  inductionTime: string;
  scheduledDeparture: string;
  status: 'Active' | 'Scheduled' | 'Maintenance';
}

export interface AutomatedSystem {
  fitnessValidation: {
    validCertificates: number;
    invalidCertificates: number;
    expiringSoon: number;
    totalTrains: number;
  };
  inductionScheduling: {
    scheduledTrains: Train[];
    firstTrain: string;
    lastTrain: string;
    serviceStart: string;
    serviceEnd: string;
    holidayStart: string;
  };
}