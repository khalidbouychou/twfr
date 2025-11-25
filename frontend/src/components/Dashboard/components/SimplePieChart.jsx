import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const SimplePieChart = ({ pieChartData, setCurrentPage }) => {
  const totalPortfolioValue = pieChartData.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="w-full h-fit border border-gray-800/50 rounded-xl p-3 lg:p-4 2xl:p-6 shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <div>
          <h3 className="text-sm lg:text-base font-bold text-white tracking-tight">Répartition</h3>
          <p className="text-xs text-gray-400 mt-0.5">Vue d'ensemble de votre portefeuille</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-medium text-emerald-500">En direct</span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="relative w-full h-[200px] lg:h-[240px] xl:h-[280px] 2xl:h-[300px] shrink-0">
        {pieChartData.length === 0 ? (
           // Empty state
           <div className="flex flex-col items-center justify-center h-full text-center">
             <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
             </div>
             <p className="text-gray-400 text-sm mb-6">Aucun investissement actif</p>
             <button 
                onClick={() => setCurrentPage("investments")}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors"
             >
                Découvrir les produits
             </button>
           </div>
        ) : (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <defs>
                        {pieChartData.map((entry, index) => (
                            <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                                <stop offset="100%" stopColor={entry.color} stopOpacity={0.8} />
                            </linearGradient>
                        ))}
                    </defs>
                    <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={4}
                        dataKey="total"
                        cornerRadius={6}
                        stroke="none"
                    >
                        {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
                        ))}
                    </Pie>
                    <Tooltip 
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                    <div className="bg-gray-900 border border-gray-800 p-3 rounded-xl shadow-xl">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
                                            <span className="text-white font-medium text-sm">{data.name}</span>
                                        </div>
                                        <div className="text-emerald-400 font-bold text-lg">
                                            {data.total.toLocaleString()} MAD
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    {/* Center Text */}
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                        <tspan x="50%" dy="-10" className="fill-gray-400 text-xs font-medium">Total</tspan>
                        <tspan x="50%" dy="24" className="fill-white text-xl font-bold">
                            {totalPortfolioValue >= 1000 
                                ? `${(totalPortfolioValue / 1000).toFixed(1)}k` 
                                : totalPortfolioValue.toLocaleString()}
                        </tspan>
                    </text>
                </PieChart>
            </ResponsiveContainer>
        )}
      </div>

      {/* Legend / List */}
      {pieChartData.length > 0 && (
        <div className="mt-3 lg:mt-4 space-y-2 lg:space-y-3">
            {pieChartData.map((item, idx) => {
                const percent = ((item.total / totalPortfolioValue) * 100).toFixed(1);
                
                return (
                    <div key={idx} className="flex items-center justify-between group p-1.5 lg:p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-2 lg:gap-3">
                            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg flex items-center justify-center bg-gray-800/50 group-hover:bg-gray-800 transition-colors">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                            </div>
                            <div>
                                <div className="text-white font-medium text-sm">{item.name}</div>
                                <div className="text-gray-500 text-xs">{percent}% du portefeuille</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-white font-bold text-sm">{item.total.toLocaleString()} MAD</div>
                            <div className={`text-xs ${item.roi >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {item.roi >= 0 ? '+' : ''}{item.roi.toLocaleString()} MAD
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
      )}
    </div>
  );
};

export default SimplePieChart;