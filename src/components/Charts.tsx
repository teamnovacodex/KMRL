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
  ResponsiveContainer
} from 'recharts';
import { historicalData, mockTrains } from '../data/mockData';

interface ChartProps {
  height?: number;
}

export const PerformanceTrendChart: React.FC<ChartProps> = ({ height = 300 }) => {
  const data = historicalData.slice(0, 15).reverse();
  
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
            name === 'onTimePerformance' ? 'On-Time Performance' : 'Efficiency'
          ]}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="onTimePerformance" 
          stroke="#10b981" 
          strokeWidth={3}
          name="On-Time Performance"
        />
        <Line 
          type="monotone" 
          dataKey="efficiency" 
          stroke="#3b82f6" 
          strokeWidth={3}
          name="Efficiency"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const FleetStatusChart: React.FC<ChartProps> = ({ height = 300 }) => {
  const statusData = [
    { name: 'Service Ready', value: mockTrains.filter(t => t.recommendation === 'Service').length, color: '#10b981' },
    { name: 'Standby', value: mockTrains.filter(t => t.recommendation === 'Standby').length, color: '#f59e0b' },
    { name: 'Maintenance', value: mockTrains.filter(t => t.recommendation === 'Maintenance').length, color: '#ef4444' },
    { name: 'Deep Clean', value: mockTrains.filter(t => t.recommendation === 'Deep Clean').length, color: '#8b5cf6' }
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

export const MileageAnalysisChart: React.FC<ChartProps> = ({ height = 300 }) => {
  const mileageData = mockTrains
    .slice(0, 10)
    .sort((a, b) => a.totalMileage - b.totalMileage)
    .map(train => ({
      trainName: train.trainName,
      totalMileage: train.totalMileage,
      dailyMileage: train.dailyMileage,
      utilizationRate: train.utilizationRate
    }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={mileageData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="trainName" 
          tick={{ fontSize: 10, angle: -45 }}
          height={80}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip 
          formatter={(value: number, name: string) => [
            name === 'utilizationRate' ? `${value}%` : value.toLocaleString(),
            name === 'totalMileage' ? 'Total Mileage' :
            name === 'dailyMileage' ? 'Daily Mileage' : 'Utilization Rate'
          ]}
        />
        <Legend />
        <Bar dataKey="totalMileage" fill="#3b82f6" name="Total Mileage" />
        <Bar dataKey="dailyMileage" fill="#10b981" name="Daily Mileage" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const HealthScoreChart: React.FC<ChartProps> = ({ height = 300 }) => {
  const healthData = mockTrains.slice(0, 10).map(train => ({
    trainName: train.trainName,
    healthScore: train.healthScore,
    engineHealth: train.engineHealth,
    brakeHealth: train.brakeHealth,
    doorHealth: train.doorSystemHealth,
    acHealth: train.acSystemHealth
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={healthData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="trainName" 
          tick={{ fontSize: 10, angle: -45 }}
          height={80}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="healthScore"
          stackId="1"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.6}
          name="Overall Health"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};