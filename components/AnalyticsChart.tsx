import React from 'react';
import { ChartDataPoint } from '../types';

// Fix: Add a global window declaration for Recharts to resolve TypeScript error.
// This is required because the Recharts library is loaded from a CDN.
declare global {
  interface Window {
    Recharts: any;
  }
}

interface AnalyticsChartProps {
  data: ChartDataPoint[];
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data }) => {
  // Defer accessing window.Recharts until render time to avoid race conditions
  // with the CDN script loading.
  if (!window.Recharts) {
    return <div className="flex items-center justify-center h-full text-slate-500">Loading chart library...</div>;
  }
  
  const { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } = window.Recharts;

  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-500">Loading chart data...</div>;
  }
  
  const canteenNames = Object.keys(data[0]).filter(key => key !== 'time');
  const colors = ['#3b82f6', '#10b981', '#f97316'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 12 }} />
        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} label={{ value: 'People in Queue', angle: -90, position: 'insideLeft', fill: '#475569', dx: -5 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          }}
        />
        <Legend wrapperStyle={{ fontSize: '14px' }} />
        {canteenNames.map((name, index) => (
          <Line
            key={name}
            type="monotone"
            dataKey={name}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AnalyticsChart;