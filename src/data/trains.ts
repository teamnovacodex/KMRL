import { Train } from '../types/train';

export const mockTrains: Train[] = [
  {
    id: '1',
    trainNumber: 'KMRL-001',
    fitnessStatus: 'Valid',
    jobCardStatus: 'Closed',
    brandingRequired: false,
    mileage: 45780,
    cleaningStatus: 'Done',
    depotBay: 1,
    recommendation: 'Service',
    lastMaintenance: '2024-12-15',
    nextScheduledMaintenance: '2025-01-15'
  },
  {
    id: '2',
    trainNumber: 'KMRL-002',
    fitnessStatus: 'Valid',
    jobCardStatus: 'Closed',
    brandingRequired: true,
    mileage: 52100,
    cleaningStatus: 'Pending',
    depotBay: 2,
    recommendation: 'Standby',
    lastMaintenance: '2024-12-10',
    nextScheduledMaintenance: '2025-01-10'
  },
  {
    id: '3',
    trainNumber: 'KMRL-003',
    fitnessStatus: 'Expired',
    jobCardStatus: 'Open',
    brandingRequired: false,
    mileage: 67890,
    cleaningStatus: 'Done',
    depotBay: 3,
    recommendation: 'Maintenance',
    lastMaintenance: '2024-11-20',
    nextScheduledMaintenance: '2024-12-20'
  },
  {
    id: '4',
    trainNumber: 'KMRL-004',
    fitnessStatus: 'Valid',
    jobCardStatus: 'Closed',
    brandingRequired: false,
    mileage: 38200,
    cleaningStatus: 'Done',
    depotBay: 4,
    recommendation: 'Service',
    lastMaintenance: '2024-12-18',
    nextScheduledMaintenance: '2025-01-18'
  },
  {
    id: '5',
    trainNumber: 'KMRL-005',
    fitnessStatus: 'Valid',
    jobCardStatus: 'Open',
    brandingRequired: true,
    mileage: 71200,
    cleaningStatus: 'Pending',
    depotBay: 5,
    recommendation: 'Maintenance',
    lastMaintenance: '2024-11-25',
    nextScheduledMaintenance: '2024-12-25'
  },
  {
    id: '6',
    trainNumber: 'KMRL-006',
    fitnessStatus: 'Valid',
    jobCardStatus: 'Closed',
    brandingRequired: false,
    mileage: 29800,
    cleaningStatus: 'Done',
    depotBay: 6,
    recommendation: 'Service',
    lastMaintenance: '2024-12-20',
    nextScheduledMaintenance: '2025-01-20'
  },
  {
    id: '7',
    trainNumber: 'KMRL-007',
    fitnessStatus: 'Expired',
    jobCardStatus: 'Open',
    brandingRequired: true,
    mileage: 84500,
    cleaningStatus: 'Pending',
    depotBay: 7,
    recommendation: 'Maintenance',
    lastMaintenance: '2024-10-15',
    nextScheduledMaintenance: '2024-11-15'
  },
  {
    id: '8',
    trainNumber: 'KMRL-008',
    fitnessStatus: 'Valid',
    jobCardStatus: 'Closed',
    brandingRequired: false,
    mileage: 41600,
    cleaningStatus: 'Done',
    depotBay: 8,
    recommendation: 'Standby',
    lastMaintenance: '2024-12-12',
    nextScheduledMaintenance: '2025-01-12'
  }
];