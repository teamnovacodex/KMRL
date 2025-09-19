import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  Activity, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';
import { mockTrains } from '../data/mockData';
import { aiOptimizationService } from '../services/aiOptimizationService';

const AIOptimization: React.FC = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [lastOptimized, setLastOptimized] = useState<string>('');
  const [autoOptimizeEnabled, setAutoOptimizeEnabled] = useState(true);

  useEffect(() => {
    // Run initial optimization
    runOptimization();
    
    // Set up auto-optimization every 5 minutes
    const interval = setInterval(() => {
      if (autoOptimizeEnabled) {
        runOptimization();
      }
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [autoOptimizeEnabled]);

  const runOptimization = async () => {
    setIsOptimizing(true);
    
    try {
      const result = await aiOptimizationService.runOptimization({
        maxServiceTrains: 18,
        minStandbyTrains: 3
      });
      
      setOptimizationResult(result);
      setLastOptimized(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const stats = {
    totalTrains: mockTrains.length,
    serviceReady: mockTrains.filter(t => t.canGoToService && t.currentBay.type === 'SBL').length,
    maintenance: mockTrains.filter(t => t.currentBay.type === 'HIBL' || t.currentBay.type === 'IBL').length,
    criticalIssues: mockTrains.filter(t => t.criticalJobCards > 0).length,
    avgHealthScore: Math.round(mockTrains.reduce((sum, t) => sum + t.healthScore, 0) / mockTrains.length)
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
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-xl">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <span>AI Optimization Engine</span>
              </h1>
              <p className="text-gray-600 mt-2">Fully Automated Train Induction Planning & Scheduling</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoOptimize"
                  checked={autoOptimizeEnabled}
                  onChange={(e) => setAutoOptimizeEnabled(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="autoOptimize" className="text-sm text-gray-700">
                  Auto-Optimize (5 min)
                </label>
              </div>
              <button
                onClick={runOptimization}
                disabled={isOptimizing}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isOptimizing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-3"
                    >
                      <Activity className="h-5 w-5" />
                    </motion.div>
                    AI Processing...
                  </>
                ) : (
                  <>
                    <Brain className="mr-3 h-5 w-5" />
                    Run AI Optimization
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* AI Status Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <Zap className="h-6 w-6 text-yellow-500" />
                <span>AI System Status</span>
              </h3>
              <p className="text-gray-600 mt-1">Real-time automated optimization for tomorrow's service</p>
            </div>
            {lastOptimized && (
              <div className="text-right">
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Last optimized at {lastOptimized}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Next auto-optimization: {autoOptimizeEnabled ? '5 minutes' : 'Disabled'}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
              <div className="text-sm text-blue-700 font-medium mb-2">Total Fleet</div>
              <div className="text-3xl font-bold text-blue-800">{stats.totalTrains}</div>
              <div className="text-sm text-blue-600">KMRL Trains</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
              <div className="text-sm text-green-700 font-medium mb-2">Service Ready</div>
              <div className="text-3xl font-bold text-green-800">{stats.serviceReady}</div>
              <div className="text-sm text-green-600">SBL Bay Trains</div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 text-center">
              <div className="text-sm text-yellow-700 font-medium mb-2">In Maintenance</div>
              <div className="text-3xl font-bold text-yellow-800">{stats.maintenance}</div>
              <div className="text-sm text-yellow-600">IBL/HIBL Bays</div>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 text-center">
              <div className="text-sm text-red-700 font-medium mb-2">Critical Issues</div>
              <div className="text-3xl font-bold text-red-800">{stats.criticalIssues}</div>
              <div className="text-sm text-red-600">Immediate Attention</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
              <div className="text-sm text-purple-700 font-medium mb-2">Fleet Health</div>
              <div className="text-3xl font-bold text-purple-800">{stats.avgHealthScore}%</div>
              <div className="text-sm text-purple-600">Average Score</div>
            </div>
          </div>
        </motion.div>

        {/* AI Optimization Results */}
        {optimizationResult && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                  <Target className="h-6 w-6 text-green-600" />
                  <span>AI Optimization Results</span>
                </h3>
                <p className="text-gray-600 mt-1">
                  Generated for {new Date(Date.now() + 24*60*60*1000).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {(optimizationResult.totalScore * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">AI Confidence</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {optimizationResult.selectedForService.length}
                </div>
                <div className="text-sm text-green-700">Selected for Service</div>
                <div className="text-xs text-green-600 mt-1">Revenue Operations</div>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {optimizationResult.standbyTrains.length}
                </div>
                <div className="text-sm text-yellow-700">Standby Ready</div>
                <div className="text-xs text-yellow-600 mt-1">Backup Fleet</div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {optimizationResult.maintenanceTrains.length}
                </div>
                <div className="text-sm text-red-700">Under Maintenance</div>
                <div className="text-xs text-red-600 mt-1">Scheduled Work</div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-3 flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Expected Performance Metrics</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">On-Time Performance:</span>
                  <p className="text-blue-800 font-semibold">
                    {optimizationResult.expectedPerformance.onTimePerformance.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Passenger Capacity:</span>
                  <p className="text-blue-800 font-semibold">
                    {(optimizationResult.expectedPerformance.passengerCapacity / 1000).toFixed(0)}K
                  </p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Expected Revenue:</span>
                  <p className="text-blue-800 font-semibold">
                    ₹{(optimizationResult.expectedPerformance.estimatedRevenue / 100000).toFixed(1)}L
                  </p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Risk Level:</span>
                  <p className={`font-semibold ${
                    optimizationResult.expectedPerformance.riskLevel === 'Low' ? 'text-green-800' :
                    optimizationResult.expectedPerformance.riskLevel === 'Medium' ? 'text-yellow-800' :
                    'text-red-800'
                  }`}>
                    {optimizationResult.expectedPerformance.riskLevel}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* AI Decision Reasoning */}
        {optimizationResult && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span>AI Decision Reasoning</span>
            </h3>
            
            <div className="space-y-4">
              {optimizationResult.reasoning.slice(0, 10).map((reasoning: any) => {
                const train = mockTrains.find(t => t.id === reasoning.trainId);
                return (
                  <div key={reasoning.trainId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">
                        {train?.trainName} ({train?.trainNumber})
                      </h5>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          reasoning.decision === 'Service' ? 'bg-green-100 text-green-800' :
                          reasoning.decision === 'Standby' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {reasoning.decision}
                        </span>
                        <span className="text-sm text-gray-600">
                          Score: {(reasoning.score * 100).toFixed(0)}%
                        </span>
                        <span className="text-xs text-gray-500">
                          {reasoning.scheduledTime}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">AI Reasoning:</span>
                      <ul className="mt-1 space-y-1">
                        {reasoning.factors.slice(0, 3).map((factor: string, index: number) => (
                          <li key={index} className="text-gray-600">• {factor}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AIOptimization;