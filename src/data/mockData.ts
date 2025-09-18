import { Train, HistoricalData } from '../types/train';

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

// Generate 23 comprehensive train records
export const mockTrains: Train[] = trainNames.map((name, index) => {
  const id = (index + 1).toString();
  const isHighMileage = Math.random() > 0.7;
  const hasOpenJobs = Math.random() > 0.8;
  const needsBranding = Math.random() > 0.6;
  const needsCleaning = Math.random() > 0.7;
  
  return {
    id,
    trainNumber: `KMRL-${(index + 1).toString().padStart(3, '0')}`,
    trainName: name,
    model: index < 15 ? 'Alstom Metropolis' : 'BEML Standard',
    manufacturingYear: index < 10 ? 2017 : index < 20 ? 2018 : 2019,
    status: Math.random() > 0.85 ? 'Maintenance' : Math.random() > 0.1 ? 'Active' : 'Out of Service',
    
    // Fitness Certificate
    fitnessStatus: Math.random() > 0.9 ? 'Expired' : Math.random() > 0.8 ? 'Expiring Soon' : 'Valid',
    fitnessExpiryDate: `2025-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
    fitnessScore: Math.floor(Math.random() * 40) + 60,
    
    // Job Cards & Maintenance
    jobCardStatus: hasOpenJobs ? 'Open' : 'Closed',
    criticalJobCards: hasOpenJobs && Math.random() > 0.7 ? 1 : 0,
    lastMaintenance: `2024-12-${Math.floor(Math.random() * 20) + 1}`,
    nextScheduledMaintenance: `2025-01-${Math.floor(Math.random() * 30) + 1}`,
    
    // Branding & Commercial
    brandingRequired: needsBranding,
    brandingContract: needsBranding ? {
      advertiser: ['Coca-Cola', 'Samsung', 'Flipkart', 'Amazon', 'Jio'][Math.floor(Math.random() * 5)],
      campaignName: `Campaign ${index + 1}`,
      requiredExposureHours: Math.floor(Math.random() * 500) + 200,
      currentExposureHours: Math.floor(Math.random() * 300) + 50,
      status: 'Active'
    } : undefined,
    
    // Mileage & Usage
    totalMileage: isHighMileage ? Math.floor(Math.random() * 50000) + 150000 : Math.floor(Math.random() * 80000) + 50000,
    dailyMileage: Math.floor(Math.random() * 100) + 200,
    utilizationRate: Math.floor(Math.random() * 30) + 70,
    
    // Cleaning & Depot
    cleaningStatus: needsCleaning ? 'Pending' : Math.random() > 0.8 ? 'In Progress' : 'Done',
    lastCleaning: `2024-12-${Math.floor(Math.random() * 21) + 1} ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}`,
    depotBay: index + 1,
    
    // Health Monitoring
    healthScore: Math.floor(Math.random() * 40) + 60,
    engineHealth: Math.floor(Math.random() * 40) + 60,
    brakeHealth: Math.floor(Math.random() * 40) + 60,
    doorSystemHealth: Math.floor(Math.random() * 40) + 60,
    acSystemHealth: Math.floor(Math.random() * 40) + 60,
    
    // AI Predictions & Recommendations
    recommendation: isHighMileage || hasOpenJobs ? 'Maintenance' : 
                   needsCleaning || needsBranding ? 'Standby' : 'Service',
    confidenceScore: Math.floor(Math.random() * 30) + 70,
    riskFactors: [
      ...(isHighMileage ? ['High mileage requires attention'] : []),
      ...(hasOpenJobs ? ['Open maintenance jobs'] : []),
      ...(needsBranding ? ['Branding contract pending'] : [])
    ]
  };
});

export const historicalData: HistoricalData[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  
  return {
    date: date.toISOString().split('T')[0],
    selectedTrains: Math.floor(Math.random() * 5) + 18,
    standbyTrains: Math.floor(Math.random() * 3) + 3,
    maintenanceTrains: Math.floor(Math.random() * 4) + 2,
    onTimePerformance: Math.floor(Math.random() * 15) + 85,
    passengerCount: Math.floor(Math.random() * 50000) + 150000,
    revenue: Math.floor(Math.random() * 500000) + 2000000,
    efficiency: Math.floor(Math.random() * 20) + 80
  };
});