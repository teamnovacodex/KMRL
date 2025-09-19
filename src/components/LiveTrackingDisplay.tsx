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
  status: 'RUNNING' | 'STOPPED' | 'APPROACHING' | 'DEPARTING';
  currentStation: string;
  nextStation: string;
  delay: number;
  passengerLoad: number;
  trackLine: number; // 1 = UP track, 2 = DOWN track
}

const LiveTrackingDisplay: React.FC<LiveTrackingDisplayProps> = ({ height = 600 }) => {
  const [selectedTrain, setSelectedTrain] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [trains, setTrains] = useState<TrainPosition[]>([
    {
      id: '001',
      name: 'SARAW',
      x: 150,
      y: 120,
      speed: 48,
      direction: 'DOWN',
      status: 'RUNNING',
      currentStation: 'ALV',
      nextStation: 'COM',
      delay: 0,
      passengerLoad: 65,
      trackLine: 2
    },
    {
      id: '003',
      name: 'TAPTI',
      x: 250,
      y: 160,
      speed: 45,
      direction: 'DOWN',
      status: 'RUNNING',
      currentStation: 'COM',
      nextStation: 'AMB',
      delay: 0,
      passengerLoad: 72,
      trackLine: 2
    },
    {
      id: '005',
      name: 'GANGA',
      x: 350,
      y: 200,
      speed: 45,
      direction: 'DOWN',
      status: 'RUNNING',
      currentStation: 'MUT',
      nextStation: 'KAL',
      delay: 0,
      passengerLoad: 68,
      trackLine: 2
    },
    {
      id: '007',
      name: 'KAVRI',
      x: 650,
      y: 320,
      speed: 0,
      direction: 'UP',
      status: 'STOPPED',
      currentStation: 'TOW',
      nextStation: 'KAL',
      delay: 2,
      passengerLoad: 85,
      trackLine: 1
    },
    {
      id: '009',
      name: 'KRISHNA',
      x: 850,
      y: 400,
      speed: 52,
      direction: 'UP',
      status: 'RUNNING',
      currentStation: 'VYT',
      nextStation: 'ELA',
      delay: 0,
      passengerLoad: 92,
      trackLine: 1
    }
  ]);

  // Real Kochi Metro Stations with exact positions from your control center image
  const stations = [
    { code: 'ALV', name: 'Aluva', x: 100, y: 100, signal: 'GREEN' },
    { code: 'PUL', name: 'Pulinchodu', x: 150, y: 120, signal: 'GREEN' },
    { code: 'COM', name: 'Companypady', x: 200, y: 140, signal: 'GREEN' },
    { code: 'AMB', name: 'Ambattukavu', x: 250, y: 160, signal: 'GREEN' },
    { code: 'MUT', name: 'Muttom', x: 300, y: 180, signal: 'GREEN' },
    { code: 'KAL', name: 'Kalamassery', x: 350, y: 200, signal: 'GREEN' },
    { code: 'COC', name: 'Cochin University', x: 400, y: 220, signal: 'GREEN' },
    { code: 'PAT', name: 'Pathadipalam', x: 450, y: 240, signal: 'GREEN' },
    { code: 'EDA', name: 'Edapally', x: 500, y: 260, signal: 'GREEN' },
    { code: 'CHA', name: 'Changampuzha Park', x: 550, y: 280, signal: 'GREEN' },
    { code: 'PAL', name: 'Palarivattom', x: 600, y: 300, signal: 'GREEN' },
    { code: 'JLN', name: 'JLN Stadium', x: 650, y: 320, signal: 'GREEN' },
    { code: 'KAL', name: 'Kaloor', x: 700, y: 340, signal: 'RED' },
    { code: 'TOW', name: 'Town Hall', x: 750, y: 360, signal: 'GREEN' },
    { code: 'MGR', name: 'M.G Road', x: 800, y: 380, signal: 'GREEN' },
    { code: 'MAH', name: 'Maharajas College', x: 850, y: 400, signal: 'GREEN' },
    { code: 'ERN', name: 'Ernakulam South', x: 900, y: 420, signal: 'GREEN' },
    { code: 'KAD', name: 'Kadavanthra', x: 950, y: 440, signal: 'GREEN' },
    { code: 'ELA', name: 'Elamkulam', x: 1000, y: 460, signal: 'GREEN' },
    { code: 'VYT', name: 'Vyttila', x: 1050, y: 480, signal: 'GREEN' },
    { code: 'THA', name: 'Thaikoodam', x: 1100, y: 500, signal: 'GREEN' },
    { code: 'PET', name: 'Petta', x: 1150, y: 520, signal: 'GREEN' },
    { code: 'VAD', name: 'Vadakkekotta', x: 1200, y: 540, signal: 'GREEN' },
    { code: 'TRI', name: 'Tripunithura', x: 1250, y: 560, signal: 'GREEN' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Realistic train movement along the exact track route
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
                const moveSpeed = train.speed * 0.05; // Realistic movement speed
                const moveX = (dx / distance) * moveSpeed;
                const moveY = (dy / distance) * moveSpeed;
                
                let newX = train.x + moveX;
                let newY = train.y + moveY;
                
                // Adjust Y position based on track line (UP/DOWN tracks are parallel)
                if (train.trackLine === 1) {
                  newY = newY - 15; // UP track (top line)
                } else {
                  newY = newY + 15; // DOWN track (bottom line)
                }
                
                // Check if reached next station
                const distanceToNext = Math.sqrt(
                  Math.pow(newX - nextStation.x, 2) + Math.pow(newY - nextStation.y, 2)
                );
                
                if (distanceToNext < 30) {
                  // Reached next station, update to next segment
                  newX = nextStation.x;
                  newY = nextStation.y + (train.trackLine === 1 ? -15 : 15);
                  
                  const newCurrentStationIndex = nextStationIndex;
                  let newNextStationIndex;
                  
                  if (train.direction === 'DOWN') {
                    newNextStationIndex = Math.min(nextStationIndex + 1, stations.length - 1);
                    // If reached end, turn around
                    if (newNextStationIndex === stations.length - 1) {
                      return {
                        ...train,
                        x: newX,
                        y: newY,
                        direction: 'UP',
                        trackLine: 1,
                        currentStation: stations[newCurrentStationIndex].code,
                        nextStation: stations[Math.max(newCurrentStationIndex - 1, 0)].code
                      };
                    }
                  } else {
                    newNextStationIndex = Math.max(nextStationIndex - 1, 0);
                    // If reached start, turn around
                    if (newNextStationIndex === 0) {
                      return {
                        ...train,
                        x: newX,
                        y: newY,
                        direction: 'DOWN',
                        trackLine: 2,
                        currentStation: stations[newCurrentStationIndex].code,
                        nextStation: stations[Math.min(newCurrentStationIndex + 1, stations.length - 1)].code
                      };
                    }
                  }
                  
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
    }, 1000); // Update every second for smooth movement

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

      {/* Live Tracking Display - Exact Layout from Control Center Image */}
      <div className="relative bg-black p-6" style={{ height: `${height}px` }}>
        <svg width="100%" height="100%" viewBox="0 0 1400 650" className="absolute inset-0">
          {/* Track Infrastructure - Like Real Control Center */}
          <defs>
            {/* Track Pattern */}
            <pattern id="trackPattern" x="0" y="0" width="20" height="4" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="20" height="4" fill="#10b981"/>
              <rect x="0" y="1" width="20" height="2" fill="#059669"/>
            </pattern>
            
            {/* Signal Light Pattern */}
            <pattern id="signalPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="3" fill="#10b981"/>
            </pattern>
          </defs>
          
          {/* Main Track Lines - UP and DOWN tracks (parallel) */}
          <g stroke="#10b981" strokeWidth="4" fill="none">
            {/* DOWN Track (Aluva to Tripunithura) - Bottom line */}
            <path 
              d="M 100 130 L 150 140 L 200 150 L 250 170 L 300 190 L 350 210 L 400 230 L 450 250 L 500 270 L 550 290 L 600 310 L 650 330 L 700 350 L 750 370 L 800 390 L 850 410 L 900 430 L 950 450 L 1000 470 L 1050 490 L 1100 510 L 1150 530 L 1200 550 L 1250 570" 
              strokeDasharray="0"
              filter="drop-shadow(0 0 6px #10b981)"
            />
            
            {/* UP Track (Tripunithura to Aluva) - Top line */}
            <path 
              d="M 100 100 L 150 110 L 200 120 L 250 140 L 300 160 L 350 180 L 400 200 L 450 220 L 500 240 L 550 260 L 600 280 L 650 300 L 700 320 L 750 340 L 800 360 L 850 380 L 900 400 L 950 420 L 1000 440 L 1050 460 L 1100 480 L 1150 500 L 1200 520 L 1250 540" 
              strokeDasharray="0"
              filter="drop-shadow(0 0 6px #10b981)"
            />
          </g>
          
          {/* Cross-over Tracks and Junctions */}
          <g stroke="#f59e0b" strokeWidth="3" fill="none">
            {/* Junction at Muttom (Depot Connection) */}
            <path d="M 300 160 L 320 140 L 340 160" strokeDasharray="5,5" />
            <path d="M 300 190 L 320 210 L 340 190" strokeDasharray="5,5" />
            
            {/* Cross-over at Palarivattom */}
            <path d="M 600 280 L 620 310 M 600 310 L 620 280" strokeDasharray="3,3" />
            
            {/* Terminal Connections */}
            <path d="M 100 100 L 80 80 L 60 100" strokeDasharray="5,5" />
            <path d="M 1250 540 L 1270 520 L 1290 540" strokeDasharray="5,5" />
          </g>
          
          {/* Station Markers - Exact Layout from Control Center */}
          {stations.map((station, index) => (
            <g key={station.code}>
              {/* Station Platform (UP Track) */}
              <rect
                x={station.x - 20}
                y={station.y - 25}
                width="40"
                height="12"
                fill="#1f2937"
                stroke={getSignalColor(station.signal)}
                strokeWidth="2"
                rx="2"
              />
              
              {/* Station Platform (DOWN Track) */}
              <rect
                x={station.x - 20}
                y={station.y + 15}
                width="40"
                height="12"
                fill="#1f2937"
                stroke={getSignalColor(station.signal)}
                strokeWidth="2"
                rx="2"
              />
              
              {/* Station Code */}
              <text
                x={station.x}
                y={station.y - 35}
                textAnchor="middle"
                className="text-xs fill-green-400 font-bold"
              >
                {station.code}
              </text>
              
              {/* Station Name */}
              <text
                x={station.x}
                y={station.y - 50}
                textAnchor="middle"
                className="text-xs fill-white font-medium"
              >
                {station.name.substring(0, 8)}
              </text>
              
              {/* Signal Lights - UP Track */}
              <circle
                cx={station.x - 30}
                cy={station.y - 19}
                r="3"
                fill={getSignalColor(station.signal)}
                className={station.signal === 'GREEN' ? 'animate-pulse' : ''}
              />
              
              {/* Signal Lights - DOWN Track */}
              <circle
                cx={station.x + 30}
                cy={station.y + 21}
                r="3"
                fill={getSignalColor(station.signal)}
                className={station.signal === 'GREEN' ? 'animate-pulse' : ''}
              />
              
              {/* Platform Numbers */}
              <text
                x={station.x}
                y={station.y - 15}
                textAnchor="middle"
                className="text-xs fill-cyan-400 font-mono"
              >
                1
              </text>
              <text
                x={station.x}
                y={station.y + 25}
                textAnchor="middle"
                className="text-xs fill-cyan-400 font-mono"
              >
                2
              </text>
              
              {/* Block Sections */}
              {index < stations.length - 1 && (
                <g>
                  {/* Block Signal */}
                  <rect
                    x={station.x + 25}
                    y={station.y - 5}
                    width="8"
                    height="8"
                    fill="#10b981"
                    className="animate-pulse"
                  />
                  <text
                    x={station.x + 29}
                    y={station.y + 1}
                    textAnchor="middle"
                    className="text-xs fill-white font-mono"
                  >
                    {index + 1}
                  </text>
                </g>
              )}
            </g>
          ))}
          
          {/* Track Sections with Block Signals */}
          {stations.map((station, index) => {
            if (index < stations.length - 1) {
              const nextStation = stations[index + 1];
              return (
                <g key={`section-${index}`}>
                  {/* Track Section Markers */}
                  <line
                    x1={station.x + 20}
                    y1={station.y - 19}
                    x2={nextStation.x - 20}
                    y2={nextStation.y - 19}
                    stroke="#10b981"
                    strokeWidth="2"
                    opacity="0.6"
                    strokeDasharray="10,5"
                  />
                  <line
                    x1={station.x + 20}
                    y1={station.y + 21}
                    x2={nextStation.x - 20}
                    y2={nextStation.y + 21}
                    stroke="#10b981"
                    strokeWidth="2"
                    opacity="0.6"
                    strokeDasharray="10,5"
                  />
                  
                  {/* Block Signals */}
                  <circle
                    cx={(station.x + nextStation.x) / 2}
                    cy={(station.y + nextStation.y) / 2 - 15}
                    r="2"
                    fill="#10b981"
                    className="animate-pulse"
                  />
                  <circle
                    cx={(station.x + nextStation.x) / 2}
                    cy={(station.y + nextStation.y) / 2 + 15}
                    r="2"
                    fill="#10b981"
                    className="animate-pulse"
                  />
                </g>
              );
            }
            return null;
          })}
          
          {/* Depot Connection Lines */}
          <g stroke="#f59e0b" strokeWidth="2" strokeDasharray="8,4">
            <path d="M 300 160 L 300 100 L 250 80" />
            <path d="M 300 190 L 300 250 L 250 270" />
            <text x="275" y="75" className="text-xs fill-yellow-400 font-bold">DEPOT</text>
          </g>
        </svg>

        {/* Live Trains - Following Exact Track Route */}
        {trains.map((train) => (
          <motion.div
            key={train.id}
            className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
              selectedTrain === train.id ? 'z-20' : 'z-10'
            }`}
            style={{
              left: `${(train.x / 1400) * 100}%`,
              top: `${(train.y / 650) * 100}%`,
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
            {/* Train Icon - Professional Railway Style */}
            <div className={`relative p-2 rounded-lg shadow-lg border-2 transition-all duration-300 ${
              selectedTrain === train.id 
                ? 'border-cyan-400 bg-gray-700' 
                : 'border-gray-600 bg-gray-800 hover:border-gray-500'
            }`}>
              <div 
                className="w-8 h-4 rounded-sm flex items-center justify-center"
                style={{ backgroundColor: getTrainStatusColor(train.status) }}
              >
                <Train className="h-3 w-3 text-white" />
              </div>
              
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
              
              {/* Direction Indicator */}
              <div className="absolute -left-6 top-1/2 transform -translate-y-1/2">
                <div className={`w-0 h-0 ${
                  train.direction === 'DOWN' 
                    ? 'border-l-4 border-l-transparent border-r-4 border-r-green-400 border-t-2 border-t-transparent border-b-2 border-b-transparent'
                    : 'border-r-4 border-r-transparent border-l-4 border-l-green-400 border-t-2 border-t-transparent border-b-2 border-b-transparent'
                }`}></div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Movement Trails for Running Trains */}
        <svg width="100%" height="100%" viewBox="0 0 1400 650" className="absolute inset-0 pointer-events-none">
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
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          ))}
          
          {/* Speed Vectors */}
          {trains.filter(t => t.status === 'RUNNING').map((train) => (
            <motion.line
              key={`vector-${train.id}`}
              x1={train.x}
              y1={train.y}
              x2={train.x + (train.direction === 'DOWN' ? 20 : -20)}
              y2={train.y}
              stroke="#00ff00"
              strokeWidth="3"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          ))}
        </svg>
        
        {/* Station Information Overlay */}
        <div className="absolute top-4 left-4 bg-gray-800/90 rounded-lg p-3 text-white text-xs font-mono">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-green-400">ACTIVE TRAINS</div>
              <div className="text-2xl font-bold">{trains.filter(t => t.status === 'RUNNING').length}</div>
            </div>
            <div>
              <div className="text-yellow-400">STOPPED</div>
              <div className="text-2xl font-bold">{trains.filter(t => t.status === 'STOPPED').length}</div>
            </div>
            <div>
              <div className="text-red-400">DELAYED</div>
              <div className="text-2xl font-bold">{trains.filter(t => t.delay > 0).length}</div>
            </div>
          </div>
        </div>
        
        {/* Track Legend */}
        <div className="absolute bottom-4 left-4 bg-gray-800/90 rounded-lg p-3 text-white text-xs">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-1 bg-green-500"></div>
              <span>UP Track (Tripunithura → Aluva)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-1 bg-green-500"></div>
              <span>DOWN Track (Aluva → Tripunithura)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-1 bg-yellow-500"></div>
              <span>Cross-over & Junctions</span>
            </div>
          </div>
        </div>
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
                  <span className="text-gray-400">Track:</span>
                  <p className="text-yellow-400 font-bold">{train.direction} (Line {train.trackLine})</p>
                </div>
                <div>
                  <span className="text-gray-400">Load:</span>
                  <p className={`font-bold ${train.passengerLoad > 90 ? 'text-red-400' : 'text-green-400'}`}>
                    {train.passengerLoad}%
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
            <span className="text-gray-400">Active Trains: <span className="text-white font-bold">{trains.filter(t => t.status === 'RUNNING').length}</span></span>
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