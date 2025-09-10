import React, { useState } from 'react';
import { Play, RotateCcw, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface OptimizationPanelProps {
  onOptimize: () => void;
  isOptimizing: boolean;
}

const OptimizationPanel: React.FC<OptimizationPanelProps> = ({ onOptimize, isOptimizing }) => {
  const [lastOptimized, setLastOptimized] = useState<string | null>(null);

  const handleOptimize = () => {
    onOptimize();
    setLastOptimized(new Date().toLocaleTimeString());
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span>AI Optimization Engine</span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Optimize train allocation based on current conditions and operational requirements
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-blue-600 font-medium">Optimization Criteria</div>
          <ul className="mt-2 text-sm text-blue-700 space-y-1">
            <li>• Fitness certificate validity</li>
            <li>• Maintenance schedules</li>
            <li>• Cleaning requirements</li>
            <li>• Mileage analysis</li>
          </ul>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-green-600 font-medium">Current Efficiency</div>
          <div className="mt-2 text-2xl font-bold text-green-700">94.2%</div>
          <div className="text-sm text-green-600">Fleet utilization rate</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-sm text-purple-600 font-medium">Next Maintenance</div>
          <div className="mt-2 text-2xl font-bold text-purple-700">3</div>
          <div className="text-sm text-purple-600">Trains due this week</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isOptimizing ? (
              <>
                <RotateCcw className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Optimizing...
              </>
            ) : (
              <>
                <Play className="-ml-1 mr-3 h-5 w-5" />
                Run Optimization
              </>
            )}
          </button>
          
          {lastOptimized && (
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>Last optimized at {lastOptimized}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>Processing time: ~30 seconds</span>
        </div>
      </div>
    </div>
  );
};

export default OptimizationPanel;