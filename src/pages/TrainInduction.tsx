import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Train, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  MapPin,
  Activity,
  Target,
  Zap,
  RefreshCw
} from 'lucide-react';
import { trainInductions, todayInductionSchedule, depotOperations, inductionTimeSlots, servicePatterns } from '../data/inductionData';

const TrainInduction: React.FC = () => {
  const [activeTab, setActiveTab] = useState('induction-plan');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTrain, setSelectedTrain] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: 'induction-plan', label: 'Induction Planning', icon: Target },
    { id: 'schedule', label: 'Schedule Management', icon: Calendar },
    { id: 'depot-status', label: 'Depot Status', icon: MapPin },
    { id: 'ai-optimization', label: 'AI Optimization', icon: Zap }
  ];

  const inductionStats = {
    eligible: trainInductions.filter(t => t.inductionEligible).length,
    scheduled: todayInductionSchedule.inductionSlots.length,
    standby: todayInductionSchedule.standbyList.length,
    maintenance: todayInductionSchedule.maintenanceList.length,
    validFitness: trainInductions.filter(t => t.fitnessStatus === 'Valid').length,
    invalidFitness: trainInductions.filter(t => t.fitnessStatus === 'Invalid').length
  };

  const renderInductionPlan = () => (
    <div className="space-y-6">
      {/* Induction Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{inductionStats.eligible}</div>
          <div className="text-sm text-green-700">Induction Eligible</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{inductionStats.scheduled}</div>
          <div className="text-sm text-blue-700">Scheduled Today</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{inductionStats.standby}</div>
          <div className="text-sm text-yellow-700">Standby Ready</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{inductionStats.maintenance}</div>
          <div className="text-sm text-red-700">Under Maintenance</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{inductionStats.validFitness}</div>
          <div className="text-sm text-emerald-700">Valid Fitness</div>
        </div>
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-rose-600">{inductionStats.invalidFitness}</div>
          <div className="text-sm text-rose-700">Invalid Fitness</div>
        </div>
      </div>

      {/* Induction Planning Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Tomorrow's Induction Plan</h3>
          <p className="text-sm text-gray-600">AI-optimized train induction schedule for {new Date(Date.now() + 24*60*60*1000).toLocaleDateString()}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slot</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Train Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Train ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Bay</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fitness Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Induction Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departure Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From Station</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">AI Decision</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trainInductions.slice(0, 18).map((train, index) => (
                <tr 
                  key={train.id} 
                  className={`hover:bg-gray-50 cursor-pointer ${selectedTrain === train.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedTrain(train.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {train.trainName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {train.trainNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      train.currentBay.type === 'SBL' ? 'bg-green-100 text-green-800' :
                      train.currentBay.type === 'IBL' ? 'bg-yellow-100 text-yellow-800' :
                      train.currentBay.type === 'HIBL' ? 'bg-red-100 text-red-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {train.currentBay.type}{train.currentBay.number}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {train.fitnessStatus === 'Valid' ? 
                        <CheckCircle className="h-4 w-4 text-green-600" /> : 
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      }
                      <span className={`text-sm ${train.fitnessStatus === 'Valid' ? 'text-green-700' : 'text-red-700'}`}>
                        {train.fitnessStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {train.inductionTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {train.scheduledDeparture}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    {train.fromStation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      train.aiRecommendation.decision === 'Induct' ? 'bg-green-100 text-green-800 border border-green-200' :
                      train.aiRecommendation.decision === 'Standby' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                      'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {train.aiRecommendation.decision}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderScheduleManagement = () => (
    <div className="space-y-6">
      {/* Schedule Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Service Pattern</h3>
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Service Type:</span>
              <span className="font-medium text-gray-900">Weekday</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Required Trains:</span>
              <span className="font-medium text-blue-600">15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service Hours:</span>
              <span className="font-medium text-green-600">05:00 - 22:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Frequency:</span>
              <span className="font-medium text-gray-900">6-8 minutes</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Induction Window</h3>
            <Clock className="h-6 w-6 text-green-600" />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">First Induction:</span>
              <span className="font-medium text-blue-600">04:30</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Induction:</span>
              <span className="font-medium text-blue-600">08:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service Start:</span>
              <span className="font-medium text-green-600">05:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Slots:</span>
              <span className="font-medium text-gray-900">15</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Depot Status</h3>
            <MapPin className="h-6 w-6 text-purple-600" />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">SBL Bays:</span>
              <span className="font-medium text-green-600">{depotOperations.currentOccupancy.sbl}/18</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">IBL Bays:</span>
              <span className="font-medium text-yellow-600">{depotOperations.currentOccupancy.ibl}/4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">HIBL Bays:</span>
              <span className="font-medium text-red-600">{depotOperations.currentOccupancy.hibl}/3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shunting:</span>
              <span className="font-medium text-blue-600">{depotOperations.shuntingOperations.inProgress} active</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">AI Status</h3>
            <Activity className="h-6 w-6 text-blue-600" />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Optimization:</span>
              <span className="font-medium text-green-600">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Confidence:</span>
              <span className="font-medium text-blue-600">94.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Run:</span>
              <span className="font-medium text-gray-900">10:45 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Next Run:</span>
              <span className="font-medium text-blue-600">10:50 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Induction Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Induction Timeline - Tomorrow</h3>
        <div className="space-y-4">
          {todayInductionSchedule.inductionSlots.slice(0, 8).map((slot, index) => (
            <div key={slot.slotId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                  {slot.priority}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{slot.trainName}</div>
                  <div className="text-sm text-gray-600">ID: {slot.trainId}</div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-8 text-sm">
                <div className="text-center">
                  <div className="text-gray-600">Induction</div>
                  <div className="font-medium text-blue-600">{slot.inductionTime}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600">Departure</div>
                  <div className="font-medium text-green-600">{slot.departureTime}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600">From</div>
                  <div className="font-medium text-gray-900">{slot.fromStation}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600">Passengers</div>
                  <div className="font-medium text-purple-600">{slot.estimatedPassengers.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDepotStatus = () => (
    <div className="space-y-6">
      {/* Depot Bay Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">SBL Bays (Service Ready)</h3>
          <div className="space-y-3">
            {trainInductions.filter(t => t.currentBay.type === 'SBL').slice(0, 6).map((train) => (
              <div key={train.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{train.trainName}</div>
                  <div className="text-sm text-gray-600">Bay {train.currentBay.number}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-600">Ready</div>
                  <div className="text-xs text-gray-500">{train.inductionTime}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4">IBL Bays (Inspection)</h3>
          <div className="space-y-3">
            {trainInductions.filter(t => t.currentBay.type === 'IBL').map((train) => (
              <div key={train.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{train.trainName}</div>
                  <div className="text-sm text-gray-600">Bay {train.currentBay.number}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-yellow-600">Inspection</div>
                  <div className="text-xs text-gray-500">{train.maintenanceWindow.estimatedDuration}h</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4">HIBL Bays (Heavy Maintenance)</h3>
          <div className="space-y-3">
            {trainInductions.filter(t => t.currentBay.type === 'HIBL').map((train) => (
              <div key={train.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{train.trainName}</div>
                  <div className="text-sm text-gray-600">Bay {train.currentBay.number}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-red-600">Heavy Maint.</div>
                  <div className="text-xs text-gray-500">{train.maintenanceWindow.estimatedDuration}h</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAIOptimization = () => (
    <div className="space-y-6">
      {/* AI Optimization Results */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Optimization Results</h3>
            <p className="text-sm text-gray-600">Automated induction planning for optimal performance</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">94.2%</div>
            <div className="text-sm text-gray-600">Optimization Score</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-3">Recommended for Induction</h4>
            <div className="space-y-2">
              {trainInductions.filter(t => t.aiRecommendation.decision === 'Induct').slice(0, 5).map((train) => (
                <div key={train.id} className="flex items-center justify-between">
                  <span className="text-sm text-green-800">{train.trainName}</span>
                  <span className="text-xs text-green-600">{train.aiRecommendation.confidence}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-3">Standby Recommendations</h4>
            <div className="space-y-2">
              {trainInductions.filter(t => t.operationalStatus === 'Standby').map((train) => (
                <div key={train.id} className="flex items-center justify-between">
                  <span className="text-sm text-yellow-800">{train.trainName}</span>
                  <span className="text-xs text-yellow-600">{train.currentBay.location.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <h4 className="font-medium text-red-900 mb-3">Maintenance Required</h4>
            <div className="space-y-2">
              {trainInductions.filter(t => t.aiRecommendation.decision === 'Maintenance').slice(0, 5).map((train) => (
                <div key={train.id} className="flex items-center justify-between">
                  <span className="text-sm text-red-800">{train.trainName}</span>
                  <span className="text-xs text-red-600">{train.maintenanceWindow.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Decision Reasoning */}
      {selectedTrain && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-medium text-blue-900 mb-4">AI Decision Reasoning</h4>
          {(() => {
            const train = trainInductions.find(t => t.id === selectedTrain);
            if (!train) return null;
            
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-lg font-semibold text-blue-900">{train.trainName} ({train.trainNumber})</h5>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    train.aiRecommendation.decision === 'Induct' ? 'bg-green-100 text-green-800' :
                    train.aiRecommendation.decision === 'Standby' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {train.aiRecommendation.decision}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h6 className="font-medium text-blue-800 mb-2">AI Reasoning:</h6>
                    <ul className="space-y-1 text-sm text-blue-700">
                      {train.aiRecommendation.reasoning.map((reason, index) => (
                        <li key={index}>• {reason}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h6 className="font-medium text-blue-800 mb-2">Risk Factors:</h6>
                    {train.aiRecommendation.riskFactors.length > 0 ? (
                      <ul className="space-y-1 text-sm text-blue-700">
                        {train.aiRecommendation.riskFactors.map((risk, index) => (
                          <li key={index}>• {risk}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-green-700">No risk factors identified</div>
                    )}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Current Bay:</span>
                      <div className="font-medium text-gray-900">{train.currentBay.type}{train.currentBay.number}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Induction Time:</span>
                      <div className="font-medium text-blue-600">{train.inductionTime}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Departure:</span>
                      <div className="font-medium text-green-600">{train.scheduledDeparture}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Confidence:</span>
                      <div className="font-medium text-purple-600">{train.aiRecommendation.confidence}%</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">KMRL Train Induction & Scheduling Expert System</h1>
              <p className="text-sm text-gray-600">AI-Driven Automated Planning & Optimization</p>
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
          {activeTab === 'induction-plan' && renderInductionPlan()}
          {activeTab === 'schedule' && renderScheduleManagement()}
          {activeTab === 'depot-status' && renderDepotStatus()}
          {activeTab === 'ai-optimization' && renderAIOptimization()}
        </motion.div>
      </div>

      {/* Expert System Status */}
      <div className="fixed bottom-4 right-4">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900">Expert System</span>
            </div>
            <div className="text-xs text-green-600 font-medium">ACTIVE</div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Induction Planning:</span>
              <span className="text-green-600 font-medium">Automated</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Schedule Optimization:</span>
              <span className="text-blue-600 font-medium">AI-Driven</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fitness Validation:</span>
              <span className="text-green-600 font-medium">Real-time</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Next Update:</span>
              <span className="text-gray-900 font-medium">30 sec</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainInduction;