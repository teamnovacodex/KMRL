export interface Train {
  id: string;
  trainNumber: string;
  trainName: string;
  model: string;
  manufacturingYear: number;
  status: 'Active' | 'Maintenance' | 'Standby' | 'Out of Service';
  
  // Fitness Certificate
  fitnessStatus: 'Valid' | 'Expired' | 'Expiring Soon';
  fitnessExpiryDate: string;
  fitnessScore: number; // 0-100
  
  // Job Cards & Maintenance
  jobCardStatus: 'Open' | 'Closed' | 'In Progress';
  criticalJobCards: number;
  lastMaintenance: string;
  nextScheduledMaintenance: string;
  
  // Branding & Commercial
  brandingRequired: boolean;
  brandingContract?: {
    advertiser: string;
    campaignName: string;
    requiredExposureHours: number;
    currentExposureHours: number;
    status: 'Active' | 'Expired';
  };
  
  // Mileage & Usage
  totalMileage: number;
  dailyMileage: number;
  utilizationRate: number; // 0-100
  
  // Cleaning & Depot
  cleaningStatus: 'Pending' | 'In Progress' | 'Done' | 'Deep Clean Required';
  lastCleaning: string;
  depotBay: number;
  
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
}