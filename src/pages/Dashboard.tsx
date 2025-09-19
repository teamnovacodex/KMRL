import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Train, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Settings,
  RefreshCw,
  Activity,
  BarChart3
} from 'lucide-react';
import { consistentTrains, fleetStats } from '../data/consistentTrainData';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'positions', label: 'Train Positions', icon: Train },
    { id: 'schedule', label: 'Schedule', icon: Clock },
    { id: 'operations', label: 'Operations', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-yellow-700 text-sm font-medium">Standby Trains</div>
          <div className="text-3xl font-bold text-yellow-800">{fleetStats.standby}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-blue-700 text-sm font-medium">Induction Trains</div>
          <div className="text-3xl font-bold text-blue-800">{fleetStats.service}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-green-700 text-sm font-medium">Scheduled Trains</div>
          <div className="text-3xl font-bold text-green-800">{fleetStats.service}</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-gray-700 text-sm font-medium">Total Trains</div>
          <div className="text-3xl font-bold text-gray-800">{fleetStats.total}</div>
        </div>
      </div>

      {/* Train Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Standby Trains */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">Standby Trains</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 border border-yellow-100">
              <div className="font-medium text-gray-900">VAAW</div>
              <div className="text-sm text-gray-600">ID: 031</div>
              <div className="text-sm text-gray-600">Position: Aluva</div>
              <div className="text-sm text-gray-600">From: Aluva</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-yellow-100">
              <div className="font-medium text-gray-900">KAVERI</div>
              <div className="text-sm text-gray-600">ID: 033</div>
              <div className="text-sm text-gray-600">Position: Tripunithura</div>
              <div className="text-sm text-gray-600">From: Tripunithura</div>
            </div>
          </div>
        </div>

        {/* Induction Trains */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Induction Trains</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <div className="font-medium text-gray-900">MAARUT</div>
              <div className="text-sm text-gray-600">ID: 041</div>
              <div className="text-sm text-gray-600">Position: ETU</div>
              <div className="text-sm text-gray-600">From: Muttom</div>
              <div className="text-sm text-blue-600">Induction: 09:00</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <div className="font-medium text-gray-900">SABARMATHI</div>
              <div className="text-sm text-gray-600">ID: 043</div>
              <div className="text-sm text-gray-600">Position: ERL</div>
              <div className="text-sm text-gray-600">From: Aluva</div>
              <div className="text-sm text-blue-600">Induction: 09:15</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <div className="font-medium text-gray-900">GODHAVARI</div>
              <div className="text-sm text-gray-600">ID: 045</div>
              <div className="text-sm text-gray-600">Position: UBL</div>
              <div className="text-sm text-gray-600">From: Muttom</div>
              <div className="text-sm text-blue-600">Induction: 09:30</div>
            </div>
          </div>
        </div>

        {/* Scheduled Trains */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-4">Scheduled Trains</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 border border-green-100">
              <div className="font-medium text-gray-900">SHIRIYA</div>
              <div className="text-sm text-gray-600">ID: 035</div>
              <div className="text-sm text-gray-600">Position: SBL4</div>
              <div className="text-sm text-gray-600">From: Muttom</div>
              <div className="text-sm text-green-600">Departure: 08:45</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-green-100">
              <div className="font-medium text-gray-900">PAMPA</div>
              <div className="text-sm text-gray-600">ID: 037</div>
              <div className="text-sm text-gray-600">Position: SBL6</div>
              <div className="text-sm text-gray-600">From: Aluva</div>
              <div className="text-sm text-green-600">Departure: 09:00</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-green-100">
              <div className="font-medium text-gray-900">NARMADA</div>
              <div className="text-sm text-gray-600">ID: 039</div>
              <div className="text-sm text-gray-600">Position: SBL7</div>
              <div className="text-sm text-gray-600">From: Muttom</div>
              <div className="text-sm text-green-600">Departure: 09:15</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrainPositions = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Train Position Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.NO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Train Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Train ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From Station</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fitness Expiry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Day Start</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {consistentTrains.slice(0, 15).map((train, index) => (
                <tr key={train.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{train.trainName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{train.trainId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{train.currentBay.type}{train.currentBay.number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{train.fromStation}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {train.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2025-09-21</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{train.fromStation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Schedule Timeline</h3>
        <div className="space-y-6">
          {consistentTrains.slice(0, 3).map((train, index) => (
            <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h4 className="text-xl font-semibold text-gray-900">{consistentTrains[index]?.trainName}</h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {consistentTrains[index]?.status}
                  </span>
                </div>
                <div className="text-right text-sm text-gray-500">
                  ID: {consistentTrains[index]?.trainId}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Position:</span>
                  <div className="font-medium text-gray-900">{consistentTrains[index]?.currentBay.type}{consistentTrains[index]?.currentBay.number}</div>
                </div>
                <div>
                  <span className="text-gray-600">From Station:</span>
                  <div className="font-medium text-blue-600">{consistentTrains[index]?.fromStation}</div>
                </div>
                <div>
                  <span className="text-gray-600">Induction Time:</span>
                  <div className="font-medium text-blue-600">{consistentTrains[index]?.scheduleTiming}</div>
                </div>
                <div>
                  <span className="text-gray-600">Scheduled Departure:</span>
                  <div className="font-medium text-green-600">{consistentTrains[index]?.scheduleTiming}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOperations = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Kochi Metro Operations Overview</h3>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-blue-700 text-sm font-medium">Total Fleet</div>
            <div className="text-3xl font-bold text-blue-800">{fleetStats.total}</div>
            <div className="text-xs text-blue-600">Trains</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-green-700 text-sm font-medium">Running Today</div>
            <div className="text-3xl font-bold text-green-800">{fleetStats.service}</div>
            <div className="text-xs text-green-600">Weekday Service</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <div className="text-yellow-700 text-sm font-medium">Standby Trains</div>
            <div className="text-3xl font-bold text-yellow-800">{fleetStats.standby}</div>
            <div className="text-xs text-yellow-600">Ready for deployment</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="text-red-700 text-sm font-medium">Maintenance</div>
            <div className="text-3xl font-bold text-red-800">{fleetStats.maintenance}</div>
            <div className="text-xs text-red-600">Under maintenance</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <div className="text-purple-700 text-sm font-medium">Service Status</div>
            <div className="text-2xl font-bold text-purple-800">Active</div>
            <div className="text-xs text-purple-600">05:00 - 22:00</div>
          </div>
        </div>

        {/* Operations Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4">Fleet Distribution</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Weekday Operations</span>
                <span className="font-medium text-gray-900">{fleetStats.service} trains</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weekend Operations</span>
                <span className="font-medium text-gray-900">12 trains</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Standby Locations</span>
                <span className="font-medium text-blue-600">Aluva, Tripunithura</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Depot Location</span>
                <span className="font-medium text-blue-600">Muttom Depot</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4">Revenue Service Hours</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Weekday Service</span>
                <span className="font-medium text-gray-900">05:00 - 22:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Holiday Service</span>
                <span className="font-medium text-gray-900">08:00 - 22:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Status</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Type</span>
                <span className="font-medium text-blue-600">Weekday Schedule</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Flow Logic */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h4 className="font-medium text-blue-900 mb-4">Operational Flow Logic</h4>
          <div className="bg-blue-100 rounded-lg p-4 mb-4">
            <h5 className="font-medium text-blue-900 mb-3">Daily Operations Cycle</h5>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                15 trains scheduled for weekday service
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                12 trains for weekend service
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                2 standby trains at terminals
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                8 trains under maintenance
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <h5 className="font-medium text-green-900 mb-3">Sample Active Trains</h5>
              <div className="space-y-2 text-sm">
                {consistentTrains.slice(0, 5).map((train, index) => (
                  <div key={index} className="text-green-800">
                    • {train.trainName} ({train.trainNumber}): {train.currentBay.type}{train.currentBay.number} → {train.fromStation}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <h5 className="font-medium text-purple-900 mb-3">Induction Schedule</h5>
              <div className="space-y-2 text-sm">
                <div className="text-purple-800">• 05:00 AM: First Train</div>
                <div className="text-purple-800">• 05:55 AM: Last Train</div>
                <div className="text-purple-800">• 05:00 AM: Service Start</div>
                <div className="text-purple-800">• 22:00 PM: Service End</div>
                <div className="text-purple-800">• 06:00 AM: Weekend Start</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-3">Fleet Distribution</h5>
              <div className="space-y-2 text-sm">
                <div className="text-gray-800">• Total Fleet: {fleetStats.total} trains</div>
                <div className="text-gray-800">• Service Ready: {fleetStats.service} trains</div>
                <div className="text-gray-800">• Standby: {fleetStats.standby} trains</div>
                <div className="text-gray-800">• Maintenance: {fleetStats.maintenance} trains</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Kochi Metro Induction & Scheduling</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Current Time: {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </div>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                  autoRefresh 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto Refresh
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'positions' && renderTrainPositions()}
          {activeTab === 'schedule' && renderSchedule()}
          {activeTab === 'operations' && renderOperations()}
        </motion.div>
      </div>

      {/* Automated Systems Panel */}
      <div className="fixed bottom-4 right-4">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900">Automated Systems</span>
            </div>
            <div className="text-xs text-gray-500">AI-Powered</div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                <span className="font-medium">Fitness Validation</span>
              </div>
              <div className="text-xs text-gray-600">
                {fleetStats.validFitness} Valid / {fleetStats.total} Total
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Clock className="h-4 w-4 text-blue-600 mr-1" />
                <span className="font-medium">Induction Scheduling</span>
              </div>
              <div className="text-xs text-gray-600">
                {fleetStats.service} Scheduled
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;