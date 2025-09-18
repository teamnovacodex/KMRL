import React from 'react';
import { Train } from '../types/train';
import { CheckCircle, XCircle, AlertTriangle, Wrench } from 'lucide-react';

interface TrainTableProps {
  trains: Train[];
}

const TrainTable: React.FC<TrainTableProps> = ({ trains }) => {
  const getStatusIcon = (status: string, type: 'fitness' | 'job' | 'cleaning') => {
    switch (type) {
      case 'fitness':
        return status === 'Valid' ? 
          <CheckCircle className="h-4 w-4 text-green-600" /> : 
          <XCircle className="h-4 w-4 text-red-600" />;
      case 'job':
        return status === 'Closed' ? 
          <CheckCircle className="h-4 w-4 text-green-600" /> : 
          <Wrench className="h-4 w-4 text-orange-600" />;
      case 'cleaning':
        return status === 'Done' ? 
          <CheckCircle className="h-4 w-4 text-green-600" /> : 
          <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Service':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Standby':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Maintenance':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Deep Clean':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Train Fleet Status</h3>
        <p className="text-sm text-gray-600 mt-1">Real-time train condition and AI recommendations</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Train Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Train Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fitness Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Cards
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Branding
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mileage (km)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Health Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                AI Recommendation
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trains.map((train) => (
              <tr key={train.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{train.trainName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{train.trainNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(train.fitnessStatus, 'fitness')}
                    <span className={`text-sm ${train.fitnessStatus === 'Valid' ? 'text-green-700' : 'text-red-700'}`}>
                      {train.fitnessStatus}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(train.jobCardStatus, 'job')}
                    <span className={`text-sm ${train.jobCardStatus === 'Closed' ? 'text-green-700' : 'text-orange-700'}`}>
                      {train.jobCardStatus}
                    </span>
                    {train.criticalJobCards > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {train.criticalJobCards} Critical
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    train.brandingRequired ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {train.brandingRequired ? 'Required' : 'Complete'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                  {train.totalMileage.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className={`h-2 rounded-full ${
                          train.healthScore >= 80 ? 'bg-green-600' :
                          train.healthScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${train.healthScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900">{train.healthScore}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRecommendationColor(train.recommendation)}`}>
                    {train.recommendation}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrainTable;