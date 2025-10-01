import React, { useState, useMemo } from 'react';
import { isWithinInterval, parseISO, subDays, subMonths, subYears, startOfDay, endOfDay } from 'date-fns';

const PortfolioPerformanceChart = ({ userInvestments }) => {
  const [dateFilter, setDateFilter] = useState('all');



  // Filter investments based on date range (for table display)
  const filteredInvestments = useMemo(() => {
    // Calculate date range based on filter selection
    const now = new Date();
    let range = null;
    
    switch (dateFilter) {
      case '7days':
        range = { from: subDays(now, 7), to: now };
        break;
      case '30days':
        range = { from: subDays(now, 30), to: now };
        break;
      case '3months':
        range = { from: subMonths(now, 3), to: now };
        break;
      case '6months':
        range = { from: subMonths(now, 6), to: now };
        break;
      case '1year':
        range = { from: subYears(now, 1), to: now };
        break;
      case 'all':
      default:
        return userInvestments;
    }
    
    if (!range) {
      return userInvestments;
    }

    // Filter investments by creation date if available
    return userInvestments.filter(investment => {
      if (investment.date || investment.createdAt || investment.dateCreated) {
        try {
          const dateStr = investment.date || investment.createdAt || investment.dateCreated;
          const investmentDate = parseISO(dateStr);
          return isWithinInterval(investmentDate, {
            start: startOfDay(range.from),
            end: endOfDay(range.to)
          });
        } catch {
          // If date parsing fails, show the investment
          return true;
        }
      }
      // If no date available, show all investments
      return true;
    });
  }, [dateFilter, userInvestments]);

  // Clear date filter function
  const clearDateFilter = () => {
    setDateFilter('all');
  };

  return (
    <div className="bg-[#0F0F19] rounded-xl p-6 border border-white/10 mb-8">
      <div className="flex flex-col sm:flex-col mb-6 gap-4">
        <h3 className="font-semibold text-white">Tableau détaillé par produit avec valeur actuelle et performance en pourcentage</h3>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-400">Filtrer par période:</span>
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 bg-[#0F0F19] border border-white/20 rounded-lg text-white text-sm hover:border-white/40 focus:border-[#3CD4AB] focus:outline-none focus:ring-2 focus:ring-[#3CD4AB]/20 transition-all cursor-pointer font-medium"
              style={{
                backgroundImage: 'none'
              }}
            >
              <option value="all" className="bg-[#1a1a2e] text-white py-2">Toutes les périodes</option>
              <option value="7days" className="bg-[#1a1a2e] text-white py-2">7 derniers jours</option>
              <option value="30days" className="bg-[#1a1a2e] text-white py-2">30 derniers jours</option>
              <option value="3months" className="bg-[#1a1a2e] text-white py-2">3 derniers mois</option>
              <option value="6months" className="bg-[#1a1a2e] text-white py-2">6 derniers mois</option>
              <option value="1year" className="bg-[#1a1a2e] text-white py-2">1 an</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white/60">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {dateFilter !== 'all' && (
            <button
              onClick={clearDateFilter}
              className="px-3 py-2 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center gap-1.5"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Réinitialiser
            </button>
          )}
          <span className="text-xs text-gray-500 ml-auto">
            {filteredInvestments.length} investissement(s) affiché(s)
          </span>
        </div>
      </div>
      
      <div className="h-100 overflow-y-scroll scrollbar-hide  ">
        {filteredInvestments.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-xl font-medium text-white mb-2">Aucun investissement</h3>
              <p className="text-gray-400">Commencez à investir pour voir vos performances ici</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto overflow-hidden ">
            {/* Summary Row */}
            <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-1">Total Investi</div>
                  <div className="text-lg font-bold text-white">
                    {filteredInvestments.length === 0 ? '0' : filteredInvestments.reduce((sum, inv) => sum + (parseFloat(inv.valueInvested) || parseFloat(inv.investedAmount) || parseFloat(inv.amount) || 0), 0).toLocaleString()} MAD
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-1">Valeur Totale</div>
                  <div className="text-lg font-bold text-white">
                    {filteredInvestments.length === 0 ? '0' : filteredInvestments.reduce((sum, inv) => sum + (parseFloat(inv.currentValue) || parseFloat(inv.valueInvested) || parseFloat(inv.investedAmount) || parseFloat(inv.amount) || 0), 0).toLocaleString()} MAD
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-1">Gains/Pertes</div>
                  <div className={`text-lg font-bold ${
                    filteredInvestments.length === 0 ? 'text-gray-400' : (
                      filteredInvestments.reduce((sum, inv) => {
                        const invested = parseFloat(inv.valueInvested) || parseFloat(inv.investedAmount) || parseFloat(inv.amount) || 0;
                        const current = parseFloat(inv.currentValue) || invested;
                        return sum + (current - invested);
                      }, 0) >= 0 ? 'text-green-400' : 'text-red-400'
                    )
                  }`}>
                    {filteredInvestments.length === 0 ? '0 MAD' : (
                      (filteredInvestments.reduce((sum, inv) => {
                        const invested = parseFloat(inv.valueInvested) || parseFloat(inv.investedAmount) || parseFloat(inv.amount) || 0;
                        const current = parseFloat(inv.currentValue) || invested;
                        return sum + (current - invested);
                      }, 0) >= 0 ? '+' : '') + 
                      filteredInvestments.reduce((sum, inv) => {
                        const invested = parseFloat(inv.valueInvested) || parseFloat(inv.investedAmount) || parseFloat(inv.amount) || 0;
                        const current = parseFloat(inv.currentValue) || invested;
                        return sum + (current - invested);
                      }, 0).toLocaleString() + ' MAD'
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-1">Performance Globale</div>
                  <div className={`text-lg font-bold ${
                    filteredInvestments.length === 0 ? 'text-gray-400' : (
                      (() => {
                        const totalInvested = filteredInvestments.reduce((sum, inv) => sum + (parseFloat(inv.valueInvested) || parseFloat(inv.investedAmount) || parseFloat(inv.amount) || 0), 0);
                        const totalCurrent = filteredInvestments.reduce((sum, inv) => sum + (parseFloat(inv.currentValue) || parseFloat(inv.valueInvested) || parseFloat(inv.investedAmount) || parseFloat(inv.amount) || 0), 0);
                        const globalPerf = totalInvested > 0 ? ((totalCurrent - totalInvested) / totalInvested) * 100 : 0;
                        return globalPerf >= 0 ? 'text-green-400' : 'text-red-400';
                      })()
                    )
                  }`}>
                    {filteredInvestments.length === 0 ? '0.00%' : (
                      (() => {
                        const totalInvested = filteredInvestments.reduce((sum, inv) => sum + (parseFloat(inv.valueInvested) || parseFloat(inv.investedAmount) || parseFloat(inv.amount) || 0), 0);
                        const totalCurrent = filteredInvestments.reduce((sum, inv) => sum + (parseFloat(inv.currentValue) || parseFloat(inv.valueInvested) || parseFloat(inv.investedAmount) || parseFloat(inv.amount) || 0), 0);
                        const globalPerf = totalInvested > 0 ? ((totalCurrent - totalInvested) / totalInvested) * 100 : 0;
                        return `${globalPerf >= 0 ? '+' : ''}${globalPerf.toFixed(2)}%`;
                      })()
                    )}
                  </div>
                </div>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Produit</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Investi</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Valeur Actuelle</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Performance</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Gains/Pertes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredInvestments.map((investment, index) => {
                  const investedAmount = parseFloat(investment.valueInvested) || parseFloat(investment.investedAmount) || parseFloat(investment.amount) || 0;
                  const currentValue = parseFloat(investment.currentValue) || investedAmount;
                  const gainLoss = currentValue - investedAmount;
                  const performancePercent = investedAmount > 0 ? ((gainLoss / investedAmount) * 100) : 0;
                  
                  return (
                    <tr key={investment.id || index} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                            {investment.pictureProduit || investment.picture || investment.avatar ? (
                              <img 
                                src={investment.pictureProduit || investment.picture || investment.avatar} 
                                alt={investment.nameProduct || investment.name || 'Produit'} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = `<span class="text-white font-bold text-sm">${(investment.nameProduct || investment.name)?.charAt(0) || 'P'}</span>`;
                                }}
                              />
                            ) : (
                              <span>{(investment.nameProduct || investment.name)?.charAt(0) || 'P'}</span>
                            )}
                          </div>
                          <div>
                            <div className="text-white font-medium">{investment.nameProduct || investment.name || 'Produit Inconnu'}</div>
                            <div className="text-gray-400 text-sm">{investment.category || 'Non catégorisé'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="text-white font-medium">
                          {investedAmount.toLocaleString()} MAD
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="text-white font-medium">
                          {currentValue.toLocaleString()} MAD
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className={`font-bold ${performancePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {performancePercent >= 0 ? '+' : ''}{performancePercent.toFixed(2)}%
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className={`font-medium ${gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {gainLoss >= 0 ? '+' : ''}{gainLoss.toLocaleString()} MAD
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            
          </div>
          
        )}
      </div>
{/*       
      {filteredInvestments.length > 0 && (
        <div className="mt-4 flex justify-center">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-3 h-3 bg-gradient-to-b from-green-500 to-green-600 rounded"></div>
            <span>Revenus générés</span>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default PortfolioPerformanceChart;