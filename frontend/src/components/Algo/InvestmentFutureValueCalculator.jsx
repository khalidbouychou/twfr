import React, { useState, useMemo } from 'react';
import { 
  IoCalculator, 
  IoTrendingUp, 
  IoShieldCheckmark, 
  IoTime,
  IoStar,
  IoInformationCircle,
  IoCheckmarkCircle,
  IoWarning,
  IoCash,
  IoPieChart
} from 'react-icons/io5';
import products from '../Resultat/Products/Tawfir_Products.json';

const InvestmentFutureValueCalculator = () => {
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [investmentDuration, setInvestmentDuration] = useState(12);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showRiskAdjustment, setShowRiskAdjustment] = useState(true);

  // Facteurs d'ajustement du risque (impact sur le rendement)
  const riskAdjustmentFactors = {
    1: { factor: 1.0, label: 'Très Faible', color: 'text-green-600', bg: 'bg-green-100' },
    2: { factor: 0.98, label: 'Faible', color: 'text-green-500', bg: 'bg-green-50' },
    3: { factor: 0.95, label: 'Modéré-Faible', color: 'text-yellow-500', bg: 'bg-yellow-50' },
    4: { factor: 0.92, label: 'Modéré', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    5: { factor: 0.88, label: 'Modéré-Élevé', color: 'text-orange-500', bg: 'bg-orange-50' },
    6: { factor: 0.85, label: 'Élevé', color: 'text-orange-600', bg: 'bg-orange-100' },
    7: { factor: 0.80, label: 'Très Élevé', color: 'text-red-500', bg: 'bg-red-50' },
    8: { factor: 0.75, label: 'Extrême', color: 'text-red-600', bg: 'bg-red-100' }
  };

  // Calcul de la valeur future selon la formule
  const calculateFutureValue = (P, r, t, riskLevel) => {
    // Formule: P * (1 + r/100)^(t/12)
    const baseRate = r / 100;
    const monthlyRate = baseRate / 12;
    const months = t;
    
    // Ajustement du risque
    const riskFactor = riskAdjustmentFactors[riskLevel]?.factor || 1.0;
    const adjustedRate = baseRate * riskFactor;
    const adjustedMonthlyRate = adjustedRate / 12;
    
    const futureValue = P * Math.pow(1 + adjustedMonthlyRate, months);
    const gains = futureValue - P;
    const effectiveRate = (Math.pow(futureValue / P, 12 / months) - 1) * 100;
    
    return {
      futureValue: Math.round(futureValue * 100) / 100,
      gains: Math.round(gains * 100) / 100,
      effectiveRate: Math.round(effectiveRate * 100) / 100,
      baseRate: r,
      adjustedRate: Math.round(adjustedRate * 100 * 100) / 100,
      riskFactor: riskFactor,
      monthlyRate: Math.round(monthlyRate * 1000000) / 1000000,
      adjustedMonthlyRate: Math.round(adjustedMonthlyRate * 1000000) / 1000000
    };
  };

  // Calculs pour tous les produits
  const productCalculations = useMemo(() => {
    return products.map(product => {
      const calculation = calculateFutureValue(
        investmentAmount,
        product.rendement_annuel_moyen,
        investmentDuration,
        product.risque
      );
      
      return {
        ...product,
        calculation,
        riskInfo: riskAdjustmentFactors[product.risque]
      };
    });
  }, [investmentAmount, investmentDuration]);

  // Tri par rendement effectif (après ajustement du risque)
  const sortedProducts = useMemo(() => {
    return [...productCalculations].sort((a, b) => b.calculation.effectiveRate - a.calculation.effectiveRate);
  }, [productCalculations]);

  // Sélection/désélection de produits
  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Calcul du portefeuille sélectionné
  const portfolioCalculation = useMemo(() => {
    if (selectedProducts.length === 0) return null;
    
    const selectedProductsData = productCalculations.filter(p => selectedProducts.includes(p.id));
    const totalInvestment = selectedProductsData.length * investmentAmount;
    const totalFutureValue = selectedProductsData.reduce((sum, p) => sum + p.calculation.futureValue, 0);
    const totalGains = totalFutureValue - totalInvestment;
    const portfolioEffectiveRate = (Math.pow(totalFutureValue / totalInvestment, 12 / investmentDuration) - 1) * 100;
    
    // Risque moyen du portefeuille
    const averageRisk = selectedProductsData.reduce((sum, p) => sum + p.risque, 0) / selectedProductsData.length;
    
    return {
      totalInvestment,
      totalFutureValue: Math.round(totalFutureValue * 100) / 100,
      totalGains: Math.round(totalGains * 100) / 100,
      portfolioEffectiveRate: Math.round(portfolioEffectiveRate * 100) / 100,
      averageRisk: Math.round(averageRisk * 10) / 10,
      riskInfo: riskAdjustmentFactors[Math.round(averageRisk)]
    };
  }, [selectedProducts, productCalculations, investmentAmount, investmentDuration]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🧮 Calculateur de Valeur Future d'Investissement
        </h1>
        <p className="text-gray-600">
          Application de la formule P × (1 + r/100)^(t/12) avec ajustement du risque
        </p>
      </div>

      {/* Paramètres d'investissement */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <IoCalculator className="mr-2 text-blue-600" />
          Paramètres d'Investissement
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant par Produit (P)
            </label>
            <div className="relative">
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(parseFloat(e.target.value) || 0)}
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="100"
                step="100"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <span className="text-gray-500">DH</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durée en Mois (t)
            </label>
            <select
              value={investmentDuration}
              onChange={(e) => setInvestmentDuration(parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={3}>3 mois</option>
              <option value={6}>6 mois</option>
              <option value={12}>1 an</option>
              <option value={24}>2 ans</option>
              <option value={36}>3 ans</option>
              <option value={60}>5 ans</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ajustement du Risque
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={showRiskAdjustment}
                onChange={(e) => setShowRiskAdjustment(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Activer l'ajustement du risque
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Le rendement est ajusté selon le niveau de risque du produit
            </p>
          </div>
        </div>

        {/* Formule */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">Formule Appliquée</h3>
          <div className="text-center">
            <div className="text-lg font-mono text-gray-800 mb-2">
              Valeur future = P × (1 + r/100)^(t/12)
            </div>
            <div className="text-sm text-gray-600">
              Avec ajustement du risque: r_ajusté = r × facteur_risque
            </div>
          </div>
        </div>
      </div>

      {/* Résultats par produit */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <IoPieChart className="mr-2 text-green-600" />
          Calculs par Produit
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Produit</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Risque</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Rendement Base</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Rendement Ajusté</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Valeur Future</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Gains</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Rendement Effectif</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Sélection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <img
                        src={product.avatar}
                        alt={product.nom_produit}
                        className="w-10 h-10 rounded-lg object-cover mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-800">{product.nom_produit}</div>
                        <div className="text-sm text-gray-500">{product.famille}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.riskInfo.bg} ${product.riskInfo.color}`}>
                      {product.risque}/8 - {product.riskInfo.label}
                    </span>
                  </td>
                  
                  <td className="px-4 py-4 text-center">
                    <span className="font-medium text-gray-800">{product.rendement_annuel_moyen}%</span>
                  </td>
                  
                  <td className="px-4 py-4 text-center">
                    <span className="font-medium text-blue-600">{product.calculation.adjustedRate}%</span>
                    <div className="text-xs text-gray-500">
                      Facteur: {product.calculation.riskFactor}
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 text-center">
                    <span className="font-semibold text-green-600">{product.calculation.futureValue.toLocaleString()} DH</span>
                  </td>
                  
                  <td className="px-4 py-4 text-center">
                    <span className="font-medium text-green-600">+{product.calculation.gains.toLocaleString()} DH</span>
                  </td>
                  
                  <td className="px-4 py-4 text-center">
                    <span className="font-semibold text-purple-600">{product.calculation.effectiveRate}%</span>
                  </td>
                  
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => toggleProductSelection(product.id)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedProducts.includes(product.id)
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {selectedProducts.includes(product.id) ? 'Sélectionné' : 'Sélectionner'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Portefeuille sélectionné */}
      {portfolioCalculation && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <IoStar className="mr-2 text-yellow-600" />
            Portefeuille Sélectionné
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{selectedProducts.length}</div>
              <div className="text-sm text-blue-700">Produits Sélectionnés</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{portfolioCalculation.totalInvestment.toLocaleString()} DH</div>
              <div className="text-sm text-green-700">Investissement Total</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{portfolioCalculation.totalFutureValue.toLocaleString()} DH</div>
              <div className="text-sm text-purple-700">Value Future</div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">+{portfolioCalculation.totalGains.toLocaleString()} DH</div>
              <div className="text-sm text-orange-700">Gains Totaux</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Rendement du Portefeuille</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{portfolioCalculation.portfolioEffectiveRate}%</div>
                <div className="text-sm text-gray-600">Rendement effectif annuel</div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Risque Moyen</h3>
              <div className="text-center">
                <span className={`px-3 py-2 rounded-full text-lg font-medium ${portfolioCalculation.riskInfo.bg} ${portfolioCalculation.riskInfo.color}`}>
                  {portfolioCalculation.averageRisk}/8 - {portfolioCalculation.riskInfo.label}
                </span>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Durée d'Investissement</h3>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{investmentDuration} mois</div>
                <div className="text-sm text-gray-600">({(investmentDuration / 12).toFixed(1)} ans)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Explications de la formule */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <IoInformationCircle className="mr-2 text-yellow-600" />
          Explications de la Formule
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-800 mb-3">🧮 Formule de Base</h3>
            <div className="bg-white p-4 rounded-lg border">
              <div className="font-mono text-lg text-center mb-2">
                P × (1 + r/100)^(t/12)
              </div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <strong>P</strong> : Montant investi</li>
                <li>• <strong>r</strong> : Rendement annuel moyen (%)</li>
                <li>• <strong>t</strong> : Durée en mois</li>
                <li>• <strong>r/100</strong> : Conversion en décimal</li>
                <li>• <strong>t/12</strong> : Conversion en années</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-3">⚠️ Ajustement du Risque</h3>
            <div className="bg-white p-4 rounded-lg border">
              <div className="font-mono text-lg text-center mb-2">
                r_ajusté = r × facteur_risque
              </div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <strong>Risque 1-2</strong> : Facteur 1.0-0.98 (pas d'impact)</li>
                <li>• <strong>Risque 3-4</strong> : Facteur 0.95-0.92 (impact faible)</li>
                <li>• <strong>Risque 5-6</strong> : Facteur 0.88-0.85 (impact modéré)</li>
                <li>• <strong>Risque 7-8</strong> : Facteur 0.80-0.75 (impact élevé)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentFutureValueCalculator; 