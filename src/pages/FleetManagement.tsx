import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Train, 
  MapPin, 
  Activity, 
  Fuel, 
  Users,
  Clock,
  AlertCircle
} from 'lucide-react';
import { metroTrains } from '../data/metroMockData';

const FleetManagement: React.FC = () => {
  const [selectedTrain, setSelectedTrain] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const selectedTrainData = selectedTrain ? 
    metroTrains.find(t => t.trainNumber === selectedTrain) : null;

  const fleetStats = {
    totalTrains: metroTrains.length,
    activeTrains: metroTrains.filter(t => t.recommendation === 'Service').length,
    standbyTrains: metroTrains.filter(t => t.recommendation === 'Standby').length,
    maintenanceTrains: metroTrains.filter(t => t.recommendation === 'Maintenance').length,
    avgHealthScore: Math.round(metroTrains.reduce((sum, t) => sum + t.healthScore, 0) / metroTrains.length),
    totalMileage: metroTrains.reduce((sum, t) => sum + t.totalMileage, 0)
  };

  const getStatusColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Service': return 'bg-green-500';
      case 'Standby': return 'bg-yellow-500';
      case 'Maintenance': return 'bg-red-500';
      default: return 'bg-purple-500';
    }
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
                <div className="bg-gradient-to-r from-green-600 to-blue-600 p-3 rounded-xl">
                  <Train className="h-8 w-8 text-white" />
                </div>
                <span>Fleet Management</span>
              </h1>
              <p className="text-gray-600 mt-2">Real-time fleet monitoring and depot visualization</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-white rounded-lg border border-gray-300">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                    viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Grid View
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                    viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  List View
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fleet Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-6 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{fleetStats.totalTrains}</div>
            <div className="text-sm text-gray-600">Total Trains</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{fleetStats.activeTrains}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{fleetStats.standbyTrains}</div>
            <div className="text-sm text-gray-600">Standby</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{fleetStats.maintenanceTrains}</div>
            <div className="text-sm text-gray-600">Maintenance</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{fleetStats.avgHealthScore}%</div>
            <div className="text-sm text-gray-600">Avg Health</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{(fleetStats.totalMileage / 1000).toFixed(0)}K</div>
            <div className="text-sm text-gray-600">Total Miles</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Fleet Overview */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Fleet Overview</h3>
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-5 gap-4">
                {metroTrains.map((train) => (
                  <motion.div
                    key={train.id}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedTrain(train.trainNumber)}
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedTrain === train.trainNumber 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-8 h-8 mx-auto mb-2 rounded-full ${getStatusColor(train.recommendation)}`}></div>
                      <div className="text-sm font-medium text-gray-900">{train.trainNumber}</div>
                      <div className="text-xs text-gray-500">Bay {train.depotBay}</div>
                      <div className="text-xs text-gray-500">{train.healthScore}%</div>
                    </div>
                    {train.criticalJobCards > 0 && (
                      <div className="absolute -top-1 -right-1">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {metroTrains.map((train) => (
                  <div
                    key={train.id}
                    onClick={() => setSelectedTrain(train.trainNumber)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                      selectedTrain === train.trainNumber 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(train.recommendation)}`}></div>
                      <div className="font-medium text-gray-900">{train.trainNumber}</div>
                      <div className="text-sm text-gray-500">Bay {train.depotBay}</div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{train.healthScore}%</span>
                      <span>{train.recommendation}</span>
                      {train.criticalJobCards > 0 && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Train Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Train Details</h3>
            
            {selectedTrainData ? (
              <div className="space-y-4">
                <div className="text-center pb-4 border-b border-gray-200">
                  <div className="text-2xl font-bold text-gray-900">{selectedTrainData.trainNumber}</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedTrainData.recommendation === 'Service' ? 'bg-green-100 text-green-800' :
                    selectedTrainData.recommendation === 'Standby' ? 'bg-yellow-100 text-yellow-800' :
                    selectedTrainData.recommendation === 'Maintenance' ? 'bg-red-100 text-red-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {selectedTrainData.recommendation}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Health Score</span>
                    </div>
                    <span className="font-medium">{selectedTrainData.healthScore}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Depot Bay</span>
                    </div>
                    <span className="font-medium">{selectedTrainData.depotBay}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Fuel className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Total Mileage</span>
                    </div>
                    <span className="font-medium">{selectedTrainData.totalMileage.toLocaleString()} km</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Utilization</span>
                    </div>
                    <span className="font-medium">{selectedTrainData.utilizationRate}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Fitness Status</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedTrainData.fitnessStatus === 'Valid' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedTrainData.fitnessStatus}
                    </span>
                  </div>

                  {selectedTrainData.criticalJobCards > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-800">
                          {selectedTrainData.criticalJobCards} Critical Job Cards
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">Next Maintenance</div>
                    <div className="font-medium">
                      {new Date(selectedTrainData.nextScheduledMaintenance).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Train className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a train to view details</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FleetManagement;