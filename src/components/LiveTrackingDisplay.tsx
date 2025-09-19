import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Train, MapPin, Activity, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { liveTrainTracking, metroStations, stationStatus } from '../data/controlCenterData';

interface LiveTrackingDisplayProps {
  height?: number;
}

const LiveTrackingDisplay: React.FC<LiveTrackingDisplayProps> = ({ height = 600 }) => {
  const [selectedTrain, setSelectedTrain] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate train movement
      updateTrainPositions();
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const updateTrainPositions = () => {
    // Simulate real-time train movement
    liveTrainTracking.forEach(train => {
      if (train.status === 'RUNNING') {
        // Move train along route
        train.coordinates.x += (Math.random() - 0.5) * 10;
        train.coordinates.y += (Math.random() - 0.5) * 5;
        train.lastUpdate = new Date().toISOString();
      }
    });
  };

  const getTrainStatusColor = (status: string) => {
    switch (status) {
      case 'RUNNING': return '#10b981';
      case 'STOPPED': return '#ef4444';
      case 'APPROACHING': return '#f59e0b';
      case 'DEPARTING': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'GREEN': return '#10b981';
      case 'RED': return '#ef4444';
      case 'YELLOW': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
      {/* Control Center Header */}
      <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-500 p-2 rounded-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">KMRL Live Tracking System</h3>
              <p className="text-sm text-gray-300">Real-time train monitoring & control</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">SYSTEM ACTIVE</span>
            </div>
            <div className="text-white text-sm font-mono">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Live Tracking Display */}
      <div className="relative bg-gray-900 p-6" style={{ height: `${height}px` }}>
        {/* Metro Route Visualization */}
        <svg width="100%" height="100%" viewBox="0 0 800 500" className="absolute inset-0">
          {/* Route Lines */}
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          
          {/* Main Route Line */}
          <path
            d="M 50 50 Q 200 100 400 150 Q 600 200 750 450"
            stroke="url(#routeGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Station Markers */}
          {metroStations.map((station, index) => {
            const x = 50 + (index * 30);
            const y = 50 + (index * 16);
            const stationStat = stationStatus[index];
            
            return (
              <g key={station.code}>
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill={getSignalColor(stationStat.signalStatus)}
                  stroke="#1f2937"
                  strokeWidth="2"
                />
                <text
                  x={x}
                  y={y - 15}
                  textAnchor="middle"
                  className="text-xs fill-white font-medium"
                >
                  {station.code}
                </text>
                {stationStat.platform1.trainPresent && (
                  <rect
                    x={x - 12}
                    y={y - 5}
                    width="8"
                    height="3"
                    fill="#fbbf24"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Live Trains */}
        {liveTrainTracking.map((train) => (
          <motion.div
            key={train.trainId}
            className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
              selectedTrain === train.trainId ? 'z-20' : 'z-10'
            }`}
            style={{
              left: `${(train.coordinates.x / 800) * 100}%`,
              top: `${(train.coordinates.y / 500) * 100}%`,
            }}
            animate={{
              scale: selectedTrain === train.trainId ? 1.3 : 1,
              x: train.status === 'RUNNING' ? [0, 2, 0] : 0,
            }}
            transition={{
              scale: { duration: 0.3 },
              x: { duration: 3, repeat: train.status === 'RUNNING' ? Infinity : 0 }
            }}
            onClick={() => setSelectedTrain(train.trainId)}
          >
            <div className={`relative p-3 rounded-lg shadow-lg border-2 transition-all duration-300 ${
              selectedTrain === train.trainId 
                ? 'border-blue-400 bg-blue-900' 
                : 'border-gray-600 bg-gray-800 hover:border-gray-500'
            }`}>
              <Train 
                className="h-6 w-6" 
                style={{ color: getTrainStatusColor(train.status) }}
              />
              
              {/* Status Indicators */}
              <div className="absolute -top-1 -right-1 flex space-x-1">
                {train.delay > 0 && (
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                )}
                {train.passengerLoad > 90 && (
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                )}
              </div>
              
              {/* Train ID */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white whitespace-nowrap">
                {train.trainName}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Movement Trails */}
        <svg width="100%" height="100%" viewBox="0 0 800 500" className="absolute inset-0 pointer-events-none">
          {liveTrainTracking.filter(t => t.status === 'RUNNING').map((train) => (
            <motion.circle
              key={`trail-${train.trainId}`}
              cx={train.coordinates.x}
              cy={train.coordinates.y}
              r="20"
              fill="none"
              stroke={getTrainStatusColor(train.status)}
              strokeWidth="2"
              strokeDasharray="3,3"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          ))}
        </svg>
      </div>

      {/* Train Details Panel */}
      {selectedTrain && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 border-t border-gray-700 p-4"
        >
          {(() => {
            const train = liveTrainTracking.find(t => t.trainId === selectedTrain);
            if (!train) return null;
            
            return (
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Train:</span>
                  <p className="text-white font-medium">{train.trainName}</p>
                </div>
                <div>
                  <span className="text-gray-400">Current:</span>
                  <p className="text-blue-400">{train.currentStation}</p>
                </div>
                <div>
                  <span className="text-gray-400">Next:</span>
                  <p className="text-green-400">{train.nextStation}</p>
                </div>
                <div>
                  <span className="text-gray-400">Speed:</span>
                  <p className="text-white">{train.speed} km/h</p>
                </div>
                <div>
                  <span className="text-gray-400">Load:</span>
                  <p className={`${train.passengerLoad > 90 ? 'text-red-400' : 'text-green-400'}`}>
                    {train.passengerLoad}%
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Delay:</span>
                  <p className={`${train.delay > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {train.delay > 0 ? `+${train.delay}min` : 'On Time'}
                  </p>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}

      {/* System Status Bar */}
      <div className="bg-gray-800 px-6 py-3 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-green-400">DEPOT: ENERGIZED</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-green-400">MAINLINE: ENERGIZED</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-yellow-400">THIRD RAIL: ACTIVE</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">Active Trains: <span className="text-white font-medium">15</span></span>
            <span className="text-gray-400">Passengers: <span className="text-white font-medium">45.2K</span></span>
            <span className="text-gray-400">System: <span className="text-green-400 font-medium">NORMAL</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingDisplay;