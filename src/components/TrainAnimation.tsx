import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Train, MapPin, Wrench, Sparkles, AlertTriangle } from 'lucide-react';
import { mockTrains } from '../data/mockData';

interface TrainAnimationProps {
  selectedTrain?: string;
  onTrainSelect: (trainId: string) => void;
}

const TrainAnimation: React.FC<TrainAnimationProps> = ({ selectedTrain, onTrainSelect }) => {
  const [animatingTrains, setAnimatingTrains] = useState<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly animate some trains
      if (Math.random() > 0.7) {
        const activeTrains = mockTrains.filter(t => t.status === 'Active');
        const randomTrain = activeTrains[Math.floor(Math.random() * activeTrains.length)];
        if (randomTrain) {
          setAnimatingTrains(prev => new Set([...prev, randomTrain.id]));
          setTimeout(() => {
            setAnimatingTrains(prev => {
              const newSet = new Set(prev);
              newSet.delete(randomTrain.id);
              return newSet;
            });
          }, 2000);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getTrainColor = (train: any) => {
    switch (train.currentBay.type) {
      case 'SBL': return '#10b981'; // Green - Service ready
      case 'IBL': return '#f59e0b'; // Yellow - Minor issues
      case 'HIBL': return '#ef4444'; // Red - Major maintenance
      default: return '#6b7280';
    }
  };

  const getTrainIcon = (train: any) => {
    if (train.status === 'Maintenance') return Wrench;
    if (train.cleaningStatus === 'In Progress') return Sparkles;
    if (train.criticalJobCards > 0) return AlertTriangle;
    return Train;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span>Live Depot View</span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">Real-time train positions and status</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>SBL - Service Ready</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>IBL - Minor Issues</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>HIBL - Major Maintenance</span>
          </div>
        </div>
      </div>

      <div className="relative bg-gray-50 rounded-lg p-4 overflow-hidden" style={{ height: '400px' }}>
        {/* Depot Grid */}
        <div className="grid grid-cols-5 gap-4 h-full">
          {mockTrains.map((train, index) => {
            const IconComponent = getTrainIcon(train);
            const isAnimating = animatingTrains.has(train.id);
            const isSelected = selectedTrain === train.id;
            
            return (
              <motion.div
                key={train.id}
                className={`relative cursor-pointer p-3 rounded-lg border-2 transition-all ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isSelected ? 1.1 : 1,
                  opacity: 1,
                  y: isAnimating ? [-2, 2, -2] : 0,
                }}
                transition={{
                  scale: { duration: 0.3 },
                  y: { duration: 1.5, repeat: isAnimating ? Infinity : 0 }
                }}
                whileHover={{ scale: 1.05 }}
                onClick={() => onTrainSelect(train.id)}
              >
                <div className="text-center">
                  <IconComponent 
                    className="h-6 w-6 mx-auto mb-2" 
                    style={{ color: getTrainColor(train) }}
                  />
                  <div className="text-xs font-medium text-gray-900">{train.trainName}</div>
                  <div className="text-xs text-gray-500">{train.currentBay.type}-{train.currentBay.bayNumber}</div>
                  <div className="text-xs text-gray-500">{train.healthScore}%</div>
                </div>
                
                {/* Status Indicators */}
                <div className="absolute -top-1 -right-1 flex space-x-1">
                  {train.criticalJobCards > 0 && (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                  {train.brandingRequired && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selected Train Details */}
      {selectedTrain && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          {(() => {
            const train = mockTrains.find(t => t.id === selectedTrain);
            if (!train) return null;
            
            return (
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">{train.trainName} ({train.trainNumber}) Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">Bay Type:</span>
                    <p className="text-blue-800">{train.currentBay.type}-{train.currentBay.bayNumber}</p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Location:</span>
                    <p className="text-blue-800">{train.currentBay.location.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Can Go to Service:</span>
                    <p className={`${train.canGoToService ? 'text-green-800' : 'text-red-800'}`}>
                      {train.canGoToService ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Health Score:</span>
                    <p className="text-blue-800">{train.healthScore}%</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">Third Rail Consumption:</span>
                    <p className="text-blue-800">{train.thirdRailConsumption.toFixed(1)} kWh/km</p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Job Cards:</span>
                    <p className="text-blue-800">{train.jobCardStatus} ({train.maximoWorkOrders.length})</p>
                  </div>
                </div>
                {train.riskFactors.length > 0 && (
                  <div className="mt-3">
                    <span className="text-blue-700 font-medium">Risk Factors:</span>
                    <ul className="text-blue-800 text-sm mt-1">
                      {train.riskFactors.map((risk, index) => (
                        <li key={index}>• {risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
};

export default TrainAnimation;