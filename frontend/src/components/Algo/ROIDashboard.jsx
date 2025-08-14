import React, { useState, useMemo } from 'react';
import { ROICalculator } from './ROICalculator';

const ROIDashboard = ({ products, investmentAmount = 10000, selectedPeriod = 5 }) => {
  const [period, setPeriod] = useState(selectedPeriod);
  const [amount, setAmount] = useState(investmentAmount);

  const roiCalculations = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    
    return products.map(product => {
      const roi1Year = ROICalculator.calculateSimpleROI(amount, product.roi_annuel !== undefined ? product.roi_annuel : 5, 1);
      const roi3Years = ROICalculator.calculateSimpleROI(amount, product.roi_annuel !== undefined ? product.roi_annuel : 5, 3);
      const roi5Years = ROICalculator.calculateSimpleROI(amount, product.roi_annuel !== undefined ? product.roi_annuel : 5, 5);
      const roi10Years = ROICalculator.calculateSimpleROI(amount, product.roi_annuel !== undefined ? product.roi_annuel : 5, 10);
      
      const riskAdjusted = ROICalculator.calculateRiskAdjustedROI(
        product.roi_annuel !== undefined ? product.roi_annuel : 5, 
        product.volatilite !== undefined ? product.volatilite : 5
      );
      
      const netROI = ROICalculator.calculateNetROI(
        amount, 
        product.roi_annuel !== undefined ? product.roi_annuel : 5, 
        period, 
        product.frais_annuels !== undefined ? product.frais_annuels : 1.5
      );

      const breakEven = ROICalculator.calculateBreakEven(
        amount, 
        product.roi_annuel !== undefined ? product.roi_annuel : 5, 
        product.frais_annuels !== undefined ? product.frais_annuels : 1.5
      );

      return {
        ...product,
        roi: {
          roi1Year: roi1Year.roiPercentage,
          roi3Years: roi3Years.roiPercentage,
          roi5Years: roi5Years.roiPercentage,
          roi10Years: roi10Years.roiPercentage,
          finalValue1Year: roi1Year.finalValue,
          finalValue3Years: roi3Years.finalValue,
          finalValue5Years: roi5Years.finalValue,
          finalValue10Years: roi10Years.finalValue,
          totalReturn1Year: roi1Year.totalReturn,
          totalReturn3Years: roi3Years.totalReturn,
          totalReturn5Years: roi5Years.totalReturn,
          totalReturn10Years: roi10Years.totalReturn
        },
        riskAdjusted,
        netROI,
        breakEven,
        comparisonScore: (roi5Years.roiPercentage * 0.4) + (riskAdjusted.sharpeRatio * 0.3) + (netROI.netROIPercentage * 0.3)
      };
    }).sort((a, b) => b.comparisonScore - a.comparisonScore);
  }, [products, amount, period]);

  const periods = [1, 3, 5, 10];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white/5 p-4 rounded-lg border border-white/10">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-1">
              Montant d'Investissement (Dhs)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:border-[#3CD4AB] focus:outline-none"
              min="1000"
              step="1000"
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-1">
              Période Principale
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:border-[#3CD4AB] focus:outline-none"
            >
              {periods.map(p => (
                <option key={p} value={p}>{p} an{p > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-white/60 text-sm">Produits analysés</div>
          <div className="text-white font-semibold text-lg">{roiCalculations.length}</div>
        </div>
      </div>

      {/* ROI Comparison Table */}
      <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-white font-medium">Produit</th>
                <th className="px-4 py-3 text-center text-white font-medium">ROI 1 an</th>
                <th className="px-4 py-3 text-center text-white font-medium">ROI 3 ans</th>
                <th className="px-4 py-3 text-center text-white font-medium">ROI 5 ans</th>
                <th className="px-4 py-3 text-center text-white font-medium">ROI 10 ans</th>
                <th className="px-4 py-3 text-center text-white font-medium">Risque</th>
                <th className="px-4 py-3 text-center text-white font-medium">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {roiCalculations.map((product, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={product.avatar} 
                        alt={product.nom_produit} 
                        className="w-8 h-8 rounded-lg"
                      />
                      <div>
                        <div className="text-white font-medium text-sm">{product.nom_produit}</div>
                        <div className="text-white/60 text-xs">{product.duree_recommandee}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className={`font-semibold ${ROICalculator.getROIColor(product.roi.roi1Year)}`}>
                      {ROICalculator.formatROI(product.roi.roi1Year)}
                    </div>
                    <div className="text-white/60 text-xs">
                      {product.roi.finalValue1Year.toLocaleString()} Dhs
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className={`font-semibold ${ROICalculator.getROIColor(product.roi.roi3Years)}`}>
                      {ROICalculator.formatROI(product.roi.roi3Years)}
                    </div>
                    <div className="text-white/60 text-xs">
                      {product.roi.finalValue3Years.toLocaleString()} Dhs
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className={`font-semibold ${ROICalculator.getROIColor(product.roi.roi5Years)}`}>
                      {ROICalculator.formatROI(product.roi.roi5Years)}
                    </div>
                    <div className="text-white/60 text-xs">
                      {product.roi.finalValue5Years.toLocaleString()} Dhs
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className={`font-semibold ${ROICalculator.getROIColor(product.roi.roi10Years)}`}>
                      {ROICalculator.formatROI(product.roi.roi10Years)}
                    </div>
                    <div className="text-white/60 text-xs">
                      {product.roi.finalValue10Years.toLocaleString()} Dhs
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-16 bg-white/20 rounded-full h-2 mr-2">
                        <div
                          className="bg-[#3CD4AB] h-2 rounded-full"
                          style={{ width: `${(product.risque / 7) * 100}%` }}
                        />
                      </div>
                      <span className="text-white text-sm">{product.risque}/7</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="text-[#3CD4AB] font-semibold">
                      {product.comparisonScore.toFixed(1)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roiCalculations.slice(0, 3).map((product, index) => (
          <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                index === 0 ? 'bg-yellow-500' : 
                index === 1 ? 'bg-gray-400' : 'bg-orange-500'
              }`}>
                {index + 1}
              </div>
              <img 
                src={product.avatar} 
                alt={product.nom_produit} 
                className="w-10 h-10 rounded-lg"
              />
              <div>
                <div className="text-white font-medium">{product.nom_produit}</div>
                <div className="text-white/60 text-sm">{product.duree_recommandee}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60 text-sm">ROI {period} ans:</span>
                <span className={`font-semibold ${ROICalculator.getROIColor(product.roi[`roi${period}Years`])}`}>
                  {ROICalculator.formatROI(product.roi[`roi${period}Years`])}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 text-sm">Valeur finale:</span>
                <span className="text-white font-medium">
                  {product.roi[`finalValue${period}Years`].toLocaleString()} Dhs
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 text-sm">Ratio Sharpe:</span>
                <span className="text-white font-medium">
                  {product.riskAdjusted.sharpeRatio}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 text-sm">ROI Net:</span>
                <span className={`font-medium ${ROICalculator.getROIColor(product.netROI.netROIPercentage)}`}>
                  {ROICalculator.formatROI(product.netROI.netROIPercentage)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Risk Analysis */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Analyse des Risques</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Volatilité par Produit</h4>
            <div className="space-y-3">
              {roiCalculations.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">{product.nom_produit}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-white/20 rounded-full h-2">
                      <div
                        className="bg-[#3CD4AB] h-2 rounded-full"
                        style={{ width: `${Math.min((product.volatilite || 5) / 20 * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-white text-sm">{product.volatilite || 5}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Break-even Analysis</h4>
            <div className="space-y-3">
              {roiCalculations.slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">{product.nom_produit}</span>
                  <div className="text-right">
                    {product.breakEven.breakEvenPossible ? (
                      <div className="text-white text-sm">
                        {product.breakEven.breakEvenYears} an{product.breakEven.breakEvenYears > 1 ? 's' : ''}
                      </div>
                    ) : (
                      <div className="text-red-400 text-sm">Impossible</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROIDashboard; 