import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Train, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Wrench,
  Activity,
  DollarSign,
  Users,
  Zap
} from 'lucide-react';
import { metroTrains, historicalData } from '../data/metroMockData';
import { 
  PerformanceTrendChart, 
  FleetStatusChart, 
  HealthScoreDistribution, 
  MileageAnalysisChart,
  KPIGaugeChart 
} from '../components/MetroCharts';
import MetroTrainAnimation from '../components/MetroTrainAnimation';

const MetroDashboard: React.FC = () => {
  const [selectedTrain, setSelectedTrain] = useState<string>('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [lastOptimized, setLastOptimized] = useState<string>('');
  const [realTimeData, setRealTimeData] = useState({
    activeTrains: 0,
    onTimePerformance: 0,
    totalPassengers: 0,
    revenue: 0,
    efficiency: 0
  });

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      const latest = historicalData[0];
      setRealTimeData({
        activeTrains: metroTrains.filter(t => t.recommendation === 'Service').length,
        onTimePerformance: latest.onTimePerformance + (Math.random() - 0.5) * 2,
        totalPassengers: latest.passengerCount + Math.floor((Math.random() - 0.5) * 10000),
        revenue: latest.revenue + Math.floor((Math.random() - 0.5) * 100000),
        efficiency: latest.efficiency + (Math.random() - 0.5) * 3
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleOptimization = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setLastOptimized(new Date().toLocaleTimeString());
    }, 3000);
  };

  const stats = {
    service: metroTrains.filter(t => t.recommendation === 'Service').length,
    standby: metroTrains.filter(t => t.recommendation === 'Standby').length,
    maintenance: metroTrains.filter(t => t.recommendation === 'Maintenance').length,
    deepClean: metroTrains.filter(t => t.recommendation === 'Deep Clean').length,
    criticalIssues: metroTrains.filter(t => t.criticalJobCards > 0).length,
    expiredFitness: metroTrains.filter(t => t.fitnessStatus === 'Expired').length,
    avgHealthScore: Math.round(metroTrains.reduce((sum, t) => sum + t.healthScore, 0) / metroTrains.length),
    totalMileage: metroTrains.reduce((sum, t) => sum + t.totalMileage, 0)
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
                <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-xl">
                  <Train className="h-8 w-8 text-white" />
                </div>
                <span>KMRL Metro Command Center</span>
              </h1>
              <p className="text-gray-600 mt-2">AI-Driven Train Induction Planning & Fleet Management</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Real-time KPI Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Trains</p>
                <p className="text-3xl font-bold text-green-600">{realTimeData.activeTrains}</p>
                <p className="text-xs text-gray-500">of 23 total</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Train className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On-Time Performance</p>
                <p className="text-3xl font-bold text-blue-600">{realTimeData.onTimePerformance.toFixed(1)}%</p>
                <p className="text-xs text-green-500">↑ 2.3% from yesterday</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Daily Passengers</p>
                <p className="text-3xl font-bold text-purple-600">{(realTimeData.totalPassengers / 1000).toFixed(0)}K</p>
                <p className="text-xs text-green-500">↑ 5.2% from last week</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue Today</p>
                <p className="text-3xl font-bold text-green-600">₹{(realTimeData.revenue / 100000).toFixed(1)}L</p>
                <p className="text-xs text-green-500">↑ 8.1% from target</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fleet Efficiency</p>
                <p className="text-3xl font-bold text-orange-600">{realTimeData.efficiency.toFixed(1)}%</p>
                <p className="text-xs text-orange-500">↓ 1.2% optimization needed</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Optimization Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <span>AI Optimization Engine</span>
              </h3>
              <p className="text-gray-600 mt-1">Advanced multi-objective optimization for tomorrow's service</p>
            </div>
            <button
              onClick={handleOptimization}
              disabled={isOptimizing}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                  Optimizing...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-3 h-5 w-5" />
                  Run AI Optimization
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <div className="text-sm text-green-700 font-medium mb-2">Service Ready</div>
              <div className="text-3xl font-bold text-green-800">{stats.service}</div>
              <div className="text-sm text-green-600">Trains optimized for service</div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
              <div className="text-sm text-yellow-700 font-medium mb-2">Standby Queue</div>
              <div className="text-3xl font-bold text-yellow-800">{stats.standby}</div>
              <div className="text-sm text-yellow-600">Ready for deployment</div>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
              <div className="text-sm text-red-700 font-medium mb-2">Maintenance</div>
              <div className="text-3xl font-bold text-red-800">{stats.maintenance}</div>
              <div className="text-sm text-red-600">Scheduled maintenance</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <div className="text-sm text-purple-700 font-medium mb-2">Deep Cleaning</div>
              <div className="text-3xl font-bold text-purple-800">{stats.deepClean}</div>
              <div className="text-sm text-purple-600">Cleaning in progress</div>
            </div>
          </div>

          {lastOptimized && (
            <div className="mt-4 flex items-center space-x-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>Last optimized at {lastOptimized} - 96.2% efficiency achieved</span>
            </div>
          )}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
            <PerformanceTrendChart height={300} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet Status Distribution</h3>
            <FleetStatusChart height={300} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Score Analysis</h3>
            <HealthScoreDistribution height={300} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mileage Distribution</h3>
            <MileageAnalysisChart height={300} />
          </motion.div>
        </div>

        {/* Live Depot View */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <MetroTrainAnimation 
            selectedTrain={selectedTrain}
            onTrainSelect={setSelectedTrain}
          />
        </motion.div>

        {/* Critical Alerts */}
        {(stats.criticalIssues > 0 || stats.expiredFitness > 0) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-red-900">Critical Alerts</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.criticalIssues > 0 && (
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <div className="text-red-800 font-medium">{stats.criticalIssues} Critical Job Cards</div>
                  <div className="text-red-600 text-sm">Immediate attention required</div>
                </div>
              )}
              {stats.expiredFitness > 0 && (
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <div className="text-red-800 font-medium">{stats.expiredFitness} Expired Fitness Certificates</div>
                  <div className="text-red-600 text-sm">Cannot be inducted for service</div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MetroDashboard;