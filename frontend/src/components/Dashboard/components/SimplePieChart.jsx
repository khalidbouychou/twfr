import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const SimplePieChart = ({ pieChartData, setCurrentPage }) => {
  // Custom label component for better readability
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label if slice is too small

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs 2xl:text-sm 3xl:text-base font-semibold"
        style={{ textShadow: '0 0 3px rgba(0,0,0,0.8)' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl p-4 2xl:p-6 3xl:p-8 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent border border-white/10 shadow-xl backdrop-blur-sm hover:shadow-2xl hover:border-white/20 transition-all duration-300">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Header */}
      <div className="relative flex items-center justify-between mb-4 2xl:mb-6 3xl:mb-8">
        <div className="flex items-center gap-3 2xl:gap-4 3xl:gap-5">
          <div className="p-2 2xl:p-2.5 3xl:p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
            <svg className="w-5 h-5 2xl:w-6 2xl:h-6 3xl:w-7 3xl:h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-bold text-base 2xl:text-xl 3xl:text-2xl">Répartition des Investissements</h3>
            <p className="text-xs 2xl:text-sm 3xl:text-base text-white/50">Par produit</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 2xl:px-4 3xl:px-5 py-1.5 2xl:py-2 3xl:py-2.5 bg-white/5 rounded-full border border-white/10">
          <div className="w-2 h-2 2xl:w-2.5 2xl:h-2.5 3xl:w-3 3xl:h-3 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs 2xl:text-sm 3xl:text-base text-white/60 font-medium">Temps réel</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative w-full h-[300px] 2xl:h-[400px] 3xl:h-[500px]">
        {pieChartData.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center h-full">
            <div className="relative mb-6 2xl:mb-8 3xl:mb-10">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-2xl rounded-full"></div>
              <svg 
                className="relative w-20 h-20 2xl:w-24 2xl:h-24 3xl:w-28 3xl:h-28 text-white/10" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" 
                />
              </svg>
            </div>
            <h4 className="text-lg 2xl:text-xl 3xl:text-2xl font-bold text-white mb-2 2xl:mb-3 3xl:mb-4">Aucun investissement</h4>
            <p className="text-sm 2xl:text-base 3xl:text-lg text-center max-w-xs 2xl:max-w-sm 3xl:max-w-md text-white/60 mb-4 2xl:mb-6 3xl:mb-8">
              Commencez par investir dans des produits pour voir la répartition de votre portefeuille.
            </p>
            <button 
              onClick={() => setCurrentPage("investments")}
              className="group/btn relative px-6 2xl:px-8 3xl:px-10 py-2.5 2xl:py-3 3xl:py-4 bg-gradient-to-r from-[#3CD4AB] to-emerald-500 text-white rounded-xl 2xl:rounded-2xl font-semibold text-sm 2xl:text-base 3xl:text-lg hover:shadow-lg hover:shadow-[#3CD4AB]/50 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2 2xl:gap-3">
                <svg className="w-5 h-5 2xl:w-6 2xl:h-6 3xl:w-7 3xl:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Explorer les investissements
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        ) : (
          // Pie Chart
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {pieChartData.map((entry, index) => (
                  <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius="45%"
                outerRadius="80%"
                dataKey="total"
                label={renderCustomLabel}
                labelLine={false}
                paddingAngle={2}
                animationBegin={0}
                animationDuration={800}
              >
                {pieChartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#gradient-${index})`}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const percentage = ((data.total / pieChartData.reduce((sum, p) => sum + p.total, 0)) * 100).toFixed(1);
                    return (
                      <div className="bg-[#0F0F19]/95 backdrop-blur-md border border-white/20 rounded-xl p-4 2xl:p-5 3xl:p-6 shadow-2xl">
                        <div className="flex items-center gap-2 2xl:gap-3 mb-3 2xl:mb-4">
                          <div 
                            className="w-4 h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6 rounded-full border-2 border-white/30"
                            style={{ backgroundColor: data.color }}
                          />
                          <p className="font-bold text-white text-sm 2xl:text-base 3xl:text-lg">{data.name}</p>
                        </div>
                        <div className="space-y-2 2xl:space-y-2.5 3xl:space-y-3">
                          <div className="flex justify-between items-center gap-6 2xl:gap-8 3xl:gap-10">
                            <span className="text-white/60 text-xs 2xl:text-sm 3xl:text-base">Investi:</span>
                            <span className="text-[#3CD4AB] font-semibold text-sm 2xl:text-base 3xl:text-lg">
                              {data.invested.toLocaleString()} MAD
                            </span>
                          </div>
                          <div className="flex justify-between items-center gap-6 2xl:gap-8 3xl:gap-10">
                            <span className="text-white/60 text-xs 2xl:text-sm 3xl:text-base">ROI:</span>
                            <span className="text-[#89559F] font-semibold text-sm 2xl:text-base 3xl:text-lg">
                              +{data.roi.toLocaleString()} MAD
                            </span>
                          </div>
                          <div className="border-t border-white/10 pt-2 2xl:pt-2.5 3xl:pt-3 flex justify-between items-center gap-6 2xl:gap-8 3xl:gap-10">
                            <span className="text-white font-medium text-xs 2xl:text-sm 3xl:text-base">Total:</span>
                            <span className="text-white font-bold text-base 2xl:text-lg 3xl:text-xl">
                              {data.total.toLocaleString()} MAD
                            </span>
                          </div>
                          <div className="text-center pt-1 2xl:pt-2">
                            <span className="text-white/80 text-xs 2xl:text-sm 3xl:text-base font-medium bg-white/10 px-3 2xl:px-4 3xl:px-5 py-1 2xl:py-1.5 3xl:py-2 rounded-full">
                              {percentage}% du total
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      
      {/* Product Details Summary */}
      {pieChartData.length > 0 && (
        <div className="relative mt-6 2xl:mt-8 3xl:mt-10">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className={`pt-4 2xl:pt-6 3xl:pt-8 space-y-3 2xl:space-y-4 3xl:space-y-5 ${
            pieChartData.length > 4 ? 'max-h-48 2xl:max-h-64 3xl:max-h-80 overflow-y-auto custom-scrollbar pr-2' : ''
          }`}>
            {pieChartData.map((product, index) => {
              const totalValue = pieChartData.reduce((sum, p) => sum + p.total, 0);
              const percentage = ((product.total / totalValue) * 100).toFixed(1);
              const profitPercentage = product.invested > 0 ? ((product.roi / product.invested) * 100).toFixed(1) : 0;
              
              return (
                <div 
                  key={index} 
                  className="group/item relative overflow-hidden rounded-xl p-3 2xl:p-4 3xl:p-5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3 2xl:gap-4 3xl:gap-5 flex-1 min-w-0">
                      <div className="relative">
                        <div 
                          className="w-4 h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6 rounded-lg border-2 border-white/30 shadow-lg"
                          style={{ backgroundColor: product.color }}
                        />
                        <div 
                          className="absolute inset-0 rounded-lg blur-md opacity-50"
                          style={{ backgroundColor: product.color }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 2xl:gap-3 mb-1">
                          <span className="text-white font-semibold text-sm 2xl:text-base 3xl:text-lg truncate">
                            {product.name}
                          </span>
                          <span className="text-white/60 text-xs 2xl:text-sm 3xl:text-base font-medium bg-white/10 px-2 2xl:px-3 py-0.5 2xl:py-1 rounded-full whitespace-nowrap">
                            {percentage}%
                          </span>
                        </div>
                        <div className="flex items-center gap-3 2xl:gap-4 3xl:gap-5 text-xs 2xl:text-sm 3xl:text-base">
                          <span className="text-white/50">Investi: <span className="text-white/70 font-medium">{product.invested.toLocaleString()} MAD</span></span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4 2xl:ml-6 3xl:ml-8">
                      <div className="text-[#3CD4AB] font-bold text-sm 2xl:text-base 3xl:text-lg mb-1">
                        {product.total.toLocaleString()} MAD
                      </div>
                      <div className={`text-xs 2xl:text-sm 3xl:text-base font-semibold px-2 2xl:px-3 3xl:px-4 py-0.5 2xl:py-1 3xl:py-1.5 rounded-full inline-block ${
                        product.roi >= 0 
                          ? 'text-green-400 bg-green-400/10' 
                          : 'text-red-400 bg-red-400/10'
                      }`}>
                        +{product.roi.toLocaleString()} MAD ({profitPercentage}%)
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(60, 212, 171, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(60, 212, 171, 0.5);
        }
      `}</style>
    </div>
  );
};

export default SimplePieChart;