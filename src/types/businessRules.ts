// Business Rules Engine Types
export interface BusinessRule {
  ruleId: string;
  name: string;
  description: string;
  category: 'Safety' | 'Operational' | 'Commercial' | 'Regulatory';
  priority: number; // 1-10, 10 being highest
  isActive: boolean;
  conditions: RuleCondition[];
  actions: RuleAction[];
}

export interface RuleCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'between';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface RuleAction {
  type: 'Block' | 'Allow' | 'Warning' | 'Score';
  value: any;
  message: string;
}

export interface RuleEvaluation {
  ruleId: string;
  trainId: string;
  passed: boolean;
  score: number;
  message: string;
  category: string;
  timestamp: string;
}

export interface TrainEligibility {
  trainId: string;
  overallScore: number;
  eligibilityStatus: 'Eligible' | 'Conditional' | 'Blocked';
  ruleEvaluations: RuleEvaluation[];
  blockingRules: string[];
  warningRules: string[];
  recommendations: string[];
}