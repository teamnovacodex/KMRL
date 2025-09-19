export interface Train {
  id: string;
  trainNumber: string;
  trainName: string;
  model: string;
  manufacturingYear: number;
  status: 'Active' | 'Maintenance' | 'Standby' | 'Out of Service';
  
  // Fitness Certificates - Rolling-Stock, Signalling, Telecom departments
  fitnessStatus: 'Valid' | 'Expired' | 'Expiring Soon';
  fitnessExpiryDate: string;
  fitnessScore: number; // 0-100
  rollingStockCert: {
    status: 'Valid' | 'Expired';
    expiryDate: string;
    issuedBy: string;
  };
  signallingCert: {
    status: 'Valid' | 'Expired';
    expiryDate: string;
    issuedBy: string;
  };
  telecomCert: {
    status: 'Valid' | 'Expired';
    expiryDate: string;
    issuedBy: string;
  };
  
  // Job Cards - IBM Maximo Integration
  jobCardStatus: 'Open' | 'Closed' | 'In Progress';
  maximoWorkOrders: MaximoJobCard[];
  criticalJobCards: number;
  lastMaintenance: string;
  nextScheduledMaintenance: string;
  
  // Branding - Sticker wrapping and interior posters
  brandingRequired: boolean;
  exteriorWrapContract?: {
    advertiser: string;
    campaignName: string;
    requiredExposureHours: number;
    currentExposureHours: number;
    contractValue: number;
    status: 'Active' | 'Expired';
  };
  interiorPosterAds: {
    advertiser: string;
    positionCount: number;
    revenue: number;
  }[];
  
  // Mileage & Third Rail System
  totalMileage: number;
  dailyMileage: number;
  thirdRailConsumption: number; // kWh per km
  bogieWear: number; // 0-100
  brakePadWear: number; // 0-100
  hvacWear: number; // 0-100
  utilizationRate: number; // 0-100
  
  // Depot Bay System - IBL, HIBL, SBL
  currentBay: {
    type: 'IBL' | 'HIBL' | 'SBL';
    bayNumber: number;
    position: 'OPEN_END' | 'BUFFERED_END';
    location: 'Muttom_Depot' | 'Aluva_Terminal' | 'Tripunithura_Terminal';
  };
  
  // Cleaning & Detailing
  cleaningStatus: 'Pending' | 'In Progress' | 'Done' | 'Deep Clean Required';
  lastCleaning: string;
  cleaningType: 'Basic' | 'Deep' | 'Interior_Detail' | 'Exterior_Wash';
  
  // Health Monitoring
  healthScore: number; // 0-100
  engineHealth: number;
  brakeHealth: number;
  doorSystemHealth: number;
  acSystemHealth: number;
  
  // AI Recommendations
  recommendation: 'Service' | 'Standby' | 'Maintenance' | 'Deep Clean';
  confidenceScore: number; // 0-100
  riskFactors: string[];
  canGoToService: boolean; // Only SBL bay trains can go to service
}

export interface MaximoJobCard {
  workOrderNumber: string;
  type: 'Preventive' | 'Corrective' | 'Emergency' | 'Inspection';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'Closed' | 'In Progress';
  description: string;
  estimatedHours: number;
  assignedTechnician: string;
  createdDate: string;
  dueDate: string;
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
}

export interface TrainSummary {
  service: number;
  standby: number;
  maintenance: number;
  total: number;
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
}