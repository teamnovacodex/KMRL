import { Train, HistoricalData, DepotBay, AIOptimizationResult } from '../types/train';

// Kochi Metro Stations (Correct Order)
export const kochiMetroStations = [
  'Aluva', 'Pulinchodu', 'Companypady', 'Ambattukavu', 'Muttom', 'Kalamassery',
  'Cochin University', 'Pathadipalam', 'Edapally', 'Changampuzha Park', 'Palarivattom',
  'JLN Stadium', 'Kaloor', 'Town Hall', 'M.G Road', 'Maharajas College', 'Ernakulam South',
  'Kadavanthra', 'Elamkulam', 'Vyttila', 'Thaikoodam', 'Petta', 'Vadakkekotta', 'SN Junction Thrippunithura'
];

// KMRL Train Names (23 Trains)
export const trainNames = [
  'KRISHNA', 'TAPTI', 'SARAW', 'ARUTH', 'VAIGAI', 'JHANAVI', 'DHWANIL', 'BHAVANI',
  'PADMA', 'MANDAKINI', 'YAMUNA', 'PERIYAR', 'KABANI', 'VAAW', 'KAVERI', 'SHIRIYA',
  'PAMPA', 'NARMADA', 'MAARUT', 'SABARMATHI', 'GODHAVARI', 'GANGA', 'PAVAN'
];

// Helper function to generate realistic dates
const getRandomDate = (daysFromNow: number, variance: number = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow + Math.floor(Math.random() * variance * 2) - variance);
  return date.toISOString();
};

// Generate 23 comprehensive train records
export const mockTrains: Train[] = trainNames.map((name, index) => {
  const id = (index + 1).toString();
  
  // Determine bay type and service eligibility
  let bayType: 'IBL' | 'HIBL' | 'SBL';
  let bayNumber: number;
  let canGoToService: boolean;
  let location: 'Muttom_Depot' | 'Aluva_Terminal' | 'Tripunithura_Terminal';
  
  const random = Math.random();
  if (random > 0.85) {
    // 15% in maintenance bays
    bayType = Math.random() > 0.6 ? 'HIBL' : 'IBL';
    bayNumber = bayType === 'HIBL' ? 5 + (index % 3) : 1 + (index % 4);
    canGoToService = false;
    location = 'Muttom_Depot';
  } else if (index >= 20) {
    // Last 3 trains at terminals
    bayType = 'SBL';
    bayNumber = 20 + (index - 20);
    canGoToService = true;
    location = index === 20 || index === 21 ? 'Aluva_Terminal' : 'Tripunithura_Terminal';
  } else {
    // Majority in service bays
    bayType = 'SBL';
    bayNumber = 8 + (index % 12);
    canGoToService = true;
    location = 'Muttom_Depot';
  }
  
  const isHighMileage = Math.random() > 0.7;
  const hasMaintenanceIssue = bayType !== 'SBL';
  const needsBranding = Math.random() > 0.6;
  const needsCleaning = Math.random() > 0.7;
  
  return {
    id,
    trainNumber: `KMRL-${(index + 1).toString().padStart(3, '0')}`,
    trainName: name,
    model: index < 15 ? 'Alstom Metropolis' : 'BEML Standard',
    manufacturingYear: index < 10 ? 2017 : index < 20 ? 2018 : 2019,
    status: hasMaintenanceIssue ? 'Maintenance' : 'Active',
    
    // Fitness Certificates
    fitnessStatus: Math.random() > 0.9 ? 'Expired' : Math.random() > 0.8 ? 'Expiring Soon' : 'Valid',
    rollingStockCert: {
      status: Math.random() > 0.95 ? 'Expired' : 'Valid',
      issueDate: getRandomDate(-365, 30),
      expiryDate: getRandomDate(365, 60),
      lastInspection: getRandomDate(-30, 15),
      nextInspection: getRandomDate(30, 15),
      issuedBy: 'Rolling Stock Department',
      certificateNumber: `RS-${index + 1}-2024`
    },
    signallingCert: {
      status: Math.random() > 0.95 ? 'Expired' : 'Valid',
      issueDate: getRandomDate(-365, 30),
      expiryDate: getRandomDate(365, 60),
      lastInspection: getRandomDate(-30, 15),
      nextInspection: getRandomDate(30, 15),
      issuedBy: 'Signalling Department',
      certificateNumber: `SG-${index + 1}-2024`
    },
    telecomCert: {
      status: Math.random() > 0.95 ? 'Expired' : 'Valid',
      issueDate: getRandomDate(-365, 30),
      expiryDate: getRandomDate(365, 60),
      lastInspection: getRandomDate(-30, 15),
      nextInspection: getRandomDate(30, 15),
      issuedBy: 'Telecom Department',
      certificateNumber: `TC-${index + 1}-2024`
    },
    
    // Job Cards
    jobCardStatus: hasMaintenanceIssue ? 'Open' : 'Closed',
    maximoWorkOrders: hasMaintenanceIssue ? [{
      workOrderNumber: `WO-2024-${1200 + index}`,
      type: Math.random() > 0.7 ? 'Emergency' : 'Corrective',
      priority: Math.random() > 0.8 ? 'Critical' : 'High',
      status: 'Open',
      description: `${bayType === 'HIBL' ? 'Major brake system overhaul' : 'Minor door adjustment'} required`,
      createdDate: getRandomDate(-5, 2),
      scheduledDate: getRandomDate(1, 1),
      dueDate: getRandomDate(3, 2),
      estimatedHours: bayType === 'HIBL' ? 24 : 8,
      assignedTechnician: `Tech-${Math.floor(Math.random() * 20) + 1}`,
      partsRequired: bayType === 'HIBL' ? ['Brake Pads', 'Hydraulic Fluid'] : ['Door Sensor'],
      estimatedCost: bayType === 'HIBL' ? 75000 : 25000
    }] : [],
    criticalJobCards: hasMaintenanceIssue && Math.random() > 0.7 ? 1 : 0,
    lastMaintenance: getRandomDate(-15, 10),
    nextScheduledMaintenance: getRandomDate(30, 15),
    maintenanceWindow: {
      startTime: `${Math.floor(Math.random() * 6) + 22}:00`,
      endTime: `${Math.floor(Math.random() * 6) + 4}:00`,
      estimatedDuration: bayType === 'HIBL' ? 8 : bayType === 'IBL' ? 4 : 2,
      priority: hasMaintenanceIssue ? 'High' : 'Medium'
    },
    
    // Branding
    brandingRequired: needsBranding,
    exteriorWrapContract: needsBranding ? {
      advertiser: ['Coca-Cola India', 'Samsung Electronics', 'Flipkart', 'Amazon India', 'Reliance Jio'][Math.floor(Math.random() * 5)],
      campaignName: `New Year Campaign ${index + 1}`,
      contractStartDate: getRandomDate(-30, 15),
      contractEndDate: getRandomDate(60, 30),
      requiredExposureHours: Math.floor(Math.random() * 500) + 300,
      currentExposureHours: Math.floor(Math.random() * 200) + 100,
      dailyTargetHours: Math.floor(Math.random() * 6) + 12,
      contractValue: Math.floor(Math.random() * 1000000) + 500000,
      penaltyPerHour: Math.floor(Math.random() * 5000) + 2000,
      status: 'Active',
      lastExposureUpdate: getRandomDate(-1, 0)
    } : undefined,
    interiorPosterAds: [
      {
        advertiser: 'Kerala Tourism',
        positionCount: Math.floor(Math.random() * 8) + 4,
        installationDate: getRandomDate(-60, 30),
        expiryDate: getRandomDate(30, 30),
        revenue: Math.floor(Math.random() * 50000) + 25000,
        status: 'Active'
      }
    ],
    
    // Mileage & Third Rail
    totalMileage: isHighMileage ? Math.floor(Math.random() * 50000) + 150000 : Math.floor(Math.random() * 80000) + 50000,
    dailyMileage: Math.floor(Math.random() * 100) + 200,
    weeklyMileage: Math.floor(Math.random() * 700) + 1400,
    monthlyMileage: Math.floor(Math.random() * 3000) + 6000,
    lastMileageUpdate: getRandomDate(-1, 0),
    thirdRailConsumption: Math.random() * 2 + 3.5,
    dailyPowerConsumption: Math.floor(Math.random() * 2000) + 1000,
    bogieWear: {
      currentWear: Math.floor(Math.random() * 40) + 30,
      lastInspection: getRandomDate(-30, 15),
      nextInspection: getRandomDate(30, 15),
      replacementDue: getRandomDate(180, 60)
    },
    brakePadWear: {
      currentWear: Math.floor(Math.random() * 50) + 25,
      lastInspection: getRandomDate(-15, 10),
      nextInspection: getRandomDate(15, 10),
      replacementDue: getRandomDate(90, 30)
    },
    hvacWear: {
      currentWear: Math.floor(Math.random() * 35) + 40,
      lastInspection: getRandomDate(-45, 20),
      nextInspection: getRandomDate(45, 20),
      replacementDue: getRandomDate(270, 90)
    },
    utilizationRate: Math.floor(Math.random() * 30) + 70,
    
    // Depot Bay
    currentBay: {
      type: bayType,
      bayNumber: bayNumber,
      position: bayType === 'SBL' && bayNumber <= 19 ? (bayNumber % 2 === 0 ? 'BUFFERED_END' : 'OPEN_END') : undefined,
      location: location,
      entryTime: getRandomDate(-1, 0),
      expectedExitTime: getRandomDate(1, 0),
      occupancyDuration: Math.floor(Math.random() * 12) + 8
    },
    
    // Cleaning
    cleaningStatus: needsCleaning ? 'Pending' : Math.random() > 0.8 ? 'In Progress' : 'Done',
    cleaningSchedule: {
      scheduledDate: getRandomDate(1, 1),
      scheduledTime: `${Math.floor(Math.random() * 4) + 1}:00`,
      estimatedDuration: needsCleaning ? 6 : 3,
      cleaningType: needsCleaning ? 'Deep' : 'Basic',
      assignedCrew: `Crew-${Math.floor(Math.random() * 5) + 1}`,
      bayRequired: Math.floor(Math.random() * 3) + 21,
      manpowerRequired: needsCleaning ? 4 : 2
    },
    lastCleaning: getRandomDate(-2, 1),
    nextCleaningDue: getRandomDate(7, 3),
    
    // Health Monitoring
    healthScore: Math.floor(Math.random() * 40) + 60,
    lastHealthCheck: getRandomDate(-1, 0),
    nextHealthCheck: getRandomDate(1, 0),
    engineHealth: {
      score: Math.floor(Math.random() * 40) + 60,
      lastCheck: getRandomDate(-7, 3),
      nextCheck: getRandomDate(7, 3),
      issues: Math.random() > 0.8 ? ['Minor oil leak detected'] : []
    },
    brakeHealth: {
      score: Math.floor(Math.random() * 40) + 60,
      lastCheck: getRandomDate(-7, 3),
      nextCheck: getRandomDate(7, 3),
      issues: Math.random() > 0.8 ? ['Brake pad wear at 75%'] : []
    },
    doorSystemHealth: {
      score: Math.floor(Math.random() * 40) + 60,
      lastCheck: getRandomDate(-7, 3),
      nextCheck: getRandomDate(7, 3),
      issues: Math.random() > 0.8 ? ['Door sensor calibration needed'] : []
    },
    acSystemHealth: {
      score: Math.floor(Math.random() * 40) + 60,
      lastCheck: getRandomDate(-7, 3),
      nextCheck: getRandomDate(7, 3),
      issues: Math.random() > 0.8 ? ['Filter replacement due'] : []
    },
    
    // AI Recommendation
    aiRecommendation: {
      decision: canGoToService && !hasMaintenanceIssue ? 'Service' : hasMaintenanceIssue ? 'Maintenance' : 'Standby',
      confidence: Math.floor(Math.random() * 30) + 70,
      reasoning: canGoToService ? ['All systems operational', 'In SBL bay'] : ['Maintenance required', `In ${bayType} bay`],
      scheduledFor: getRandomDate(1, 0).split('T')[0],
      estimatedServiceHours: canGoToService ? 16 : 0,
      riskFactors: hasMaintenanceIssue ? ['Maintenance pending'] : [],
      alternativeOptions: ['Standby if needed'],
      lastUpdated: new Date().toISOString()
    },
    
    canGoToService,
    serviceEligibilityReasons: canGoToService ? 
      ['In SBL bay', 'All certificates valid'] : 
      [`In ${bayType} bay - not service ready`],
    nextServiceDate: canGoToService ? getRandomDate(1, 0) : getRandomDate(7, 5),
    estimatedRevenue: canGoToService ? Math.floor(Math.random() * 50000) + 30000 : 0
  };
});

// Generate historical data
export const historicalData: HistoricalData[] = Array.from({ length: 90 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  
  return {
    date: date.toISOString().split('T')[0],
    selectedTrains: Math.floor(Math.random() * 5) + 16,
    standbyTrains: Math.floor(Math.random() * 3) + 4,
    maintenanceTrains: Math.floor(Math.random() * 4) + 3,
    onTimePerformance: Math.floor(Math.random() * 15) + 85,
    passengerCount: Math.floor(Math.random() * 50000) + 150000,
    revenue: Math.floor(Math.random() * 500000) + 2000000,
    efficiency: Math.floor(Math.random() * 20) + 80,
    thirdRailConsumption: Math.floor(Math.random() * 5000) + 15000,
    averageHealthScore: Math.floor(Math.random() * 20) + 75,
    criticalIssues: Math.floor(Math.random() * 3),
    completedMaintenance: Math.floor(Math.random() * 5) + 2
  };
});

// Depot Bay Configuration
export const depotBays: DepotBay[] = [
  // IBL Bays (1-4) - Minor maintenance
  ...Array.from({ length: 4 }, (_, i) => ({
    bayNumber: i + 1,
    type: 'IBL' as const,
    description: 'Inspection Bay Light - Minor Service',
    capacity: 1,
    location: 'Muttom_Depot' as const,
    canServiceRevenue: false,
    maintenanceCapabilities: ['Minor Repairs', 'Inspections', 'Component Replacement'],
    availableFrom: getRandomDate(0, 1),
    nextAvailable: getRandomDate(1, 1)
  })),
  
  // HIBL Bays (5-7) - Major maintenance
  ...Array.from({ length: 3 }, (_, i) => ({
    bayNumber: i + 5,
    type: 'HIBL' as const,
    description: 'Heavy Inspection Bay - Major Maintenance',
    capacity: 1,
    location: 'Muttom_Depot' as const,
    canServiceRevenue: false,
    maintenanceCapabilities: ['Major Overhauls', 'System Replacements', 'Heavy Repairs'],
    availableFrom: getRandomDate(0, 2),
    nextAvailable: getRandomDate(2, 2)
  })),
  
  // SBL Bays (8-19) - Service ready
  ...Array.from({ length: 12 }, (_, i) => ({
    bayNumber: i + 8,
    type: 'SBL' as const,
    description: 'Service Bay - Ready for Revenue Service',
    capacity: 1,
    location: 'Muttom_Depot' as const,
    position: (i % 2 === 0 ? 'OPEN_END' : 'BUFFERED_END') as const,
    canServiceRevenue: true,
    maintenanceCapabilities: ['Light Maintenance', 'Cleaning', 'Pre-service Checks'],
    availableFrom: getRandomDate(0, 1),
    nextAvailable: getRandomDate(1, 1)
  })),
  
  // Terminal Stabling (20-23)
  ...Array.from({ length: 4 }, (_, i) => ({
    bayNumber: i + 20,
    type: 'SBL' as const,
    description: i < 2 ? 'Aluva Terminal Stabling' : 'Tripunithura Terminal Stabling',
    capacity: 2,
    location: (i < 2 ? 'Aluva_Terminal' : 'Tripunithura_Terminal') as const,
    canServiceRevenue: true,
    maintenanceCapabilities: ['Light Cleaning', 'Pre-service Checks'],
    availableFrom: getRandomDate(0, 1),
    nextAvailable: getRandomDate(1, 1)
  }))
];