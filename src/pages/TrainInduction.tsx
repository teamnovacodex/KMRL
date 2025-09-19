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

  const renderScheduleManagement = () => (
    <div className="space-y-6">
      {/* Schedule Management Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Management</h3>
        <p className="text-gray-600">Schedule management functionality will be implemented here.</p>
      </div>
    </div>
  );

  const renderDepotStatus = () => (
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

  const renderAIOptimization = () => (
    <div className="space-y-6">
      {/* Real Fitness Certificate Validation */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Automated Systems</h3>
            <p className="text-sm text-gray-600">AI-Powered Fitness Validation & Induction Scheduling</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="autoRefresh" defaultChecked className="rounded" />
              <label htmlFor="autoRefresh" className="text-sm text-gray-700">Auto Refresh</label>
            </div>
          </div>
        </div>

        {/* Fitness Validation Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              <span className="text-sm text-green-700 font-medium">Valid Certificates</span>
            </div>
            <div className="text-3xl font-bold text-green-800">18</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
              <span className="text-sm text-red-700 font-medium">Invalid Certificates</span>
            </div>
            <div className="text-3xl font-bold text-red-800">7</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-6 w-6 text-yellow-600 mr-2" />
              <span className="text-sm text-yellow-700 font-medium">Expiring Soon</span>
            </div>
            <div className="text-3xl font-bold text-yellow-800">0</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Train className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-sm text-blue-700 font-medium">Total Trains</span>
            </div>
            <div className="text-3xl font-bold text-blue-800">25</div>
          </div>
        </div>

        {/* Fitness Certificate Validation Results */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-4">Fitness Certificate Validation Results</h4>
          <p className="text-sm text-gray-600 mb-4">AI-powered automated validation for all 25 trains</p>
          
          <div className="space-y-4">
            {/* Sample validation results */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-6 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-900">GANGA</div>
                  <div className="text-gray-600">ID: 001</div>
                </div>
                <div>
                  <div className="text-gray-600">FC-001-175829340782</div>
                  <div className="text-gray-600">Expires: 2025-09-21</div>
                </div>
                <div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Valid
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">Mechanical</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">Electrical</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">BrakeSystem</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">DoorSystem</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">AI Automated System</div>
                  <div className="text-xs text-blue-600">2025-09-19</div>
                </div>
                <div>
                  <div className="text-xs text-green-600">All systems validated successfully</div>
                  <div className="text-xs text-blue-600">🤖 AI Generated</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-6 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-900">KAVRI</div>
                  <div className="text-gray-600">ID: 002</div>
                </div>
                <div>
                  <div className="text-gray-600">FC-002-175829340782</div>
                  <div className="text-gray-600">Expires: 2025-09-21</div>
                </div>
                <div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Invalid
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">Mechanical</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">Electrical</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">BrakeSystem</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="h-3 w-3 text-red-600" />
                    <span className="text-xs text-red-600">DoorSystem</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">AI Automated System</div>
                  <div className="text-xs text-blue-600">2025-09-19</div>
                </div>
                <div>
                  <div className="text-xs text-red-600">Some validation checks failed - manual inspection required</div>
                  <div className="text-xs text-blue-600">🤖 AI Generated</div>
                </div>
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