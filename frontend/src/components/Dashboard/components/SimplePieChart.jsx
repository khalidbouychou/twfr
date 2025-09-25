import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const SimplePieChart = ({ pieChartData, setCurrentPage }) => {
  return (
    <div className="p-4 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Répartition des Investissements</h3>
        <div className="text-xs text-white/60">
          Mis à jour toutes les 30s
        </div>
      </div>
      <div className="w-full h-80">
        {pieChartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/60">
            <div className="text-6xl mb-4">📊</div>
            <h4 className="text-lg font-medium text-white mb-2">Aucun investissement trouvé</h4>
            <p className="text-sm text-center max-w-xs">
              Commencez par investir dans des produits pour voir la répartition de votre portefeuille ici.
            </p>
            <button 
              onClick={() => setCurrentPage("investments")}
              className="mt-4 px-4 py-2 bg-[#3CD4AB] text-white rounded-lg hover:bg-[#2ea885] transition-colors"
            >
              Explorer les investissements
            </button>
          </div>
        ) : (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="total"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                labelLine={false}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [
                  `${Number(value).toLocaleString()} MAD`,
                  'Valeur Totale'
                ]}
                contentStyle={{ 
                  backgroundColor: '#0F0F19', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  color: '#fff',
                  borderRadius: '8px'
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#0F0F19] border border-white/20 rounded-lg p-3 text-white">
                        <p className="font-semibold text-white mb-2">{data.name}</p>
                        <p className="text-[#3CD4AB]">
                          Investi: {data.invested.toLocaleString()} MAD
                        </p>
                        <p className="text-[#89559F]">
                          ROI: {data.roi.toLocaleString()} MAD
                        </p>
                        <p className="text-white border-t border-white/20 pt-1 mt-1">
                          Total: {data.total.toLocaleString()} MAD
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                wrapperStyle={{ color: '#fff' }}
                content={({ payload }) => (
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {payload.map((entry, index) => (
                      <div key={index} className="flex items-center gap-1 text-xs text-white">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: entry.color }}
                        />
                        <span>{entry.payload.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      
      {/* Product Details Summary */}
      {pieChartData.length > 0 && (
        <div className={`mt-4 space-y-2 ${pieChartData.length > 4 ? 'max-h-32 overflow-y-scroll no-scrollbar' : ''}`}>
          {pieChartData.map((product, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: product.color }}
                />
                <span className="text-white">{product.name}</span>
              </div>
              <div className="text-right">
                <div className="text-[#3CD4AB]">{product.invested.toLocaleString()} MAD</div>
                <div className="text-[#89559F] text-xs">+{product.roi.toLocaleString()} MAD</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimplePieChart;