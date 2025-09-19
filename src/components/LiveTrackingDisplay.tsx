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
  direction: 'UP' | 'DOWN'; // Aluva to Tripunithura = DOWN, reverse = UP
  status: 'RUNNING' | 'STOPPED' | 'APPROACHING' | 'DEPARTING';
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
      name: 'SARAW',
      x: 120,
      y: 150,
      speed: 48,
      direction: 'DOWN',
      status: 'RUNNING',
      currentStation: 'ALV',
      nextStation: 'COM',
      delay: 0,
      passengerLoad: 65
    },
    {
      id: '003',
      name: 'TAPTI',
      x: 180,
      y: 200,
      speed: 45,
      direction: 'DOWN',
      status: 'RUNNING',
      currentStation: 'COM',
      nextStation: 'AMB',
      delay: 0,
      passengerLoad: 72
    },
    {
      id: '005',
      name: 'GANGA',
      x: 240,
      y: 250,
      speed: 45,
      direction: 'DOWN',
      status: 'RUNNING',
      currentStation: 'MUT',
      nextStation: 'KAL',
      delay: 0,
      passengerLoad: 68
    },
    {
      id: '007',
      name: 'KAVRI',
      x: 420,
      y: 350,
      speed: 0,
      direction: 'UP',
      status: 'STOPPED',
      currentStation: 'TOW',
      nextStation: 'KAL',
      delay: 2,
      passengerLoad: 85
    },
    {
      id: '009',
      name: 'KRISHNA',
      x: 580,
      y: 450,
      speed: 52,
      direction: 'UP',
      status: 'RUNNING',
      currentStation: 'VYT',
      nextStation: 'ELA',
      delay: 0,
      passengerLoad: 92
    }
  ]);

  // Real Kochi Metro Stations with accurate positions (from your image)
  const stations = [
    { code: 'ALV', name: 'Aluva', x: 100, y: 130, signal: 'GREEN' },
    { code: 'PUL', name: 'Pulinchodu', x: 130, y: 150, signal: 'GREEN' },
    { code: 'COM', name: 'Companypady', x: 160, y: 170, signal: 'GREEN' },
    { code: 'AMB', name: 'Ambattukavu', x: 190, y: 190, signal: 'GREEN' },
    { code: 'MUT', name: 'Muttom', x: 220, y: 210, signal: 'GREEN' },
    { code: 'KAL', name: 'Kalamassery', x: 250, y: 230, signal: 'GREEN' },
    { code: 'COC', name: 'Cochin University', x: 280, y: 250, signal: 'GREEN' },
    { code: 'PAT', name: 'Pathadipalam', x: 310, y: 270, signal: 'GREEN' },
    { code: 'EDA', name: 'Edapally', x: 340, y: 290, signal: 'GREEN' },
    { code: 'CHA', name: 'Changampuzha Park', x: 370, y: 310, signal: 'GREEN' },
    { code: 'PAL', name: 'Palarivattom', x: 400, y: 330, signal: 'GREEN' },
    { code: 'JLN', name: 'JLN Stadium', x: 430, y: 350, signal: 'GREEN' },
    { code: 'KAL', name: 'Kaloor', x: 460, y: 370, signal: 'RED' },
    { code: 'TOW', name: 'Town Hall', x: 490, y: 390, signal: 'GREEN' },
    { code: 'MGR', name: 'M.G Road', x: 520, y: 410, signal: 'GREEN' },
    { code: 'MAH', name: 'Maharajas College', x: 550, y: 430, signal: 'GREEN' },
    { code: 'ERN', name: 'Ernakulam South', x: 580, y: 450, signal: 'GREEN' },
    { code: 'KAD', name: 'Kadavanthra', x: 610, y: 470, signal: 'GREEN' },
    { code: 'ELA', name: 'Elamkulam', x: 640, y: 490, signal: 'GREEN' },
    { code: 'VYT', name: 'Vyttila', x: 670, y: 510, signal: 'GREEN' },
    { code: 'THA', name: 'Thaikoodam', x: 700, y: 530, signal: 'GREEN' },
    { code: 'PET', name: 'Petta', x: 730, y: 550, signal: 'GREEN' },
    { code: 'VAD', name: 'Vadakkekotta', x: 760, y: 570, signal: 'GREEN' },
    { code: 'TRI', name: 'Tripunithura', x: 790, y: 590, signal: 'GREEN' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate realistic train movement along the track
      setTrains(prevTrains => 
        prevTrains.map(train => {
          if (train.status === 'RUNNING') {
            const currentStationIndex = stations.findIndex(s => s.code === train.currentStation);
            const nextStationIndex = stations.findIndex(s => s.code === train.nextStation);
            
            if (currentStationIndex !== -1 && nextStationIndex !== -1) {
              const currentStation = stations[currentStationIndex];
              const nextStation = stations[nextStationIndex];
              
              // Calculate movement towards next station
              const dx = nextStation.x - currentStation.x;
              const dy = nextStation.y - currentStation.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance > 0) {
                const moveSpeed = train.speed * 0.1; // Scale movement
                const moveX = (dx / distance) * moveSpeed;
                const moveY = (dy / distance) * moveSpeed;
                
                let newX = train.x + moveX;
                let newY = train.y + moveY;
                
                // Check if reached next station
                const distanceToNext = Math.sqrt(
                  Math.pow(newX - nextStation.x, 2) + Math.pow(newY - nextStation.y, 2)
                );
                
                if (distanceToNext < 20) {
                  // Reached next station, update to next segment
                  newX = nextStation.x;
                  newY = nextStation.y;
                  
                  const newCurrentStationIndex = nextStationIndex;
                  const newNextStationIndex = train.direction === 'DOWN' ? 
                    Math.min(nextStationIndex + 1, stations.length - 1) :
                    Math.max(nextStationIndex - 1, 0);
                  
                  return {
                    ...train,
                    x: newX,
                    y: newY,
                    currentStation: stations[newCurrentStationIndex].code,
                    nextStation: stations[newNextStationIndex].code
                  };
                }
                
                return { ...train, x: newX, y: newY };
              }
            }
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

      {/* Live Tracking Display - Like Real Control Center */}
      <div className="relative bg-black p-6" style={{ height: `${height}px` }}>
        {/* Metro Route Visualization - Exact Layout from Your Image */}
        <svg width="100%" height="100%" viewBox="0 0 900 650" className="absolute inset-0">
          {/* Track Lines - Like Real Control Center */}
          <defs>
            <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            
            {/* Track Pattern */}
            <pattern id="trackPattern" x="0" y="0" width="20" height="4" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="20" height="4" fill="#10b981"/>
              <rect x="0" y="1" width="20" height="2" fill="#059669"/>
            </pattern>
          </defs>
          
          {/* Main Track Lines (UP & DOWN) - Following Real Route */}
          <g stroke="url(#trackGradient)" strokeWidth="6" fill="none">
            {/* DOWN Track (Aluva to Tripunithura) */}
            <path 
              d="M 100 130 L 130 150 L 160 170 L 190 190 L 220 210 L 250 230 L 280 250 L 310 270 L 340 290 L 370 310 L 400 330 L 430 350 L 460 370 L 490 390 L 520 410 L 550 430 L 580 450 L 610 470 L 640 490 L 670 510 L 700 530 L 730 550 L 760 570 L 790 590" 
              strokeDasharray="0"
              filter="drop-shadow(0 0 4px #10b981)"
            />
            
            {/* UP Track (Tripunithura to Aluva) - Parallel */}
            <path 
              d="M 100 140 L 130 160 L 160 180 L 190 200 L 220 220 L 250 240 L 280 260 L 310 280 L 340 300 L 370 320 L 400 340 L 430 360 L 460 380 L 490 400 L 520 420 L 550 440 L 580 460 L 610 480 L 640 500 L 670 520 L 700 540 L 730 560 L 760 580 L 790 600" 
              strokeDasharray="0"
              filter="drop-shadow(0 0 4px #10b981)"
            />
          </g>
          
          {/* Station Markers - Like Real Control Center */}
          {stations.map((station, index) => (
            <g key={station.code}>
              {/* Station Platform */}
              <rect
                x={station.x - 15}
                y={station.y - 8}
                width="30"
                height="16"
                fill="#1f2937"
                stroke={getSignalColor(station.signal)}
                strokeWidth="2"
                rx="3"
              />
              
              {/* Station Code */}
              <text
                x={station.x}
                y={station.y + 3}
                textAnchor="middle"
                className="text-xs fill-white font-bold"
              >
                {station.code}
              </text>
              
              {/* Station Name */}
              <text
                x={station.x}
                y={station.y - 20}
                textAnchor="middle"
                className="text-xs fill-green-400 font-medium"
              >
                {station.name.substring(0, 8)}
              </text>
              
              {/* Signal Light */}
              <circle
                cx={station.x}
                cy={station.y - 30}
                r="4"
                fill={getSignalColor(station.signal)}
                className={station.signal === 'GREEN' ? 'animate-pulse' : ''}
              />
              
              {/* Platform Indicators */}
              <rect
                x={station.x - 12}
                y={station.y + 10}
                width="24"
                height="3"
                fill={getSignalColor(station.signal)}
                opacity="0.7"
              />
            </g>
          ))}
          
          {/* Track Sections with Signals */}
          {stations.map((station, index) => {
            if (index < stations.length - 1) {
              const nextStation = stations[index + 1];
              return (
                <g key={`section-${index}`}>
                  {/* Track Section */}
                  <line
                    x1={station.x + 15}
                    y1={station.y}
                    x2={nextStation.x - 15}
                    y2={nextStation.y}
                    stroke="#10b981"
                    strokeWidth="4"
                    opacity="0.8"
                    strokeDasharray="10,5"
                  />
                  
                  {/* Block Signals */}
                  <circle
                    cx={(station.x + nextStation.x) / 2}
                    cy={(station.y + nextStation.y) / 2}
                    r="3"
                    fill="#10b981"
                    className="animate-pulse"
                  />
                </g>
              );
            }
            return null;
          })}
        </svg>

        {/* Live Trains - Following Track Route */}
        {trains.map((train) => (
          <motion.div
            key={train.id}
            className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
              selectedTrain === train.id ? 'z-20' : 'z-10'
            }`}
            style={{
              left: `${(train.x / 900) * 100}%`,
              top: `${(train.y / 650) * 100}%`,
            }}
            animate={{
              scale: selectedTrain === train.id ? 1.4 : 1,
              x: train.status === 'RUNNING' ? [0, 2, 0] : 0,
            }}
            transition={{
              scale: { duration: 0.3 },
              x: { duration: 1.5, repeat: train.status === 'RUNNING' ? Infinity : 0 }
            }}
            onClick={() => setSelectedTrain(train.id)}
          >
            <div className={`relative p-3 rounded-lg shadow-lg border-2 transition-all duration-300 ${
              selectedTrain === train.id 
                ? 'border-cyan-400 bg-gray-800' 
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
                {train.status === 'RUNNING' && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
              
              {/* Train Name */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-green-400 whitespace-nowrap">
                {train.name}
              </div>
              
              {/* Speed Display */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-mono text-cyan-400 whitespace-nowrap">
                {train.speed} km/h
              </div>
            </div>
          </motion.div>
        ))}

        {/* Movement Trails for Running Trains */}
        <svg width="100%" height="100%" viewBox="0 0 900 650" className="absolute inset-0 pointer-events-none">
          {trains.filter(t => t.status === 'RUNNING').map((train) => (
            <motion.circle
              key={`trail-${train.id}`}
              cx={train.x}
              cy={train.y}
              r="30"
              fill="none"
              stroke={getTrainStatusColor(train.status)}
              strokeWidth="2"
              strokeDasharray="4,4"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          ))}
          
          {/* Direction Arrows */}
          {trains.filter(t => t.status === 'RUNNING').map((train) => (
            <motion.polygon
              key={`arrow-${train.id}`}
              points={train.direction === 'DOWN' ? 
                `${train.x + 15},${train.y} ${train.x + 25},${train.y - 5} ${train.x + 25},${train.y + 5}` :
                `${train.x - 15},${train.y} ${train.x - 25},${train.y - 5} ${train.x - 25},${train.y + 5}`
              }
              fill={getTrainStatusColor(train.status)}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
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
            const train = trains.find(t => t.id === selectedTrain);
            if (!train) return null;
            
            return (
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Train:</span>
                  <p className="text-white font-bold">{train.name} ({train.id})</p>
                </div>
                <div>
                  <span className="text-gray-400">Current:</span>
                  <p className="text-cyan-400 font-bold">{train.currentStation}</p>
                </div>
                <div>
                  <span className="text-gray-400">Next:</span>
                  <p className="text-green-400 font-bold">{train.nextStation}</p>
                </div>
                <div>
                  <span className="text-gray-400">Speed:</span>
                  <p className="text-white font-bold">{train.speed} km/h</p>
                </div>
                <div>
                  <span className="text-gray-400">Load:</span>
                  <p className={`font-bold ${train.passengerLoad > 90 ? 'text-red-400' : 'text-green-400'}`}>
                    {train.passengerLoad}%
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <p className={`font-bold ${train.delay > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {train.delay > 0 ? `DELAYED +${train.delay}min` : 'ON TIME'}
                  </p>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}

      {/* System Status Bar - Like Real Control Center */}
      <div className="bg-gray-800 px-6 py-3 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-green-400 font-mono">DEPOT: DC ENERGIZED</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-green-400 font-mono">TT: DC ENERGIZED</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-yellow-400 font-mono">THIRD RAIL: ACTIVE</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-blue-400 font-mono">SYSTEM TIME: {currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">Active Trains: <span className="text-white font-bold">{trains.length}</span></span>
            <span className="text-gray-400">Total Load: <span className="text-white font-bold">
              {Math.round(trains.reduce((sum, t) => sum + t.passengerLoad, 0) / trains.length)}%
            </span></span>
            <span className="text-gray-400">System: <span className="text-green-400 font-bold">NORMAL</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingDisplay;