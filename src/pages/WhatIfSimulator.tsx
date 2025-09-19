import React, { useState, useEffect } from 'react';
import { Settings, RotateCcw, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { metroTrains } from '../data/metroMockData';
import { Train as TrainType } from '../types/metro';

const WhatIfSimulator: React.FC = () => {
  const [trains, setTrains] = useState<TrainType[]>(metroTrains);
  const [excludedTrains, setExcludedTrains] = useState<Set<string>>(new Set());
  const [forcedInclusions, setForcedInclusions] = useState<Map<string, string>>(new Map());
  const [isSimulating, setIsSimulating] = useState(false);

  const handleExcludeToggle = (trainId: string) => {
    const newExcluded = new Set(excludedTrains);
    const newForced = new Map(forcedInclusions);
    
    if (newExcluded.has(trainId)) {
      newExcluded.delete(trainId);
    } else {
      newExcluded.add(trainId);
      newForced.delete(trainId); // Remove from forced inclusions if excluding
    }
    
    setExcludedTrains(newExcluded);
    setForcedInclusions(newForced);
    runSimulation();
  };

  const handleForceInclude = (trainId: string, recommendation: string) => {
    const newForced = new Map(forcedInclusions);
    const newExcluded = new Set(excludedTrains);
    
    if (newForced.get(trainId) === recommendation) {
      newForced.delete(trainId);
    } else {
      newForced.set(trainId, recommendation);
      newExcluded.delete(trainId); // Remove from exclusions if forcing
    }
    
    setForcedInclusions(newForced);
    setExcludedTrains(newExcluded);
    runSimulation();
  };

  const runSimulation = () => {
    setIsSimulating(true);
    
    setTimeout(() => {
      const simulatedTrains = metroTrains.map(train => {
        if (excludedTrains.has(train.id)) {
          return { ...train, recommendation: 'Maintenance' as const }; // Excluded trains go to maintenance
        }
        
        if (forcedInclusions.has(train.id)) {
          return { ...train, recommendation: forcedInclusions.get(train.id) as 'Service' | 'Standby' | 'Maintenance' };
        }
        
        // Run normal optimization logic for non-excluded, non-forced trains
        let newRecommendation = train.recommendation;
        
        if (train.fitnessStatus === 'Expired' || train.jobCardStatus === 'Open') {
          newRecommendation = 'Maintenance';
        } else if (train.mileage > 70000) {
          newRecommendation = 'Maintenance';
        } else if (train.brandingRequired || train.cleaningStatus === 'Pending') {
          newRecommendation = 'Standby';
        } else {
          newRecommendation = 'Service';
        }
        
        return { ...train, recommendation: newRecommendation };
      });
      
      setTrains(simulatedTrains);
      setIsSimulating(false);
    }, 1000);
  };

  const resetSimulation = () => {
    setTrains(metroTrains);
    setExcludedTrains(new Set());
    setForcedInclusions(new Map());
  };

  useEffect(() => {
    runSimulation();
  }, []);

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Service':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Standby':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Maintenance':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const summary = {
    service: trains.filter(t => t.recommendation === 'Service').length,
    standby: trains.filter(t => t.recommendation === 'Standby').length,
    maintenance: trains.filter(t => t.recommendation === 'Maintenance').length,
    excluded: excludedTrains.size,
    forced: forcedInclusions.size
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
            <Settings className="h-8 w-8 text-blue-600" />
            <span>What-if Simulator</span>
          </h1>
          <p className="text-gray-600 mt-2">Test different scenarios by excluding trains or forcing specific allocations</p>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Scenario Controls</h3>
            <button
              onClick={resetSimulation}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default
            </button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{summary.service}</div>
              <div className="text-sm text-green-700">In Service</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{summary.standby}</div>
              <div className="text-sm text-yellow-700">On Standby</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{summary.maintenance}</div>
              <div className="text-sm text-red-700">Maintenance</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{summary.excluded}</div>
              <div className="text-sm text-gray-700">Excluded</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{summary.forced}</div>
              <div className="text-sm text-blue-700">Force Assigned</div>
            </div>
          </div>
        </div>

        {/* Train Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Train Fleet Simulation</h3>
            <p className="text-sm text-gray-600 mt-1">Click controls to modify train assignments and see real-time impact</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {trains.map((train) => {
              const isExcluded = excludedTrains.has(train.id);
              const forcedRecommendation = forcedInclusions.get(train.id);
              
              return (
                <div 
                  key={train.id} 
                  className={`rounded-lg border-2 p-4 transition-all duration-200 ${
                    isExcluded 
                      ? 'border-red-300 bg-red-50 opacity-75' 
                      : forcedRecommendation 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-200 bg-white hover:shadow-md'
                  }`}
                >
                  {/* Train Header */}
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{train.trainNumber}</h4>
                    <button
                      onClick={() => handleExcludeToggle(train.id)}
                      className={`p-2 rounded-full transition-colors duration-200 ${
                        isExcluded 
                          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={isExcluded ? 'Include train' : 'Exclude train'}
                    >
                      {isExcluded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Train Status */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Fitness:</span>
                      <span className={`flex items-center space-x-1 ${train.fitnessStatus === 'Valid' ? 'text-green-600' : 'text-red-600'}`}>
                        {train.fitnessStatus === 'Valid' ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                        <span>{train.fitnessStatus}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Mileage:</span>
                      <span className="font-mono">{train.totalMileage.toLocaleString()} km</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Depot Bay:</span>
                      <span className="font-semibold">#{train.depotBay}</span>
                    </div>
                  </div>

                  {/* Current Recommendation */}
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Current Recommendation:</div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRecommendationColor(train.recommendation)}`}>
                      {train.recommendation}
                      {isExcluded && <span className="ml-2 text-red-600">(Excluded)</span>}
                      {forcedRecommendation && <span className="ml-2 text-blue-600">(Forced)</span>}
                    </span>
                  </div>

                  {/* Force Assignment Buttons */}
                  {!isExcluded && (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600 mb-2">Force Assignment:</div>
                      <div className="flex space-x-2">
                        {['Service', 'Standby', 'Maintenance'].map((recommendation) => (
                          <button
                            key={recommendation}
                            onClick={() => handleForceInclude(train.id, recommendation)}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${
                              forcedRecommendation === recommendation
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {recommendation}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIfSimulator;