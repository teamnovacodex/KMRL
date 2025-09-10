import { OptimizationResult, OptimizationObjective, OptimizationConstraint, OptimizationReasoning, AlternativeScenario } from '../types/optimization';
import { TrainEligibility } from '../types/businessRules';
import { Train } from '../types/train';

class OptimizationEngine {
  private objectives: OptimizationObjective[] = [
    {
      name: 'Service Readiness',
      weight: 0.3,
      type: 'maximize',
      description: 'Maximize number of service-ready trains'
    },
    {
      name: 'Branding Revenue',
      weight: 0.25,
      type: 'maximize',
      description: 'Maximize advertising revenue from branding contracts'
    },
    {
      name: 'Mileage Balance',
      weight: 0.2,
      type: 'maximize',
      description: 'Maintain balanced mileage across fleet'
    },
    {
      name: 'Operational Efficiency',
      weight: 0.15,
      type: 'maximize',
      description: 'Minimize depot shunting and maximize cleaning efficiency'
    },
    {
      name: 'Maintenance Cost',
      weight: 0.1,
      type: 'minimize',
      description: 'Minimize unexpected maintenance costs'
    }
  ];

  private constraints: OptimizationConstraint[] = [
    {
      name: 'Minimum Service Trains',
      type: 'hard',
      description: 'At least 60% of eligible trains must be in service',
      penalty: 0
    },
    {
      name: 'Depot Capacity',
      type: 'hard',
      description: 'Cannot exceed depot bay capacity',
      penalty: 0
    },
    {
      name: 'Cleaning Capacity',
      type: 'soft',
      description: 'Prefer not to exceed daily cleaning capacity',
      penalty: 0.2
    },
    {
      name: 'Technician Availability',
      type: 'soft',
      description: 'Consider available maintenance technicians',
      penalty: 0.15
    }
  ];

  async optimize(
    trains: Train[],
    eligibilityResults: TrainEligibility[],
    constraints?: { maxServiceTrains?: number; maxMaintenanceTrains?: number }
  ): Promise<OptimizationResult> {
    // Filter eligible trains
    const eligibleTrains = eligibilityResults.filter(e => e.eligibilityStatus === 'Eligible');
    const conditionalTrains = eligibilityResults.filter(e => e.eligibilityStatus === 'Conditional');
    
    // Multi-objective optimization using weighted scoring
    const trainScores = this.calculateTrainScores(trains, eligibilityResults);
    
    // Sort trains by score
    const sortedTrains = trainScores.sort((a, b) => b.score - a.score);
    
    // Apply constraints and select trains
    const maxServiceTrains = constraints?.maxServiceTrains || Math.floor(trains.length * 0.6);
    const maxMaintenanceTrains = constraints?.maxMaintenanceTrains || Math.floor(trains.length * 0.3);
    
    const selectedTrains: string[] = [];
    const standbyTrains: string[] = [];
    const maintenanceTrains: string[] = [];
    
    // First pass: Select high-scoring eligible trains for service
    for (const trainScore of sortedTrains) {
      const eligibility = eligibilityResults.find(e => e.trainId === trainScore.trainId);
      
      if (selectedTrains.length < maxServiceTrains && eligibility?.eligibilityStatus === 'Eligible') {
        selectedTrains.push(trainScore.trainId);
      } else if (maintenanceTrains.length < maxMaintenanceTrains && 
                (eligibility?.eligibilityStatus === 'Blocked' || trainScore.needsMaintenance)) {
        maintenanceTrains.push(trainScore.trainId);
      } else {
        standbyTrains.push(trainScore.trainId);
      }
    }
    
    // Calculate objective scores
    const objectiveScores = this.calculateObjectiveScores(
      selectedTrains, standbyTrains, maintenanceTrains, trains, eligibilityResults
    );
    
    // Calculate total weighted score
    const totalScore = this.objectives.reduce((sum, obj) => {
      return sum + (obj.weight * (objectiveScores[obj.name] || 0));
    }, 0);
    
    // Generate reasoning
    const reasoning = this.generateReasoning(selectedTrains, standbyTrains, maintenanceTrains, trains, eligibilityResults);
    
    // Generate alternative scenarios
    const alternativeScenarios = this.generateAlternativeScenarios(trains, eligibilityResults);
    
    return {
      optimizationId: `OPT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      objectives: this.objectives,
      constraints: this.constraints,
      selectedTrains,
      standbyTrains,
      maintenanceTrains,
      totalScore,
      objectiveScores,
      constraintViolations: [],
      reasoning,
      alternativeScenarios
    };
  }

  private calculateTrainScores(trains: Train[], eligibilityResults: TrainEligibility[]): Array<{trainId: string, score: number, needsMaintenance: boolean}> {
    return trains.map(train => {
      const eligibility = eligibilityResults.find(e => e.trainId === train.id);
      let score = eligibility?.overallScore || 0;
      
      // Service readiness factors
      if (train.fitnessStatus === 'Valid') score += 0.3;
      if (train.jobCardStatus === 'Closed') score += 0.2;
      if (train.cleaningStatus === 'Done') score += 0.15;
      
      // Branding revenue factors
      if (train.brandingRequired) score += 0.25;
      
      // Mileage balance factors
      const avgMileage = 50000; // Simplified average
      const mileageDeviation = Math.abs(train.mileage - avgMileage) / avgMileage;
      score += (1 - mileageDeviation) * 0.2;
      
      // Operational efficiency factors
      score += (10 - train.depotBay) * 0.01; // Prefer lower bay numbers for easier access
      
      // Maintenance cost factors (inverse of mileage)
      score += (1 - train.mileage / 100000) * 0.1;
      
      const needsMaintenance = train.fitnessStatus === 'Expired' || 
                              train.jobCardStatus === 'Open' || 
                              train.mileage > 70000;
      
      return { trainId: train.id, score, needsMaintenance };
    });
  }

  private calculateObjectiveScores(
    selectedTrains: string[],
    standbyTrains: string[],
    maintenanceTrains: string[],
    trains: Train[],
    eligibilityResults: TrainEligibility[]
  ): { [key: string]: number } {
    const scores: { [key: string]: number } = {};
    
    // Service Readiness
    const eligibleCount = selectedTrains.length;
    const totalTrains = trains.length;
    scores['Service Readiness'] = eligibleCount / totalTrains;
    
    // Branding Revenue
    const brandingTrains = selectedTrains.filter(id => {
      const train = trains.find(t => t.id === id);
      return train?.brandingRequired;
    }).length;
    scores['Branding Revenue'] = brandingTrains / selectedTrains.length;
    
    // Mileage Balance
    const selectedTrainObjects = trains.filter(t => selectedTrains.includes(t.id));
    const avgMileage = selectedTrainObjects.reduce((sum, t) => sum + t.mileage, 0) / selectedTrainObjects.length;
    const mileageVariance = selectedTrainObjects.reduce((sum, t) => sum + Math.pow(t.mileage - avgMileage, 2), 0) / selectedTrainObjects.length;
    scores['Mileage Balance'] = 1 / (1 + mileageVariance / 1000000); // Normalized
    
    // Operational Efficiency
    const cleanTrains = selectedTrains.filter(id => {
      const train = trains.find(t => t.id === id);
      return train?.cleaningStatus === 'Done';
    }).length;
    scores['Operational Efficiency'] = cleanTrains / selectedTrains.length;
    
    // Maintenance Cost (inverse)
    const highMileageTrains = selectedTrains.filter(id => {
      const train = trains.find(t => t.id === id);
      return train && train.mileage > 70000;
    }).length;
    scores['Maintenance Cost'] = 1 - (highMileageTrains / selectedTrains.length);
    
    return scores;
  }

  private generateReasoning(
    selectedTrains: string[],
    standbyTrains: string[],
    maintenanceTrains: string[],
    trains: Train[],
    eligibilityResults: TrainEligibility[]
  ): OptimizationReasoning[] {
    const reasoning: OptimizationReasoning[] = [];
    
    [...selectedTrains, ...standbyTrains, ...maintenanceTrains].forEach(trainId => {
      const train = trains.find(t => t.id === trainId);
      const eligibility = eligibilityResults.find(e => e.trainId === trainId);
      
      if (!train || !eligibility) return;
      
      let decision: 'Selected' | 'Standby' | 'Maintenance';
      if (selectedTrains.includes(trainId)) decision = 'Selected';
      else if (standbyTrains.includes(trainId)) decision = 'Standby';
      else decision = 'Maintenance';
      
      const primaryReasons: string[] = [];
      const secondaryFactors: string[] = [];
      const tradeoffs: string[] = [];
      
      if (decision === 'Selected') {
        if (train.fitnessStatus === 'Valid') primaryReasons.push('Valid fitness certificate');
        if (train.jobCardStatus === 'Closed') primaryReasons.push('No open job cards');
        if (train.brandingRequired) primaryReasons.push('Active branding contract');
        if (train.cleaningStatus === 'Done') secondaryFactors.push('Recently cleaned');
        if (train.mileage < 50000) secondaryFactors.push('Low mileage');
      } else if (decision === 'Maintenance') {
        if (train.fitnessStatus === 'Expired') primaryReasons.push('Expired fitness certificate');
        if (train.jobCardStatus === 'Open') primaryReasons.push('Open job cards require attention');
        if (train.mileage > 70000) primaryReasons.push('High mileage requires maintenance');
      } else {
        if (train.cleaningStatus === 'Pending') primaryReasons.push('Awaiting cleaning');
        if (train.brandingRequired) secondaryFactors.push('Branding work needed');
      }
      
      reasoning.push({
        trainId,
        decision,
        primaryReasons,
        secondaryFactors,
        score: eligibility.overallScore,
        tradeoffs
      });
    });
    
    return reasoning;
  }

  private generateAlternativeScenarios(trains: Train[], eligibilityResults: TrainEligibility[]): AlternativeScenario[] {
    return [
      {
        scenarioId: 'ALT-001',
        name: 'Maximum Service',
        description: 'Prioritize maximum number of trains in service',
        selectedTrains: eligibilityResults
          .filter(e => e.eligibilityStatus !== 'Blocked')
          .sort((a, b) => b.overallScore - a.overallScore)
          .slice(0, Math.floor(trains.length * 0.8))
          .map(e => e.trainId),
        totalScore: 0.85,
        keyDifferences: ['More trains in service', 'Higher operational risk', 'Reduced maintenance buffer']
      },
      {
        scenarioId: 'ALT-002',
        name: 'Conservative Approach',
        description: 'Prioritize safety and maintenance',
        selectedTrains: eligibilityResults
          .filter(e => e.eligibilityStatus === 'Eligible' && e.overallScore > 0.8)
          .slice(0, Math.floor(trains.length * 0.5))
          .map(e => e.trainId),
        totalScore: 0.92,
        keyDifferences: ['Fewer trains in service', 'Higher safety margin', 'More maintenance capacity']
      }
    ];
  }

  async getObjectives(): Promise<OptimizationObjective[]> {
    return this.objectives;
  }

  async updateObjectiveWeights(weights: { [key: string]: number }): Promise<void> {
    this.objectives.forEach(obj => {
      if (weights[obj.name] !== undefined) {
        obj.weight = weights[obj.name];
      }
    });
  }
}

export const optimizationEngine = new OptimizationEngine();