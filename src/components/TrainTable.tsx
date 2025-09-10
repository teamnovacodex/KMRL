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
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Train Fleet Status</h3>
        <p className="text-sm text-gray-600 mt-1">Real-time train condition and recommendations</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Train ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fitness Certificate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Card Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Branding
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mileage (km)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cleaning Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Depot Bay
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
                  <div className="font-medium text-gray-900">{train.trainNumber}</div>
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
                  {train.mileage.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(train.cleaningStatus, 'cleaning')}
                    <span className={`text-sm ${train.cleaningStatus === 'Done' ? 'text-green-700' : 'text-yellow-700'}`}>
                      {train.cleaningStatus}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
                    {train.depotBay}
                  </span>
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