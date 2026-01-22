'use client';

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import styles from './TrendChart.module.css';

// Sample data for the last 30 days
const data = [
  { day: '1', position: 8.2, traffic: 8500 },
  { day: '3', position: 7.8, traffic: 9200 },
  { day: '5', position: 7.5, traffic: 9800 },
  { day: '7', position: 6.9, traffic: 10500 },
  { day: '9', position: 6.2, traffic: 10200 },
  { day: '11', position: 5.8, traffic: 11000 },
  { day: '13', position: 5.5, traffic: 11400 },
  { day: '15', position: 5.2, traffic: 11800 },
  { day: '17', position: 4.9, traffic: 12100 },
  { day: '19', position: 5.1, traffic: 11600 },
  { day: '21', position: 4.7, traffic: 12300 },
  { day: '23', position: 4.5, traffic: 12600 },
  { day: '25', position: 4.3, traffic: 12800 },
  { day: '27', position: 4.1, traffic: 13200 },
  { day: '30', position: 4.2, traffic: 12400 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>Jour {label}</p>
        {payload.map((entry, index) => (
          <p key={index} className={styles.tooltipValue} style={{ color: entry.color }}>
            {entry.name === 'position' ? 'Position: ' : 'Trafic: '}
            <strong>
              {entry.name === 'position' 
                ? entry.value.toFixed(1)
                : entry.value.toLocaleString()
              }
            </strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function TrendChart() {
  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPosition" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(255,255,255,0.05)" 
            vertical={false}
          />
          <XAxis 
            dataKey="day" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#71717a', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            yAxisId="left"
            reversed
            domain={[0, 10]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#71717a', fontSize: 12 }}
            dx={-10}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            domain={['auto', 'auto']}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#71717a', fontSize: 12 }}
            dx={10}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="position"
            stroke="#00d4ff"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorPosition)"
            dot={false}
            activeDot={{ r: 6, fill: '#00d4ff', stroke: '#0a0a0f', strokeWidth: 2 }}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="traffic"
            stroke="#8b5cf6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorTraffic)"
            dot={false}
            activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#0a0a0f', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
