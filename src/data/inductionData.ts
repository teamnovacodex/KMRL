import { TrainInduction, InductionSchedule, InductionSlot, StandbyTrain, MaintenanceTrain, DepotOperations } from '../types/induction';

// KMRL Train Names (25 trains)
export const kmrlTrainNames = [
  'GANGA', 'KAVRI', 'KRISHNA', 'TAPTI', 'SARAW', 'ARUTH', 'VAIGAI', 'JHANAVI', 
  'DHWANIL', 'BHAVANI', 'PADMA', 'MANDAKINI', 'YAMUNA', 'PERIYAR', 'KABANI', 
  'VAAW', 'KAVERI', 'SHIRIYA', 'PAMPA', 'NARMADA', 'MAARUT', 'SABARMATHI', 
  'GODHAVARI', 'PAVAN', 'INDUS'
];

// Generate accurate train induction data
export const trainInductions: TrainInduction[] = kmrlTrainNames.map((name, index) => {
  const trainId = (index + 1).toString().padStart(3, '0');
  
  // Determine bay assignment based on operational status
  let bayType: 'SBL' | 'IBL' | 'HIBL' | 'Terminal';
  let bayNumber: number;
  let location: 'Muttom_Depot' | 'Aluva_Terminal' | 'Tripunithura_Terminal';
  let operationalStatus: 'Active' | 'Standby' | 'Induction' | 'Maintenance' | 'Cleaning';
  let inductionEligible: boolean;
  
  if (index < 15) {
    // First 15 trains - Service Ready (SBL bays)
    bayType = 'SBL';
    bayNumber = index + 1;
    location = 'Muttom_Depot';
    operationalStatus = 'Active';
    inductionEligible = true;
  } else if (index < 17) {
    // 2 Standby trains at terminals
    bayType = 'Terminal';
    bayNumber = index - 14;
    location = index === 15 ? 'Aluva_Terminal' : 'Tripunithura_Terminal';
    operationalStatus = 'Standby';
    inductionEligible = true;
  } else if (index < 20) {
    // 3 Induction trains
    bayType = 'SBL';
    bayNumber = index - 2;
    location = 'Muttom_Depot';
    operationalStatus = 'Induction';
    inductionEligible = true;
  } else if (index < 23) {
    // 3 trains in IBL (minor maintenance)
    bayType = 'IBL';
    bayNumber = index - 19;
    location = 'Muttom_Depot';
    operationalStatus = 'Maintenance';
    inductionEligible = false;
  } else {
    // 2 trains in HIBL (major maintenance)
    bayType = 'HIBL';
    bayNumber = index - 22;
    location = 'Muttom_Depot';
    operationalStatus = 'Maintenance';
    inductionEligible = false;
  }
  
  // Calculate induction time (04:30 - 08:00)
  const baseTime = 4 * 60 + 30; // 04:30 in minutes
  const inductionMinutes = baseTime + (index * 15); // 15-minute intervals
  const inductionHour = Math.floor(inductionMinutes / 60);
  const inductionMin = inductionMinutes % 60;
  const inductionTime = `${inductionHour.toString().padStart(2, '0')}:${inductionMin.toString().padStart(2, '0')}`;
  
  // Departure time (30 minutes after induction)
  const departureMinutes = inductionMinutes + 30;
  const departureHour = Math.floor(departureMinutes / 60);
  const departureMin = departureMinutes % 60;
  const scheduledDeparture = `${departureHour.toString().padStart(2, '0')}:${departureMin.toString().padStart(2, '0')}`;
  
  // Station assignment
  const stations = ['Aluva', 'Tripunithura', 'Muttom'];
  const fromStation = stations[index % 3] as 'Aluva' | 'Tripunithura' | 'Muttom';
  const nextDayStart = fromStation;
  
  // Fitness status (mostly valid, some invalid for realism)
  const fitnessValid = index < 18; // 18 valid, 7 invalid
  
  return {
    id: trainId,
    trainNumber: trainId,
    trainName: name,
    
    currentBay: {
      type: bayType,
      number: bayNumber,
      location: location,
      position: bayType === 'SBL' && bayNumber <= 18 ? 
        (bayNumber % 2 === 0 ? 'BUFFERED_END' : 'OPEN_END') : undefined
    },
    
    fitnessStatus: fitnessValid ? 'Valid' : 'Invalid',
    fitnessExpiry: '2025-09-21',
    certificateNumber: `FC-${trainId}-175829340782`,
    lastInspection: '2025-09-19',
    nextInspection: '2025-09-23',
    
    inductionEligible,
    inductionTime,
    scheduledDeparture,
    fromStation,
    nextDayStart,
    
    operationalStatus,
    serviceType: inductionEligible ? 'Revenue' : 'Out_of_Service',
    
    scheduleSlot: {
      slotNumber: index + 1,
      timeWindow: `${inductionTime} - ${scheduledDeparture}`,
      priority: index < 5 ? 'High' : index < 15 ? 'Medium' : 'Low',
      conflicts: []
    },
    
    maintenanceWindow: {
      required: !inductionEligible,
      type: bayType === 'HIBL' ? 'Emergency' : bayType === 'IBL' ? 'Corrective' : 'Preventive',
      estimatedDuration: bayType === 'HIBL' ? 24 : bayType === 'IBL' ? 8 : 4,
      scheduledDate: '2025-09-22'
    },
    
    reliability: Math.floor(Math.random() * 20) + 80,
    punctuality: Math.floor(Math.random() * 15) + 85,
    mileage: {
      total: Math.floor(Math.random() * 100000) + 100000,
      daily: Math.floor(Math.random() * 100) + 200,
      weekly: Math.floor(Math.random() * 700) + 1400,
      lastUpdate: new Date().toISOString()
    },
    
    aiRecommendation: {
      decision: inductionEligible ? 'Induct' : 'Maintenance',
      confidence: Math.floor(Math.random() * 20) + 80,
      reasoning: inductionEligible ? 
        ['Valid fitness certificate', 'In SBL bay', 'All systems operational'] :
        ['Maintenance required', `In ${bayType} bay`, 'Not service ready'],
      riskFactors: inductionEligible ? [] : ['Safety compliance', 'Operational readiness'],
      alternativeOptions: inductionEligible ? ['Standby if needed'] : ['Complete maintenance first']
    }
  };
});

// Today's Induction Schedule
export const todayInductionSchedule: InductionSchedule = {
  scheduleId: `SCH-${new Date().toISOString().split('T')[0]}`,
  date: new Date().toISOString().split('T')[0],
  serviceType: 'Weekday',
  
  requiredTrains: 15,
  standbyTrains: 2,
  totalCapacity: 17,
  
  firstInduction: '04:30',
  lastInduction: '08:00',
  serviceStart: '05:00',
  serviceEnd: '22:00',
  
  inductionSlots: trainInductions
    .filter(t => t.operationalStatus === 'Active' || t.operationalStatus === 'Induction')
    .slice(0, 18)
    .map((train, index) => ({
      slotId: `SLOT-${index + 1}`,
      trainId: train.id,
      trainName: train.trainName,
      inductionTime: train.inductionTime,
      departureTime: train.scheduledDeparture,
      fromStation: train.fromStation,
      toStation: train.fromStation === 'Aluva' ? 'Tripunithura' : 'Aluva',
      route: `${train.fromStation} - ${train.fromStation === 'Aluva' ? 'Tripunithura' : 'Aluva'}`,
      estimatedPassengers: Math.floor(Math.random() * 2000) + 3000,
      priority: index + 1
    })),
  
  standbyList: trainInductions
    .filter(t => t.operationalStatus === 'Standby')
    .map(train => ({
      trainId: train.id,
      trainName: train.trainName,
      location: train.currentBay.location.replace('_', ' '),
      readyTime: '05:00',
      deploymentPriority: 1,
      estimatedResponseTime: 15
    })),
  
  maintenanceList: trainInductions
    .filter(t => t.operationalStatus === 'Maintenance')
    .map(train => ({
      trainId: train.id,
      trainName: train.trainName,
      maintenanceType: train.maintenanceWindow.type,
      estimatedCompletion: '2025-09-23',
      nextAvailable: '2025-09-24',
      priority: train.currentBay.type === 'HIBL' ? 'Critical' : 'Medium'
    })),
  
  targetPunctuality: 96.5,
  targetCapacity: 95.0,
  riskAssessment: 'Low'
};

// Depot Operations Status
export const depotOperations: DepotOperations = {
  totalBays: 25,
  serviceBays: 18, // SBL1-18
  inspectionBays: 4, // IBL1-4
  heavyMaintenanceBays: 3, // HIBL1-3
  cleaningBays: 2,
  
  currentOccupancy: {
    sbl: trainInductions.filter(t => t.currentBay.type === 'SBL').length,
    ibl: trainInductions.filter(t => t.currentBay.type === 'IBL').length,
    hibl: trainInductions.filter(t => t.currentBay.type === 'HIBL').length,
    cleaning: 0
  },
  
  shuntingOperations: {
    planned: 5,
    inProgress: 2,
    completed: 12,
    estimatedTime: 15
  }
};

// Induction Time Slots (Expert Level)
export const inductionTimeSlots = [
  { time: '04:30', slot: 1, description: 'First Train - Peak Preparation' },
  { time: '04:45', slot: 2, description: 'Early Service Setup' },
  { time: '05:00', slot: 3, description: 'Service Commencement' },
  { time: '05:15', slot: 4, description: 'Peak Hour Preparation' },
  { time: '05:30', slot: 5, description: 'Morning Rush Support' },
  { time: '05:45', slot: 6, description: 'Full Service Deployment' },
  { time: '06:00', slot: 7, description: 'Peak Hour Coverage' },
  { time: '06:15', slot: 8, description: 'Additional Capacity' },
  { time: '06:30', slot: 9, description: 'Extended Service' },
  { time: '06:45', slot: 10, description: 'Morning Peak End' },
  { time: '07:00', slot: 11, description: 'Regular Service' },
  { time: '07:15', slot: 12, description: 'Day Service Support' },
  { time: '07:30', slot: 13, description: 'Mid-Morning Service' },
  { time: '07:45', slot: 14, description: 'Late Morning Coverage' },
  { time: '08:00', slot: 15, description: 'Final Induction' }
];

// Service Patterns
export const servicePatterns = {
  weekday: {
    requiredTrains: 15,
    serviceHours: '05:00 - 22:00',
    peakHours: ['07:00-09:00', '17:00-19:00'],
    frequency: '6-8 minutes',
    standbyRequired: 2
  },
  weekend: {
    requiredTrains: 12,
    serviceHours: '06:00 - 22:00',
    peakHours: ['10:00-12:00', '18:00-20:00'],
    frequency: '8-10 minutes',
    standbyRequired: 2
  },
  holiday: {
    requiredTrains: 12,
    serviceHours: '08:00 - 22:00',
    peakHours: ['10:00-14:00'],
    frequency: '10-12 minutes',
    standbyRequired: 1
  }
};