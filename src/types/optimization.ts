// Optimization Engine Types
export interface OptimizationObjective {
  name: string;
  weight: number; // 0-1, sum should equal 1
  type: 'maximize' | 'minimize';
  description: string;
}

export interface OptimizationConstraint {
  name: string;
  type: 'hard' | 'soft';
  description: string;
  penalty: number; // for soft constraints
}

export interface OptimizationResult {
  optimizationId: string;
  timestamp: string;
  objectives: OptimizationObjective[];
  constraints: OptimizationConstraint[];
  selectedTrains: string[];
  standbyTrains: string[];
  maintenanceTrains: string[];
  totalScore: number;
  objectiveScores: { [key: string]: number };
  constraintViolations: ConstraintViolation[];
  reasoning: OptimizationReasoning[];
  alternativeScenarios: AlternativeScenario[];
}

export interface ConstraintViolation {
  constraintName: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  affectedTrains: string[];
  description: string;
  suggestedActions: string[];
}

export interface OptimizationReasoning {
  trainId: string;
  decision: 'Selected' | 'Standby' | 'Maintenance';
  primaryReasons: string[];
  secondaryFactors: string[];
  score: number;
  tradeoffs: string[];
}

export interface AlternativeScenario {
  scenarioId: string;
  name: string;
  description: string;
  selectedTrains: string[];
  totalScore: number;
  keyDifferences: string[];
}

export interface HistoricalPerformance {
  date: string;
  selectedTrains: string[];
  actualPerformance: {
    punctuality: number;
    passengerSatisfaction: number;
    maintenanceCosts: number;
    brandingRevenue: number;
    operationalEfficiency: number;
  };
  predictedPerformance: {
    punctuality: number;
    passengerSatisfaction: number;
    maintenanceCosts: number;
    brandingRevenue: number;
    operationalEfficiency: number;
  };
  accuracy: number;
}