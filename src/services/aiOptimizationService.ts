import { Train, AIOptimizationResult } from '../types/train';
import { mockTrains, generateAIOptimization } from '../data/mockData';

class AIOptimizationService {
  private lastOptimization: AIOptimizationResult | null = null;
  private optimizationHistory: AIOptimizationResult[] = [];

  // Main AI Optimization Algorithm
  async runOptimization(constraints?: {
    maxServiceTrains?: number;
    minStandbyTrains?: number;
    targetDate?: string;
  }): Promise<AIOptimizationResult> {
    
    console.log('🤖 AI Optimization Engine Starting...');
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const now = new Date();
    const targetDate = constraints?.targetDate || new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Step 1: Evaluate each train's fitness for service
    const trainEvaluations = mockTrains.map(train => this.evaluateTrainFitness(train));
    
    // Step 2: Apply business rules and constraints
    const eligibleTrains = trainEvaluations.filter(eval => eval.canGoToService);
    const maintenanceTrains = trainEvaluations.filter(eval => eval.requiresMaintenance);
    const cleaningTrains = trainEvaluations.filter(eval => eval.requiresCleaning);
    
    // Step 3: Optimize for multiple objectives
    const optimizedSelection = this.multiObjectiveOptimization(eligibleTrains, constraints);
    
    // Step 4: Generate detailed reasoning
    const reasoning = trainEvaluations.map(eval => ({
      trainId: eval.trainId,
      decision: eval.recommendation,
      score: eval.overallScore,
      factors: eval.reasoningFactors,
      scheduledTime: this.calculateOptimalScheduleTime(eval)
    }));
    
    // Step 5: Calculate expected performance
    const expectedPerformance = this.calculateExpectedPerformance(optimizedSelection);
    
    const result: AIOptimizationResult = {
      optimizationId: `OPT-${Date.now()}`,
      timestamp: now.toISOString(),
      targetDate,
      totalScore: optimizedSelection.totalScore,
      selectedForService: optimizedSelection.serviceTrains,
      standbyTrains: optimizedSelection.standbyTrains,
      maintenanceTrains: maintenanceTrains.map(t => t.trainId),
      cleaningTrains: cleaningTrains.map(t => t.trainId),
      reasoning,
      constraints: {
        maxServiceTrains: constraints?.maxServiceTrains || 18,
        minStandbyTrains: constraints?.minStandbyTrains || 3,
        availableManpower: 25,
        depotCapacity: 23
      },
      expectedPerformance
    };
    
    this.lastOptimization = result;
    this.optimizationHistory.push(result);
    
    console.log('✅ AI Optimization Complete:', {
      serviceTrains: result.selectedForService.length,
      standbyTrains: result.standbyTrains.length,
      maintenanceTrains: result.maintenanceTrains.length,
      totalScore: result.totalScore
    });
    
    return result;
  }

  // Evaluate individual train fitness
  private evaluateTrainFitness(train: Train) {
    let overallScore = 100;
    let reasoningFactors: string[] = [];
    let canGoToService = true;
    let requiresMaintenance = false;
    let requiresCleaning = false;
    let recommendation: 'Service' | 'Standby' | 'Maintenance' | 'Deep Clean' = 'Service';

    // 1. Fitness Certificate Check (Critical)
    if (train.rollingStockCert.status === 'Expired' || 
        train.signallingCert.status === 'Expired' || 
        train.telecomCert.status === 'Expired') {
      overallScore = 0;
      canGoToService = false;
      requiresMaintenance = true;
      recommendation = 'Maintenance';
      reasoningFactors.push('❌ Expired fitness certificates - SAFETY CRITICAL');
    } else {
      reasoningFactors.push('✅ All fitness certificates valid');
    }

    // 2. Job Card Status (Critical)
    if (train.criticalJobCards > 0) {
      overallScore = Math.min(overallScore, 20);
      canGoToService = false;
      requiresMaintenance = true;
      recommendation = 'Maintenance';
      reasoningFactors.push('❌ Critical job cards open - IMMEDIATE ATTENTION');
    } else if (train.jobCardStatus === 'Open') {
      overallScore -= 30;
      reasoningFactors.push('⚠️ Non-critical job cards open');
    } else {
      reasoningFactors.push('✅ No open job cards');
    }

    // 3. Bay Position (Critical for Service)
    if (train.currentBay.type !== 'SBL') {
      canGoToService = false;
      requiresMaintenance = true;
      recommendation = 'Maintenance';
      reasoningFactors.push(`❌ In ${train.currentBay.type} bay - cannot go to revenue service`);
    } else {
      reasoningFactors.push(`✅ In SBL bay ${train.currentBay.bayNumber} - service ready`);
    }

    // 4. Health Score Assessment
    if (train.healthScore < 60) {
      overallScore -= 40;
      canGoToService = false;
      requiresMaintenance = true;
      recommendation = 'Maintenance';
      reasoningFactors.push('❌ Low health score - requires maintenance');
    } else if (train.healthScore < 75) {
      overallScore -= 20;
      recommendation = 'Standby';
      reasoningFactors.push('⚠️ Moderate health score - standby recommended');
    } else {
      reasoningFactors.push('✅ Good health score');
    }

    // 5. Cleaning Status
    if (train.cleaningStatus === 'Deep Clean Required') {
      overallScore -= 25;
      requiresCleaning = true;
      recommendation = 'Deep Clean';
      reasoningFactors.push('🧽 Deep cleaning required before service');
    } else if (train.cleaningStatus === 'Pending') {
      overallScore -= 10;
      reasoningFactors.push('⚠️ Basic cleaning pending');
    } else {
      reasoningFactors.push('✅ Cleaning completed');
    }

    // 6. Branding Priority (Revenue Optimization)
    if (train.brandingRequired && train.exteriorWrapContract?.status === 'Active') {
      overallScore += 15;
      reasoningFactors.push('💰 Active branding contract - high revenue priority');
    }

    // 7. Mileage Balancing
    if (train.totalMileage > 180000) {
      overallScore -= 15;
      reasoningFactors.push('⚠️ High mileage - consider maintenance rotation');
    } else if (train.totalMileage < 80000) {
      overallScore += 10;
      reasoningFactors.push('✅ Low mileage - optimal for service');
    }

    // 8. Third Rail Consumption Efficiency
    if (train.thirdRailConsumption > 5.0) {
      overallScore -= 10;
      reasoningFactors.push('⚡ High power consumption - efficiency concern');
    } else {
      reasoningFactors.push('✅ Efficient power consumption');
    }

    return {
      trainId: train.id,
      trainName: train.trainName,
      overallScore: Math.max(0, overallScore),
      canGoToService,
      requiresMaintenance,
      requiresCleaning,
      recommendation,
      reasoningFactors
    };
  }

  // Multi-objective optimization algorithm
  private multiObjectiveOptimization(eligibleTrains: any[], constraints?: any) {
    const maxService = constraints?.maxServiceTrains || 18;
    const minStandby = constraints?.minStandbyTrains || 3;
    
    // Sort by overall score (descending)
    const sortedTrains = [...eligibleTrains].sort((a, b) => b.overallScore - a.overallScore);
    
    const serviceTrains: string[] = [];
    const standbyTrains: string[] = [];
    
    // Select top performers for service
    for (let i = 0; i < Math.min(maxService, sortedTrains.length); i++) {
      serviceTrains.push(sortedTrains[i].trainId);
    }
    
    // Remaining eligible trains go to standby
    for (let i = maxService; i < sortedTrains.length; i++) {
      standbyTrains.push(sortedTrains[i].trainId);
    }
    
    // Ensure minimum standby requirement
    while (standbyTrains.length < minStandby && serviceTrains.length > 0) {
      const moved = serviceTrains.pop();
      if (moved) standbyTrains.unshift(moved);
    }
    
    const totalScore = this.calculateOptimizationScore(serviceTrains, standbyTrains);
    
    return {
      serviceTrains,
      standbyTrains,
      totalScore
    };
  }

  // Calculate optimization score
  private calculateOptimizationScore(serviceTrains: string[], standbyTrains: string[]): number {
    let score = 0;
    const totalTrains = serviceTrains.length + standbyTrains.length;
    
    // Service capacity score (40% weight)
    score += (serviceTrains.length / 18) * 0.4;
    
    // Standby buffer score (20% weight)
    score += Math.min(standbyTrains.length / 5, 1) * 0.2;
    
    // Health score average (25% weight)
    const avgHealth = mockTrains
      .filter(t => serviceTrains.includes(t.id))
      .reduce((sum, t) => sum + t.healthScore, 0) / serviceTrains.length;
    score += (avgHealth / 100) * 0.25;
    
    // Revenue potential (15% weight)
    const brandingTrains = mockTrains
      .filter(t => serviceTrains.includes(t.id) && t.brandingRequired)
      .length;
    score += (brandingTrains / serviceTrains.length) * 0.15;
    
    return Math.min(1, score);
  }

  // Calculate optimal schedule time
  private calculateOptimalScheduleTime(evaluation: any): string {
    if (evaluation.recommendation === 'Service') {
      // Service trains start early morning
      const hour = 5 + Math.floor(Math.random() * 2); // 05:00 - 07:00
      return `${hour.toString().padStart(2, '0')}:00`;
    } else if (evaluation.recommendation === 'Maintenance') {
      // Maintenance during night hours
      const hour = 22 + Math.floor(Math.random() * 6); // 22:00 - 04:00
      return `${(hour % 24).toString().padStart(2, '0')}:00`;
    } else {
      // Standby and cleaning flexible timing
      const hour = 6 + Math.floor(Math.random() * 4); // 06:00 - 10:00
      return `${hour.toString().padStart(2, '0')}:00`;
    }
  }

  // Calculate expected performance metrics
  private calculateExpectedPerformance(optimization: any) {
    const serviceCount = optimization.serviceTrains.length;
    const standbyCount = optimization.standbyTrains.length;
    
    return {
      onTimePerformance: Math.min(98, 85 + (serviceCount * 0.7) + (standbyCount * 0.3)),
      passengerCapacity: serviceCount * 8000, // 8000 passengers per train per day
      estimatedRevenue: serviceCount * 150000, // ₹150,000 per train per day
      operationalCost: (serviceCount * 50000) + (standbyCount * 20000),
      riskLevel: optimization.totalScore > 0.9 ? 'Low' : 
                 optimization.totalScore > 0.7 ? 'Medium' : 'High'
    };
  }

  // Get last optimization result
  getLastOptimization(): AIOptimizationResult | null {
    return this.lastOptimization;
  }

  // Get optimization history
  getOptimizationHistory(): AIOptimizationResult[] {
    return this.optimizationHistory;
  }

  // Real-time monitoring and auto-optimization
  startRealTimeMonitoring() {
    setInterval(() => {
      // Check for critical changes that require re-optimization
      const criticalIssues = mockTrains.filter(t => 
        t.criticalJobCards > 0 || 
        t.rollingStockCert.status === 'Expired' ||
        t.signallingCert.status === 'Expired' ||
        t.telecomCert.status === 'Expired'
      );
      
      if (criticalIssues.length > 0) {
        console.log('🚨 Critical issues detected, triggering auto-optimization...');
        this.runOptimization();
      }
    }, 300000); // Check every 5 minutes
  }
}

export const aiOptimizationService = new AIOptimizationService();