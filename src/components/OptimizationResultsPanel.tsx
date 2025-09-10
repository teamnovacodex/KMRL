import React from 'react';
import { TrendingUp, Target, AlertCircle, Lightbulb, BarChart3 } from 'lucide-react';
import { OptimizationResult } from '../types/optimization';
import { Train } from '../types/train';

interface OptimizationResultsPanelProps {
  result: OptimizationResult | null;
  trains: Train[];
}

const OptimizationResultsPanel: React.FC<OptimizationResultsPanelProps> = ({ result, trains }) => {
  if (!result) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Optimization Results</h3>
          <p className="text-gray-600">Run the optimization engine to see detailed results and recommendations.</p>
        </div>
      </div>
    );
  }

  const getTrainName = (trainId: string) => {
    const train = trains.find(t => t.id === trainId);
    return train?.trainNumber || `Train ${trainId}`;
  };

  return (
    <div className="space-y-6">
      {/* Optimization Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>Optimization Results</span>
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Generated at {new Date(result.timestamp).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{(result.totalScore * 100).toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Overall Score</div>
          </div>
        </div>

        {/* Allocation Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{result.selectedTrains.length}</div>
            <div className="text-sm text-green-700">Selected for Service</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{result.standbyTrains.length}</div>
            <div className="text-sm text-yellow-700">On Standby</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{result.maintenanceTrains.length}</div>
            <div className="text-sm text-red-700">Under Maintenance</div>
          </div>
        </div>

        {/* Objective Scores */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Objective Performance</span>
          </h4>
          <div className="space-y-3">
            {result.objectives.map((objective) => {
              const score = result.objectiveScores[objective.name] || 0;
              const percentage = score * 100;
              
              return (
                <div key={objective.name} className="flex items-center space-x-3">
                  <div className="w-32 text-sm text-gray-700">{objective.name}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-12 text-sm font-medium text-gray-900">
                    {percentage.toFixed(0)}%
                  </div>
                  <div className="w-16 text-xs text-gray-500">
                    (Weight: {(objective.weight * 100).toFixed(0)}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Reasoning */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
          <Lightbulb className="h-4 w-4 text-yellow-600" />
          <span>Decision Reasoning</span>
        </h4>
        
        <div className="space-y-4">
          {result.reasoning.map((reasoning) => (
            <div key={reasoning.trainId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-900">{getTrainName(reasoning.trainId)}</h5>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    reasoning.decision === 'Selected' ? 'bg-green-100 text-green-800' :
                    reasoning.decision === 'Standby' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {reasoning.decision}
                  </span>
                  <span className="text-sm text-gray-600">
                    Score: {(reasoning.score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Primary Reasons:</span>
                  <ul className="mt-1 space-y-1">
                    {reasoning.primaryReasons.map((reason, index) => (
                      <li key={index} className="text-gray-600">• {reason}</li>
                    ))}
                  </ul>
                </div>
                {reasoning.secondaryFactors.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Secondary Factors:</span>
                    <ul className="mt-1 space-y-1">
                      {reasoning.secondaryFactors.map((factor, index) => (
                        <li key={index} className="text-gray-600">• {factor}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alternative Scenarios */}
      {result.alternativeScenarios.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <span>Alternative Scenarios</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.alternativeScenarios.map((scenario) => (
              <div key={scenario.scenarioId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{scenario.name}</h5>
                  <span className="text-sm text-gray-600">
                    Score: {(scenario.totalScore * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Key Differences:</span>
                  <ul className="mt-1 space-y-1">
                    {scenario.keyDifferences.map((diff, index) => (
                      <li key={index} className="text-gray-600">• {diff}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizationResultsPanel;