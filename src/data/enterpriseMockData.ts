import { Train, JobCard, BrandingContract, BreakdownRecord, HistoricalData, DepotLayout } from '../types/enterprise';

// Generate 25 comprehensive train records
export const enterpriseTrains: Train[] = [
  {
    id: '1',
    trainNumber: 'KMRL-001',
    model: 'Alstom Metropolis',
    manufacturingYear: 2017,
    lastMajorOverhaul: '2023-06-15',
    currentLocation: 'Depot Bay 1',
    status: 'Active',
    
    fitnessStatus: 'Valid',
    fitnessExpiryDate: '2025-03-15',
    lastFitnessCheck: '2024-09-15',
    fitnessScore: 95,
    
    jobCardStatus: 'Closed',
    openJobCards: [],
    criticalJobCards: 0,
    lastMaintenance: '2024-12-10',
    nextScheduledMaintenance: '2025-01-10',
    maintenanceScore: 92,
    
    brandingRequired: true,
    brandingContract: {
      id: 'BC-001',
      trainId: '1',
      advertiser: 'Coca-Cola India',
      campaignName: 'Holiday Special 2024',
      contractValue: 2500000,
      startDate: '2024-12-01',
      endDate: '2025-02-28',
      requiredExposureHours: 1200,
      currentExposureHours: 890,
      dailyTarget: 12,
      penaltyClause: 50000,
      status: 'Active'
    },
    brandingScore: 88,
    
    totalMileage: 145780,
    dailyMileage: 245,
    weeklyMileage: 1715,
    monthlyMileage: 7350,
    mileageDeviation: -5.2,
    utilizationRate: 94,
    
    cleaningStatus: 'Done',
    lastCleaning: '2024-12-21 22:30',
    cleaningType: 'Deep',
    depotBay: 1,
    stablingPosition: { x: 50, y: 100 },
    shuntingDistance: 0,
    
    healthScore: 94,
    engineHealth: 96,
    brakeHealth: 92,
    doorSystemHealth: 95,
    acSystemHealth: 91,
    batteryLevel: 98,
    vibrationLevel: 2.1,
    temperature: 28.5,
    
    recommendation: 'Service',
    confidenceScore: 96,
    riskFactors: ['High branding exposure required'],
    predictedIssues: [],
    
    punctualityRate: 98.5,
    breakdownHistory: [],
    performanceMetrics: {
      onTimePerformance: 98.5,
      meanTimeBetweenFailures: 2400,
      meanTimeToRepair: 45,
      availability: 97.8,
      reliability: 98.2,
      fuelEfficiency: 4.2,
      passengerSatisfaction: 4.6
    }
  },
  {
    id: '2',
    trainNumber: 'KMRL-002',
    model: 'Alstom Metropolis',
    manufacturingYear: 2017,
    lastMajorOverhaul: '2023-08-20',
    currentLocation: 'Depot Bay 2',
    status: 'Active',
    
    fitnessStatus: 'Valid',
    fitnessExpiryDate: '2025-05-20',
    lastFitnessCheck: '2024-11-20',
    fitnessScore: 89,
    
    jobCardStatus: 'Open',
    openJobCards: [
      {
        id: 'JC-002-001',
        trainId: '2',
        workOrderNumber: 'WO-2024-1205',
        type: 'Preventive',
        priority: 'Medium',
        status: 'In Progress',
        description: 'Brake pad replacement and system check',
        estimatedHours: 6,
        actualHours: 4,
        assignedTechnician: 'Rajesh Kumar',
        createdDate: '2024-12-20',
        dueDate: '2024-12-22',
        parts: [
          {
            partNumber: 'BP-ALM-001',
            description: 'Brake Pad Set',
            quantity: 8,
            unitCost: 2500,
            availability: 'In Stock'
          }
        ],
        cost: 25000
      }
    ],
    criticalJobCards: 0,
    lastMaintenance: '2024-12-15',
    nextScheduledMaintenance: '2025-01-15',
    maintenanceScore: 78,
    
    brandingRequired: false,
    brandingScore: 100,
    
    totalMileage: 152100,
    dailyMileage: 238,
    weeklyMileage: 1666,
    monthlyMileage: 7140,
    mileageDeviation: 2.1,
    utilizationRate: 91,
    
    cleaningStatus: 'Pending',
    lastCleaning: '2024-12-19 23:15',
    cleaningType: 'Basic',
    depotBay: 2,
    stablingPosition: { x: 150, y: 100 },
    shuntingDistance: 100,
    
    healthScore: 85,
    engineHealth: 88,
    brakeHealth: 75,
    doorSystemHealth: 92,
    acSystemHealth: 87,
    batteryLevel: 94,
    vibrationLevel: 2.8,
    temperature: 29.2,
    
    recommendation: 'Standby',
    confidenceScore: 82,
    riskFactors: ['Open maintenance job', 'Brake system needs attention'],
    predictedIssues: ['Potential brake performance degradation'],
    
    punctualityRate: 96.2,
    breakdownHistory: [
      {
        id: 'BR-002-001',
        trainId: '2',
        date: '2024-11-15',
        type: 'Mechanical',
        severity: 'Minor',
        downtime: 25,
        cause: 'Door sensor malfunction',
        resolution: 'Sensor recalibration',
        cost: 5000
      }
    ],
    performanceMetrics: {
      onTimePerformance: 96.2,
      meanTimeBetweenFailures: 1800,
      meanTimeToRepair: 52,
      availability: 95.1,
      reliability: 96.8,
      fuelEfficiency: 4.1,
      passengerSatisfaction: 4.4
    }
  },
  // Continue with remaining 23 trains...
  {
    id: '3',
    trainNumber: 'KMRL-003',
    model: 'Alstom Metropolis',
    manufacturingYear: 2018,
    lastMajorOverhaul: '2023-04-10',
    currentLocation: 'Maintenance Bay 1',
    status: 'Maintenance',
    
    fitnessStatus: 'Expired',
    fitnessExpiryDate: '2024-12-01',
    lastFitnessCheck: '2024-06-01',
    fitnessScore: 45,
    
    jobCardStatus: 'Open',
    openJobCards: [
      {
        id: 'JC-003-001',
        trainId: '3',
        workOrderNumber: 'WO-2024-1201',
        type: 'Emergency',
        priority: 'Critical',
        status: 'In Progress',
        description: 'Fitness certificate renewal and comprehensive inspection',
        estimatedHours: 24,
        actualHours: 18,
        assignedTechnician: 'Suresh Nair',
        createdDate: '2024-12-18',
        dueDate: '2024-12-23',
        parts: [
          {
            partNumber: 'FC-KIT-001',
            description: 'Fitness Certification Kit',
            quantity: 1,
            unitCost: 15000,
            availability: 'In Stock'
          }
        ],
        cost: 75000
      }
    ],
    criticalJobCards: 1,
    lastMaintenance: '2024-11-20',
    nextScheduledMaintenance: '2024-12-25',
    maintenanceScore: 35,
    
    brandingRequired: false,
    brandingScore: 100,
    
    totalMileage: 167890,
    dailyMileage: 0,
    weeklyMileage: 0,
    monthlyMileage: 2100,
    mileageDeviation: 12.8,
    utilizationRate: 15,
    
    cleaningStatus: 'Deep Clean Required',
    lastCleaning: '2024-12-17 20:00',
    cleaningType: 'Basic',
    depotBay: 15,
    stablingPosition: { x: 50, y: 300 },
    shuntingDistance: 200,
    
    healthScore: 62,
    engineHealth: 58,
    brakeHealth: 72,
    doorSystemHealth: 65,
    acSystemHealth: 55,
    batteryLevel: 88,
    vibrationLevel: 3.5,
    temperature: 31.8,
    
    recommendation: 'Maintenance',
    confidenceScore: 98,
    riskFactors: ['Expired fitness certificate', 'Critical maintenance pending', 'High mileage'],
    predictedIssues: ['Engine performance degradation', 'AC system failure risk'],
    
    punctualityRate: 78.5,
    breakdownHistory: [
      {
        id: 'BR-003-001',
        trainId: '3',
        date: '2024-12-15',
        type: 'Electrical',
        severity: 'Major',
        downtime: 180,
        cause: 'AC compressor failure',
        resolution: 'Compressor replacement scheduled',
        cost: 45000
      }
    ],
    performanceMetrics: {
      onTimePerformance: 78.5,
      meanTimeBetweenFailures: 720,
      meanTimeToRepair: 125,
      availability: 82.3,
      reliability: 85.1,
      fuelEfficiency: 3.8,
      passengerSatisfaction: 3.9
    }
  }
  // ... Continue with remaining 22 trains with similar detailed data
];

// Generate remaining 22 trains programmatically
for (let i = 4; i <= 25; i++) {
  const train: Train = {
    id: i.toString(),
    trainNumber: `KMRL-${i.toString().padStart(3, '0')}`,
    model: i <= 15 ? 'Alstom Metropolis' : 'BEML Standard',
    manufacturingYear: i <= 10 ? 2017 : i <= 20 ? 2018 : 2019,
    lastMajorOverhaul: `2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
    currentLocation: `Depot Bay ${i}`,
    status: Math.random() > 0.8 ? 'Maintenance' : 'Active',
    
    fitnessStatus: Math.random() > 0.9 ? 'Expired' : Math.random() > 0.7 ? 'Expiring Soon' : 'Valid',
    fitnessExpiryDate: `2025-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
    lastFitnessCheck: `2024-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
    fitnessScore: Math.floor(Math.random() * 40) + 60,
    
    jobCardStatus: Math.random() > 0.7 ? 'Open' : 'Closed',
    openJobCards: [],
    criticalJobCards: Math.random() > 0.9 ? 1 : 0,
    lastMaintenance: `2024-12-${Math.floor(Math.random() * 20) + 1}`,
    nextScheduledMaintenance: `2025-01-${Math.floor(Math.random() * 30) + 1}`,
    maintenanceScore: Math.floor(Math.random() * 40) + 60,
    
    brandingRequired: Math.random() > 0.6,
    brandingScore: Math.floor(Math.random() * 30) + 70,
    
    totalMileage: Math.floor(Math.random() * 100000) + 100000,
    dailyMileage: Math.floor(Math.random() * 100) + 200,
    weeklyMileage: Math.floor(Math.random() * 700) + 1400,
    monthlyMileage: Math.floor(Math.random() * 3000) + 6000,
    mileageDeviation: (Math.random() - 0.5) * 20,
    utilizationRate: Math.floor(Math.random() * 30) + 70,
    
    cleaningStatus: ['Pending', 'Done', 'In Progress', 'Deep Clean Required'][Math.floor(Math.random() * 4)] as any,
    lastCleaning: `2024-12-${Math.floor(Math.random() * 21) + 1} ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}`,
    cleaningType: ['Basic', 'Deep', 'Exterior', 'Interior'][Math.floor(Math.random() * 4)] as any,
    depotBay: i,
    stablingPosition: { x: (i % 5) * 100 + 50, y: Math.floor((i - 1) / 5) * 100 + 100 },
    shuntingDistance: Math.floor(Math.random() * 300),
    
    healthScore: Math.floor(Math.random() * 40) + 60,
    engineHealth: Math.floor(Math.random() * 40) + 60,
    brakeHealth: Math.floor(Math.random() * 40) + 60,
    doorSystemHealth: Math.floor(Math.random() * 40) + 60,
    acSystemHealth: Math.floor(Math.random() * 40) + 60,
    batteryLevel: Math.floor(Math.random() * 30) + 70,
    vibrationLevel: Math.random() * 3 + 1,
    temperature: Math.random() * 10 + 25,
    
    recommendation: ['Service', 'Standby', 'Maintenance', 'Deep Clean'][Math.floor(Math.random() * 4)] as any,
    confidenceScore: Math.floor(Math.random() * 30) + 70,
    riskFactors: [],
    predictedIssues: [],
    
    punctualityRate: Math.floor(Math.random() * 20) + 80,
    breakdownHistory: [],
    performanceMetrics: {
      onTimePerformance: Math.floor(Math.random() * 20) + 80,
      meanTimeBetweenFailures: Math.floor(Math.random() * 2000) + 1000,
      meanTimeToRepair: Math.floor(Math.random() * 100) + 30,
      availability: Math.floor(Math.random() * 20) + 80,
      reliability: Math.floor(Math.random() * 20) + 80,
      fuelEfficiency: Math.random() * 2 + 3,
      passengerSatisfaction: Math.random() * 1.5 + 3.5
    }
  };
  
  enterpriseTrains.push(train);
}

export const historicalData: HistoricalData[] = Array.from({ length: 90 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  
  return {
    date: date.toISOString().split('T')[0],
    selectedTrains: Math.floor(Math.random() * 5) + 18,
    standbyTrains: Math.floor(Math.random() * 3) + 3,
    maintenanceTrains: Math.floor(Math.random() * 4) + 2,
    onTimePerformance: Math.floor(Math.random() * 15) + 85,
    breakdowns: Math.floor(Math.random() * 3),
    passengerCount: Math.floor(Math.random() * 50000) + 150000,
    revenue: Math.floor(Math.random() * 500000) + 2000000,
    operationalCost: Math.floor(Math.random() * 200000) + 800000,
    efficiency: Math.floor(Math.random() * 20) + 80
  };
});

export const depotLayout: DepotLayout = {
  totalBays: 25,
  serviceBays: 15,
  maintenanceBays: 6,
  cleaningBays: 3,
  storageBays: 1,
  layout: Array.from({ length: 25 }, (_, i) => ({
    bayNumber: i + 1,
    type: i < 15 ? 'Service' : i < 21 ? 'Maintenance' : i < 24 ? 'Cleaning' : 'Storage',
    capacity: 1,
    currentOccupant: enterpriseTrains[i]?.id,
    position: { x: (i % 5) * 100 + 50, y: Math.floor(i / 5) * 100 + 100 },
    adjacentBays: [],
    facilities: i < 15 ? ['Power Supply', 'Compressed Air'] : 
               i < 21 ? ['Lifting Equipment', 'Tool Access', 'Parts Storage'] :
               i < 24 ? ['Water Supply', 'Drainage', 'Cleaning Equipment'] :
               ['Long-term Storage']
  }))
};