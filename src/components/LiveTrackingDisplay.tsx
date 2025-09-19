import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Train, MapPin, Activity, Zap, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface LiveTrackingDisplayProps {
  height?: number;
}

interface TrainPosition {
  id: string;
  name: string;
  x: number;
  y: number;
  speed: number;
  direction: 'UP' | 'DOWN';
  status: 'RUNNING' | 'STOPPED' | 'APPROACHING';
  currentStation: string;
  nextStation: string;
  delay: number;
  passengerLoad: number;
}

const LiveTrackingDisplay: React.FC<LiveTrackingDisplayProps> = ({ height = 600 }) => {
  const [selectedTrain, setSelectedTrain] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [trains, setTrains] = useState<TrainPosition[]>([
    {
      id: '001',
      name: 'GANGA',
      x: 150,
      y: 100,
      speed: 45,
      direction: 'DOWN',
      status: 'RUNNING',
      currentStation: 'Palarivattom',
      nextStation: 'JLN Stadium',
      delay: 0,
      passengerLoad: 78
    },
    {
      id: '003',
      name: 'KAVRI',
      x: 300,
      y: 200,
      speed: 0,
      direction: 'DOWN',
      status: 'STOPPED',
      currentStation: 'Kaloor',
      nextStation: 'Town Hall',
      delay: 2,
      passengerLoad: 85
    },
    {
      id: '005',
      name: 'KRISHNA',
      x: 450,
      y: 300,
      speed: 52,
      direction: 'DOWN',
      status: 'RUNNING',
      currentStation: 'Vyttila',
      nextStation: 'Thaikoodam',
      delay: 0,
      passengerLoad: 92
    },
    {
      id: '007',
      name: 'TAPTI',
      x: 200,
      y: 150,
      speed: 48,
      direction: 'UP',
      status: 'RUNNING',
      currentStation: 'Edapally',
      nextStation: 'Changampuzha Park',
      delay: 1,
      passengerLoad: 65
    },
    {
      id: '009',
      name: 'SARAW',
      x: 80,
      y: 80,
      speed: 0,
      direction: 'DOWN',
      status: 'APPROACHING',
      currentStation: 'Aluva',
      nextStation: 'Pulinchodu',
      delay: 0,
      passengerLoad: 45
    }
  ]);

  // Metro stations with coordinates
  const stations = [
    { name: 'Aluva', x: 80, y: 80, signal: 'GREEN' },
    { name: 'Pulinchodu', x: 110, y: 90, signal: 'GREEN' },
    { name: 'Companypady', x: 140, y: 100, signal: 'GREEN' },
    { name: 'Ambattukavu', x: 170, y: 110, signal: 'YELLOW' },
    { name: 'Muttom', x: 200, y: 120, signal: 'GREEN' },
    { name: 'Kalamassery', x: 230, y: 130, signal: 'GREEN' },
    { name: 'Cochin University', x: 260, y: 140, signal: 'GREEN' },
    { name: 'Pathadipalam', x: 290, y: 150, signal: 'GREEN' },
    { name: 'Edapally', x: 320, y: 160, signal: 'GREEN' },
    { name: 'Changampuzha Park', x: 350, y: 170, signal: 'GREEN' },
    { name: 'Palarivattom', x: 380, y: 180, signal: 'GREEN' },
    { name: 'JLN Stadium', x: 410, y: 190, signal: 'GREEN' },
    { name: 'Kaloor', x: 440, y: 200, signal: 'RED' },
    { name: 'Town Hall', x: 470, y: 210, signal: 'GREEN' },
    { name: 'M.G Road', x: 500, y: 220, signal: 'GREEN' },
    { name: 'Maharajas College', x: 530, y: 230, signal: 'GREEN' },
    { name: 'Ernakulam South', x: 560, y: 240, signal: 'GREEN' },
    { name: 'Kadavanthra', x: 590, y: 250, signal: 'GREEN' },
    { name: 'Elamkulam', x: 620, y: 260, signal: 'GREEN' },
    { name: 'Vyttila', x: 650, y: 270, signal: 'GREEN' },
    { name: 'Thaikoodam', x: 680, y: 280, signal: 'GREEN' },
    { name: 'Petta', x: 710, y: 290, signal: 'GREEN' },
    { name: 'Vadakkekotta', x: 740, y: 300, signal: 'GREEN' },
    { name: 'Tripunithura', x: 770, y: 310, signal: 'GREEN' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate train movement
      setTrains(prevTrains => 
        prevTrains.map(train => {
          if (train.status === 'RUNNING') {
            const moveDistance = train.speed * 0.1; // Scale movement
            let newX = train.x;
            let newY = train.y;
            
            if (train.direction === 'DOWN') {
              newX += moveDistance * 0.8;
              newY += moveDistance * 0.3;
            } else {
              newX -= moveDistance * 0.8;
              newY -= moveDistance * 0.3;
            }
            
            // Keep trains within bounds
            newX = Math.max(50, Math.min(800, newX));
            newY = Math.max(50, Math.min(350, newY));
            
            return { ...train, x: newX, y: newY };
          }
          return train;
        })
      );
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const getTrainStatusColor = (status: string) => {
    switch (status) {
      case 'RUNNING': return '#10b981';
      case 'STOPPED': return '#ef4444';
      case 'APPROACHING': return '#f59e0b';
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
      <div className="relative bg-black p-6" style={{ height: `${height}px` }}>
        {/* Metro Route Visualization */}
        <svg width="100%" height="100%" viewBox="0 0 850 400" className="absolute inset-0">
          {/* Track Lines - Like Real Control Center */}
          <defs>
            <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          
          {/* Main Track Lines (Like your image) */}
          <g stroke="#10b981" strokeWidth="3" fill="none">
            {/* Track 1 */}
            <path d="M 80 80 L 770 310" strokeDasharray="0" />
            {/* Track 2 (Parallel) */}
            <path d="M 80 90 L 770 320" strokeDasharray="0" />
            
            {/* Station Connection Lines */}
            {stations.map((station, index) => (
              <g key={station.name}>
                <line
                  x1={station.x}
                  y1={station.y - 10}
                  x2={station.x}
                  y2={station.y + 20}
                  stroke="#10b981"
                  strokeWidth="2"
                />
              </g>
            ))}
          </g>
          
          {/* Station Markers */}
          {stations.map((station, index) => (
            <g key={station.name}>
              <circle
                cx={station.x}
                cy={station.y}
                r="6"
                fill={getSignalColor(station.signal)}
                stroke="#1f2937"
                strokeWidth="2"
              />
              <text
                x={station.x}
                y={station.y - 15}
                textAnchor="middle"
                className="text-xs fill-green-400 font-medium"
              >
                {station.name.substring(0, 3).toUpperCase()}
              </text>
              
              {/* Signal Status */}
              <rect
                x={station.x - 3}
                y={station.y + 10}
                width="6"
                height="3"
                fill={getSignalColor(station.signal)}
              />
            </g>
          ))}
          
          {/* Track Sections */}
          {stations.map((station, index) => {
            if (index < stations.length - 1) {
              const nextStation = stations[index + 1];
              return (
                <g key={`section-${index}`}>
                  <line
                    x1={station.x + 6}
                    y1={station.y}
                    x2={nextStation.x - 6}
                    y2={nextStation.y}
                    stroke="#10b981"
                    strokeWidth="4"
                    opacity="0.8"
                  />
                </g>
              );
            }
            return null;
          })}
        </svg>

        {/* Live Trains */}
        {trains.map((train) => (
          <motion.div
            key={train.id}
            className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
              selectedTrain === train.id ? 'z-20' : 'z-10'
            }`}
            style={{
              left: `${(train.x / 850) * 100}%`,
              top: `${(train.y / 400) * 100}%`,
            }}
            animate={{
              scale: selectedTrain === train.id ? 1.4 : 1,
              x: train.status === 'RUNNING' ? [0, 3, 0] : 0,
            }}
            transition={{
              scale: { duration: 0.3 },
              x: { duration: 2, repeat: train.status === 'RUNNING' ? Infinity : 0 }
            }}
            onClick={() => setSelectedTrain(train.id)}
          >
            <div className={`relative p-3 rounded-lg shadow-lg border-2 transition-all duration-300 ${
              selectedTrain === train.id 
                ? 'border-cyan-400 bg-gray-800' 
                : 'border-gray-600 bg-gray-800 hover:border-gray-500'
            }`}>
              <Train 
                className="h-5 w-5" 
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
                {train.status === 'RUNNING' && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
              
              {/* Train ID */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-green-400 whitespace-nowrap">
                {train.name}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Movement Trails for Running Trains */}
        <svg width="100%" height="100%" viewBox="0 0 850 400" className="absolute inset-0 pointer-events-none">
          {trains.filter(t => t.status === 'RUNNING').map((train) => (
            <motion.circle
              key={`trail-${train.id}`}
              cx={train.x}
              cy={train.y}
              r="25"
              fill="none"
              stroke={getTrainStatusColor(train.status)}
              strokeWidth="2"
              strokeDasharray="4,4"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          ))}
        </svg>

        {/* Speed Indicators */}
        {trains.filter(t => t.status === 'RUNNING').map((train) => (
          <div
            key={`speed-${train.id}`}
            className="absolute text-xs text-green-400 font-mono bg-gray-800 px-2 py-1 rounded"
            style={{
              left: `${(train.x / 850) * 100}%`,
              top: `${((train.y + 30) / 400) * 100}%`,
              transform: 'translateX(-50%)'
            }}
          >
            {train.speed} km/h
          </div>
        ))}
      </div>

      {/* Train Details Panel */}
      {selectedTrain && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 border-t border-gray-700 p-4"
        >
          {(() => {
            const train = trains.find(t => t.id === selectedTrain);
            if (!train) return null;
            
            return (
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Train:</span>
                  <p className="text-white font-medium">{train.name} ({train.id})</p>
                </div>
                <div>
                  <span className="text-gray-400">Current:</span>
                  <p className="text-cyan-400">{train.currentStation}</p>
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
                  <span className="text-gray-400">Status:</span>
                  <p className={`${train.delay > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {train.delay > 0 ? `DELAYED +${train.delay}min` : 'ON TIME'}
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
              <span className="text-green-400">DEPOT: DC ENERGIZED</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-green-400">MAINLINE: DC ENERGIZED</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-yellow-400">THIRD RAIL: ACTIVE</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-blue-400">SYSTEM TIME: {currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">Active Trains: <span className="text-white font-medium">5</span></span>
            <span className="text-gray-400">Passengers: <span className="text-white font-medium">12.8K</span></span>
            <span className="text-gray-400">System: <span className="text-green-400 font-medium">NORMAL</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingDisplay;