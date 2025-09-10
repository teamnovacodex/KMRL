import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { DataSource } from '../types/dataIntegration';
import { dataIntegrationService } from '../services/dataIntegrationService';

const DataIntegrationPanel: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [isPerformingETL, setIsPerformingETL] = useState(false);
  const [etlResult, setEtlResult] = useState<{ success: boolean; recordsProcessed: number; errors: string[] } | null>(null);

  useEffect(() => {
    loadDataSources();
  }, []);

  const loadDataSources = async () => {
    const sources = await dataIntegrationService.getDataSources();
    setDataSources(sources);
  };

  const handleSync = async (sourceId: string) => {
    await dataIntegrationService.syncDataSource(sourceId);
    loadDataSources();
  };

  const handleETL = async () => {
    setIsPerformingETL(true);
    const result = await dataIntegrationService.performETL();
    setEtlResult(result);
    setIsPerformingETL(false);
    loadDataSources();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Syncing':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'Error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'Disconnected':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Syncing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Disconnected':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Database className="h-5 w-5 text-blue-600" />
            <span>Data Integration Status</span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Real-time status of all data sources and ETL processes
          </p>
        </div>
        <button
          onClick={handleETL}
          disabled={isPerformingETL}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isPerformingETL ? (
            <>
              <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Processing ETL...
            </>
          ) : (
            <>
              <Database className="-ml-1 mr-2 h-4 w-4" />
              Run ETL Process
            </>
          )}
        </button>
      </div>

      {/* ETL Result */}
      {etlResult && (
        <div className={`mb-6 p-4 rounded-lg border ${etlResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center space-x-2">
            {etlResult.success ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <span className={`font-medium ${etlResult.success ? 'text-green-800' : 'text-red-800'}`}>
              ETL Process {etlResult.success ? 'Completed Successfully' : 'Failed'}
            </span>
          </div>
          <p className={`mt-1 text-sm ${etlResult.success ? 'text-green-700' : 'text-red-700'}`}>
            {etlResult.success 
              ? `Processed ${etlResult.recordsProcessed} records successfully`
              : `Errors: ${etlResult.errors.join(', ')}`
            }
          </p>
        </div>
      )}

      {/* Data Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataSources.map((source) => (
          <div key={source.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">{source.name}</h4>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(source.status)}`}>
                {getStatusIcon(source.status)}
                <span className="ml-1">{source.status}</span>
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-medium">{source.type}</span>
              </div>
              <div className="flex justify-between">
                <span>Records:</span>
                <span className="font-medium">{source.recordCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Sync:</span>
                <span className="font-medium">
                  {new Date(source.lastSync).toLocaleTimeString()}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => handleSync(source.id)}
              disabled={source.status === 'Syncing'}
              className="mt-3 w-full inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {source.status === 'Syncing' ? (
                <>
                  <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="-ml-1 mr-2 h-4 w-4" />
                  Sync Now
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataIntegrationPanel;