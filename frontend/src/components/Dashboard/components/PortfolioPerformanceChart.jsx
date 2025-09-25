import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "../../ui/chart.jsx";

const PortfolioPerformanceChart = ({ 
  portfolioData, 
  calculateTotalProfits, 
  areaRange, 
  setAreaRange, 
  areaSeries 
}) => {
  return (
    <div className="p-4 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold">Performance du Portefeuille</h3>
          <div className="flex gap-4 mt-2 text-sm">
            <div className="text-[#3CD4AB]">
              Total Investi: {(portfolioData?.totalInvested || 0).toLocaleString()} MAD
            </div>
            <div className="text-[#89559F]">
              Total ROI: {calculateTotalProfits().toLocaleString()} MAD
            </div>
          </div>
        </div>
        <select
          value={areaRange}
          onChange={(e) => setAreaRange(e.target.value)}
          className="bg-[#0F0F19] border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:border-[#3CD4AB] focus:outline-none"
          style={{ backgroundColor: '#0F0F19', color: 'white' }}
        >
          <option value="day" style={{ backgroundColor: '#0F0F19', color: 'white' }}>7 Jours</option>
          <option value="month" style={{ backgroundColor: '#0F0F19', color: 'white' }}>12 Mois</option>
          <option value="year" style={{ backgroundColor: '#0F0F19', color: 'white' }}>5 Années</option>
        </select>
      </div>
      <ChartContainer
        config={{
          investedPct: {
            label: "Investissement",
            color: "#3CD4AB",
          },
          profitPct: {
            label: "Profits",
            color: "#89559F",
          },
        }}
        className="h-80 w-full"
      >
        <AreaChart data={areaSeries.map(p => { 
          const total = Math.max(1, (p.invested||0)+(p.roi||0)); 
          return { 
            date: p.date, 
            investedPct: ((p.invested||0)/total*100), 
            profitPct: ((p.roi||0)/total*100), 
            invested: p.invested||0, 
            roi: p.roi||0 
          }; 
        })}>
          <defs>
            <linearGradient id="fillInvested" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3CD4AB" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3CD4AB" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillProfits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#89559F" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#89559F" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#ffffff60', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            domain={[0, 100]} 
            tickFormatter={(v) => `${v}%`} 
            tick={{ fill: '#ffffff60', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <ChartTooltip 
            content={<ChartTooltipContent 
              formatter={(value, name, props) => {
                const isInvested = name === 'investedPct';
                const label = isInvested ? 'Investissement' : 'Profits';
                const percentage = `${Number(value).toFixed(1)}%`;
                const amount = isInvested ? props.payload.invested : props.payload.roi;
                return [`${percentage} (${Number(amount).toLocaleString()} MAD)`, label];
              }}
              labelFormatter={(value) => `Période: ${value}`}
              className="bg-[#0F0F19] border border-white/20 text-white"
            />}
          />
          <Area
            type="monotone"
            dataKey="investedPct"
            name="investedPct"
            stackId="portfolio"
            stroke="#3CD4AB"
            fill="url(#fillInvested)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="profitPct"
            name="profitPct"
            stackId="portfolio"
            stroke="#89559F"
            fill="url(#fillProfits)"
            strokeWidth={2}
          />
          <ChartLegend 
            content={<ChartLegendContent 
              nameKey="name"
              payload={[
                { value: 'Investissement', type: 'line', color: '#3CD4AB' },
                { value: 'Profits', type: 'line', color: '#89559F' }
              ]}
              className="text-white"
            />}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default PortfolioPerformanceChart;