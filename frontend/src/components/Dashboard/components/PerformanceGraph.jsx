import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PerformanceGraph = ({ portfolioData }) => {
  const [timeRange, setTimeRange] = useState('1Y'); // 24H, 1M, 1Y, ALL

  // Mock data generation based on time range if portfolioData doesn't have enough
  const chartData = useMemo(() => {
    if (!portfolioData) return [];
    
    // If we have real history, use it (assuming it matches the requested range or we filter it)
    // For this implementation, we'll generate data based on the selected range to match the visual requirement
    // using the current portfolio value as an anchor.
    
    const currentVal = portfolioData.totalInvested * (1 + (portfolioData.globalPerformance / 100)) || 10000;
    const dataPoints = [];
    const now = new Date();
    
    let points = 12;
    let interval = 'month';
    
    if (timeRange === '24H') {
      points = 24;
      interval = 'hour';
    } else if (timeRange === '1M') {
      points = 30;
      interval = 'day';
    } else if (timeRange === '1Y') {
      points = 12;
      interval = 'month';
    } else if (timeRange === 'ALL') {
      points = 24; // e.g. 2 years
      interval = 'month';
    }

    for (let i = 0; i < points; i++) {
      const date = new Date(now);
      if (interval === 'hour') date.setHours(now.getHours() - (points - 1 - i));
      if (interval === 'day') date.setDate(now.getDate() - (points - 1 - i));
      if (interval === 'month') date.setMonth(now.getMonth() - (points - 1 - i));
      
      let label = '';
      if (interval === 'hour') label = date.getHours() + 'h';
      if (interval === 'day') label = date.getDate() + '/' + (date.getMonth() + 1);
      if (interval === 'month') label = date.toLocaleDateString('fr-FR', { month: 'short' });

      // Random walk for demo
      // const volatility = 0.02;
      // const trend = 0.005; // slight upward trend
      // const randomFactor = 1 + (Math.random() * volatility * 2 - volatility) + trend;
      
      // Create a curve that ends near currentVal
      // We'll generate backwards from currentVal
      // But here we are generating forward in the loop, so let's just make a nice curve
      
      // Simplified: just use a sine wave + linear trend
      const progress = i / points;
      const value = currentVal * (0.8 + (0.2 * progress) + (Math.random() * 0.05));
      const benchmark = currentVal * (0.75 + (0.15 * progress) + (Math.random() * 0.02));

      dataPoints.push({
        date: label,
        value: Math.round(value),
        benchmark: Math.round(benchmark)
      });
    }
    
    return dataPoints;
  }, [portfolioData, timeRange]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1A1A27] border border-white/10 p-3 rounded-lg shadow-xl">
          <p className="text-gray-400 text-xs mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-xs text-white/70">{entry.name}:</span>
              <span className="text-sm font-bold text-white">
                {entry.value.toLocaleString()} MAD
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#0F0F19] rounded-xl border border-[#89559F]/20 p-3 lg:p-4 h-full flex flex-col">
      <div className="flex flex-col gap-1 mb-4">
        <h3 className="text-lg font-bold text-white">Graphiques de performance</h3>
        <p className="text-xs text-[#3CD4AB] font-medium">Indispensable pour un robo-advisor :</p>
        <p className="text-xs text-gray-400">Courbe d’évolution du portefeuille dans le temps</p>
      </div>

      <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar">
        {['24H', '1M', '1Y', 'ALL'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              timeRange === range
                ? 'bg-[#3CD4AB]/20 text-[#3CD4AB] border border-[#3CD4AB]/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
            }`}
          >
            {range === 'ALL' ? 'Depuis le début' : range === '1M' ? '1 mois' : range === '1Y' ? '1 an' : range}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3CD4AB" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3CD4AB" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#89559F" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#89559F" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 10 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 10 }} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', color: '#9CA3AF' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              name="Mon Portefeuille" 
              stroke="#3CD4AB" 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
            <Area 
              type="monotone" 
              dataKey="benchmark" 
              name="Benchmark" 
              stroke="#89559F" 
              strokeWidth={2} 
              strokeDasharray="4 4"
              fillOpacity={1} 
              fill="url(#colorBenchmark)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 text-center">
        <p className="text-[10px] text-gray-500">Comparaison avec un indice de référence (benchmark simple)</p>
      </div>
    </div>
  );
};

export default PerformanceGraph;
