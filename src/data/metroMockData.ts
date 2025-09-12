import { Train, JobCard, BrandingContract, BreakdownRecord, HistoricalData, DepotLayout } from '../types/metro';

// Kochi Metro Stations
export const kochiMetroStations = [
  'Aluva', 'Pulinchodu', 'Companypady', 'Ambattukavu', 'Muttom', 'Kalamassery',
  'Cochin University', 'Pathadipalam', 'Edapally', 'Changampuzha Park', 'Palarivattom',
  'JLN Stadium', 'Kaloor', 'Town Hall', 'M.G Road', 'Maharajas College', 'Ernakulam South',
  'Kadavanthra', 'Elamkulam', 'Vyttila', 'Thaikoodam', 'Petta', 'Vadakkekotta', 'SN Junction Thrippunithura'
];

// Train Names
export const trainNames = [
  'KRISHNA', 'TAPTI', 'SARAW', 'ARUTH', 'VAIGAI', 'JHANAVI', 'DHWANIL', 'BHAVANI',
  'PADMA', 'MANDAKINI', 'YAMUNA', 'PERIYAR', 'KABANI', 'VAAW', 'KAVERI', 'SHIRIYA',
  'PAMPA', 'NARMADA', 'MAARUT', 'SABARMATHI', 'GODHAVARI', 'GANGA', 'PAVAN'
];

// Generate 23 comprehensive train records with actual names
export const metroTrains: Train[] = trainNames.map((name, index) => {
  const id = (index + 1).toString();
  const isHighMileage = Math.random() > 0.7;
  const hasOpenJobs = Math.random() > 0.8;
  const needsBranding = Math.random() > 0.6;
  const needsCleaning = Math.random() > 0.7;
  
  return {
    id,
    trainNumber: name,
    model: index < 15 ? 'Alstom Metropolis' : 'BEML Standard',
    manufacturingYear: index < 10 ? 2017 : index < 20 ? 2018 : 2019,
    lastMajorOverhaul: `2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
    currentLocation: `Depot Bay ${index + 1}`,
    status: Math.random() > 0.85 ? 'Maintenance' : Math.random() > 0.1 ? 'Active' : 'Out of Service',
    
    // Fitness Certificate
    fitnessStatus: Math.random() > 0.9 ? 'Expired' : Math.random() > 0.8 ? 'Expiring Soon' : 'Valid',
    fitnessExpiryDate: `2025-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
    lastFitnessCheck: `2024-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
    fitnessScore: Math.floor(Math.random() * 40) + 60,
    
    // Job Cards & Maintenance
    jobCardStatus: hasOpenJobs ? 'Open' : 'Closed',
    openJobCards: hasOpenJobs ? [{
      id: `JC-${id}-001`,
      trainId: id,
      workOrderNumber: `WO-2024-${1200 + index}`,
      type: Math.random() > 0.7 ? 'Emergency' : Math.random() > 0.5 ? 'Corrective' : 'Preventive',
      priority: Math.random() > 0.8 ? 'Critical' : Math.random() > 0.6 ? 'High' : 'Medium',
      status: Math.random() > 0.5 ? 'In Progress' : 'Open',
      description: `${Math.random() > 0.5 ? 'Brake system' : 'Door mechanism'} maintenance required`,
      estimatedHours: Math.floor(Math.random() * 16) + 4,
      actualHours: Math.floor(Math.random() * 10) + 2,
      assignedTechnician: `Tech-${Math.floor(Math.random() * 20) + 1}`,
      createdDate: `2024-12-${Math.floor(Math.random() * 20) + 1}`,
      dueDate: `2024-12-${Math.floor(Math.random() * 10) + 22}`,
      parts: [],
      cost: Math.floor(Math.random() * 50000) + 10000
    }] : [],
    criticalJobCards: hasOpenJobs && Math.random() > 0.7 ? 1 : 0,
    lastMaintenance: `2024-12-${Math.floor(Math.random() * 20) + 1}`,
    nextScheduledMaintenance: `2025-01-${Math.floor(Math.random() * 30) + 1}`,
    maintenanceScore: Math.floor(Math.random() * 40) + 60,
    
    // Branding & Commercial
    brandingRequired: needsBranding,
    brandingContract: needsBranding ? {
      id: `BC-${id}`,
      trainId: id,
      advertiser: ['Coca-Cola', 'Samsung', 'Flipkart', 'Amazon', 'Jio'][Math.floor(Math.random() * 5)],
      campaignName: `Campaign ${index + 1}`,
      contractValue: Math.floor(Math.random() * 1000000) + 500000,
      startDate: `2024-12-${Math.floor(Math.random() * 15) + 1}`,
      endDate: `2025-02-${Math.floor(Math.random() * 28) + 1}`,
      requiredExposureHours: Math.floor(Math.random() * 500) + 200,
      currentExposureHours: Math.floor(Math.random() * 300) + 50,
      dailyTarget: Math.floor(Math.random() * 10) + 8,
      penaltyClause: Math.floor(Math.random() * 100000) + 25000,
      status: 'Active'
    } : undefined,
    brandingScore: needsBranding ? Math.floor(Math.random() * 30) + 70 : 100,
    
    // Mileage & Usage
    totalMileage: isHighMileage ? Math.floor(Math.random() * 50000) + 150000 : Math.floor(Math.random() * 80000) + 50000,
    dailyMileage: Math.floor(Math.random() * 100) + 200,
    weeklyMileage: Math.floor(Math.random() * 700) + 1400,
    monthlyMileage: Math.floor(Math.random() * 3000) + 6000,
    mileageDeviation: (Math.random() - 0.5) * 20,
    utilizationRate: Math.floor(Math.random() * 30) + 70,
    
    // Cleaning & Depot
    cleaningStatus: needsCleaning ? 'Pending' : Math.random() > 0.8 ? 'In Progress' : 'Done',
    lastCleaning: `2024-12-${Math.floor(Math.random() * 21) + 1} ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}`,
    cleaningType: ['Basic', 'Deep', 'Exterior', 'Interior'][Math.floor(Math.random() * 4)] as any,
    depotBay: index + 1,
    stablingPosition: { x: (index % 5) * 100 + 50, y: Math.floor(index / 5) * 100 + 100 },
    shuntingDistance: Math.floor(Math.random() * 300),
    
    // IoT & Health Monitoring
    healthScore: Math.floor(Math.random() * 40) + 60,
    engineHealth: Math.floor(Math.random() * 40) + 60,
    brakeHealth: Math.floor(Math.random() * 40) + 60,
    doorSystemHealth: Math.floor(Math.random() * 40) + 60,
    acSystemHealth: Math.floor(Math.random() * 40) + 60,
    batteryLevel: Math.floor(Math.random() * 30) + 70,
    vibrationLevel: Math.random() * 3 + 1,
    temperature: Math.random() * 10 + 25,
    
    // AI Predictions & Recommendations
    recommendation: isHighMileage || hasOpenJobs ? 'Maintenance' : 
                   needsCleaning || needsBranding ? 'Standby' : 'Service',
    confidenceScore: Math.floor(Math.random() * 30) + 70,
    riskFactors: [
      ...(isHighMileage ? ['High mileage requires attention'] : []),
      ...(hasOpenJobs ? ['Open maintenance jobs'] : []),
      ...(needsBranding ? ['Branding contract pending'] : [])
    ],
    predictedIssues: isHighMileage ? ['Potential brake wear', 'Engine performance degradation'] : [],
    
    // Historical Performance
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
});

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
  totalBays: 23,
  serviceBays: 15,
  maintenanceBays: 5,
  cleaningBays: 2,
  storageBays: 1,
  layout: Array.from({ length: 23 }, (_, i) => ({
    bayNumber: i + 1,
    type: i < 15 ? 'Service' : i < 20 ? 'Maintenance' : i < 22 ? 'Cleaning' : 'Storage',
    capacity: 1,
    currentOccupant: metroTrains[i]?.id,
    position: { x: (i % 5) * 100 + 50, y: Math.floor(i / 5) * 100 + 100 },
    adjacentBays: [],
    facilities: i < 15 ? ['Power Supply', 'Compressed Air'] : 
               i < 20 ? ['Lifting Equipment', 'Tool Access', 'Parts Storage'] :
               i < 22 ? ['Water Supply', 'Drainage', 'Cleaning Equipment'] :
               ['Long-term Storage']
  }))
};