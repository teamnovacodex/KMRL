import React, { useState, useEffect } from 'react';
import { Train, Pause, Wrench, Activity, Database, Shield, Target } from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import TrainTable from '../components/TrainTable';
import OptimizationPanel from '../components/OptimizationPanel';
import DataIntegrationPanel from '../components/DataIntegrationPanel';
import BusinessRulesPanel from '../components/BusinessRulesPanel';
import OptimizationResultsPanel from '../components/OptimizationResultsPanel';
import { mockTrains } from '../data/trains';
import { Train as TrainType, TrainSummary } from '../types/train';
import { TrainEligibility } from '../types/businessRules';
import { OptimizationResult } from '../types/optimization';
import { dataIntegrationService } from '../services/dataIntegrationService';
import { businessRulesEngine } from '../services/businessRulesEngine';
import { optimizationEngine } from '../services/optimizationEngine';

const Dashboard: React.FC = () => {
  const [trains, setTrains] = useState<TrainType[]>(mockTrains);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [summary, setSummary] = useState<TrainSummary>({ service: 0, standby: 0, maintenance: 0, total: 0 });
  const [activeTab, setActiveTab] = useState<'overview' | 'data' | 'rules' | 'optimization'>('overview');
  const [eligibilityResults, setEligibilityResults] = useState<TrainEligibility[]>([]);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);

  useEffect(() => {
    const calculateSummary = () => {
      const service = trains.filter(train => train.recommendation === 'Service').length;
      const standby = trains.filter(train => train.recommendation === 'Standby').length;
      const maintenance = trains.filter(train => train.recommendation === 'Maintenance').length;
      
      setSummary({
        service,
        standby,
        maintenance,
        total: trains.length
      });
    };

    calculateSummary();
  }, [trains]);

  useEffect(() => {
    evaluateTrainEligibility();
  }, [trains]);

  const evaluateTrainEligibility = async () => {
    const jobCards = await dataIntegrationService.getMaximoJobCards();
    const iotData = await dataIntegrationService.getIoTSensorData();
    const brandingContracts = await dataIntegrationService.getBrandingContracts();
    
    const results = await Promise.all(
      trains.map(train => 
        businessRulesEngine.evaluateTrainEligibility(train, jobCards, iotData, brandingContracts)
      )
    );
    
    setEligibilityResults(results);
  };

  const handleOptimization = () => {
    setIsOptimizing(true);
    
    // Enhanced AI optimization process
    setTimeout(() => {
      optimizationEngine.optimize(trains, eligibilityResults).then(result => {
        setOptimizationResult(result);
        
        // Update train recommendations based on optimization result
        const optimizedTrains = trains.map(train => {
          let newRecommendation = train.recommendation;
          
          if (result.selectedTrains.includes(train.id)) {
            newRecommendation = 'Service';
          } else if (result.standbyTrains.includes(train.id)) {
            newRecommendation = 'Standby';
          } else if (result.maintenanceTrains.includes(train.id)) {
            newRecommendation = 'Maintenance';
          }
          
          return { ...train, recommendation: newRecommendation };
        });
        
        setTrains(optimizedTrains);
        setIsOptimizing(false);
      });
    }, 2000);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'data', label: 'Data Integration', icon: Database },
    { id: 'rules', label: 'Business Rules', icon: Shield },
    { id: 'optimization', label: 'Optimization Results', icon: Target }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">AI-Driven Train Induction Planning</h1>
          <p className="text-gray-600 mt-2">Comprehensive decision-support system for Kochi Metro Rail operations</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <SummaryCard
                title="In Service"
                value={summary.service}
                icon={Train}
                color="text-green-600"
                bgColor="bg-white"
                borderColor="border-green-200"
              />
              <SummaryCard
                title="On Standby"
                value={summary.standby}
                icon={Pause}
                color="text-yellow-600"
                bgColor="bg-white"
                borderColor="border-yellow-200"
              />
              <SummaryCard
                title="Under Maintenance"
                value={summary.maintenance}
                icon={Wrench}
                color="text-red-600"
                bgColor="bg-white"
                borderColor="border-red-200"
              />
              <SummaryCard
                title="Total Fleet"
                value={summary.total}
                icon={Activity}
                color="text-blue-600"
                bgColor="bg-white"
                borderColor="border-blue-200"
              />
            </div>

            {/* Optimization Panel */}
            <div className="mb-8">
              <OptimizationPanel onOptimize={handleOptimization} isOptimizing={isOptimizing} />
            </div>

            {/* Train Table */}
            <TrainTable trains={trains} />
          </>
        )}

        {activeTab === 'data' && <DataIntegrationPanel />}
        
        {activeTab === 'rules' && <BusinessRulesPanel eligibilityResults={eligibilityResults} />}
        
        {activeTab === 'optimization' && (
          <OptimizationResultsPanel result={optimizationResult} trains={trains} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;