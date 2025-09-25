import React from 'react';
import { ResponsiveContainer } from "recharts";
import { RadarChart as RChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from "recharts";

const RadarChart = ({ radarData }) => {
  return (
    <div className="p-2 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Profil d'Investisseur</h3>
      </div>
      <div className="w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RChart data={radarData} outerRadius="80%">
            <PolarGrid stroke="#ffffff20" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: '#ffffffa6', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#ffffff80', fontSize: 10 }} stroke="#ffffff20" />
            <Radar name="Score" dataKey="value" stroke="#3CD4AB" fill="#3CD4AB" fillOpacity={0.4} />
            <Tooltip 
              formatter={(v) => [`${v}`, 'Score']} 
              contentStyle={{ backgroundColor: '#0F0F19', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }} 
            />
            <Legend wrapperStyle={{ color: '#fff' }} />
          </RChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RadarChart;