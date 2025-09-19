export interface Train {
  id: string;
  trainNumber: string;
  trainName: string;
  model: string;
  manufacturingYear: number;
  status: 'Active' | 'Maintenance' | 'Standby' | 'Out of Service';
  
  // Fitness Certificates - 3 departments with timestamps
  fitnessStatus: 'Valid' | 'Expired' | 'Expiring Soon';
  rollingStockCert: {
    status: 'Valid' | 'Expired';
    issueDate: string;
    expiryDate: string;
    lastInspection: string;
    nextInspection: string;
    issuedBy: string;
    certificateNumber: string;
  };
  signallingCert: {
    status: 'Valid' | 'Expired';
    issueDate: string;
    expiryDate: string;
    lastInspection: string;
    nextInspection: string;
    issuedBy: string;
    certificateNumber: string;
  };
  telecomCert: {
    status: 'Valid' | 'Expired';
    issueDate: string;
    expiryDate: string;
    lastInspection: string;
    nextInspection: string;
    issuedBy: string;
    certificateNumber: string;
  };
  
  // Job Cards - IBM Maximo with scheduling
  jobCardStatus: 'Open' | 'Closed' | 'In Progress';
  maximoWorkOrders: MaximoJobCard[];
  criticalJobCards: number;
  lastMaintenance: string;
  nextScheduledMaintenance: string;
  maintenanceWindow: {
    startTime: string;
    endTime: string;
    estimatedDuration: number; // hours
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
  };
  
  // Branding - Sticker wrapping + interior posters with scheduling
  brandingRequired: boolean;
  exteriorWrapContract?: {
    advertiser: string;
    campaignName: string;
    contractStartDate: string;
    contractEndDate: string;
    requiredExposureHours: number;
    currentExposureHours: number;
    dailyTargetHours: number;
    contractValue: number;
    penaltyPerHour: number;
    status: 'Active' | 'Expired' | 'Pending';
    lastExposureUpdate: string;
  };
  interiorPosterAds: {
    advertiser: string;
    positionCount: number;
    installationDate: string;
    expiryDate: string;
    revenue: number;
    status: 'Active' | 'Expired';
  }[];
  
  // Mileage & Third Rail System with time tracking
  totalMileage: number;
  dailyMileage: number;
  weeklyMileage: number;
  monthlyMileage: number;
  lastMileageUpdate: string;
  thirdRailConsumption: number; // kWh per km
  dailyPowerConsumption: number; // kWh
  bogieWear: {
    currentWear: number; // 0-100%
    lastInspection: string;
    nextInspection: string;
    replacementDue: string;
  };
  brakePadWear: {
    currentWear: number; // 0-100%
    lastInspection: string;
    nextInspection: string;
    replacementDue: string;
  };
  hvacWear: {
    currentWear: number; // 0-100%
    lastInspection: string;
    nextInspection: string;
    replacementDue: string;
  };
  utilizationRate: number; // 0-100
  
  // Depot Bay System with scheduling
  currentBay: {
    type: 'IBL' | 'HIBL' | 'SBL';
    bayNumber: number;
    position?: 'OPEN_END' | 'BUFFERED_END';
    location: 'Muttom_Depot' | 'Aluva_Terminal' | 'Tripunithura_Terminal';
    entryTime: string;
    expectedExitTime: string;
    occupancyDuration: number; // hours
  };
  
  // Cleaning & Detailing with scheduling
  cleaningStatus: 'Pending' | 'In Progress' | 'Done' | 'Deep Clean Required';
  cleaningSchedule: {
    scheduledDate: string;
    scheduledTime: string;
    estimatedDuration: number; // hours
    cleaningType: 'Basic' | 'Deep' | 'Interior_Detail' | 'Exterior_Wash';
    assignedCrew: string;
    bayRequired: number;
    manpowerRequired: number;
  };
  lastCleaning: string;
  nextCleaningDue: string;
  
  // Health Monitoring with timestamps
  healthScore: number; // 0-100
  lastHealthCheck: string;
  nextHealthCheck: string;
  engineHealth: {
    score: number;
    lastCheck: string;
    nextCheck: string;
    issues: string[];
  };
  brakeHealth: {
    score: number;
    lastCheck: string;
    nextCheck: string;
    issues: string[];
  };
  doorSystemHealth: {
    score: number;
    lastCheck: string;
    nextCheck: string;
    issues: string[];
  };
  acSystemHealth: {
    score: number;
    lastCheck: string;
    nextCheck: string;
    issues: string[];
  };
  
  // AI Scheduling & Recommendations
  aiRecommendation: {
    decision: 'Service' | 'Standby' | 'Maintenance' | 'Deep Clean';
    confidence: number; // 0-100
    reasoning: string[];
    scheduledFor: string; // tomorrow's date
    estimatedServiceHours: number;
    riskFactors: string[];
    alternativeOptions: string[];
    lastUpdated: string;
  };
  
  // Service Eligibility
  canGoToService: boolean;
  serviceEligibilityReasons: string[];
  nextServiceDate: string;
  estimatedRevenue: number; // for tomorrow
}

export interface MaximoJobCard {
  workOrderNumber: string;
  type: 'Preventive' | 'Corrective' | 'Emergency' | 'Inspection';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'Closed' | 'In Progress';
  description: string;
  createdDate: string;
  scheduledDate: string;
  dueDate: string;
  completedDate?: string;
  estimatedHours: number;
  actualHours?: number;
  assignedTechnician: string;
  partsRequired: string[];
  estimatedCost: number;
}

export interface DepotBay {
  bayNumber: number;
  type: 'IBL' | 'HIBL' | 'SBL';
  description: string;
  capacity: number;
  currentOccupant?: string;
  location: 'Muttom_Depot' | 'Aluva_Terminal' | 'Tripunithura_Terminal';
  position?: 'OPEN_END' | 'BUFFERED_END';
  canServiceRevenue: boolean;
  maintenanceCapabilities: string[];
  availableFrom: string;
  nextAvailable: string;
}

export interface AIOptimizationResult {
  optimizationId: string;
  timestamp: string;
  targetDate: string; // tomorrow's date
  totalScore: number;
  selectedForService: string[];
  standbyTrains: string[];
  maintenanceTrains: string[];
  cleaningTrains: string[];
  reasoning: {
    trainId: string;
    decision: string;
    score: number;
    factors: string[];
    scheduledTime: string;
  }[];
  constraints: {
    maxServiceTrains: number;
    minStandbyTrains: number;
    availableManpower: number;
    depotCapacity: number;
  };
  expectedPerformance: {
    onTimePerformance: number;
    passengerCapacity: number;
    estimatedRevenue: number;
    operationalCost: number;
    riskLevel: 'Low' | 'Medium' | 'High';
  };
}

export interface HistoricalData {
  date: string;
  selectedTrains: number;
  standbyTrains: number;
  maintenanceTrains: number;
  onTimePerformance: number;
  passengerCount: number;
  revenue: number;
  efficiency: number;
  thirdRailConsumption: number;
  averageHealthScore: number;
  criticalIssues: number;
  completedMaintenance: number;
}