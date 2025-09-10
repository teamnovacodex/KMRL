import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Train, MapPin, Wrench, Sparkles, AlertTriangle } from 'lucide-react';
import { enterpriseTrains, depotLayout } from '../data/enterpriseMockData';

interface TrainAnimationProps {
  selectedTrain?: string;
  onTrainSelect: (trainId: string) => void;
}

const EnterpriseTrainAnimation: React.FC<TrainAnimationProps> = ({ selectedTrain, onTrainSelect }) => {
  const [animatingTrains, setAnimatingTrains] = useState<Set<string>>(new Set());
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 1);
      
      // Randomly animate some trains
      if (Math.random() > 0.7) {
        const activeTrains = enterpriseTrains.filter(t => t.status === 'Active');
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
    switch (train.recommendation) {
      case 'Service': return '#10b981';
      case 'Standby': return '#f59e0b';
      case 'Maintenance': return '#ef4444';
      case 'Deep Clean': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getTrainIcon = (train: any) => {
    if (train.status === 'Maintenance') return Wrench;
    if (train.cleaningStatus === 'In Progress') return Sparkles;
    if (train.criticalJobCards > 0) return AlertTriangle;
    return Train;
  };

  const getBayColor = (bay: any) => {
    switch (bay.type) {
      case 'Service': return '#e0f2fe';
      case 'Maintenance': return '#fef3c7';
      case 'Cleaning': return '#f3e8ff';
      case 'Storage': return '#f1f5f9';
      default: return '#f8fafc';
    }
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
            <span>Service Ready</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Standby</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Maintenance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Cleaning</span>
          </div>
        </div>
      </div>

      <div className="relative bg-gray-50 rounded-lg p-4 overflow-hidden" style={{ height: '600px' }}>
        {/* Depot Layout Grid */}
        <svg width="100%" height="100%" viewBox="0 0 500 500" className="absolute inset-0">
          {/* Grid Lines */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Depot Bays */}
          {depotLayout.layout.map((bay) => (
            <g key={bay.bayNumber}>
              <rect
                x={bay.position.x - 40}
                y={bay.position.y - 20}
                width="80"
                height="40"
                fill={getBayColor(bay)}
                stroke="#d1d5db"
                strokeWidth="2"
                rx="5"
              />
              <text
                x={bay.position.x}
                y={bay.position.y - 25}
                textAnchor="middle"
                className="text-xs font-medium fill-gray-600"
              >
                Bay {bay.bayNumber}
              </text>
              <text
                x={bay.position.x}
                y={bay.position.y + 35}
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                {bay.type}
              </text>
            </g>
          ))}
        </svg>

        {/* Trains */}
        <AnimatePresence>
          {enterpriseTrains.map((train) => {
            const IconComponent = getTrainIcon(train);
            const isAnimating = animatingTrains.has(train.id);
            const isSelected = selectedTrain === train.id;
            
            return (
              <motion.div
                key={train.id}
                className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                  isSelected ? 'z-20' : 'z-10'
                }`}
                style={{
                  left: `${(train.stablingPosition.x / 500) * 100}%`,
                  top: `${(train.stablingPosition.y / 500) * 100}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isSelected ? 1.3 : 1,
                  opacity: 1,
                  y: isAnimating ? [-5, 5, -5] : 0,
                }}
                transition={{
                  scale: { duration: 0.3 },
                  y: { duration: 2, repeat: isAnimating ? Infinity : 0 }
                }}
                whileHover={{ scale: 1.2 }}
                onClick={() => onTrainSelect(train.id)}
              >
                <div className={`relative p-3 rounded-lg shadow-lg border-2 transition-all duration-300 ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}>
                  <IconComponent 
                    className="h-6 w-6" 
                    style={{ color: getTrainColor(train) }}
                  />
                  
                  {/* Status Indicators */}
                  <div className="absolute -top-1 -right-1 flex space-x-1">
                    {train.criticalJobCards > 0 && (
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                    {train.brandingRequired && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                    {train.cleaningStatus === 'In Progress' && (
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  
                  {/* Train Number */}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 whitespace-nowrap">
                    {train.trainNumber}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Movement Paths */}
        <svg width="100%" height="100%" viewBox="0 0 500 500" className="absolute inset-0 pointer-events-none">
          {animatingTrains.size > 0 && Array.from(animatingTrains).map((trainId) => {
            const train = enterpriseTrains.find(t => t.id === trainId);
            if (!train) return null;
            
            return (
              <motion.circle
                key={`path-${trainId}`}
                cx={train.stablingPosition.x}
                cy={train.stablingPosition.y}
                r="30"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="5,5"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            );
          })}
        </svg>
      </div>

      {/* Selected Train Details */}
      {selectedTrain && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          {(() => {
            const train = enterpriseTrains.find(t => t.id === selectedTrain);
            if (!train) return null;
            
            return (
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">{train.trainNumber} Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">Status:</span>
                    <p className="text-blue-800">{train.status}</p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Health Score:</span>
                    <p className="text-blue-800">{train.healthScore}%</p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Mileage:</span>
                    <p className="text-blue-800">{train.totalMileage.toLocaleString()} km</p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Recommendation:</span>
                    <p className="text-blue-800">{train.recommendation}</p>
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

export default EnterpriseTrainAnimation;