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
  RefreshCw,
  Bot,
  Brain
} from 'lucide-react';
import { trainInductions, todayInductionSchedule, depotOperations, inductionTimeSlots, servicePatterns } from '../data/inductionData';
import { tomorrowInductionPlan, controlCenterData } from '../data/controlCenterData';
import LiveTrackingDisplay from '../components/LiveTrackingDisplay';
import AISchedulingBot from '../components/AISchedulingBot';

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
    { id: 'induction-plan', label: 'Tomorrow\'s Plan', icon: Calendar },
    { id: 'live-tracking', label: 'Live Tracking', icon: Activity },
    { id: 'depot-control', label: 'Depot Control', icon: MapPin },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Brain }
  ];

  const dailyStats = {
    tomorrowPlan: tomorrowInductionPlan.totalTrainsRequired,
    standbyReady: tomorrowInductionPlan.standbyTrains.length,
    maintenance: tomorrowInductionPlan.maintenanceSchedule.length,
    currentActive: controlCenterData.activeTrains,
    systemStatus: controlCenterData.operationalStatus,
    confidence: aiSchedulingBot.confidence
  };

  const renderTomorrowPlan = () => (
    <div className="space-y-6">
      {/* Tomorrow's Plan Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Tomorrow's Service Plan</h2>
            <p className="text-blue-100">
              📅 {tomorrowInductionPlan.planDate} | Generated once daily at 23:00
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{tomorrowInductionPlan.totalTrainsRequired}</div>
            <div className="text-blue-100">Trains Scheduled</div>
          </div>
        </div>
      </div>

      {/* Daily Plan Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{dailyStats.tomorrowPlan}</div>
          <div className="text-sm text-green-700">Revenue Service</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{dailyStats.standbyReady}</div>
          <div className="text-sm text-yellow-700">Standby Ready</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{dailyStats.maintenance}</div>
          <div className="text-sm text-red-700">Maintenance</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{dailyStats.currentActive}</div>
          <div className="text-sm text-blue-700">Currently Active</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{dailyStats.systemStatus}</div>
          <div className="text-sm text-purple-700">System Status</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{dailyStats.confidence}%</div>
          <div className="text-sm text-emerald-700">AI Confidence</div>
        </div>
      </div>

      {/* Tomorrow's Induction Schedule */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Tomorrow's Induction Schedule</h3>
              <p className="text-sm text-gray-600">
                🤖 AI-generated daily plan | Valid for {tomorrowInductionPlan.planDate} | Generated once at 23:00
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-600 font-medium">APPROVED</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slot</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Train Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bay Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From Terminal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Induction Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departure Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue Target</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tomorrowInductionPlan.inductionSlots.map((slot, index) => (
                <tr 
                  key={slot.trainId} 
                  className={`hover:bg-gray-50 cursor-pointer ${selectedTrain === slot.trainId ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedTrain(slot.trainId)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {slot.slotNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {slot.trainName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {slot.bayPosition}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      slot.fromTerminal === 'ALUVA' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {slot.fromTerminal}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {slot.inductionTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {slot.departureTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {slot.assignedRoute}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      ₹{(slot.revenueTarget / 1000).toFixed(0)}K
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Details */}
      {selectedTrain && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="font-medium text-green-900 mb-4">Train Schedule Details</h4>
          {(() => {
            const slot = tomorrowInductionPlan.inductionSlots.find(s => s.trainId === selectedTrain);
            if (!slot) return null;
            
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-lg font-semibold text-green-900">{slot.trainName} ({slot.trainId})</h5>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    SCHEDULED
                  </span>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Bay Position:</span>
                      <div className="font-medium text-gray-900">{slot.bayPosition}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Induction Time:</span>
                      <div className="font-medium text-blue-600">{slot.inductionTime}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Departure:</span>
                      <div className="font-medium text-green-600">{slot.departureTime}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Passengers:</span>
                      <div className="font-medium text-purple-600">{slot.estimatedPassengers.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Revenue:</span>
                      <div className="font-medium text-green-600">₹{(slot.revenueTarget / 1000).toFixed(0)}K</div>
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

  const renderLiveTracking = () => (
    <div className="space-y-6">
      <LiveTrackingDisplay height={600} />
    </div>
  );

  const renderDepotControl = () => (
    <div className="space-y-6">
      {/* Real Depot Overview Board */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">DEPOT OVERVIEW - 16/09/2025</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600 font-medium">DEPOT: DC ENERGIZED</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600 font-medium">TT: DC ENERGIZED</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* MILTS Data */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4">MILTS</h4>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="text-center">
                <div className="font-bold text-gray-900">12</div>
                <div className="text-gray-600">17</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900">17</div>
                <div className="text-gray-600">14</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900">20</div>
                <div className="text-gray-600">05</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900">21</div>
                <div className="text-gray-600">24</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900">1</div>
                <div className="text-gray-600">11</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900">05</div>
                <div className="text-gray-600">1</div>
              </div>
            </div>
          </div>

          {/* Stabling Instructions */}
          <div className="bg-red-50 rounded-lg p-4">
            <h4 className="font-medium text-red-900 mb-4">NO STABLING</h4>
            <div className="space-y-2 text-sm">
              <div className="text-red-800 font-medium">SBL 04, 05</div>
              <div className="text-gray-600 mt-3">
                <div>ROAD SIDE GATE: <span className="font-medium">1 OPEN</span></div>
                <div>TT & WSP SIDE GATE: <span className="font-medium">5 OPEN</span></div>
                <div>CLOSE: <span className="font-medium">4</span></div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-4">DRILLS: SEP 2025</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border border-gray-400 rounded"></div>
                <span className="text-gray-600">ETS</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border border-gray-400 rounded"></div>
                <span className="text-gray-600">SDD</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border border-gray-400 rounded"></div>
                <span className="text-gray-600">ESP</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border border-gray-400 rounded"></div>
                <span className="text-gray-600">MDD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real Bay Layout */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Bay Layout - Real Time Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SBL Bays */}
          <div>
            <h4 className="font-medium text-green-900 mb-4">SBL Bays (Service Bays Light)</h4>
            <div className="space-y-2">
              {[
                { bay: 'SBL1', openEnd: '05', bufferedEnd: '' },
                { bay: 'SBL2', openEnd: '', bufferedEnd: '' },
                { bay: 'SBL3', openEnd: '', bufferedEnd: '25' },
                { bay: 'SBL4', openEnd: '', bufferedEnd: '' },
                { bay: 'SBL5', openEnd: '', bufferedEnd: '' },
                { bay: 'SBL6', openEnd: '', bufferedEnd: '05' },
                { bay: 'SBL7', openEnd: '2', bufferedEnd: '' },
                { bay: 'SBL8', openEnd: '', bufferedEnd: '15' },
                { bay: 'SBL9', openEnd: '', bufferedEnd: '' },
                { bay: 'SBL10', openEnd: '19', bufferedEnd: '' },
                { bay: 'SBL11', openEnd: '', bufferedEnd: '' },
                { bay: 'SBL12', openEnd: '', bufferedEnd: '' }
              ].map((bay) => (
                <div key={bay.bay} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border">
                  <div className="font-medium text-gray-900">{bay.bay}</div>
                  <div className="flex space-x-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-600">OPEN END</div>
                      <div className={`font-bold ${bay.openEnd ? 'text-blue-600' : 'text-gray-400'}`}>
                        {bay.openEnd || '-'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-600">BUFFERED END</div>
                      <div className={`font-bold ${bay.bufferedEnd ? 'text-blue-600' : 'text-gray-400'}`}>
                        {bay.bufferedEnd || '-'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IBL & HIBL Bays */}
          <div>
            <h4 className="font-medium text-yellow-900 mb-4">IBL & HIBL Bays</h4>
            <div className="space-y-2">
              {[
                { bay: 'IBL1', openEnd: '9', bufferedEnd: '', type: 'IBL' },
                { bay: 'IBL2', openEnd: '9', bufferedEnd: '', type: 'IBL' },
                { bay: 'IBL3', openEnd: '25', bufferedEnd: '', type: 'IBL' },
                { bay: 'HICL', openEnd: '23', bufferedEnd: '', type: 'HIBL' },
                { bay: 'HIS1', openEnd: '13', bufferedEnd: '', type: 'HIBL' },
                { bay: 'HIS2', openEnd: '05', bufferedEnd: '', type: 'HIBL' },
                { bay: 'HIS3', openEnd: '04', bufferedEnd: '', type: 'HIBL' },
                { bay: 'FULL', openEnd: '15', bufferedEnd: '', type: 'SPECIAL' },
                { bay: 'ETU', openEnd: '', bufferedEnd: '', type: 'SPECIAL' },
                { bay: 'ERL', openEnd: '', bufferedEnd: '', type: 'SPECIAL' },
                { bay: 'UBL', openEnd: '', bufferedEnd: '', type: 'SPECIAL' }
              ].map((bay) => (
                <div key={bay.bay} className={`flex items-center justify-between p-3 rounded-lg border ${
                  bay.type === 'IBL' ? 'bg-yellow-50' :
                  bay.type === 'HIBL' ? 'bg-red-50' : 'bg-purple-50'
                }`}>
                  <div className="font-medium text-gray-900">{bay.bay}</div>
                  <div className="flex space-x-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-600">OPEN END</div>
                      <div className={`font-bold ${bay.openEnd ? 'text-blue-600' : 'text-gray-400'}`}>
                        {bay.openEnd || '-'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-600">BUFFERED END</div>
                      <div className={`font-bold ${bay.bufferedEnd ? 'text-blue-600' : 'text-gray-400'}`}>
                        {bay.bufferedEnd || '-'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Instructions Panel */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">INST: SHUNTING (24/8/24)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-3">Shunting Instructions</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>→ Any Movement - ATO BY PASS</li>
              <li>→ ATC TRIP CONDITION</li>
              <li>→ TRAIN POWER OFF</li>
              <li>→ Note in Shunting Register</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-3">DEPOT MOVEMENT (24/8/24)</h4>
            <ul className="space-y-1 text-sm text-green-800">
              <li>→ All Revenue Train in ATO</li>
              <li>→ Induction/Withdrawal</li>
              <li>→ 1st Train in ETP</li>
              <li>→ Trains scheduled for washing in ATO</li>
              <li>→ Washing to RM</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 bg-green-100 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">Working Instructions (10:05 2025)</h4>
          <div className="text-green-800 font-medium">
            → Do Stabling SBL 04 & 05<br/>
            → Till Further Instruction
          </div>
        </div>
      </div>
    </div>
  );

  const renderAIAssistant = () => (
    <div className="space-y-6">
      {/* AI Assistant Interface */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <span>AI Scheduling Assistant</span>
            </h3>
            <p className="text-sm text-gray-600">Interactive AI chatbot for train operations</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">AI ACTIVE</span>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">AI Assistant Status</h4>
              <p className="text-sm text-blue-700">Ready to help with train operations</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Current Task:</span>
              <p className="font-medium text-blue-900">{aiSchedulingBot.currentTask}</p>
            </div>
            <div>
              <span className="text-blue-700">Status:</span>
              <p className="font-medium text-blue-900">{aiSchedulingBot.processingStatus}</p>
            </div>
            <div>
              <span className="text-blue-700">Confidence:</span>
              <p className="font-medium text-blue-900">{aiSchedulingBot.confidence}%</p>
            </div>
            <div>
              <span className="text-blue-700">Next Optimization:</span>
              <p className="font-medium text-blue-900">Tomorrow 23:00</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">AI Recommendations</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            {aiSchedulingBot.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Control Center Header */}
      <div className="bg-gray-900 text-white border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
                <Train className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">KMRL Control Center</h1>
                <p className="text-sm text-gray-300">AI-Driven Train Induction & Live Tracking</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">SYSTEM NORMAL</span>
              </div>
              <div className="text-white text-sm font-mono">
                {currentTime.toLocaleTimeString()}
              </div>
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
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
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
          {activeTab === 'induction-plan' && renderTomorrowPlan()}
          {activeTab === 'live-tracking' && renderLiveTracking()}
          {activeTab === 'depot-control' && renderDepotControl()}
          {activeTab === 'ai-assistant' && renderAIAssistant()}
        </motion.div>
      </div>

      {/* AI Scheduling Bot */}
      <AISchedulingBot />
    </div>
  );
};

export default TrainInduction;