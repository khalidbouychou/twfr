import React, { useState, useEffect } from 'react';
import { RecommendationEngine } from '../Algo';

const Resultat = ({ userAnswers, onBackToProfiling }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [showAlternativeScenarios, setShowAlternativeScenarios] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [showExcludedProducts, setShowExcludedProducts] = useState(false);

  useEffect(() => {
    if (userAnswers) {
      const engine = new RecommendationEngine();
      const results = engine.generateCompleteRecommendation(userAnswers);
      setRecommendations(results);
    }
  }, [userAnswers]);

  if (!recommendations) {
    return (
      <div className="min-h-screen bg-[#0F0F19] flex items-center justify-center">
        <div className="text-white text-xl">Chargement des recommandations...</div>
      </div>
    );
  }

  const { riskProfile, matchedProducts, portfolioAllocation, excludedProducts } = recommendations;

  // Color scheme for risk levels
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Faible': return '#3CD4AB';
      case 'Modéré': return '#FFA500';
      case 'Élevé': return '#FF6B6B';
      default: return '#89559F';
    }
  };

  // Generate pie chart data for portfolio allocation
  const generatePieChartData = (allocation) => {
    return [
      { name: 'Conservateur', value: allocation.conservative, color: '#3CD4AB' },
      { name: 'Équilibré', value: allocation.balanced, color: '#89559F' },
      { name: 'Agressif', value: allocation.aggressive, color: '#FF6B6B' }
    ];
  };

  // Simple pie chart component
  const PieChart = ({ data, size = 200 }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
      <svg width={size} height={size} className="mx-auto">
        {data.map((item, index) => {
          const percentage = item.value / total;
          const startAngle = currentAngle;
          const endAngle = currentAngle + (percentage * 360);
          currentAngle = endAngle;

          const x1 = size / 2 + (size / 2 - 20) * Math.cos(startAngle * Math.PI / 180);
          const y1 = size / 2 + (size / 2 - 20) * Math.sin(startAngle * Math.PI / 180);
          const x2 = size / 2 + (size / 2 - 20) * Math.cos(endAngle * Math.PI / 180);
          const y2 = size / 2 + (size / 2 - 20) * Math.sin(endAngle * Math.PI / 180);

          const largeArcFlag = percentage > 0.5 ? 1 : 0;

          const pathData = [
            `M ${size / 2} ${size / 2}`,
            `L ${x1} ${y1}`,
            `A ${size / 2 - 20} ${size / 2 - 20} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');

          return (
            <path
              key={index}
              d={pathData}
              fill={item.color}
              stroke="#0F0F19"
              strokeWidth="2"
            />
          );
        })}
        <circle cx={size / 2} cy={size / 2} r={size / 2 - 40} fill="#0F0F19" />
        <text x={size / 2} y={size / 2} textAnchor="middle" dy="0.35em" className="text-white font-bold text-lg">
          {total}%
        </text>
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-[#0F0F19] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Vos Recommandations Personnalisées
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Basées sur votre profil financier, voici nos recommandations d'investissement 
            adaptées à vos objectifs et à votre tolérance au risque.
          </p>
        </div>

        {/* Risk Profile Section */}
        <div className="bg-white/5 rounded-lg p-6 mb-8 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Profil de Risque</h2>
            <div 
              className="px-4 py-2 rounded-full text-white font-semibold"
              style={{ backgroundColor: getRiskColor(riskProfile.riskLevel) }}
            >
              {riskProfile.riskLevel}
            </div>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed">
            {riskProfile.description}
          </p>
        </div>

        {/* Portfolio Allocation Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Allocation Recommandée</h3>
            <div className="flex items-center justify-center mb-6">
              <PieChart data={generatePieChartData(portfolioAllocation)} />
            </div>
            <div className="space-y-3">
              {generatePieChartData(portfolioAllocation).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded mr-3"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-white">{item.name}</span>
                  </div>
                  <span className="text-white font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Produits Recommandés</h3>
            <div className="space-y-4">
              {matchedProducts.slice(0, 3).map((product, index) => (
                <div key={index} className="flex items-center p-3 bg-white/5 rounded-lg">
                  <img 
                    src={product.avatar} 
                    alt={product.nom_produit} 
                    className="w-12 h-12 rounded mr-3"
                  />
                  <div className="flex-1">
                    <div className="text-white font-semibold">{product.nom_produit}</div>
                    <div className="text-gray-400 text-sm">{product.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{product.overallCompatibility}%</div>
                    <div className="text-gray-400 text-xs">Compatibilité</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alternative Scenarios */}
        <div className="bg-white/5 rounded-lg p-6 mb-8 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Scénarios Alternatifs</h3>
            <button
              onClick={() => setShowAlternativeScenarios(!showAlternativeScenarios)}
              className="px-4 py-2 bg-[#89559F] text-white rounded-lg hover:bg-[#7a4a8a] transition-colors"
            >
              {showAlternativeScenarios ? 'Masquer' : 'Afficher 5 scénarios alternatifs'}
            </button>
          </div>
          
          {showAlternativeScenarios && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {recommendations.generateAlternativeScenarios(userAnswers).map((scenario, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedScenario === index 
                      ? 'border-[#3CD4AB] bg-[#3CD4AB]/10' 
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedScenario(selectedScenario === index ? null : index)}
                >
                  <h4 className="text-white font-semibold mb-2">{scenario.name}</h4>
                  <p className="text-gray-400 text-sm mb-3">{scenario.description}</p>
                  <div className="space-y-1 text-xs text-white/80">
                    <div>Conservateur: {scenario.allocation.conservative}%</div>
                    <div>Équilibré: {scenario.allocation.balanced}%</div>
                    <div>Agressif: {scenario.allocation.aggressive}%</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detailed Product Comparison */}
        <div className="bg-white/5 rounded-lg p-6 mb-8 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Comparaison des Produits</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-3">Produit</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Risque</th>
                  <th className="text-left p-3">Durée</th>
                  <th className="text-left p-3">Rendement</th>
                  <th className="text-left p-3">Compatibilité</th>
                </tr>
              </thead>
              <tbody>
                {matchedProducts.map((product, index) => (
                  <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3">
                      <div className="flex items-center">
                        <img 
                          src={product.avatar} 
                          alt={product.nom_produit} 
                          className="w-8 h-8 rounded mr-2"
                        />
                        <span className="font-medium">{product.nom_produit}</span>
                      </div>
                    </td>
                    <td className="p-3">{product.type}</td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <div className="flex space-x-1 mr-2">
                          {[...Array(7)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded ${
                                i < product.risque ? 'bg-red-500' : 'bg-gray-600'
                              }`}
                            ></div>
                          ))}
                        </div>
                        {product.risque}/7
                      </div>
                    </td>
                    <td className="p-3">{product.duree_recommandee}</td>
                    <td className="p-3">{product.rendement}</td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-700 rounded-full h-2 mr-2">
                          <div
                            className="bg-[#3CD4AB] h-2 rounded-full"
                            style={{ width: `${product.overallCompatibility}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold">{product.overallCompatibility}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Excluded Products */}
        <div className="bg-white/5 rounded-lg p-6 mb-8 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Produits Exclus</h3>
            <button
              onClick={() => setShowExcludedProducts(!showExcludedProducts)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {showExcludedProducts ? 'Masquer' : 'Voir les exclusions'}
            </button>
          </div>
          
          {showExcludedProducts && (
            <div className="space-y-4">
              {excludedProducts.map((product, index) => (
                <div key={index} className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <img 
                        src={product.avatar} 
                        alt={product.nom_produit} 
                        className="w-10 h-10 rounded mr-3"
                      />
                      <div>
                        <div className="text-white font-semibold">{product.nom_produit}</div>
                        <div className="text-gray-400 text-sm">{product.type}</div>
                      </div>
                    </div>
                    <div className="text-red-400 text-sm font-medium">
                      Exclu
                    </div>
                  </div>
                  <div className="text-red-300 text-sm">
                    <strong>Raison:</strong> {product.reason}
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    <span>Risque: {product.risque}/7</span>
                    <span className="mx-2">•</span>
                    <span>Min: {product.montant_min} MAD</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {onBackToProfiling && (
            <button
              onClick={onBackToProfiling}
              className="px-8 py-3 bg-[#89559F] text-white rounded-lg hover:bg-[#7a4a8a] transition-colors font-semibold"
            >
              Modifier mon profil
            </button>
          )}
          <a
            href="/dashboard"
            className="px-8 py-3 bg-[#3CD4AB] text-[#0F0F19] rounded-lg hover:bg-[#2bb894] transition-colors font-semibold text-center"
          >
            Aller au Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default Resultat; 