import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter
} from 'recharts';
import { historicalData, enterpriseTrains } from '../data/enterpriseMockData';

interface ChartProps {
  data?: any[];
  height?: number;
}

export const PerformanceTrendChart: React.FC<ChartProps> = ({ height = 300 }) => {
  const data = historicalData.slice(0, 30).reverse();
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip 
          labelFormatter={(value) => new Date(value).toLocaleDateString()}
          formatter={(value: number, name: string) => [
            `${value}${name === 'onTimePerformance' ? '%' : ''}`,
            name === 'onTimePerformance' ? 'On-Time Performance' : 
            name === 'efficiency' ? 'Operational Efficiency' : name
          ]}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="onTimePerformance" 
          stroke="#10b981" 
          strokeWidth={3}
          dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
          name="On-Time Performance"
        />
        <Line 
          type="monotone" 
          dataKey="efficiency" 
          stroke="#3b82f6" 
          strokeWidth={3}
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          name="Operational Efficiency"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const FleetStatusChart: React.FC<ChartProps> = ({ height = 300 }) => {
  const statusData = [
    { name: 'Service Ready', value: enterpriseTrains.filter(t => t.recommendation === 'Service').length, color: '#10b981' },
    { name: 'Standby', value: enterpriseTrains.filter(t => t.recommendation === 'Standby').length, color: '#f59e0b' },
    { name: 'Maintenance', value: enterpriseTrains.filter(t => t.recommendation === 'Maintenance').length, color: '#ef4444' },
    { name: 'Deep Clean', value: enterpriseTrains.filter(t => t.recommendation === 'Deep Clean').length, color: '#8b5cf6' }
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={statusData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={120}
          paddingAngle={5}
          dataKey="value"
        >
          {statusData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number, name: string) => [`${value} trains`, name]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const HealthScoreDistribution: React.FC<ChartProps> = ({ height = 300 }) => {
  const healthData = enterpriseTrains.map(train => ({
    trainNumber: train.trainNumber,
    healthScore: train.healthScore,
    engineHealth: train.engineHealth,
    brakeHealth: train.brakeHealth,
    recommendation: train.recommendation
  }));

  const getColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Service': return '#10b981';
      case 'Standby': return '#f59e0b';
      case 'Maintenance': return '#ef4444';
      default: return '#8b5cf6';
    }
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart data={healthData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="engineHealth" 
          name="Engine Health"
          tick={{ fontSize: 12 }}
          label={{ value: 'Engine Health Score', position: 'insideBottom', offset: -10 }}
        />
        <YAxis 
          dataKey="brakeHealth" 
          name="Brake Health"
          tick={{ fontSize: 12 }}
          label={{ value: 'Brake Health Score', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }}
          formatter={(value: number, name: string) => [`${value}%`, name]}
          labelFormatter={(label, payload) => {
            if (payload && payload[0]) {
              return `${payload[0].payload.trainNumber}`;
            }
            return label;
          }}
        />
        <Scatter 
          dataKey="healthScore" 
          fill={(entry: any) => getColor(entry.recommendation)}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export const MileageAnalysisChart: React.FC<ChartProps> = ({ height = 300 }) => {
  const mileageData = enterpriseTrains
    .sort((a, b) => a.totalMileage - b.totalMileage)
    .map(train => ({
      trainNumber: train.trainNumber,
      totalMileage: train.totalMileage,
      monthlyMileage: train.monthlyMileage,
      utilizationRate: train.utilizationRate
    }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={mileageData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="trainNumber" 
          tick={{ fontSize: 10, angle: -45 }}
          height={80}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip 
          formatter={(value: number, name: string) => [
            name === 'utilizationRate' ? `${value}%` : value.toLocaleString(),
            name === 'totalMileage' ? 'Total Mileage' :
            name === 'monthlyMileage' ? 'Monthly Mileage' : 'Utilization Rate'
          ]}
        />
        <Legend />
        <Bar dataKey="totalMileage" fill="#3b82f6" name="Total Mileage" />
        <Bar dataKey="monthlyMileage" fill="#10b981" name="Monthly Mileage" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const MaintenanceCostTrend: React.FC<ChartProps> = ({ height = 300 }) => {
  const costData = historicalData.slice(0, 30).reverse().map(day => ({
    ...day,
    maintenanceCost: Math.floor(Math.random() * 100000) + 200000,
    preventiveCost: Math.floor(Math.random() * 50000) + 100000,
    correctiveCost: Math.floor(Math.random() * 80000) + 150000
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={costData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
        />
        <Tooltip 
          labelFormatter={(value) => new Date(value).toLocaleDateString()}
          formatter={(value: number, name: string) => [
            `₹${value.toLocaleString()}`,
            name === 'preventiveCost' ? 'Preventive Maintenance' :
            name === 'correctiveCost' ? 'Corrective Maintenance' : 'Total Maintenance Cost'
          ]}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="preventiveCost"
          stackId="1"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.6}
          name="Preventive"
        />
        <Area
          type="monotone"
          dataKey="correctiveCost"
          stackId="1"
          stroke="#ef4444"
          fill="#ef4444"
          fillOpacity={0.6}
          name="Corrective"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const KPIGaugeChart: React.FC<{ value: number; max: number; title: string; color: string }> = ({ 
  value, max, title, color 
}) => {
  const data = [
    { name: title, value, fill: color }
  ];

  return (
    <div className="text-center">
      <ResponsiveContainer width="100%" height={150}>
        <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={data}>
          <RadialBar
            dataKey="value"
            cornerRadius={10}
            fill={color}
          />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold">
            {value}%
          </text>
        </RadialBarChart>
      </ResponsiveContainer>
      <p className="text-sm font-medium text-gray-600 mt-2">{title}</p>
    </div>
  );
};