export interface LiveTrainTracking {
  trainId: string;
  trainName: string;
  currentStation: string;
  nextStation: string;
  speed: number; // km/h
  direction: 'UP' | 'DOWN'; // Aluva to Tripunithura = DOWN, reverse = UP
  status: 'RUNNING' | 'STOPPED' | 'APPROACHING' | 'DEPARTING';
  passengerLoad: number; // percentage
  delay: number; // minutes
  coordinates: { x: number; y: number };
  lastUpdate: string;
}

export interface StationStatus {
  stationCode: string;
  stationName: string;
  platform1: {
    trainPresent: boolean;
    trainId?: string;
    dwellTime?: number;
    passengerCount?: number;
  };
  platform2: {
    trainPresent: boolean;
    trainId?: string;
    dwellTime?: number;
    passengerCount?: number;
  };
  signalStatus: 'GREEN' | 'RED' | 'YELLOW';
  powerStatus: 'ENERGIZED' | 'DE_ENERGIZED';
}

export interface DailyInductionPlan {
  planDate: string; // Tomorrow's date
  planGenerated: string; // When plan was created
  validUntil: string; // Plan validity
  totalTrainsRequired: number;
  inductionSlots: DailyInductionSlot[];
  standbyTrains: StandbyAssignment[];
  maintenanceSchedule: MaintenanceSlot[];
  riskAssessment: 'LOW' | 'MEDIUM' | 'HIGH';
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
}

export interface DailyInductionSlot {
  slotNumber: number;
  trainId: string;
  trainName: string;
  inductionTime: string; // 04:30, 04:45, etc.
  departureTime: string; // 05:00, 05:15, etc.
  fromTerminal: 'ALUVA' | 'TRIPUNITHURA';
  assignedRoute: string;
  estimatedPassengers: number;
  revenueTarget: number;
  fitnessValid: boolean;
  bayPosition: string; // SBL1, SBL2, etc.
}

export interface StandbyAssignment {
  trainId: string;
  trainName: string;
  location: 'ALUVA_TERMINAL' | 'TRIPUNITHURA_TERMINAL';
  readyTime: string;
  deploymentPriority: number;
  estimatedResponseTime: number; // minutes to deploy
}

export interface MaintenanceSlot {
  trainId: string;
  trainName: string;
  maintenanceType: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY';
  bayAssignment: string; // IBL1, HIBL1, etc.
  estimatedDuration: number; // hours
  scheduledStart: string;
  estimatedCompletion: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ControlCenterData {
  systemTime: string;
  operationalStatus: 'NORMAL' | 'DEGRADED' | 'EMERGENCY';
  activeTrains: number;
  totalPassengers: number;
  systemAlerts: SystemAlert[];
  powerStatus: {
    depot: 'ENERGIZED' | 'DE_ENERGIZED';
    mainline: 'ENERGIZED' | 'DE_ENERGIZED';
    thirdRail: 'ENERGIZED' | 'DE_ENERGIZED';
  };
}

export interface SystemAlert {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  timestamp: string;
  acknowledged: boolean;
  source: 'TRAIN' | 'STATION' | 'DEPOT' | 'SYSTEM';
}

export interface AISchedulingBot {
  isActive: boolean;
  lastOptimization: string;
  nextOptimization: string;
  confidence: number;
  recommendations: string[];
  currentTask: string;
  processingStatus: 'IDLE' | 'ANALYZING' | 'OPTIMIZING' | 'COMPLETE';
}