import { Train, HistoricalData, DepotBay } from '../types/train';

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

// Depot Bay Configuration
export const depotBays: DepotBay[] = [
  // IBL Bays (Inspection Bay Light) - Minor maintenance
  { bayNumber: 1, type: 'IBL', description: 'Inspection Bay Light - Minor Service', capacity: 1, location: 'Muttom_Depot', canServiceRevenue: false },
  { bayNumber: 2, type: 'IBL', description: 'Inspection Bay Light - Minor Service', capacity: 1, location: 'Muttom_Depot', canServiceRevenue: false },
  { bayNumber: 3, type: 'IBL', description: 'Inspection Bay Light - Minor Service', capacity: 1, location: 'Muttom_Depot', canServiceRevenue: false },
  { bayNumber: 4, type: 'IBL', description: 'Inspection Bay Light - Minor Service', capacity: 1, location: 'Muttom_Depot', canServiceRevenue: false },
  
  // HIBL Bays (Heavy Inspection Bay Light) - Major maintenance
  { bayNumber: 5, type: 'HIBL', description: 'Heavy Inspection Bay - Major Maintenance', capacity: 1, location: 'Muttom_Depot', canServiceRevenue: false },
  { bayNumber: 6, type: 'HIBL', description: 'Heavy Inspection Bay - Major Maintenance', capacity: 1, location: 'Muttom_Depot', canServiceRevenue: false },
  { bayNumber: 7, type: 'HIBL', description: 'Heavy Inspection Bay - Major Maintenance', capacity: 1, location: 'Muttom_Depot', canServiceRevenue: false },
  
  // SBL Bays (Service Bay Light) - Ready for revenue service
  { bayNumber: 8, type: 'SBL', description: 'Service Bay - Ready for Revenue Service', capacity: 1, location: 'Muttom_Depot', position: 'OPEN_END', canServiceRevenue: true },
  { bayNumber: 9, type: 'SBL', description: 'Service Bay - Ready for Revenue Service', capacity: 1, location: 'Muttom_Depot', position: 'BUFFERED_END', canServiceRevenue: true },
  { bayNumber: 10, type: 'SBL', description: 'Service Bay - Ready for Revenue Service', capacity: 1, location: 'Muttom_Depot', position: 'OPEN_END', canServiceRevenue: true },
  { bayNumber: 11, type: 'SBL', description: 'Service Bay - Ready for Revenue Service', capacity: 1, location: 'Muttom_Depot', position: 'BUFFERED_END', canServiceRevenue: true },
  { bayNumber: 12, type: 'SBL', description: 'Service Bay - Ready for Revenue Service', capacity: 1, location: 'Muttom_Depot', position: 'OPEN_END', canServiceRevenue: true },
  { bayNumber: 13, type: 'SBL', description: 'Service Bay - Ready for Revenue Service', capacity: 1, location: 'Muttom_Depot', position: 'BUFFERED_END', canServiceRevenue: true },
  { bayNumber: 14, type: 'SBL', description: 'Service Bay - Ready for Revenue Service', capacity: 1, location: 'Muttom_Depot', position: 'OPEN_END', canServiceRevenue: true },
  { bayNumber: 15, type: 'SBL', description: 'Service Bay - Ready for Revenue Service', capacity: 1, location: 'Muttom_Depot', position: 'BUFFERED_END', canServiceRevenue: true },
  { bayNumber: 16, type: 'SBL', description: 'Service Bay - Ready for Revenue Service', capacity: 1, location: 'Muttom_Depot', position: 'OPEN_END', canServiceRevenue: true },
  { bayNumber: 17, type: 'SBL', description: 'Service Bay - Ready for Revenue Service', capacity: 1, location: 'Muttom_Depot', position: 'BUFFERED_END', canServiceRevenue: true },
  { bayNumber: 18, type: 'SBL', description: 'Service Bay - Ready for Revenue Service', capacity: 1, location: 'Muttom_Depot', position: 'OPEN_END', canServiceRevenue: true },
  { bayNumber: 19, type: 'SBL', description: 'Service Bay - Ready for Revenue Service', capacity: 1, location: 'Muttom_Depot', position: 'BUFFERED_END', canServiceRevenue: true },
  
  // Terminal Stabling
  { bayNumber: 20, type: 'SBL', description: 'Aluva Terminal Stabling', capacity: 2, location: 'Aluva_Terminal', canServiceRevenue: true },
  { bayNumber: 21, type: 'SBL', description: 'Aluva Terminal Stabling', capacity: 2, location: 'Aluva_Terminal', canServiceRevenue: true },
  { bayNumber: 22, type: 'SBL', description: 'Tripunithura Terminal Stabling', capacity: 2, location: 'Tripunithura_Terminal', canServiceRevenue: true },
  { bayNumber: 23, type: 'SBL', description: 'Tripunithura Terminal Stabling', capacity: 2, location: 'Tripunithura_Terminal', canServiceRevenue: true }
];

// Generate 23 comprehensive train records
export const mockTrains: Train[] = trainNames.map((name, index) => {
  const id = (index + 1).toString();
  const hasMaintenanceIssue = Math.random() > 0.8;
  const hasMinorIssue = Math.random() > 0.7;
  const needsBranding = Math.random() > 0.6;
  const isHighMileage = Math.random() > 0.7;
  
  // Determine bay type based on train condition
  let bayType: 'IBL' | 'HIBL' | 'SBL';
  let bayNumber: number;
  let canGoToService: boolean;
  
  if (hasMaintenanceIssue) {
    bayType = 'HIBL';
    bayNumber = 5 + (index % 3); // HIBL bays 5-7
    canGoToService = false;
  } else if (hasMinorIssue) {
    bayType = 'IBL';
    bayNumber = 1 + (index % 4); // IBL bays 1-4
    canGoToService = false;
  } else {
    bayType = 'SBL';
    bayNumber = 8 + (index % 12); // SBL bays 8-19
    canGoToService = true;
  }
  
  return {
    id,
    trainNumber: `KMRL-${(index + 1).toString().padStart(3, '0')}`,
    trainName: name,
    model: index < 15 ? 'Alstom Metropolis' : 'BEML Standard',
    manufacturingYear: index < 10 ? 2017 : index < 20 ? 2018 : 2019,
    status: hasMaintenanceIssue ? 'Maintenance' : 'Active',
    
    // Fitness Certificates - 3 departments
    fitnessStatus: Math.random() > 0.9 ? 'Expired' : Math.random() > 0.8 ? 'Expiring Soon' : 'Valid',
    fitnessExpiryDate: `2025-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
    fitnessScore: Math.floor(Math.random() * 40) + 60,
    rollingStockCert: {
      status: Math.random() > 0.95 ? 'Expired' : 'Valid',
      expiryDate: `2025-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
      issuedBy: 'Rolling Stock Department'
    },
    signallingCert: {
      status: Math.random() > 0.95 ? 'Expired' : 'Valid',
      expiryDate: `2025-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
      issuedBy: 'Signalling Department'
    },
    telecomCert: {
      status: Math.random() > 0.95 ? 'Expired' : 'Valid',
      expiryDate: `2025-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
      issuedBy: 'Telecom Department'
    },
    
    // IBM Maximo Job Cards
    jobCardStatus: hasMaintenanceIssue || hasMinorIssue ? 'Open' : 'Closed',
    maximoWorkOrders: hasMaintenanceIssue || hasMinorIssue ? [{
      workOrderNumber: `WO-2024-${1200 + index}`,
      type: hasMaintenanceIssue ? 'Corrective' : 'Preventive',
      priority: hasMaintenanceIssue ? 'High' : 'Medium',
      status: 'Open',
      description: hasMaintenanceIssue ? 'Major brake system overhaul required' : 'Routine inspection and minor repairs',
      estimatedHours: hasMaintenanceIssue ? 24 : 8,
      assignedTechnician: `Tech-${Math.floor(Math.random() * 20) + 1}`,
      createdDate: '2024-12-20',
      dueDate: '2024-12-25'
    }] : [],
    criticalJobCards: hasMaintenanceIssue ? 1 : 0,
    lastMaintenance: `2024-12-${Math.floor(Math.random() * 20) + 1}`,
    nextScheduledMaintenance: `2025-01-${Math.floor(Math.random() * 30) + 1}`,
    
    // Branding - Exterior wraps and interior posters
    brandingRequired: needsBranding,
    exteriorWrapContract: needsBranding ? {
      advertiser: ['Coca-Cola', 'Samsung', 'Flipkart', 'Amazon', 'Jio', 'BSNL', 'Airtel'][Math.floor(Math.random() * 7)],
      campaignName: `Campaign ${index + 1}`,
      requiredExposureHours: Math.floor(Math.random() * 500) + 200,
      currentExposureHours: Math.floor(Math.random() * 300) + 50,
      contractValue: Math.floor(Math.random() * 1000000) + 500000,
      status: 'Active'
    } : undefined,
    interiorPosterAds: [
      {
        advertiser: 'Kerala Tourism',
        positionCount: Math.floor(Math.random() * 8) + 4,
        revenue: Math.floor(Math.random() * 50000) + 25000
      },
      {
        advertiser: 'Local Business',
        positionCount: Math.floor(Math.random() * 6) + 2,
        revenue: Math.floor(Math.random() * 30000) + 15000
      }
    ],
    
    // Mileage & Third Rail System
    totalMileage: isHighMileage ? Math.floor(Math.random() * 50000) + 150000 : Math.floor(Math.random() * 80000) + 50000,
    dailyMileage: Math.floor(Math.random() * 100) + 200,
    thirdRailConsumption: Math.random() * 2 + 3.5, // kWh per km
    bogieWear: Math.floor(Math.random() * 40) + 30,
    brakePadWear: Math.floor(Math.random() * 50) + 25,
    hvacWear: Math.floor(Math.random() * 35) + 40,
    utilizationRate: Math.floor(Math.random() * 30) + 70,
    
    // Depot Bay System
    currentBay: {
      type: bayType,
      bayNumber: bayNumber,
      position: bayType === 'SBL' && bayNumber <= 19 ? (bayNumber % 2 === 0 ? 'BUFFERED_END' : 'OPEN_END') : 'OPEN_END',
      location: bayNumber >= 20 ? (bayNumber <= 21 ? 'Aluva_Terminal' : 'Tripunithura_Terminal') : 'Muttom_Depot'
    },
    
    // Cleaning Status
    cleaningStatus: Math.random() > 0.7 ? 'Pending' : Math.random() > 0.8 ? 'In Progress' : 'Done',
    lastCleaning: `2024-12-${Math.floor(Math.random() * 21) + 1} ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}`,
    cleaningType: ['Basic', 'Deep', 'Interior_Detail', 'Exterior_Wash'][Math.floor(Math.random() * 4)] as any,
    
    // Health Monitoring
    healthScore: Math.floor(Math.random() * 40) + 60,
    engineHealth: Math.floor(Math.random() * 40) + 60,
    brakeHealth: Math.floor(Math.random() * 40) + 60,
    doorSystemHealth: Math.floor(Math.random() * 40) + 60,
    acSystemHealth: Math.floor(Math.random() * 40) + 60,
    
    // AI Recommendations
    recommendation: canGoToService ? 'Service' : hasMaintenanceIssue ? 'Maintenance' : 'Standby',
    confidenceScore: Math.floor(Math.random() * 30) + 70,
    riskFactors: [
      ...(isHighMileage ? ['High mileage requires attention'] : []),
      ...(hasMaintenanceIssue ? ['Critical maintenance pending'] : []),
      ...(hasMinorIssue ? ['Minor issues need resolution'] : []),
      ...(!canGoToService ? ['Not in service bay - cannot go to revenue service'] : [])
    ],
    canGoToService
  };
});

export const historicalData: HistoricalData[] = Array.from({ length: 30 }, (_, i) => {
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
    thirdRailConsumption: Math.floor(Math.random() * 5000) + 15000 // kWh per day
  };
});