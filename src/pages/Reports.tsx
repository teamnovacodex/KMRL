import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Filter, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('daily');
  const [dateRange, setDateRange] = useState('7days');

  const reportTypes = [
    { id: 'daily', name: 'Daily Operations Report', icon: Calendar },
    { id: 'maintenance', name: 'Maintenance Summary', icon: AlertTriangle },
    { id: 'performance', name: 'Performance Analytics', icon: TrendingUp },
    { id: 'compliance', name: 'Compliance Report', icon: CheckCircle }
  ];

  const mockReportData = {
    daily: {
      totalTrains: 25,
      inService: 18,
      onStandby: 4,
      inMaintenance: 3,
      onTimePerformance: 96.5,
      passengerCount: 45230,
      incidents: 2
    },
    maintenance: {
      scheduledJobs: 12,
      completedJobs: 8,
      pendingJobs: 4,
      criticalIssues: 1,
      averageRepairTime: '2.3 hours',
      maintenanceCost: '₹2,45,000'
    },
    performance: {
      averageSpeed: 42.5,
      energyEfficiency: 89.2,
      punctualityRate: 94.8,
      customerSatisfaction: 4.6,
      systemAvailability: 99.1
    },
    compliance: {
      safetyChecks: 100,
      fitnessValidation: 96,
      documentationComplete: 98,
      regulatoryCompliance: 100
    }
  };

  const exportReport = (format: string) => {
    // Mock export functionality
    console.log(`Exporting ${selectedReport} report as ${format}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and export comprehensive operational reports</p>
        </div>

        {/* Report Selection */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <motion.button
                key={report.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedReport(report.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedReport === report.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium text-sm">{report.name}</p>
              </motion.button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1day">Last 24 Hours</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                </select>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => exportReport('pdf')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
              <button
                onClick={() => exportReport('excel')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                Export Excel
              </button>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <motion.div
          key={selectedReport}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {reportTypes.find(r => r.id === selectedReport)?.name}
            </h2>
          </div>

          {/* Report Data Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(mockReportData[selectedReport as keyof typeof mockReportData]).map(([key, value]) => (
              <div key={key} className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Additional Report Details */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Report Generated</span>
            </div>
            <p className="text-blue-700">
              {new Date().toLocaleString()} | Data Range: {dateRange} | Status: Complete
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Reports;