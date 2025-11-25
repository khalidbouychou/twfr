import React, { useState, useMemo, useEffect } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend
} from 'recharts';
import { 
  IoTrendingUp, 
  IoShieldCheckmark, 
  IoTime, 
  IoStar,
  IoInformationCircle,
  IoCheckmarkCircle,
  IoWarning,
  IoCash,
  IoPieChart,
  IoBarChart,
  IoCalculator,
  IoArrowForward,
  IoArrowBack
} from 'react-icons/io5';
import { ROICalculator } from '../Algo';
import { useUserContext } from '../Context/useUserContext';
import { useCart } from '../Context/CartContext';

const DrivenInvestmentRecommendations = ({ userResults, onInvestmentDecision }) => {
  const { addUserInvestment } = useUserContext();
  const { addMultipleToCart } = useCart();
  const [selectedView, setSelectedView] = useState('summary'); // 'summary', 'scenarios', 'simulation'
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [investmentAmounts, setInvestmentAmounts] = useState({});
  const [simulationPeriod, setSimulationPeriod] = useState(5);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState({}); // Track which products are selected for cart
  const [showCartSuccessAlert, setShowCartSuccessAlert] = useState(false);

  // Load recommendations from localStorage if no userResults
  const [localRecommendations, setLocalRecommendations] = useState(null);
  
  useEffect(() => {
    if (!userResults) {
      const stored = localStorage.getItem('userResults');
      if (stored) {
        try {
          setLocalRecommendations(JSON.parse(stored));
        } catch (error) {
          console.error('Error parsing stored recommendations:', error);
        }
      }
    }
  }, [userResults]);

  const recommendations = userResults || localRecommendations;

  // Initialize investment amounts for each product
  useEffect(() => {
    if (recommendations?.matchedProducts) {
      const initialAmounts = {};
      recommendations.matchedProducts.forEach(product => {
        initialAmounts[product.id] = 1000; // Default 1000 MAD
      });
      setInvestmentAmounts(initialAmounts);
    }
  }, [recommendations]);

  // Generate portfolio allocation data for charts
  const portfolioAllocation = useMemo(() => {
    if (!recommendations?.matchedProducts) return [];

    const categories = {};
    recommendations.matchedProducts.forEach(product => {
      const category = getProductCategory(product.nom_produit);
      if (!categories[category]) {
        categories[category] = {
          name: category,
          value: 0,
          count: 0,
          products: []
        };
      }
      categories[category].value += product.overallCompatibility || 0;
      categories[category].count += 1;
      categories[category].products.push(product);
    });

    // Convert to percentage and sort
    const total = Object.values(categories).reduce((sum, cat) => sum + cat.value, 0);
    return Object.values(categories)
      .map(cat => ({
        ...cat,
        value: Math.round((cat.value / total) * 100),
        percentage: Math.round((cat.value / total) * 100)
      }))
      .sort((a, b) => b.value - a.value);
  }, [recommendations]);

  // Generate alternative scenarios
  const alternativeScenarios = useMemo(() => {
    if (!recommendations?.matchedProducts) return [];

    const scenarios = [
      {
        name: "Scénario Conservateur",
        description: "Focus sur la sécurité et la stabilité",
        allocation: { conservative: 70, balanced: 25, aggressive: 5 },
        products: recommendations.matchedProducts
          .filter(p => p.risque <= 3)
          .slice(0, 4)
          .map(p => ({ ...p, allocation: 25 }))
      },
      {
        name: "Scénario Équilibré",
        description: "Équilibre entre sécurité et croissance",
        allocation: { conservative: 40, balanced: 45, aggressive: 15 },
        products: recommendations.matchedProducts
          .filter(p => p.risque >= 2 && p.risque <= 5)
          .slice(0, 4)
          .map(p => ({ ...p, allocation: 25 }))
      },
      {
        name: "Scénario Croissance",
        description: "Focus sur la croissance et les rendements",
        allocation: { conservative: 20, balanced: 35, aggressive: 45 },
        products: recommendations.matchedProducts
          .filter(p => p.risque >= 4)
          .slice(0, 4)
          .map(p => ({ ...p, allocation: 25 }))
      },
      {
        name: "Scénario Retraite",
        description: "Optimisé pour la préparation à la retraite",
        allocation: { conservative: 50, balanced: 35, aggressive: 15 },
        products: recommendations.matchedProducts
          .filter(p => p.type === 'Obligations' || p.type === 'Fonds')
          .slice(0, 4)
          .map(p => ({ ...p, allocation: 25 }))
      },
      {
        name: "Scénario ESG",
        description: "Investissements responsables et durables",
        allocation: { conservative: 30, balanced: 50, aggressive: 20 },
        products: recommendations.matchedProducts
          .filter(p => p.categories?.includes('Équilibré'))
          .slice(0, 4)
          .map(p => ({ ...p, allocation: 25 }))
      }
    ];

    return scenarios;
  }, [recommendations]);

  // Calculate simulation results
  const simulationResults = useMemo(() => {
    if (!recommendations?.matchedProducts || Object.keys(investmentAmounts).length === 0) return null;

    const results = [];
    let totalInvested = 0;
    let totalExpectedValue = 0;

    recommendations.matchedProducts.forEach(product => {
      const amount = investmentAmounts[product.id];
      if (amount && amount > 0) {
        const roi = product.rendement_annuel_moyen !== undefined ? product.rendement_annuel_moyen : 
                    (product.roi_annuel !== undefined ? product.roi_annuel : 5);
        const roiCalculator = new ROICalculator(amount, roi, product.risque || 5);
        const expectedValue = roiCalculator.calculateFutureValue(simulationPeriod);
        const roi5Years = roiCalculator.calculateROI(simulationPeriod);

        results.push({
          product,
          amount,
          expectedValue,
          roi5Years,
          risk: product.risque || 5
        });

        totalInvested += amount;
        totalExpectedValue += expectedValue;
      }
    });

    const totalReturn = totalExpectedValue - totalInvested;
    const totalReturnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

    return {
      results,
      totalInvested,
      totalExpectedValue,
      totalReturn,
      totalReturnPercentage
    };
  }, [recommendations, investmentAmounts, simulationPeriod]);

  // Helper function to get product category
  const getProductCategory = (productName) => {
    if (!productName) return 'Autre';
    const name = productName.toLowerCase();
    if (name.includes('action') || name.includes('bourse')) return 'Actions';
    if (name.includes('obligation') || name.includes('bond')) return 'Obligations';
    if (name.includes('immobilier') || name.includes('reit')) return 'Immobilier';
    return 'Fonds';
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'Actions': '#3B82F6',
      'Obligations': '#10B981',
      'Immobilier': '#F59E0B',
      'Fonds': '#8B5CF6',
      'Autre': '#6B7280'
    };
    return colors[category] || colors['Autre'];
  };

  // Handle investment amount change
  const handleInvestmentAmountChange = (productId, amount) => {
    setInvestmentAmounts(prev => ({
      ...prev,
      [productId]: parseFloat(amount) || 0
    }));
  };

  // Handle investment decision with context
  const handleInvestmentDecisionWithContext = (decision) => {
    // Add each investment to the context
    decision.investments.forEach(investment => {
      addUserInvestment({
        picture: investment.product.avatar || "",
        nameProduct: investment.product.nom_produit,
        category: getProductCategory(investment.product.nom_produit),
        valueInvested: investment.amount,
        currentValue: investment.amount,
        date: new Date().toISOString(),
        roi_product: investment.product.rendement_annuel_moyen || investment.product.roi_annuel || 0,
        investedAmount: investment.amount,
        dailyChange: 0,
        dailyChangePercent: 0,
        investmentDate: new Date().toISOString()
      });
    });
    
    // Call the original handler
    if (onInvestmentDecision) {
      onInvestmentDecision(decision);
    }
  };

  // Handle product checkbox toggle
  const handleProductCheckboxToggle = (productId, checked) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: checked
    }));
    if (!checked) {
      // Clear amount when unchecking
      setInvestmentAmounts(prev => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
    }
  };

  // Get selected products count
  const getSelectedProductsCount = () => {
    return Object.values(selectedProducts).filter(Boolean).length;
  };

  // Get total selected amount
  const getTotalSelectedAmount = () => {
    return Object.entries(selectedProducts).reduce((total, [productId, isSelected]) => {
      if (isSelected && investmentAmounts[productId]) {
        return total + parseFloat(investmentAmounts[productId]);
      }
      return total;
    }, 0);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    const productsToAdd = [];
    
    Object.entries(selectedProducts).forEach(([productId, isSelected]) => {
      if (isSelected && investmentAmounts[productId]) {
        const product = recommendations.matchedProducts.find(p => p.id === productId);
        if (product) {
          const amount = parseFloat(investmentAmounts[productId]);
          productsToAdd.push({
            product: {
              id: productId,
              name: product.nom_produit,
              image: product.avatar,
              min: product.montant_minimum || 1000,
              risk: product.risque || 5,
              roi: {
                annual: product.rendement_annuel_moyen || product.roi_annuel || 5
              }
            },
            amount: amount
          });
        }
      }
    });

    if (productsToAdd.length > 0) {
      addMultipleToCart(productsToAdd);
      setShowCartSuccessAlert(true);
      
      // Clear selections
      setSelectedProducts({});
      setInvestmentAmounts({});
      
      // Hide alert after 3 seconds
      setTimeout(() => {
        setShowCartSuccessAlert(false);
      }, 3000);
    }
  };

  if (!recommendations) {
    return (
      <div className="text-center py-12">
        <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-8">
          <h3 className="text-blue-400 font-medium mb-4">Aucune Recommandation Disponible</h3>
          <p className="text-gray-400 mb-6">
            Pour recevoir des recommandations personnalisées, complétez d'abord votre profil financier.
          </p>
          <a 
            href="/profiling" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Compléter le Profil
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Recommandations Personnalisées
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Basées sur votre profil et vos objectifs d'investissement
        </p>
        
        {/* Profile Summary */}
        {recommendations.riskProfile && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-xl">
              <div className="text-xs text-blue-600 font-medium mb-1">Profil de Risque</div>
              <div className="text-lg md:text-xl font-bold text-blue-900">{recommendations.riskProfile.riskLevel}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 rounded-xl">
              <div className="text-xs text-purple-600 font-medium mb-1">Produits</div>
              <div className="text-lg md:text-xl font-bold text-purple-900">{recommendations.matchedProducts?.length || 0}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-4 rounded-xl">
              <div className="text-xs text-green-600 font-medium mb-1">Compatibilité</div>
              <div className="text-lg md:text-xl font-bold text-green-900">
                {Math.round(recommendations.matchedProducts?.reduce((sum, p) => sum + (p.overallCompatibility || 0), 0) / (recommendations.matchedProducts?.length || 1))}%
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-4 rounded-xl">
              <div className="text-xs text-amber-600 font-medium mb-1">Source</div>
              <div className="text-lg md:text-xl font-bold text-amber-900">
                {localRecommendations && !userResults ? 'Local' : 'Temps réel'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-gray-100 shadow-sm">
        <div className="flex space-x-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedView('summary')}
            className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
              selectedView === 'summary'
                ? 'bg-gradient-to-r from-[#3CD4AB] to-[#2bb894] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Résumé & Répartition
          </button>
          <button
            onClick={() => setSelectedView('scenarios')}
            className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
              selectedView === 'scenarios'
                ? 'bg-gradient-to-r from-[#3CD4AB] to-[#2bb894] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Scénarios Alternatifs
          </button>
          <button
            onClick={() => setSelectedView('simulation')}
            className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
              selectedView === 'simulation'
                ? 'bg-gradient-to-r from-[#3CD4AB] to-[#2bb894] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Simulation
          </button>
        </div>
      </div>

      {/* Summary View */}
      {selectedView === 'summary' && (
        <div className="space-y-6">
          {/* Portfolio Allocation Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Pie Chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Répartition par Catégorie
              </h3>
              <div className="h-72 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={portfolioAllocation}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {portfolioAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value}%`, name]}
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Score de Compatibilité
              </h3>
              <div className="h-72 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={recommendations.matchedProducts?.slice(0, 8) || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="nom_produit" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={11}
                      stroke="#6b7280"
                    />
                    <YAxis domain={[0, 100]} stroke="#6b7280" fontSize={11} />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Compatibilité']}
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="overallCompatibility" fill="#3CD4AB" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Product List */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Produits Recommandés
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {recommendations.matchedProducts?.map((product, index) => (
                <div key={product.id || index} className="border border-gray-100 rounded-xl p-5 hover:border-[#3CD4AB]/30 hover:shadow-md transition-all duration-200 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3CD4AB]/10 to-[#89559F]/10 flex items-center justify-center overflow-hidden">
                        <img 
                          src={product.avatar} 
                          alt={product.nom_produit} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `<span class="text-[#3CD4AB] font-bold text-lg">${product.nom_produit?.charAt(0) || 'P'}</span>`;
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-[#3CD4AB] transition-colors">{product.nom_produit}</h4>
                        <p className="text-xs text-gray-500">{product.duree_recommandee}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-[#3CD4AB]">
                        {Math.round(product.overallCompatibility || 0)}%
                      </div>
                      <div className="text-xs text-gray-500">Match</div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg">
                      <div className="text-xs text-blue-600 font-medium mb-1">Rendement</div>
                      <div className="text-base font-bold text-blue-900">
                        {product.rendement_annuel_moyen !== undefined ? `${product.rendement_annuel_moyen}%` : 
                         (product.roi_annuel !== undefined ? `${product.roi_annuel}%` : 'N/A')}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg">
                      <div className="text-xs text-green-600 font-medium mb-1">Risque</div>
                      <div className="text-base font-bold text-green-900">
                        {product.risque}/7
                      </div>
                    </div>
                  </div>

                  {/* ROI Projections */}
                  {(product.rendement_annuel_moyen !== undefined || product.roi_annuel !== undefined) && (
                    <div className="mb-4 p-3 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg">
                      <div className="text-xs font-medium text-gray-600 mb-2">Projections ROI (10,000 MAD)</div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center p-2 bg-white rounded-lg">
                          <div className="font-bold text-green-600">
                            {(() => {
                              const annualReturn = product.rendement_annuel_moyen !== undefined ? product.rendement_annuel_moyen : 
                                                (product.roi_annuel !== undefined ? product.roi_annuel : 0);
                              return (annualReturn > 0 && !isNaN(annualReturn)) ? `+${(annualReturn * 3).toFixed(1)}%` : 'N/A';
                            })()}
                          </div>
                          <div className="text-gray-400 text-[10px]">3 ans</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg">
                          <div className="font-bold text-blue-600">
                            {(() => {
                              const annualReturn = product.rendement_annuel_moyen !== undefined ? product.rendement_annuel_moyen : 
                                                (product.roi_annuel !== undefined ? product.roi_annuel : 0);
                              return (annualReturn > 0 && !isNaN(annualReturn)) ? `+${(annualReturn * 5).toFixed(1)}%` : 'N/A';
                            })()}
                          </div>
                          <div className="text-gray-400 text-[10px]">5 ans</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg">
                          <div className="font-bold text-purple-600">
                            {(() => {
                              const annualReturn = product.rendement_annuel_moyen !== undefined ? product.rendement_annuel_moyen : 
                                                (product.roi_annuel !== undefined ? product.roi_annuel : 0);
                              return (annualReturn > 0 && !isNaN(annualReturn)) ? `+${(annualReturn * 10).toFixed(1)}%` : 'N/A';
                            })()}
                          </div>
                          <div className="text-gray-400 text-[10px]">10 ans</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Key Benefits */}
                  <div className="space-y-1.5">
                    <div className="flex items-center text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3CD4AB] mr-2"></div>
                      Compatible avec votre profil de risque
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3CD4AB] mr-2"></div>
                      Durée adaptée à vos objectifs
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3CD4AB] mr-2"></div>
                      Frais compétitifs
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scenarios View */}
      {selectedView === 'scenarios' && (
        <div className="space-y-6">
          {/* Scenario Selection */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Scénarios d'Investissement Alternatifs
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
              {alternativeScenarios.map((scenario, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedScenario(index)}
                  className={`p-4 rounded-xl transition-all duration-200 ${
                    selectedScenario === index
                      ? 'bg-gradient-to-br from-[#3CD4AB]/10 to-[#89559F]/10 border-2 border-[#3CD4AB] shadow-md'
                      : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-900 mb-2">{scenario.name}</div>
                    <div className="text-xs text-gray-600 mb-3">{scenario.description}</div>
                    <div className="grid grid-cols-3 gap-1 text-xs">
                      <div className="bg-blue-100 text-blue-700 px-1.5 py-1 rounded-md font-medium">
                        {scenario.allocation.conservative}%
                      </div>
                      <div className="bg-green-100 text-green-700 px-1.5 py-1 rounded-md font-medium">
                        {scenario.allocation.balanced}%
                      </div>
                      <div className="bg-orange-100 text-orange-700 px-1.5 py-1 rounded-md font-medium">
                        {scenario.allocation.aggressive}%
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Scenario Details */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-6">
              <h4 className="text-base font-semibold text-gray-900 mb-6">
                {alternativeScenarios[selectedScenario]?.name}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Allocation Chart */}
                <div>
                  <h5 className="font-medium text-gray-700 text-sm mb-4">Répartition du Portefeuille</h5>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Conservateur</span>
                        <span className="font-semibold text-gray-900">{alternativeScenarios[selectedScenario]?.allocation.conservative}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500" 
                          style={{ width: `${alternativeScenarios[selectedScenario]?.allocation.conservative}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Équilibré</span>
                        <span className="font-semibold text-gray-900">{alternativeScenarios[selectedScenario]?.allocation.balanced}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all duration-500" 
                          style={{ width: `${alternativeScenarios[selectedScenario]?.allocation.balanced}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Agressif</span>
                        <span className="font-semibold text-gray-900">{alternativeScenarios[selectedScenario]?.allocation.aggressive}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-orange-600 h-2.5 rounded-full transition-all duration-500" 
                          style={{ width: `${alternativeScenarios[selectedScenario]?.allocation.aggressive}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products in Scenario */}
                <div>
                  <h5 className="font-medium text-gray-700 text-sm mb-4">Produits Recommandés</h5>
                  <div className="space-y-2.5">
                    {alternativeScenarios[selectedScenario]?.products.map((product, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-[#3CD4AB]/30 transition-all">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3CD4AB]/10 to-[#89559F]/10 flex items-center justify-center overflow-hidden">
                            <img src={product.avatar} alt={product.nom_produit} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{product.nom_produit}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-[#3CD4AB]">{product.allocation}%</div>
                          <div className="text-xs text-gray-500">Allocation</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simulation View */}
      {selectedView === 'simulation' && (
        <div className="space-y-8">
          {/* Investment Simulation */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <IoCalculator className="mr-2 text-green-600" />
              Simulation d'Investissement
            </h3>

            {/* Simulation Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Période de Simulation
                </label>
                <select
                  value={simulationPeriod}
                  onChange={(e) => setSimulationPeriod(parseInt(e.target.value) || 1)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={1}>1 an</option>
                  <option value={3}>3 ans</option>
                  <option value={5}>5 ans</option>
                  <option value={10}>10 ans</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scénario Sélectionné
                </label>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="font-medium text-blue-800">
                    {alternativeScenarios[selectedScenario]?.name}
                  </div>
                  <div className="text-sm text-blue-600">
                    {alternativeScenarios[selectedScenario]?.description}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Investi
                </label>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-2xl font-bold text-green-800">
                    {simulationResults?.totalInvested?.toLocaleString() || 0} MAD
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Amounts Input */}
            <div className="mb-8">
              <h4 className="text-lg font-medium text-gray-800 mb-4">Montants d'Investissement par Produit</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.matchedProducts?.map((product, index) => (
                  <div key={product.id || index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <img src={product.avatar} alt={product.nom_produit} className="w-10 h-10 rounded object-cover" />
                        <div>
                          <div className="font-medium text-gray-800">{product.nom_produit}</div>
                          <div className="text-sm text-gray-500">Match: {Math.round(product.overallCompatibility || 0)}%</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">ROI annuel</div>
                        <div className="text-lg font-bold text-green-600">
                          {product.rendement_annuel_moyen !== undefined ? `${product.rendement_annuel_moyen}%` : 
                           (product.roi_annuel !== undefined ? `${product.roi_annuel}%` : 'N/A')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        value={investmentAmounts[product.id] || 0}
                        onChange={(e) => handleInvestmentAmountChange(product.id, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Montant en MAD"
                        min="0"
                        step="100"
                      />
                      <span className="text-gray-500">MAD</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulation Results */}
            {simulationResults && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Résultats de la Simulation</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{simulationResults.totalInvested.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Investi (MAD)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{simulationResults.totalExpectedValue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Valeur Attendue (MAD)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">+{simulationResults.totalReturn.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Gain Total (MAD)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">+{simulationResults.totalReturnPercentage.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Rendement Total</div>
                  </div>
                </div>

                {/* Detailed Results Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white">
                      <tr>
                        <th className="text-left p-3 font-medium text-gray-700">Produit</th>
                        <th className="text-center p-3 font-medium text-gray-700">Montant</th>
                        <th className="text-center p-3 font-medium text-gray-700">Valeur Attendue</th>
                        <th className="text-center p-3 font-medium text-gray-700">Gain</th>
                        <th className="text-center p-3 font-medium text-gray-700">ROI {simulationPeriod} ans</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {simulationResults.results.map((result, index) => (
                        <tr key={index} className="hover:bg-white">
                          <td className="p-3">
                            <div className="flex items-center space-x-3">
                              <img src={result.product.avatar} alt={result.product.nom_produit} className="w-8 h-8 rounded object-cover" />
                              <div>
                                <div className="font-medium text-gray-800">{result.product.nom_produit}</div>
                                <div className="text-xs text-gray-500">Risque: {result.risk}/7</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-center">{result.amount.toLocaleString()} MAD</td>
                          <td className="p-3 text-center text-green-600 font-medium">{result.expectedValue.toLocaleString()} MAD</td>
                          <td className="p-3 text-center text-blue-600 font-medium">+{(result.expectedValue - result.amount).toLocaleString()} MAD</td>
                          <td className="p-3 text-center">
                            <span className={`font-medium ${ROICalculator.getROIColor(result.roi5Years)}`}>
                              +{result.roi5Years.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    onClick={() => setSelectedView('scenarios')}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center space-x-2"
                  >
                    <IoArrowBack className="w-5 h-5" />
                    <span>Modifier le Scénario</span>
                  </button>
                  <button
                    onClick={() => {
                      if (!simulationResults) return;
                      const decision = {
                        scenario: alternativeScenarios[selectedScenario],
                        investments: simulationResults.results,
                        totalAmount: simulationResults.totalInvested,
                        expectedReturn: simulationResults.totalReturnPercentage
                      };
                      handleInvestmentDecisionWithContext(decision);
                      setShowConfirmation(true);
                    }}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <span>Confirmer l'Investissement</span>
                    <IoArrowForward className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Investment Confirmation Modal */}
      {showConfirmation && simulationResults && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IoCheckmarkCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Investissement Confirmé !</h3>
              <p className="text-gray-600">Votre décision d'investissement a été enregistrée avec succès.</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="font-medium text-gray-800 mb-4">Résumé de l'Investissement</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Scénario:</span>
                  <div className="font-medium text-gray-800">{alternativeScenarios[selectedScenario]?.name}</div>
                </div>
                <div>
                  <span className="text-gray-600">Montant Total:</span>
                  <div className="font-medium text-gray-800">{simulationResults.totalInvested.toLocaleString()} MAD</div>
                </div>
                <div>
                  <span className="text-gray-600">Rendement Attendu:</span>
                  <div className="font-medium text-green-600">+{simulationResults.totalReturnPercentage.toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-gray-600">Période:</span>
                  <div className="font-medium text-gray-800">{simulationPeriod} an(s)</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setSelectedView('summary');
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Voir le Résumé
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrivenInvestmentRecommendations; 
