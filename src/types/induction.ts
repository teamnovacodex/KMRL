export interface TrainInduction {
  id: string;
  trainNumber: string;
  trainName: string;
  
  // Current Position & Status
  currentBay: {
    type: 'SBL' | 'IBL' | 'HIBL' | 'Terminal';
    number: number;
    location: 'Muttom_Depot' | 'Aluva_Terminal' | 'Tripunithura_Terminal';
    position?: 'OPEN_END' | 'BUFFERED_END';
  };
  
  // Fitness & Eligibility
  fitnessStatus: 'Valid' | 'Invalid' | 'Expiring_Soon';
  fitnessExpiry: string;
  certificateNumber: string;
  lastInspection: string;
  nextInspection: string;
  
  // Induction Planning
  inductionEligible: boolean;
  inductionTime: string; // 04:30, 04:45, etc.
  scheduledDeparture: string; // 05:00, 05:15, etc.
  fromStation: 'Aluva' | 'Tripunithura' | 'Muttom';
  nextDayStart: 'Aluva' | 'Tripunithura' | 'Muttom';
  
  // Operational Status
  operationalStatus: 'Active' | 'Standby' | 'Induction' | 'Maintenance' | 'Cleaning';
  serviceType: 'Revenue' | 'Non_Revenue' | 'Deadhead' | 'Out_of_Service';
  
  // Schedule Details
  scheduleSlot: {
    slotNumber: number;
    timeWindow: string;
    priority: 'High' | 'Medium' | 'Low';
    conflicts: string[];
  };
  
  // Maintenance & Health
  maintenanceWindow: {
    required: boolean;
    type: 'Preventive' | 'Corrective' | 'Emergency';
    estimatedDuration: number; // hours
    scheduledDate: string;
  };
  
  // Performance Metrics
  reliability: number; // 0-100
  punctuality: number; // 0-100
  mileage: {
    total: number;
    daily: number;
    weekly: number;
    lastUpdate: string;
  };
  
  // AI Decision
  aiRecommendation: {
    decision: 'Induct' | 'Standby' | 'Maintenance' | 'Hold';
    confidence: number; // 0-100
    reasoning: string[];
    riskFactors: string[];
    alternativeOptions: string[];
  };
}

export interface InductionSchedule {
  scheduleId: string;
  date: string;
  serviceType: 'Weekday' | 'Weekend' | 'Holiday';
  
  // Service Requirements
  requiredTrains: number;
  standbyTrains: number;
  totalCapacity: number;
  
  // Time Slots
  firstInduction: string; // 04:30
  lastInduction: string; // 08:00
  serviceStart: string; // 05:00
  serviceEnd: string; // 22:00
  
  // Scheduled Trains
  inductionSlots: InductionSlot[];
  standbyList: StandbyTrain[];
  maintenanceList: MaintenanceTrain[];
  
  // Performance Targets
  targetPunctuality: number;
  targetCapacity: number;
  riskAssessment: 'Low' | 'Medium' | 'High';
}

export interface InductionSlot {
  slotId: string;
  trainId: string;
  trainName: string;
  inductionTime: string;
  departureTime: string;
  fromStation: string;
  toStation: string;
  route: string;
  estimatedPassengers: number;
  priority: number;
}

export interface StandbyTrain {
  trainId: string;
  trainName: string;
  location: string;
  readyTime: string;
  deploymentPriority: number;
  estimatedResponseTime: number; // minutes
}

export interface MaintenanceTrain {
  trainId: string;
  trainName: string;
  maintenanceType: string;
  estimatedCompletion: string;
  nextAvailable: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
}

export interface DepotOperations {
  totalBays: number;
  serviceBays: number; // SBL
  inspectionBays: number; // IBL
  heavyMaintenanceBays: number; // HIBL
  cleaningBays: number;
  
  currentOccupancy: {
    sbl: number;
    ibl: number;
    hibl: number;
    cleaning: number;
  };
  
  shuntingOperations: {
    planned: number;
    inProgress: number;
    completed: number;
    estimatedTime: number; // minutes
  };
}