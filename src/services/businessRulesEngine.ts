import { BusinessRule, RuleEvaluation, TrainEligibility } from '../types/businessRules';
import { Train } from '../types/train';
import { MaximoJobCard, IoTSensorData, BrandingContract } from '../types/dataIntegration';

class BusinessRulesEngine {
  private rules: BusinessRule[] = [
    {
      ruleId: 'SAFETY-001',
      name: 'Valid Fitness Certificate',
      description: 'Train must have a valid fitness certificate',
      category: 'Safety',
      priority: 10,
      isActive: true,
      conditions: [
        { field: 'fitnessStatus', operator: 'equals', value: 'Valid' }
      ],
      actions: [
        { type: 'Block', value: true, message: 'Train blocked due to expired fitness certificate' }
      ]
    },
    {
      ruleId: 'SAFETY-002',
      name: 'Critical Job Cards',
      description: 'No critical job cards should be open',
      category: 'Safety',
      priority: 9,
      isActive: true,
      conditions: [
        { field: 'criticalJobCards', operator: 'equals', value: 0 }
      ],
      actions: [
        { type: 'Block', value: true, message: 'Train blocked due to open critical job cards' }
      ]
    },
    {
      ruleId: 'OPERATIONAL-001',
      name: 'Mileage Balance',
      description: 'Maintain balanced mileage across fleet',
      category: 'Operational',
      priority: 6,
      isActive: true,
      conditions: [
        { field: 'mileageDeviation', operator: 'less_than', value: 10000 }
      ],
      actions: [
        { type: 'Score', value: 0.8, message: 'Good mileage balance' }
      ]
    },
    {
      ruleId: 'COMMERCIAL-001',
      name: 'Branding Contract Fulfillment',
      description: 'Prioritize trains with active branding contracts',
      category: 'Commercial',
      priority: 7,
      isActive: true,
      conditions: [
        { field: 'activeBrandingContract', operator: 'equals', value: true }
      ],
      actions: [
        { type: 'Score', value: 1.2, message: 'Priority for branding contract fulfillment' }
      ]
    },
    {
      ruleId: 'OPERATIONAL-002',
      name: 'IoT Health Score',
      description: 'Train systems must meet minimum health thresholds',
      category: 'Operational',
      priority: 8,
      isActive: true,
      conditions: [
        { field: 'overallHealthScore', operator: 'greater_than', value: 70 }
      ],
      actions: [
        { type: 'Allow', value: true, message: 'Train meets health requirements' }
      ]
    },
    {
      ruleId: 'OPERATIONAL-003',
      name: 'Cleaning Status',
      description: 'Prefer trains that are cleaned and ready',
      category: 'Operational',
      priority: 5,
      isActive: true,
      conditions: [
        { field: 'cleaningStatus', operator: 'equals', value: 'Done' }
      ],
      actions: [
        { type: 'Score', value: 1.1, message: 'Bonus for completed cleaning' }
      ]
    }
  ];

  async evaluateTrainEligibility(
    train: Train,
    jobCards: MaximoJobCard[],
    iotData: IoTSensorData[],
    brandingContracts: BrandingContract[]
  ): Promise<TrainEligibility> {
    const trainJobCards = jobCards.filter(jc => jc.trainId === train.id);
    const trainIoTData = iotData.find(iot => iot.trainId === train.id);
    const trainBranding = brandingContracts.find(bc => bc.trainId === train.id);

    // Calculate derived metrics
    const criticalJobCards = trainJobCards.filter(jc => jc.priority === 'Critical' && jc.status === 'Open').length;
    const overallHealthScore = trainIoTData ? 
      (trainIoTData.engineHealth + trainIoTData.brakeSystemHealth + trainIoTData.doorSystemHealth + trainIoTData.airConditioningHealth) / 4 : 75;
    const activeBrandingContract = trainBranding?.status === 'Active';

    const evaluations: RuleEvaluation[] = [];
    let overallScore = 1.0;
    const blockingRules: string[] = [];
    const warningRules: string[] = [];

    for (const rule of this.rules.filter(r => r.isActive)) {
      const evaluation = this.evaluateRule(rule, {
        ...train,
        criticalJobCards,
        overallHealthScore,
        activeBrandingContract,
        mileageDeviation: Math.abs(train.mileage - 50000) // Simplified calculation
      });

      evaluations.push(evaluation);

      if (!evaluation.passed && rule.actions.some(a => a.type === 'Block')) {
        blockingRules.push(rule.ruleId);
      } else if (!evaluation.passed && rule.actions.some(a => a.type === 'Warning')) {
        warningRules.push(rule.ruleId);
      } else if (evaluation.passed && rule.actions.some(a => a.type === 'Score')) {
        const scoreAction = rule.actions.find(a => a.type === 'Score');
        if (scoreAction) {
          overallScore *= scoreAction.value as number;
        }
      }
    }

    const eligibilityStatus = blockingRules.length > 0 ? 'Blocked' : 
                            warningRules.length > 0 ? 'Conditional' : 'Eligible';

    return {
      trainId: train.id,
      overallScore,
      eligibilityStatus,
      ruleEvaluations: evaluations,
      blockingRules,
      warningRules,
      recommendations: this.generateRecommendations(evaluations, train)
    };
  }

  private evaluateRule(rule: BusinessRule, trainData: any): RuleEvaluation {
    let passed = true;
    let score = 1.0;

    for (const condition of rule.conditions) {
      const fieldValue = trainData[condition.field];
      const conditionPassed = this.evaluateCondition(fieldValue, condition.operator, condition.value);
      
      if (!conditionPassed) {
        passed = false;
        break;
      }
    }

    if (passed) {
      const scoreAction = rule.actions.find(a => a.type === 'Score');
      if (scoreAction) {
        score = scoreAction.value as number;
      }
    }

    return {
      ruleId: rule.ruleId,
      trainId: trainData.id,
      passed,
      score,
      message: passed ? 'Rule passed' : rule.actions[0]?.message || 'Rule failed',
      category: rule.category,
      timestamp: new Date().toISOString()
    };
  }

  private evaluateCondition(fieldValue: any, operator: string, expectedValue: any): boolean {
    switch (operator) {
      case 'equals':
        return fieldValue === expectedValue;
      case 'not_equals':
        return fieldValue !== expectedValue;
      case 'greater_than':
        return fieldValue > expectedValue;
      case 'less_than':
        return fieldValue < expectedValue;
      case 'contains':
        return fieldValue.toString().includes(expectedValue);
      case 'between':
        return fieldValue >= expectedValue[0] && fieldValue <= expectedValue[1];
      default:
        return false;
    }
  }

  private generateRecommendations(evaluations: RuleEvaluation[], train: Train): string[] {
    const recommendations: string[] = [];
    
    const failedEvaluations = evaluations.filter(e => !e.passed);
    
    if (failedEvaluations.some(e => e.ruleId === 'SAFETY-001')) {
      recommendations.push('Renew fitness certificate before induction');
    }
    
    if (failedEvaluations.some(e => e.ruleId === 'SAFETY-002')) {
      recommendations.push('Complete critical maintenance tasks');
    }
    
    if (train.cleaningStatus === 'Pending') {
      recommendations.push('Schedule cleaning before service deployment');
    }
    
    if (train.mileage > 70000) {
      recommendations.push('Consider preventive maintenance due to high mileage');
    }

    return recommendations;
  }

  async getRules(): Promise<BusinessRule[]> {
    return this.rules;
  }

  async updateRule(ruleId: string, updates: Partial<BusinessRule>): Promise<void> {
    const ruleIndex = this.rules.findIndex(r => r.ruleId === ruleId);
    if (ruleIndex !== -1) {
      this.rules[ruleIndex] = { ...this.rules[ruleIndex], ...updates };
    }
  }
}

export const businessRulesEngine = new BusinessRulesEngine();