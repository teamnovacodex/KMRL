import { DataSource, MaximoJobCard, IoTSensorData, BrandingContract, DepotSchedule, ManualOverride } from '../types/dataIntegration';

class DataIntegrationService {
  private dataSources: DataSource[] = [
    {
      id: 'maximo',
      name: 'IBM Maximo',
      type: 'API',
      status: 'Connected',
      lastSync: new Date().toISOString(),
      recordCount: 156
    },
    {
      id: 'iot-sensors',
      name: 'IoT Fitness Sensors',
      type: 'IoT',
      status: 'Connected',
      lastSync: new Date().toISOString(),
      recordCount: 8
    },
    {
      id: 'branding-db',
      name: 'Branding Database',
      type: 'Database',
      status: 'Connected',
      lastSync: new Date().toISOString(),
      recordCount: 23
    },
    {
      id: 'depot-schedule',
      name: 'Depot Schedule System',
      type: 'API',
      status: 'Syncing',
      lastSync: new Date(Date.now() - 300000).toISOString(),
      recordCount: 45
    },
    {
      id: 'manual-overrides',
      name: 'Supervisor Overrides',
      type: 'Manual',
      status: 'Connected',
      lastSync: new Date().toISOString(),
      recordCount: 3
    }
  ];

  async getDataSources(): Promise<DataSource[]> {
    return this.dataSources;
  }

  async syncDataSource(sourceId: string): Promise<void> {
    const source = this.dataSources.find(s => s.id === sourceId);
    if (source) {
      source.status = 'Syncing';
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      source.status = 'Connected';
      source.lastSync = new Date().toISOString();
    }
  }

  async getMaximoJobCards(): Promise<MaximoJobCard[]> {
    // Simulate API call to IBM Maximo
    return [
      {
        jobCardId: 'JC-2024-001',
        trainId: '3',
        workOrderType: 'Corrective',
        status: 'Open',
        priority: 'High',
        estimatedHours: 8,
        assignedTechnician: 'Tech-001',
        createdDate: '2024-12-20',
        dueDate: '2024-12-22'
      },
      {
        jobCardId: 'JC-2024-002',
        trainId: '5',
        workOrderType: 'Preventive',
        status: 'Open',
        priority: 'Medium',
        estimatedHours: 4,
        assignedTechnician: 'Tech-002',
        createdDate: '2024-12-21',
        dueDate: '2024-12-25'
      }
    ];
  }

  async getIoTSensorData(): Promise<IoTSensorData[]> {
    // Simulate IoT sensor data
    const trains = ['1', '2', '3', '4', '5', '6', '7', '8'];
    return trains.map(trainId => ({
      trainId,
      timestamp: new Date().toISOString(),
      mileage: Math.floor(Math.random() * 100000) + 20000,
      engineHealth: Math.floor(Math.random() * 30) + 70,
      brakeSystemHealth: Math.floor(Math.random() * 25) + 75,
      doorSystemHealth: Math.floor(Math.random() * 20) + 80,
      airConditioningHealth: Math.floor(Math.random() * 35) + 65,
      batteryLevel: Math.floor(Math.random() * 40) + 60,
      vibrationLevel: Math.random() * 5,
      temperature: Math.random() * 10 + 20
    }));
  }

  async getBrandingContracts(): Promise<BrandingContract[]> {
    return [
      {
        contractId: 'BC-2024-001',
        trainId: '2',
        advertiser: 'Coca-Cola',
        campaignName: 'Holiday Special',
        startDate: '2024-12-01',
        endDate: '2024-12-31',
        requiredExposureHours: 200,
        currentExposureHours: 150,
        revenue: 500000,
        status: 'Active'
      },
      {
        contractId: 'BC-2024-002',
        trainId: '5',
        advertiser: 'Samsung',
        campaignName: 'New Year Launch',
        startDate: '2024-12-15',
        endDate: '2025-01-15',
        requiredExposureHours: 300,
        currentExposureHours: 45,
        revenue: 750000,
        status: 'Active'
      }
    ];
  }

  async getManualOverrides(): Promise<ManualOverride[]> {
    return [
      {
        overrideId: 'MO-2024-001',
        trainId: '1',
        supervisorId: 'SUP-001',
        reason: 'VIP service requirement',
        action: 'Force Include',
        timestamp: new Date().toISOString(),
        expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        approved: true
      }
    ];
  }

  async performETL(): Promise<{ success: boolean; recordsProcessed: number; errors: string[] }> {
    // Simulate ETL process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      success: true,
      recordsProcessed: 235,
      errors: []
    };
  }
}

export const dataIntegrationService = new DataIntegrationService();