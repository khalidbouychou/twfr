import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { RecommendationEngine } from '../Algo';

const InvestmentResults = ({ formData }) => {
  const [showAlternativeScenarios, setShowAlternativeScenarios] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [showReintegrationModal, setShowReintegrationModal] = useState(false);

  // Use the recommendation engine
  const recommendationEngine = new RecommendationEngine();
  const baseResults = recommendationEngine.generateCompleteRecommendation(formData);
  
  // Initialize with base results
  const [results, setResults] = useState(baseResults);
  
  // Handle scenario selection
  const handleScenarioSelection = (scenarioIndex) => {
    setSelectedScenario(scenarioIndex);
    const selectedScenarioData = baseResults.alternativeScenarios[scenarioIndex];
    
    // Generate new allocation based on selected scenario
    const scenarioAllocation = selectedScenarioData.products.map((product, index) => {
      const colors = ['#3CD4AB', '#89559F', '#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF'];
      return {
        name: product.nom_produit,
        value: Math.round(100 / selectedScenarioData.products.length),
        color: colors[index % colors.length],
        product: product
      };
    });
    
    // Add compatibility scores to scenario products
    const scenarioProductsWithCompatibility = selectedScenarioData.products.map(product => ({
      ...product,
      overallCompatibility: selectedScenarioData.compatibility
    }));
    
    // Update results with selected scenario data
    setResults({
      ...baseResults,
      allocation: scenarioAllocation,
      compatibilityScore: selectedScenarioData.compatibility,
      matchedProducts: scenarioProductsWithCompatibility,
      currentScenario: selectedScenarioData.name
    });
  };

  return (
    <div className="min-h-screen bg-[#0F0F19] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold text-white mb-4">
            Vos Recommandations d'Investissement
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Basées sur votre profil financier, voici nos recommandations personnalisées
          </p>
          {results.currentScenario && (
            <div className="mt-4 inline-block bg-[#3CD4AB]/20 border border-[#3CD4AB] rounded-lg px-4 py-2">
              <span className="text-[#3CD4AB] font-semibold">
                Scénario actuel: {results.currentScenario}
              </span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Allocation & Compatibility */}
          <div className="space-y-6">
            {/* Personalized Allocation */}
            <div className="bg-white/10 rounded-lg p-6 animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-2xl font-bold text-white mb-4">Allocation Personnalisée</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={results.allocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {results.allocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Allocation']}
                        contentStyle={{ backgroundColor: '#0F0F19', border: '1px solid #89559F' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Product List */}
                <div className="space-y-3">
                  {results.allocation.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-white font-medium">{item.name}</span>
                      </div>
                      <span className="text-[#3CD4AB] font-bold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile-Product Match */}
            <div className="bg-white/10 rounded-lg p-6 animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-2xl font-bold text-white mb-4">Match Profil-Produit</h2>
              <div className="text-center">
                <div className="text-6xl font-bold text-[#3CD4AB] mb-2">
                  {results.compatibilityScore}%
                </div>
                <p className="text-gray-300">Compatibilité</p>
                <div className="mt-4 bg-white/10 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-[#3CD4AB] to-[#89559F] h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${results.compatibilityScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Scenarios & Recommendations */}
          <div className="space-y-6">
            {/* Alternative Scenarios */}
            <div className="bg-white/10 rounded-lg p-6 animate-slideUp" style={{ animationDelay: '0.3s' }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Autres Scénarios</h2>
                <div className="flex space-x-2">
                  {results.currentScenario && results.currentScenario !== 'Scénario Équilibré' && (
                    <button
                      onClick={() => handleScenarioSelection(1)} // Reset to balanced scenario
                      className="px-3 py-2 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#e55a5a] transition-all duration-200 text-sm"
                    >
                      Réinitialiser
                    </button>
                  )}
                  <button
                    onClick={() => setShowAlternativeScenarios(!showAlternativeScenarios)}
                    className="px-4 py-2 bg-[#89559F] text-white rounded-lg hover:bg-[#7a4a8a] transition-all duration-200"
                  >
                    {showAlternativeScenarios ? 'Masquer' : 'Afficher 5 scénarios alternatifs'}
                  </button>
                </div>
              </div>

              {showAlternativeScenarios && (
                <div className="space-y-4 animate-fadeIn">
                  {results.alternativeScenarios.map((scenario, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedScenario === index 
                          ? 'bg-[#3CD4AB]/20 border-2 border-[#3CD4AB]' 
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                      onClick={() => handleScenarioSelection(index)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-white font-semibold">{scenario.name}</h3>
                        <span className="text-[#3CD4AB] font-bold">{scenario.compatibility}%</span>
                      </div>
                      <p className="text-gray-300 text-sm">{scenario.description}</p>
                      <div className="mt-2 text-xs text-gray-400">
                        {scenario.products.length} produits recommandés
                      </div>
                      {results.currentScenario === scenario.name && (
                        <div className="mt-2 text-xs text-[#3CD4AB] font-semibold">
                          ✓ Scénario actuel
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="bg-white/10 rounded-lg p-6 animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <h2 className="text-2xl font-bold text-white mb-4">Recommandations</h2>
              <div className="space-y-3">
                {results.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-[#3CD4AB] rounded-full mt-2 mr-3 flex-shrink-0" />
                    <p className="text-gray-300">{rec.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Excluded Products */}
            {results.excludedProducts.length > 0 && (
              <div className="bg-white/10 rounded-lg p-6 animate-slideUp" style={{ animationDelay: '0.5s' }}>
                <h2 className="text-2xl font-bold text-white mb-4">Produits Exclus</h2>
                <div className="space-y-3">
                  {results.excludedProducts.slice(0, 3).map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
                      <span className="text-gray-300">{product.nom_produit}</span>
                      <span className="text-red-400 text-sm">Exclu</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setShowReintegrationModal(true)}
                  className="mt-4 px-4 py-2 bg-[#89559F] text-white rounded-lg hover:bg-[#7a4a8a] transition-all duration-200"
                >
                  Réintégrer avec impact
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Products Grid */}
        <div className="mt-8 bg-white/10 rounded-lg p-6 animate-slideUp" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-2xl font-bold text-white mb-6">Produits Recommandés</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.matchedProducts.slice(0, 6).map((product, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center mb-3">
                  <img 
                    src={product.avatar} 
                    alt={product.nom_produit}
                    className="w-12 h-12 rounded-lg mr-3"
                  />
                  <div>
                    <h3 className="text-white font-semibold">{product.nom_produit}</h3>
                    <p className="text-gray-400 text-sm">Risque: {product.risque}/7</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300">
                    <span className="text-[#3CD4AB]">Durée:</span> {product.duree_recommandee}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-[#3CD4AB]">Enveloppe:</span> {product.enveloppe_gestion}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-[#3CD4AB]">Compatibilité:</span> {Math.round(product.overallCompatibility)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4 animate-slideUp" style={{ animationDelay: '0.7s' }}>
          <button className="px-8 py-3 bg-[#3CD4AB] text-[#0F0F19] rounded-lg font-semibold hover:bg-[#2bb894] transition-all duration-200">
            Investir
          </button>
          <button className="px-8 py-3 bg-[#89559F] text-white rounded-lg font-semibold hover:bg-[#7a4a8a] transition-all duration-200">
            Télécharger le Rapport
          </button>
        </div>

        {/* Reintegration Modal */}
        {showReintegrationModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-[#0F0F19] rounded-lg p-6 max-w-md w-full mx-4 border border-[#89559F]">
              <h3 className="text-xl font-bold text-white mb-4">Réintégrer les Produits Exclus</h3>
              
              <div className="space-y-4 mb-6">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Impact sur votre profil</h4>
                  <p className="text-gray-300 text-sm">
                    Réintégrer ces produits peut augmenter le risque de votre portefeuille et 
                    ne correspond pas à votre profil de tolérance au risque actuel.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-white font-semibold">Produits à réintégrer :</h4>
                  {results.excludedProducts.slice(0, 3).map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
                      <span className="text-gray-300">{product.nom_produit}</span>
                      <span className="text-red-400 text-sm">Risque: {product.risque}/7</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowReintegrationModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    // Here you would implement the actual reintegration logic
                    alert('Fonctionnalité de réintégration en cours de développement');
                    setShowReintegrationModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#e55a5a] transition-all duration-200"
                >
                  Réintégrer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default InvestmentResults; 