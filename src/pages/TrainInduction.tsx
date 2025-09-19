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
import { tomorrowInductionPlan, controlCenterData, aiSchedulingBot } from '../data/controlCenterData';
import { weekdaySchedule, weekendSchedule, getCurrentSchedule, realServicePatterns, realDepotBays } from '../data/realScheduleData';
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
    confidence: aiSchedulingBot.confidence,
    scheduleStatus: getScheduleStatus()
  };

  const renderTomorrowPlan = () => (
    <div className="space-y-6">
      {/* Tomorrow's Plan Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Tomorrow's Service Plan</h2>
            <p className="text-blue-100">
              📅 {new Date(Date.now() + 24*60*60*1000).toLocaleDateString()} | Real KMRL Schedule
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{getCurrentSchedule().length}</div>
            <div className="text-blue-100">Trains Scheduled</div>
          </div>
        </div>
      </div>

      {/* Daily Plan Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{getCurrentSchedule().length}</div>
          <div className="text-sm text-green-700">Revenue Service</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">2</div>
          <div className="text-sm text-yellow-700">Standby Ready</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">8</div>
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

      {/* Real KMRL Schedule */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Real KMRL Train Schedule</h3>
              <p className="text-sm text-gray-600">
                📋 Actual operational schedule | Weekdays: 15 trains | Weekends: 12 trains
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-600 font-medium">OPERATIONAL</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Train Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Train No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Train ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timing</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Station</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected Passengers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Type</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getCurrentSchedule().map((train, index) => (
                <tr 
                  key={train.trainId} 
                  className={`hover:bg-gray-50 cursor-pointer ${selectedTrain === train.trainId ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedTrain(train.trainId)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {train.serialNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {train.trainName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {train.trainNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {train.trainId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {train.timing}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      train.station.includes('DEPOT') ? 'bg-blue-100 text-blue-800' : 
                      train.station === 'ALUVA' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {train.station}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600">
                    {train.passengerLoad.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      train.serviceType === 'Weekday' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {train.serviceType}
                    </span>
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
            const train = getCurrentSchedule().find(t => t.trainId === selectedTrain);
            if (!train) return null;
            
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-lg font-semibold text-green-900">{train.trainName} ({train.trainId})</h5>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    SCHEDULED
                  </span>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Train No:</span>
                      <div className="font-medium text-gray-900">{train.trainNo}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Timing:</span>
                      <div className="font-medium text-blue-600">{train.timing}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Station:</span>
                      <div className="font-medium text-green-600">{train.station}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Passengers:</span>
                      <div className="font-medium text-purple-600">{train.passengerLoad.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Priority:</span>
                      <div className="font-medium text-green-600">#{train.priority}</div>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-6">DEPOT BAY LAYOUT - REAL TIME STATUS (16/09/2025)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* SBL Bays - Two Entry Lines */}
          <div>
            <h4 className="font-medium text-green-900 mb-4 text-center bg-green-100 py-2 rounded">
              SBL BAYS - TWO ENTRY LINES ({realDepotBays.sbl.totalBays} BAYS)
            </h4>
            <div className="space-y-2">
              {realDepotBays.sbl.bays.map((bay) => (
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`font-bold text-lg ${bay.crossed ? 'text-red-900' : 'text-gray-900'}`}>
                      {bay.bay}
                    </div>
                    <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">
                      {bay.entryLine}
                    </div>
                    {bay.crossed && <span className="text-red-600 font-bold">❌ NO STABLING</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-600 font-bold bg-blue-100 py-1 rounded">OPEN END</div>
                      <div className={`font-bold text-3xl mt-1 ${bay.openEnd ? 'text-blue-600' : 'text-gray-400'}`}>
                        {bay.openEnd || '-'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-600 font-bold bg-purple-100 py-1 rounded">BUFFERED END</div>
                      <div className={`font-bold text-3xl mt-1 ${bay.bufferedEnd ? 'text-purple-600' : 'text-gray-400'}`}>
                        {bay.bufferedEnd || '-'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IBL & HIBL Bays - ONE ENTRY LINE */}
          <div>
            <h4 className="font-medium text-yellow-900 mb-4 text-center bg-yellow-100 py-2 rounded">IBL & HIBL BAYS - ONE ENTRY LINE</h4>
            <div className="space-y-2">
              {[
                { bay: 'IBL1', openEnd: '', bufferedEnd: '', type: 'IBL', entryLine: 'SINGLE ENTRY' },
                { bay: 'IBL2', openEnd: '9', bufferedEnd: '', type: 'IBL', entryLine: 'SINGLE ENTRY' },
                { bay: 'IBL3', openEnd: '25', bufferedEnd: '', type: 'IBL', entryLine: 'SINGLE ENTRY' },
                { bay: 'HIS1', openEnd: '13', bufferedEnd: '', type: 'HIBL', entryLine: 'SINGLE ENTRY' },
                { bay: 'HIS2', openEnd: '05', bufferedEnd: '', type: 'HIBL', entryLine: 'SINGLE ENTRY' },
                { bay: 'HIS3', openEnd: '04', bufferedEnd: '', type: 'HIBL', entryLine: 'SINGLE ENTRY' },
                { bay: 'FULL', openEnd: '15', bufferedEnd: '', type: 'SPECIAL', entryLine: 'SINGLE ENTRY' }
              ].map((bay) => (
                <div key={bay.bay} className={`p-3 rounded-lg border-2 ${
                  bay.type === 'IBL' ? 'bg-yellow-50' :
                  bay.type === 'HIBL' ? 'bg-red-50' : 'bg-purple-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-lg text-gray-900">{bay.bay}</div>
                    <div className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded font-bold">
                      {bay.entryLine}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                      bay.type === 'IBL' ? 'bg-yellow-200 text-yellow-800' :
                      bay.type === 'HIBL' ? 'bg-red-200 text-red-800' : 'bg-purple-200 text-purple-800'
                    }`}>
                      {bay.type}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-600 font-bold bg-blue-100 py-1 rounded">OPEN END</div>
                      <div className={`font-bold text-2xl mt-1 ${bay.openEnd ? 'text-blue-600' : 'text-gray-400'}`}>
                        {bay.openEnd || '-'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-600 font-bold bg-purple-100 py-1 rounded">BUFFERED END</div>
                      <div className={`font-bold text-2xl mt-1 ${bay.bufferedEnd ? 'text-purple-600' : 'text-gray-400'}`}>
                        {bay.bufferedEnd || '-'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HICL - RACK OPTION (ONE BAY ONLY) */}
          <div>
            <h4 className="font-medium text-purple-900 mb-4 text-center bg-purple-100 py-2 rounded">HICL - RACK OPTION (ONE BAY)</h4>
            <div className="space-y-2">
              {/* HICL - Rack Option Bay */}
              <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-xl text-gray-900">HICL</div>
                  <div className="text-xs bg-orange-200 text-orange-800 px-3 py-1 rounded-full font-bold">
                    RACK OPTION
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600 font-bold bg-orange-100 py-1 rounded mb-2">RACK BAY</div>
                  <div className="font-bold text-4xl text-orange-600">23</div>
                  <div className="text-sm text-orange-700 mt-2">Heavy Inspection & Cleaning</div>
                </div>
              </div>
              
              {/* Special Terminal Bays */}
              {[
                { bay: 'ETU', openEnd: '', bufferedEnd: '', type: 'TERMINAL', description: 'Empty Train Unit' },
                { bay: 'ERL', openEnd: '', bufferedEnd: '', type: 'TERMINAL', description: 'Emergency Relief' },
                { bay: 'UBL', openEnd: '', bufferedEnd: '', type: 'TERMINAL', description: 'Utility Bay' }
              ].map((bay) => (
                <div key={bay.bay} className="p-3 bg-gray-50 rounded-lg border-2 border-gray-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-lg text-gray-900">{bay.bay}</div>
                    <div className="text-xs text-gray-700 font-medium">{bay.description}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-600 font-bold bg-blue-100 py-1 rounded">OPEN END</div>
                      <div className={`font-bold text-2xl mt-1 ${bay.openEnd ? 'text-blue-600' : 'text-gray-400'}`}>
                        {bay.openEnd || '-'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-600 font-bold bg-gray-100 py-1 rounded">BUFFERED END</div>
                      <div className={`font-bold text-2xl mt-1 ${bay.bufferedEnd ? 'text-gray-600' : 'text-gray-400'}`}>
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
    <div className="min-h-screen bg-kmrl-grey-50">
      {/* Control Center Header */}
      <div className="bg-kmrl-grey-800 text-white border-b border-kmrl-grey-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-kmrl-aquamarine-500 to-kmrl-lime-500 p-2 rounded-lg">
                <Train className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">KMRL Control Center</h1>
                <p className="text-sm text-kmrl-grey-300">AI-Driven Train Induction & Live Tracking</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-kmrl-lime-500 rounded-full animate-pulse"></div>
                <span className="text-kmrl-lime-400 text-sm font-medium">SYSTEM NORMAL</span>
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
                      ? 'bg-kmrl-aquamarine-600 text-white'
                      : 'text-kmrl-grey-300 hover:text-white hover:bg-kmrl-grey-700'
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