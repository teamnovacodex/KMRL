export interface Train {
  id: string;
  trainNumber: string;
  model: string;
  manufacturingYear: number;
  lastMajorOverhaul: string;
  currentLocation: string;
  status: 'Active' | 'Maintenance' | 'Standby' | 'Out of Service';
  
  // Fitness Certificate
  fitnessStatus: 'Valid' | 'Expired' | 'Expiring Soon';
  fitnessExpiryDate: string;
  lastFitnessCheck: string;
  fitnessScore: number; // 0-100
  
  // Job Cards & Maintenance
  jobCardStatus: 'Open' | 'Closed' | 'In Progress';
  openJobCards: JobCard[];
  criticalJobCards: number;
  lastMaintenance: string;
  nextScheduledMaintenance: string;
  maintenanceScore: number; // 0-100
  
  // Branding & Commercial
  brandingRequired: boolean;
  brandingContract?: BrandingContract;
  brandingScore: number; // 0-100
  
  // Mileage & Usage
  totalMileage: number;
  dailyMileage: number;
  weeklyMileage: number;
  monthlyMileage: number;
  mileageDeviation: number; // from fleet average
  utilizationRate: number; // 0-100
  
  // Cleaning & Depot
  cleaningStatus: 'Pending' | 'In Progress' | 'Done' | 'Deep Clean Required';
  lastCleaning: string;
  cleaningType: 'Basic' | 'Deep' | 'Exterior' | 'Interior';
  depotBay: number;
  stablingPosition: { x: number; y: number };
  shuntingDistance: number;
  
  // IoT & Health Monitoring
  healthScore: number; // 0-100
  engineHealth: number;
  brakeHealth: number;
  doorSystemHealth: number;
  acSystemHealth: number;
  batteryLevel: number;
  vibrationLevel: number;
  temperature: number;
  
  // AI Predictions & Recommendations
  recommendation: 'Service' | 'Standby' | 'Maintenance' | 'Deep Clean';
  confidenceScore: number; // 0-100
  riskFactors: string[];
  predictedIssues: string[];
  
  // Historical Performance
  punctualityRate: number; // last 30 days
  breakdownHistory: BreakdownRecord[];
  performanceMetrics: PerformanceMetrics;
}

export interface JobCard {
  id: string;
  trainId: string;
  workOrderNumber: string;
  type: 'Preventive' | 'Corrective' | 'Emergency' | 'Inspection';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Closed' | 'On Hold';
  description: string;
  estimatedHours: number;
  actualHours?: number;
  assignedTechnician: string;
  createdDate: string;
  dueDate: string;
  completedDate?: string;
  parts: MaintenancePart[];
  cost: number;
}

export interface BrandingContract {
  id: string;
  trainId: string;
  advertiser: string;
  campaignName: string;
  contractValue: number;
  startDate: string;
  endDate: string;
  requiredExposureHours: number;
  currentExposureHours: number;
  dailyTarget: number;
  penaltyClause: number;
  status: 'Active' | 'Expired' | 'Pending' | 'Cancelled';
}

export interface MaintenancePart {
  partNumber: string;
  description: string;
  quantity: number;
  unitCost: number;
  availability: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'On Order';
}

export interface BreakdownRecord {
  id: string;
  trainId: string;
  date: string;
  type: 'Mechanical' | 'Electrical' | 'Software' | 'External';
  severity: 'Minor' | 'Major' | 'Critical';
  downtime: number; // minutes
  cause: string;
  resolution: string;
  cost: number;
}

export interface PerformanceMetrics {
  onTimePerformance: number;
  meanTimeBetweenFailures: number;
  meanTimeToRepair: number;
  availability: number;
  reliability: number;
  fuelEfficiency: number;
  passengerSatisfaction: number;
}

export interface DepotLayout {
  totalBays: number;
  serviceBays: number;
  maintenanceBays: number;
  cleaningBays: number;
  storageBays: number;
  layout: DepotBay[];
}

export interface DepotBay {
  bayNumber: number;
  type: 'Service' | 'Maintenance' | 'Cleaning' | 'Storage';
  capacity: number;
  currentOccupant?: string;
  position: { x: number; y: number };
  adjacentBays: number[];
  facilities: string[];
}

export interface HistoricalData {
  date: string;
  selectedTrains: number;
  standbyTrains: number;
  maintenanceTrains: number;
  onTimePerformance: number;
  breakdowns: number;
  passengerCount: number;
  revenue: number;
  operationalCost: number;
  efficiency: number;
}

export interface OptimizationResult {
  timestamp: string;
  totalScore: number;
  selectedTrains: string[];
  standbyTrains: string[];
  maintenanceTrains: string[];
  reasoning: TrainReasoning[];
  constraints: ConstraintResult[];
  alternatives: AlternativeScenario[];
  riskAssessment: RiskAssessment;
}

export interface TrainReasoning {
  trainId: string;
  decision: string;
  score: number;
  factors: ReasoningFactor[];
  risks: string[];
  alternatives: string[];
}

export interface ReasoningFactor {
  category: string;
  weight: number;
  score: number;
  description: string;
  impact: 'Positive' | 'Negative' | 'Neutral';
}

export interface ConstraintResult {
  name: string;
  type: 'Hard' | 'Soft';
  satisfied: boolean;
  violation?: string;
  impact: number;
}

export interface AlternativeScenario {
  id: string;
  name: string;
  description: string;
  score: number;
  tradeoffs: string[];
  risks: string[];
}

export interface RiskAssessment {
  overallRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  riskFactors: RiskFactor[];
  mitigation: string[];
  contingencyPlans: string[];
}

export interface RiskFactor {
  category: string;
  description: string;
  probability: number;
  impact: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}