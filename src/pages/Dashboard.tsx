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
  Users,
  Zap
} from 'lucide-react';
import { mockTrains, historicalData } from '../data/mockData';
import { 
  PerformanceTrendChart, 
  FleetStatusChart, 
  MileageAnalysisChart,
  HealthScoreChart 
} from '../components/Charts';
import TrainAnimation from '../components/TrainAnimation';
import SummaryCard from '../components/SummaryCard';
import TrainTable from '../components/TrainTable';

const Dashboard: React.FC = () => {
  const [selectedTrain, setSelectedTrain] = useState<string>('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [lastOptimized, setLastOptimized] = useState<string>('');
  const [realTimeData, setRealTimeData] = useState({
    activeTrains: 0,
    onTimePerformance: 0,
    totalPassengers: 0,
    efficiency: 0
  });

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      const latest = historicalData[0];
      setRealTimeData({
        activeTrains: mockTrains.filter(t => t.recommendation === 'Service').length,
        onTimePerformance: latest.onTimePerformance + (Math.random() - 0.5) * 2,
        totalPassengers: latest.passengerCount + Math.floor((Math.random() - 0.5) * 10000),
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
    service: mockTrains.filter(t => t.canGoToService && t.currentBay.type === 'SBL').length,
    standby: mockTrains.filter(t => t.currentBay.type === 'IBL').length,
    maintenance: mockTrains.filter(t => t.currentBay.type === 'HIBL').length,
    sblBays: mockTrains.filter(t => t.currentBay.type === 'SBL').length,
    criticalIssues: mockTrains.filter(t => t.criticalJobCards > 0).length,
    expiredCerts: mockTrains.filter(t => 
      t.rollingStockCert.status === 'Expired' || 
      t.signallingCert.status === 'Expired' || 
      t.telecomCert.status === 'Expired'
    ).length,
    avgHealthScore: Math.round(mockTrains.reduce((sum, t) => sum + t.healthScore, 0) / mockTrains.length),
    totalThirdRailConsumption: mockTrains.reduce((sum, t) => sum + t.thirdRailConsumption, 0)
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-xl">
                  <Train className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <span>KMRL Metro Command Center</span>
              </h1>
              <p className="text-gray-600 mt-2">AI-Driven Train Induction Planning & Fleet Management</p>
            </div>
            <div className="text-right mt-4 sm:mt-0">
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        >
          <SummaryCard
            title="SBL Bays (Service Ready)"
            value={realTimeData.activeTrains}
            icon={Train}
            color="text-green-600"
          />
          <SummaryCard
            title="IBL Bays (Minor Issues)"
            value={stats.standby}
            icon={AlertTriangle}
            color="text-yellow-600"
          />
          <SummaryCard
            title="HIBL Bays (Major Maintenance)"
            value={stats.maintenance}
            icon={Wrench}
            color="text-red-600"
          />
          <SummaryCard
            title="On-Time Performance"
            value={Math.round(realTimeData.onTimePerformance)}
            icon={Clock}
            color="text-blue-600"
          />
          <SummaryCard
            title="Third Rail Consumption"
            value={Math.round(realTimeData.efficiency)}
            icon={Activity}
            color="text-orange-600"
          />
        </motion.div>

        {/* AI Optimization Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
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
              className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
              <div className="text-sm text-green-700 font-medium mb-2">SBL Bays - Service Ready</div>
              <div className="text-3xl font-bold text-green-800">{stats.service}</div>
              <div className="text-sm text-green-600">Can go to revenue service</div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 text-center">
              <div className="text-sm text-yellow-700 font-medium mb-2">IBL Bays - Minor Issues</div>
              <div className="text-3xl font-bold text-yellow-800">{stats.standby}</div>
              <div className="text-sm text-yellow-600">Minor maintenance needed</div>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 text-center">
              <div className="text-sm text-red-700 font-medium mb-2">HIBL Bays - Major Maintenance</div>
              <div className="text-3xl font-bold text-red-800">{stats.maintenance}</div>
              <div className="text-sm text-red-600">Major repairs needed</div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="text-sm text-blue-700 font-medium mb-2">Total SBL Bays</div>
              <div className="text-3xl font-bold text-blue-800">{stats.sblBays}</div>
              <div className="text-sm text-blue-600">All service bays</div>
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
            <HealthScoreChart height={300} />
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
          className="mb-8"
        >
          <TrainAnimation 
            selectedTrain={selectedTrain}
            onTrainSelect={setSelectedTrain}
          />
        </motion.div>

        {/* Train Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <TrainTable trains={mockTrains} />
        </motion.div>

        {/* Critical Alerts */}
        {(stats.criticalIssues > 0 || stats.expiredCerts > 0) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-red-50 border border-red-200 rounded-xl p-6"
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
              {stats.expiredCerts > 0 && (
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <div className="text-red-800 font-medium">{stats.expiredCerts} Expired Department Certificates</div>
                  <div className="text-red-600 text-sm">Rolling Stock/Signalling/Telecom certs expired</div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;