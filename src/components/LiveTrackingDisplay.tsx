import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Train, MapPin, Activity, Zap, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { liveTrackingTrains } from '../data/consistentTrainData';

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
  trackLine: number;
  progress: number;
}

interface TrackSection {
  id: string;
  startX: number;
  endX: number;
  y: number;
  isOccupied: boolean;
  occupiedBy?: string;
}

const LiveTrackingDisplay: React.FC<LiveTrackingDisplayProps> = ({ height = 600 }) => {
  const [selectedTrain, setSelectedTrain] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real Kochi Metro Stations - Based on your diagram
  const stations = [
    { code: 'ALV', name: 'Aluva', x: 100, y: 200, km: 0.0 },
    { code: 'PUL', name: 'Pulinchodu', x: 180, y: 200, km: 2.1 },
    { code: 'COM', name: 'Companypady', x: 260, y: 200, km: 3.8 },
    { code: 'AMB', name: 'Ambattukavu', x: 340, y: 200, km: 5.2 },
    { code: 'MUT', name: 'Muttom', x: 420, y: 200, km: 6.8 },
    { code: 'KAL', name: 'Kalamassery', x: 500, y: 200, km: 8.4 },
    { code: 'COC', name: 'Cochin University', x: 580, y: 200, km: 10.1 },
    { code: 'PAT', name: 'Pathadipalam', x: 660, y: 200, km: 11.7 },
    { code: 'EDA', name: 'Edapally', x: 740, y: 200, km: 13.2 },
    { code: 'CHA', name: 'Changampuzha Park', x: 820, y: 200, km: 14.8 },
    { code: 'PAL', name: 'Palarivattom', x: 900, y: 200, km: 16.3 },
    { code: 'JLN', name: 'JLN Stadium', x: 980, y: 200, km: 17.9 },
    { code: 'KAL', name: 'Kaloor', x: 1060, y: 200, km: 19.4 },
    { code: 'TOW', name: 'Town Hall', x: 1140, y: 200, km: 20.8 },
    { code: 'MGR', name: 'M.G Road', x: 1220, y: 200, km: 22.1 },
    { code: 'MAH', name: 'Maharajas College', x: 1300, y: 200, km: 23.4 },
    { code: 'ERN', name: 'Ernakulam South', x: 1380, y: 200, km: 24.7 },
    { code: 'KAD', name: 'Kadavanthra', x: 1460, y: 200, km: 26.2 },
    { code: 'ELA', name: 'Elamkulam', x: 1540, y: 200, km: 27.8 },
    { code: 'VYT', name: 'Vyttila', x: 1620, y: 200, km: 29.3 },
    { code: 'THA', name: 'Thaikoodam', x: 1700, y: 200, km: 30.9 },
    { code: 'PET', name: 'Petta', x: 1780, y: 200, km: 32.4 },
    { code: 'VAD', name: 'Vadakkekotta', x: 1860, y: 200, km: 33.8 },
    { code: 'TRI', name: 'Tripunithura', x: 1940, y: 200, km: 35.2 }
  ];

  // Track sections for occupation detection
  const [trackSections, setTrackSections] = useState<TrackSection[]>(() => {
    const sections: TrackSection[] = [];
    for (let i = 0; i < stations.length - 1; i++) {
      // UP track sections
      sections.push({
        id: `up-${i}`,
        startX: stations[i].x,
        endX: stations[i + 1].x,
        y: 180,
        isOccupied: false
      });
      // DOWN track sections
      sections.push({
        id: `down-${i}`,
        startX: stations[i].x,
        endX: stations[i + 1].x,
        y: 220,
        isOccupied: false
      });
    }
    return sections;
  });

  // Live trains - Based on your diagram with train numbers
  const [trains, setTrains] = useState<TrainPosition[]>(() => 
    liveTrackingTrains.map(train => ({
      id: train.id,
      name: train.name,
      x: train.x,
      y: train.y,
      speed: train.speed,
      direction: train.direction as 'UP' | 'DOWN',
      status: train.status as 'RUNNING' | 'STOPPED' | 'APPROACHING' | 'DEPARTING',
      currentStation: train.currentStation,
      nextStation: train.nextStation,
      delay: train.delay,
      passengerLoad: train.passengerLoad,
      trackLine: train.trackLine,
      progress: train.progress
    }))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Update train positions and track occupation
      setTrains(prevTrains => {
        const newTrains = prevTrains.map(train => {
          if (train.status === 'RUNNING') {
            const currentStationIndex = stations.findIndex(s => s.code === train.currentStation);
            const nextStationIndex = stations.findIndex(s => s.code === train.nextStation);
            
            if (currentStationIndex !== -1 && nextStationIndex !== -1) {
              const currentStation = stations[currentStationIndex];
              const nextStation = stations[nextStationIndex];
              
              // Calculate new progress
              let newProgress = train.progress + (train.speed * 0.003); // 3x faster movement
              
              // Interpolate position along track
              const newX = currentStation.x + (nextStation.x - currentStation.x) * newProgress;
              const newY = train.trackLine === 1 ? 180 : 220;
              
              // Check if reached next station
              if (newProgress >= 1.0) {
                let newCurrentStationIndex = nextStationIndex;
                let newNextStationIndex;
                let newDirection = train.direction;
                let newTrackLine = train.trackLine;
                
                if (train.direction === 'DOWN') {
                  newNextStationIndex = Math.min(nextStationIndex + 1, stations.length - 1);
                  if (newNextStationIndex === stations.length - 1) {
                    newDirection = 'UP';
                    newTrackLine = 1;
                    newNextStationIndex = Math.max(newCurrentStationIndex - 1, 0);
                  }
                } else {
                  newNextStationIndex = Math.max(nextStationIndex - 1, 0);
                  if (newNextStationIndex === 0) {
                    newDirection = 'DOWN';
                    newTrackLine = 2;
                    newNextStationIndex = Math.min(newCurrentStationIndex + 1, stations.length - 1);
                  }
                }
                
                return {
                  ...train,
                  x: stations[newCurrentStationIndex].x,
                  y: newTrackLine === 1 ? 180 : 220,
                  direction: newDirection,
                  trackLine: newTrackLine,
                  currentStation: stations[newCurrentStationIndex].code,
                  nextStation: stations[newNextStationIndex].code,
                  progress: 0.0,
                  speed: Math.random() > 0.3 ? Math.floor(Math.random() * 20) + 35 : 0 // Vary speed or stop
                };
              } else {
                return {
                  ...train,
                  x: newX,
                  y: newY,
                  progress: newProgress,
                  speed: train.status === 'STOPPED' ? 0 : Math.floor(Math.random() * 20) + 35
                };
              }
            }
          }
          
          // Handle stopped trains - randomly resume movement
          if (train.status === 'STOPPED' && Math.random() > 0.5) { // Resume faster
            return {
              ...train,
              status: 'RUNNING',
              speed: Math.floor(Math.random() * 20) + 35
            };
          }
          
          // Handle running trains - randomly stop at stations
          if (train.status === 'RUNNING' && Math.random() > 0.98) { // Stop less frequently
            return {
              ...train,
              status: 'STOPPED',
              speed: 0,
              delay: Math.random() > 0.5 ? Math.floor(Math.random() * 3) + 1 : 0
            };
          }
          
          return train;
        });
        
        // Update track occupation
        setTrackSections(prevSections => 
          prevSections.map(section => {
            const isOccupied = newTrains.some(train => {
              const trainOnCorrectTrack = (section.y === 180 && train.trackLine === 1) || 
                                        (section.y === 220 && train.trackLine === 2);
              return trainOnCorrectTrack && 
                     train.x >= section.startX - 20 && 
                     train.x <= section.endX + 20;
            });
            
            const occupyingTrain = newTrains.find(train => {
              const trainOnCorrectTrack = (section.y === 180 && train.trackLine === 1) || 
                                        (section.y === 220 && train.trackLine === 2);
              return trainOnCorrectTrack && 
                     train.x >= section.startX - 20 && 
                     train.x <= section.endX + 20;
            });
            
            return {
              ...section,
              isOccupied,
              occupiedBy: occupyingTrain?.id
            };
          })
        );
        
        return newTrains;
      });
    }, 200); // Faster updates for smoother animation

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
      <div className="bg-kmrl-grey-800 px-6 py-4 border-b border-kmrl-grey-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-kmrl-lime-500 p-2 rounded-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">KMRL Live Tracking System</h3>
              <p className="text-sm text-kmrl-grey-300">Real-time train monitoring & control</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-kmrl-lime-500 rounded-full animate-pulse"></div>
              <span className="text-kmrl-lime-400 text-sm font-medium">SYSTEM ACTIVE</span>
            </div>
            <div className="text-white text-sm font-mono">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Live Tracking Display */}
      <div className="relative bg-kmrl-grey-900 p-6" style={{ height: `${height}px` }}>
        <svg width="100%" height="100%" viewBox="0 0 2100 400" className="absolute inset-0">
          {/* Track Infrastructure */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Track Sections with Dynamic Colors */}
          {trackSections.map((section) => (
            <line
              key={section.id}
              x1={section.startX}
              y1={section.y}
              x2={section.endX}
              y2={section.y}
              stroke={section.isOccupied ? '#ef4444' : '#14b8a6'}
              strokeWidth="8"
              filter="url(#glow)"
            />
          ))}
          
          {/* Stations */}
          {stations.map((station, index) => (
            <g key={station.code}>
              {/* Station Platform Blocks */}
              <rect
                x={station.x - 15}
                y={165}
                width="30"
                height="8"
                fill="#4b5563"
                stroke="#14b8a6"
                strokeWidth="1"
                rx="2"
              />
              <rect
                x={station.x - 15}
                y={227}
                width="30"
                height="8"
                fill="#4b5563"
                stroke="#14b8a6"
                strokeWidth="1"
                rx="2"
              />
              
              {/* Station Code Labels */}
              <text
                x={station.x}
                y={155}
                textAnchor="middle"
                className="text-xs fill-kmrl-lime-400 font-bold"
              >
                {station.code}
              </text>
              
              {/* Station Name */}
              <text
                x={station.x}
                y={145}
                textAnchor="middle"
                className="text-xs fill-kmrl-grey-400"
              >
                {station.name}
              </text>
              
              {/* Platform Numbers */}
              <text
                x={station.x}
                y={170}
                textAnchor="middle"
                className="text-xs fill-kmrl-aquamarine-400 font-mono"
              >
                1
              </text>
              <text
                x={station.x}
                y={245}
                textAnchor="middle"
                className="text-xs fill-kmrl-aquamarine-400 font-mono"
              >
                2
              </text>
              
              {/* Signal Lights */}
              <circle
                cx={station.x - 25}
                cy={175}
                r="3"
                fill="#14b8a6"
                className="animate-pulse"
              />
              <circle
                cx={station.x + 25}
                cy={225}
                r="3"
                fill="#14b8a6"
                className="animate-pulse"
              />
              
              {/* Crossover Points (X marks) at major stations */}
              {(station.code === 'MUT' || station.code === 'PAL' || station.code === 'VYT' || station.code === 'KAL') && (
                <g stroke="#fbbf24" strokeWidth="3">
                  <path d={`M ${station.x - 15} 175 L ${station.x + 15} 225`} />
                  <path d={`M ${station.x + 15} 175 L ${station.x - 15} 225`} />
                  <text
                    x={station.x}
                    y={205}
                    textAnchor="middle"
                    className="text-xs fill-kmrl-yellow-400 font-bold"
                  >
                    ✕
                  </text>
                </g>
              )}
            </g>
          ))}
          
          {/* Depot Connection at Muttom */}
          <g stroke="#fbbf24" strokeWidth="3" strokeDasharray="6,3">
            <path d="M 420 180 L 420 120 L 380 100" />
            <path d="M 420 220 L 420 280 L 380 300" />
            <text x="375" y="95" className="text-xs fill-kmrl-yellow-400 font-bold">DEPOT</text>
            <text x="375" y="305" className="text-xs fill-kmrl-yellow-400 font-bold">YARD</text>
          </g>
        </svg>

        {/* Live Trains - Blue Dark Boxes (Like Your Diagram) */}
        {trains.map((train) => (
          <motion.div
            key={train.id}
            className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
              selectedTrain === train.id ? 'z-20' : 'z-10'
            }`}
            style={{
              left: `${(train.x / 2100) * 100}%`,
              top: `${(train.y / 400) * 100}%`,
            }}
            animate={{
              scale: selectedTrain === train.id ? 1.2 : 1,
            }}
            transition={{ scale: { duration: 0.3 } }}
            onClick={() => setSelectedTrain(train.id)}
          >
            {/* Blue Dark Box - Exactly Like Your Diagram */}
            <div className={`relative transition-all duration-300 ${
              selectedTrain === train.id 
                ? 'border-2 border-kmrl-aquamarine-400' 
                : 'border border-kmrl-grey-600'
            }`}>
              <div 
                className="w-12 h-6 bg-kmrl-aquamarine-800 border border-kmrl-aquamarine-700 rounded-sm flex items-center justify-center relative shadow-lg"
                style={{ backgroundColor: train.status === 'STOPPED' ? '#0f766e' : '#115e59' }}
              >
                {/* Train Number - White Text */}
                <span className="text-white text-xs font-bold">{train.id}</span>
                
                {/* Direction Arrow */}
                <div className={`absolute ${train.direction === 'DOWN' ? 'right-0' : 'left-0'} top-1/2 transform -translate-y-1/2`}>
                  <div className={`w-0 h-0 ${
                    train.direction === 'DOWN' 
                      ? 'border-l-2 border-l-white border-t-1 border-t-transparent border-b-1 border-b-transparent'
                      : 'border-r-2 border-r-white border-t-1 border-t-transparent border-b-1 border-b-transparent'
                  }`}></div>
                </div>
              </div>
              
              {/* Status Indicators */}
              <div className="absolute -top-1 -right-1 flex space-x-1">
                {train.delay > 0 && (
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                )}
                {train.status === 'RUNNING' && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
              
              {/* Speed Display */}
              {train.status === 'RUNNING' && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-mono text-kmrl-aquamarine-400 whitespace-nowrap">
                  {train.speed}km/h
                </div>
              )}
            </div>
          </motion.div>
        ))}
        
         {/* Power Status */}
         <div className="absolute top-4 right-4 bg-kmrl-grey-800/90 rounded-lg p-3 text-white text-xs font-mono">
           <div className="space-y-1">
             <div className="flex items-center space-x-2">
               <div className="w-2 h-2 bg-kmrl-lime-500 rounded-full animate-pulse"></div>
               <span>DEPOT: DC ENERGIZED</span>
             </div>
             <div className="flex items-center space-x-2">
               <div className="w-2 h-2 bg-kmrl-lime-500 rounded-full animate-pulse"></div>
               <span>TT: DC ENERGIZED</span>
             </div>
             <div className="flex items-center space-x-2">
               <div className="w-2 h-2 bg-kmrl-lime-500 rounded-full animate-pulse"></div>
               <span>THIRD RAIL: ACTIVE</span>
             </div>
           </div>
         </div>
       </div>

       {/* Selected Train Details */}
       {selectedTrain && (
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-kmrl-grey-800 border-t border-kmrl-grey-700 p-4"
         >
           {(() => {
             const train = trains.find(t => t.id === selectedTrain);
             if (!train) return null;
             
             return (
               <div className="text-white">
                 <h4 className="font-semibold text-kmrl-aquamarine-400 mb-2">Train {train.id} - {train.name}</h4>
                 <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                   <div>
                     <span className="text-kmrl-grey-400">Current Station:</span>
                     <p className="text-white font-medium">{train.currentStation}</p>
                   </div>
                   <div>
                     <span className="text-kmrl-grey-400">Next Station:</span>
                     <p className="text-white font-medium">{train.nextStation}</p>
                   </div>
                   <div>
                     <span className="text-kmrl-grey-400">Speed:</span>
                     <p className="text-white font-medium">{train.speed} km/h</p>
                   </div>
                   <div>
                     <span className="text-kmrl-grey-400">Direction:</span>
                     <p className="text-white font-medium">{train.direction}</p>
                   </div>
                   <div>
                     <span className="text-kmrl-grey-400">Status:</span>
                     <p className={`font-medium ${
                       train.status === 'RUNNING' ? 'text-kmrl-lime-400' :
                       train.status === 'STOPPED' ? 'text-red-400' : 'text-yellow-400'
                     }`}>
                       {train.status}
                     </p>
                   </div>
                 </div>
                 <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                   <div>
                     <span className="text-kmrl-grey-400">Passenger Load:</span>
                     <p className="text-white font-medium">{train.passengerLoad}%</p>
                   </div>
                   <div>
                     <span className="text-kmrl-grey-400">Delay:</span>
                     <p className={`font-medium ${train.delay > 0 ? 'text-red-400' : 'text-kmrl-lime-400'}`}>
                       {train.delay > 0 ? `+${train.delay} min` : 'On Time'}
                     </p>
                   </div>
                 </div>
               </div>
             );
           })()}
         </motion.div>
       )}
     </div>
   );
 };
 
 export default LiveTrackingDisplay;