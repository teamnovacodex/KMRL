import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { enterpriseTrains } from '../data/enterpriseMockData';

const Maintenance: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTrain, setSelectedTrain] = useState<string>('');

  const maintenanceData = enterpriseTrains.map(train => ({
    ...train,
    maintenanceType: train.recommendation === 'Maintenance' ? 'Scheduled' : 
                    train.criticalJobCards > 0 ? 'Critical' : 'Preventive',
    estimatedDuration: Math.floor(Math.random() * 8) + 2, // 2-10 hours
    techniciansRequired: Math.floor(Math.random() * 3) + 1, // 1-4 technicians
    partsRequired: train.criticalJobCards > 0 ? ['Brake Pads', 'Air Filter'] : 
                  train.recommendation === 'Maintenance' ? ['Oil Change', 'Inspection'] : []
  }));

  const filteredTrains = filterStatus === 'all' ? maintenanceData : 
    maintenanceData.filter(train => 
      filterStatus === 'critical' ? train.criticalJobCards > 0 :
      filterStatus === 'scheduled' ? train.recommendation === 'Maintenance' :
      filterStatus === 'completed' ? train.jobCardStatus === 'Closed' : true
    );

  const maintenanceStats = {
    critical: maintenanceData.filter(t => t.criticalJobCards > 0).length,
    scheduled: maintenanceData.filter(t => t.recommendation === 'Maintenance').length,
    inProgress: maintenanceData.filter(t => t.jobCardStatus === 'Open').length,
    completed: maintenanceData.filter(t => t.jobCardStatus === 'Closed').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 p-3 rounded-xl">
                  <Wrench className="h-8 w-8 text-white" />
                </div>
                <span>Maintenance Management</span>
              </h1>
              <p className="text-gray-600 mt-2">Comprehensive maintenance scheduling and tracking</p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Maintenance</option>
                <option value="critical">Critical Issues</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
              </select>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Issues</p>
                <p className="text-3xl font-bold text-red-600">{maintenanceStats.critical}</p>
                <p className="text-xs text-red-500">Immediate attention</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-3xl font-bold text-orange-600">{maintenanceStats.scheduled}</p>
                <p className="text-xs text-orange-500">Planned maintenance</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{maintenanceStats.inProgress}</p>
                <p className="text-xs text-blue-500">Currently working</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">{maintenanceStats.completed}</p>
                <p className="text-xs text-green-500">Ready for service</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Maintenance Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Maintenance Schedule</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Train ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Technicians
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Maintenance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTrains.map((train) => (
                  <tr key={train.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {train.trainNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        train.maintenanceType === 'Critical' ? 'bg-red-100 text-red-800' :
                        train.maintenanceType === 'Scheduled' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {train.maintenanceType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        train.criticalJobCards > 0 ? 'bg-red-100 text-red-800' :
                        train.recommendation === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {train.criticalJobCards > 0 ? 'High' : 
                         train.recommendation === 'Maintenance' ? 'Medium' : 'Low'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {train.estimatedDuration}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {train.techniciansRequired}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        train.jobCardStatus === 'Open' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {train.jobCardStatus === 'Open' ? 'In Progress' : 'Completed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(train.nextScheduledMaintenance).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Maintenance;