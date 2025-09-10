// Data Integration Types for Multiple Sources
export interface DataSource {
  id: string;
  name: string;
  type: 'API' | 'CSV' | 'Database' | 'IoT' | 'Manual';
  status: 'Connected' | 'Disconnected' | 'Error' | 'Syncing';
  lastSync: string;
  recordCount: number;
}

export interface MaximoJobCard {
  jobCardId: string;
  trainId: string;
  workOrderType: 'Preventive' | 'Corrective' | 'Emergency';
  status: 'Open' | 'In Progress' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  estimatedHours: number;
  assignedTechnician: string;
  createdDate: string;
  dueDate: string;
}

export interface IoTSensorData {
  trainId: string;
  timestamp: string;
  mileage: number;
  engineHealth: number; // 0-100
  brakeSystemHealth: number; // 0-100
  doorSystemHealth: number; // 0-100
  airConditioningHealth: number; // 0-100
  batteryLevel: number; // 0-100
  vibrationLevel: number;
  temperature: number;
}

export interface BrandingContract {
  contractId: string;
  trainId: string;
  advertiser: string;
  campaignName: string;
  startDate: string;
  endDate: string;
  requiredExposureHours: number;
  currentExposureHours: number;
  revenue: number;
  status: 'Active' | 'Expired' | 'Pending';
}

export interface DepotSchedule {
  scheduleId: string;
  date: string;
  cleaningSlots: CleaningSlot[];
  maintenanceSlots: MaintenanceSlot[];
  availableManpower: number;
  maxCapacity: number;
}

export interface CleaningSlot {
  slotId: string;
  startTime: string;
  endTime: string;
  bayNumber: number;
  trainId?: string;
  cleaningType: 'Basic' | 'Deep' | 'Exterior' | 'Interior';
  status: 'Available' | 'Booked' | 'In Progress' | 'Completed';
}

export interface MaintenanceSlot {
  slotId: string;
  startTime: string;
  endTime: string;
  bayNumber: number;
  trainId?: string;
  maintenanceType: 'Inspection' | 'Repair' | 'Overhaul';
  requiredTechnicians: number;
  status: 'Available' | 'Booked' | 'In Progress' | 'Completed';
}

export interface DepotLayout {
  bayId: string;
  bayNumber: number;
  position: { x: number; y: number };
  capacity: number;
  type: 'Service' | 'Maintenance' | 'Cleaning' | 'Storage';
  adjacentBays: string[];
  shuntingDistance: { [key: string]: number };
}

export interface ManualOverride {
  overrideId: string;
  trainId: string;
  supervisorId: string;
  reason: string;
  action: 'Force Include' | 'Exclude' | 'Priority Change';
  timestamp: string;
  expiryTime: string;
  approved: boolean;
}