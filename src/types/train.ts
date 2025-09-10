export interface Train {
  id: string;
  trainNumber: string;
  fitnessStatus: 'Valid' | 'Expired';
  jobCardStatus: 'Open' | 'Closed';
  brandingRequired: boolean;
  mileage: number;
  cleaningStatus: 'Pending' | 'Done';
  depotBay: number;
  recommendation: 'Service' | 'Standby' | 'Maintenance';
  lastMaintenance: string;
  nextScheduledMaintenance: string;
}

export interface TrainSummary {
  service: number;
  standby: number;
  maintenance: number;
  total: number;
}