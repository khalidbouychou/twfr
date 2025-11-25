import React, { useState } from 'react';
import { useSharedData } from '../../Context/useSharedData.js';
import { useCart } from '../../Context/CartContext';

// Mock product data with avatars and ROI information
const getProductDetails = (productName) => {
  const productMap = {
    'Compte sur Carnet': {
      title: 'Compte sur Carnet',
      avatar: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=400&h=400&fit=crop&crop=center',
      roi: 2.5,
      minInvestment: 100
    },
    'OPCVM Monétaires': {
      title: 'OPCVM Monétaires',
      avatar: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=400&fit=crop&crop=center',
      roi: 3.8,
      minInvestment: 1000
    },
    'Dépôt à Terme': {
      title: 'Dépôt à Terme',
      avatar: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop&crop=center',
      roi: 3.2,
      minInvestment: 1000
    },
    'Gestion sous Mandat': {
      title: 'Gestion sous Mandat',
      avatar: 'https://images.unsplash.com/photo-1642115958395-3f05ad94030c?w=400&h=400&fit=crop&crop=center',
      roi: 9.2,
      minInvestment: 10000
    },
    'OPCVM Actions': {
      title: 'OPCVM Actions',
      avatar: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop&crop=center',
      roi: 8.5,
      minInvestment: 500
    },
    'Produits Structurés': {
      title: 'Produits Structurés',
      avatar: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=400&fit=crop&crop=center',
      roi: 5.2,
      minInvestment: 3000
    }
  };
  
  return productMap[productName] || {
    title: productName,
    avatar: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=400&fit=crop&crop=center',
    roi: 5.0,
    minInvestment: 1000
  };
};


const riskProfiles = [
  { value: 'conservateur', label: 'Conservateur (4% annuel)', rate: 0.04 },
  { value: 'modere', label: 'Modéré (7% annuel)', rate: 0.07 },
  { value: 'dynamique', label: 'Dynamique (10% annuel)', rate: 0.10 },
  { value: 'agressif', label: 'Agressif (15% annuel)', rate: 0.15 },
];

const productRecommendations = {
  conservateur: ['Compte sur Carnet', 'OPCVM Monétaires', 'Dépôt à Terme'],
  modere: ['OPCVM Monétaires', 'Gestion sous Mandat', 'OPCVM Actions'],
  dynamique: ['OPCVM Actions', 'Gestion sous Mandat', 'Produits Structurés'],
  agressif: ['Produits Structurés', 'OPCVM Actions', 'Gestion sous Mandat'],
};

const SimulationsPage = ({ 
  userBalance, 
  simulationDateFilter, 
  setSimulationDateFilter, 
  getFilteredSimulations,
  recentSimulations = []
}) => {
  const {
    profileType,
    accountBalance, // Fallback balance from context
    totalInvested,
    globalROI,
    actions,
    validators
  } = useSharedData();

  // Cart context
  const { addMultipleToCart } = useCart();

  // Use the prop balance if available, otherwise fall back to context balance
  const currentBalance = userBalance !== undefined ? userBalance : accountBalance;

  const [form, setForm] = useState({
    initialCapital: '',
    duration: '12',
    riskProfile: profileType || 'modere',
  });
  const [result, setResult] = useState(null);
  
  // Investment flow states
  const [showInvestmentPopup, setShowInvestmentPopup] = useState(false);
  const [selectedProductsForSelection, setSelectedProductsForSelection] = useState({}); // Checkbox selections
  const [investmentAmounts, setInvestmentAmounts] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  // Date filter loading state
  const [isFilteringSimulations, setIsFilteringSimulations] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  
  // Handle date filter change with loading state
  const handleDateFilterChange = async (newFilter) => {
    setIsFilteringSimulations(true);
    setSimulationDateFilter(newFilter);
    
    // Simulate a brief loading period for better UX
    setTimeout(() => {
      setIsFilteringSimulations(false);
    }, 300);
  };

  // Investment flow functions
  const openInvestmentPopup = () => {
    setShowInvestmentPopup(true);
    setSelectedProductsForSelection({});
    setInvestmentAmounts({});
  };

  const handleProductCheckbox = (productName, checked) => {
    setSelectedProductsForSelection(prev => ({
      ...prev,
      [productName]: checked
    }));
    
    // Clear amount if unchecked
    if (!checked) {
      setInvestmentAmounts(prev => {
        const newAmounts = { ...prev };
        delete newAmounts[productName];
        return newAmounts;
      });
    }
  };

  const handleAmountChange = (productName, amount) => {
    setInvestmentAmounts(prev => ({
      ...prev,
      [productName]: amount
    }));
  };

  const getTotalSelectedAmount = () => {
    return Object.entries(investmentAmounts).reduce((total, [productName, amount]) => {
      if (selectedProductsForSelection[productName] && amount) {
        return total + parseFloat(amount);
      }
      return total;
    }, 0);
  };

  const getSelectedProductsCount = () => {
    return Object.values(selectedProductsForSelection).filter(Boolean).length;
  };

  const canAddToCart = () => {
    const hasSelection = getSelectedProductsCount() > 0;
    const allSelectedHaveAmounts = Object.entries(selectedProductsForSelection).every(([productName, isSelected]) => {
      if (isSelected) {
        const amount = investmentAmounts[productName];
        const product = getProductDetails(productName);
        return amount && parseFloat(amount) >= product.minInvestment;
      }
      return true;
    });
    const totalAmount = getTotalSelectedAmount();
    const initialCapital = parseFloat(form.initialCapital) || 0;
    
    return hasSelection && allSelectedHaveAmounts && totalAmount <= initialCapital && totalAmount > 0;
  };

  const handleAddToCart = () => {
    // Prepare array of products to add
    const productsToAdd = [];
    
    Object.entries(selectedProductsForSelection).forEach(([productName, isSelected]) => {
      if (isSelected && investmentAmounts[productName]) {
        const productDetails = getProductDetails(productName);
        const amount = parseFloat(investmentAmounts[productName]);
        
        console.log('Preparing to add to cart:', productName, 'Amount:', amount);
        
        productsToAdd.push({
          product: {
            id: productName,
            name: productDetails.title,
            image: productDetails.avatar,
            min: productDetails.minInvestment,
            risk: 5, // Default risk level
            roi: {
              annual: productDetails.roi
            }
          },
          amount: amount
        });
      }
    });
    
    console.log('Total products to add:', productsToAdd.length);
    
    // Add all products to cart in a single operation
    if (productsToAdd.length > 0) {
      addMultipleToCart(productsToAdd);
      
      // Show success message
      setAlertMessage(`${productsToAdd.length} produit(s) ajouté(s) au panier avec succès!`);
      setShowAlert(true);
      
      // Close popup after short delay
      setTimeout(() => {
        setShowAlert(false);
        setShowInvestmentPopup(false);
        setSelectedProductsForSelection({});
        setInvestmentAmounts({});
      }, 2000);
    }
  };

  const handleSimulate = () => {
    // Calculate 3 scenarios: pessimistic, expected, optimistic
    const capital = parseFloat(form.initialCapital) || 0;
    const years = parseInt(form.duration, 10) / 12;
    const profile = riskProfiles.find((r) => r.value === form.riskProfile) || riskProfiles[1];
    const rate = profile.rate;
    
    // Enhanced calculation with user's current performance data
    const userROIBonus = globalROI > 0 ? 0.01 : 0; // 1% bonus if user has positive ROI
    const adjustedRate = rate + userROIBonus;
    
    // Pessimistic: 60% of rate, Expected: adjusted rate, Optimistic: 140% of rate
    const pessimistic = Math.round(capital * Math.pow(1 + adjustedRate * 0.6, years));
    const expected = Math.round(capital * Math.pow(1 + adjustedRate, years));
    const optimistic = Math.round(capital * Math.pow(1 + adjustedRate * 1.4, years));
    
    const simulationResult = {
      pessimistic,
      expected,
      optimistic,
      products: productRecommendations[form.riskProfile] || [],
      profileLabel: profile.label,
      userROIBonus,
      canAfford: currentBalance >= capital,
      basedOnCurrentPerformance: globalROI > 0,
      projectedAnnualReturn: (adjustedRate * 100).toFixed(2)
    };
    
    setResult(simulationResult);
    
    // Save simulation to shared data
    actions.addSimulation({
      initialCapital: capital,
      duration: form.duration,
      riskProfile: form.riskProfile,
      result: simulationResult
    });
  };

  return (
    <div className="flex flex-col lg:flex-row w-full gap-6 lg:gap-8 justify-center mt-6 lg:mt-8 px-4 lg:px-0 h-full overflow-y-auto">
      <div className="bg-white/5 border border-white/20 rounded-2xl p-6 lg:p-8 w-full lg:max-w-2xl backdrop-blur-sm">
        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6 lg:mb-8">Simulation d'investissement</h3>
        
        {/* User Context Info */}
        {validators.hasCompleteProfile() && (
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-xl p-4 lg:p-5 mb-6 lg:mb-8">
            <h4 className="text-blue-300 font-semibold mb-3 text-base lg:text-lg">Basé sur votre profil</h4>
            <div className="grid grid-cols-2 gap-3 text-sm lg:text-base">
              <div className="bg-white/10 rounded-lg p-3 border border-white/10">
                <div className="text-white/60 text-xs mb-1">Solde disponible</div>
                <div className="text-white font-semibold">{currentBalance.toLocaleString()} MAD</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 border border-white/10">
                <div className="text-white/60 text-xs mb-1">Total investi</div>
                <div className="text-white font-semibold">{totalInvested.toLocaleString()} MAD</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 border border-white/10">
                <div className="text-white/60 text-xs mb-1">Performance actuelle</div>
                <div className="text-white font-semibold">{globalROI.toFixed(2)}%</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 border border-white/10">
                <div className="text-white/60 text-xs mb-1">Profil de risque</div>
                <div className="text-white font-semibold capitalize">{profileType || 'Non défini'}</div>
              </div>
            </div>
          </div>
        )}
        <div className="space-y-5">
          <div>
            <label className="block text-white text-sm font-semibold mb-2">Capital initial (MAD)</label>
            <input
              type="number"
              value={form.initialCapital}
              onChange={(e) => handleChange('initialCapital', e.target.value)}
              className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3.5 text-white placeholder-white/50 focus:border-[#3CD4AB] focus:ring-2 focus:ring-[#3CD4AB]/30 focus:outline-none transition-all"
              placeholder="10000"
              min={0}
            />
          </div>
          <div>
            <label className="block text-white text-sm font-semibold mb-2">Durée</label>
            <select
              value={form.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
              className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3.5 text-white focus:border-[#3CD4AB] focus:ring-2 focus:ring-[#3CD4AB]/30 focus:outline-none transition-all [&>option]:text-black [&>option]:bg-white"
            >
              <option value="6" className="text-black bg-white">6 mois</option>
              <option value="12" className="text-black bg-white">1 an</option>
              <option value="24" className="text-black bg-white">2 ans</option>
              <option value="60" className="text-black bg-white">5 ans</option>
            </select>
          </div>
          <div>
            <label className="block text-white text-sm font-semibold mb-2">Profil de risque</label>
            <select
              value={form.riskProfile}
              onChange={(e) => handleChange('riskProfile', e.target.value)}
              className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3.5 text-white focus:border-[#3CD4AB] focus:ring-2 focus:ring-[#3CD4AB]/30 focus:outline-none transition-all [&>option]:text-black [&>option]:bg-white"
            >
              {riskProfiles.map((r) => (
                <option key={r.value} value={r.value} className="text-black bg-white">{r.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={handleSimulate}
              disabled={!form.initialCapital || parseFloat(form.initialCapital) <= 0}
              className="flex-1 bg-gradient-to-r from-[#3CD4AB] to-emerald-500 text-white font-semibold py-3.5 px-6 rounded-xl hover:from-[#2bb894] hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md text-base"
            >
              Lancer la simulation
            </button>
            
            {result && currentBalance >= parseFloat(form.initialCapital) && (
              <button
                onClick={openInvestmentPopup}
                className="px-6 py-3.5 bg-gradient-to-r from-purple-500 to-[#89559F] hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md text-base"
                title="Investir dans les produits recommandés"
              >
                Investir maintenant
              </button>
            )}
          </div>
          
          {currentBalance < parseFloat(form.initialCapital) && form.initialCapital && (
            <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-3 mt-4">
              <p className="text-red-300 text-sm">
                Solde insuffisant. Solde disponible: {currentBalance.toLocaleString()} MAD
              </p>
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="bg-white/5 border border-white/20 rounded-2xl p-6 lg:p-8 w-full lg:w-auto backdrop-blur-sm">
          {/* Header */}
          <div className="mb-6">
            <h4 className="text-xl lg:text-2xl font-bold text-white mb-2">Résultats & recommandations</h4>
            <div className="flex items-center gap-3 text-sm text-white/60">
              <span>{result.profileLabel}</span>
              <span>•</span>
              <span>Rendement: {result.projectedAnnualReturn}%</span>
              {result.basedOnCurrentPerformance && (
                <>
                  <span>•</span>
                  <span className="text-green-400">Optimisé</span>
                </>
              )}
            </div>
          </div>

          {/* Performance Bonus Alert */}
          {result.userROIBonus > 0 && (
            <div className="bg-green-500/10 border border-green-400/20 rounded-xl p-3 mb-6">
              <p className="text-green-300 text-sm">
                +1% bonus basé sur vos performances actuelles ({globalROI.toFixed(2)}%)
              </p>
            </div>
          )}
          
          {/* Scenario Cards - Simplified */}
          <div className="space-y-3 mb-6">
            {/* Expected Scenario - Main highlight */}
            <div className="bg-[#3CD4AB]/10 border-l-4 border-[#3CD4AB] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white/60 text-xs mb-1">Scénario attendu</div>
                  <div className="text-2xl font-bold text-[#3CD4AB]">{result.expected.toLocaleString()} MAD</div>
                </div>
                <div className="text-right">
                  <div className="text-[#3CD4AB] text-xl font-bold">
                    +{((result.expected - parseFloat(form.initialCapital)) / parseFloat(form.initialCapital) * 100).toFixed(1)}%
                  </div>
                  <div className="text-white/50 text-xs">Gain projeté</div>
                </div>
              </div>
            </div>

            {/* Pessimistic and Optimistic in a row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-red-500/10 border border-red-400/20 rounded-lg p-3">
                <div className="text-red-300/70 text-xs mb-1">Pessimiste</div>
                <div className="text-lg font-bold text-red-400">{result.pessimistic.toLocaleString()}</div>
                <div className="text-red-300/70 text-xs mt-1">
                  +{((result.pessimistic - parseFloat(form.initialCapital)) / parseFloat(form.initialCapital) * 100).toFixed(1)}%
                </div>
              </div>
              <div className="bg-green-500/10 border border-green-400/20 rounded-lg p-3">
                <div className="text-green-300/70 text-xs mb-1">Optimiste</div>
                <div className="text-lg font-bold text-green-400">{result.optimistic.toLocaleString()}</div>
                <div className="text-green-300/70 text-xs mt-1">
                  +{((result.optimistic - parseFloat(form.initialCapital)) / parseFloat(form.initialCapital) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
          
          {/* Insufficient Balance Warning */}
          {!result.canAfford && (
            <div className="bg-orange-500/10 border border-orange-400/20 rounded-lg p-3 mb-6">
              <p className="text-orange-300 text-sm">
                Montant supérieur à votre solde actuel ({currentBalance.toLocaleString()} MAD)
              </p>
            </div>
          )}
          
          {/* Recommended Products - Simplified List */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-white/80 text-sm font-medium mb-3">Produits recommandés</div>
            <div className="space-y-2">
              {result.products.map((product, idx) => (
                <div key={idx} className="flex items-center gap-2 text-white/70 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3CD4AB]"></div>
                  <span>{product}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Investment Popup */}
      {showInvestmentPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-white/10">
            
            {/* Header - Fixed */}
            <div className="bg-gradient-to-r from-[#3CD4AB]/10 to-emerald-500/10 border-b border-white/10 p-6 lg:p-8 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">Sélectionnez vos investissements</h3>
                  <p className="text-white/60 text-sm">Choisissez les produits et définissez les montants</p>
                </div>
                <button 
                  onClick={() => setShowInvestmentPopup(false)}
                  className="text-white/60 hover:text-white hover:bg-white/10 w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Capital Summary Bar */}
              <div className="grid grid-cols-3 gap-3 lg:gap-4">
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <div className="text-white/50 text-xs mb-1">Capital initial</div>
                  <div className="text-white font-bold text-lg">{parseFloat(form.initialCapital).toLocaleString()}</div>
                  <div className="text-white/40 text-xs">MAD</div>
                </div>
                <div className={`border rounded-lg p-3 ${getTotalSelectedAmount() > parseFloat(form.initialCapital) ? 'bg-red-500/10 border-red-400/30' : 'bg-[#3CD4AB]/10 border-[#3CD4AB]/30'}`}>
                  <div className="text-white/50 text-xs mb-1">Total sélectionné</div>
                  <div className={`font-bold text-lg ${getTotalSelectedAmount() > parseFloat(form.initialCapital) ? 'text-red-400' : 'text-[#3CD4AB]'}`}>
                    {getTotalSelectedAmount().toLocaleString()}
                  </div>
                  <div className="text-white/40 text-xs">MAD</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <div className="text-white/50 text-xs mb-1">Restant</div>
                  <div className={`font-bold text-lg ${(parseFloat(form.initialCapital) - getTotalSelectedAmount()) < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {(parseFloat(form.initialCapital) - getTotalSelectedAmount()).toLocaleString()}
                  </div>
                  <div className="text-white/40 text-xs">MAD</div>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 p-6 lg:p-8">
              {/* Warning Message */}
              {getTotalSelectedAmount() > parseFloat(form.initialCapital) && (
                <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-3 mb-6">
                  <p className="text-red-300 text-sm">
                    Le montant total dépasse votre capital. Ajustez les montants avant de continuer.
                  </p>
                </div>
              )}

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result?.products.map((productName, index) => {
                  const product = getProductDetails(productName);
                  const isSelected = selectedProductsForSelection[productName];
                  const currentAmount = investmentAmounts[productName] || '';
                  
                  return (
                    <div 
                      key={index} 
                      onClick={() => !isSelected && handleProductCheckbox(productName, true)}
                      className={`relative border rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? 'border-[#3CD4AB] bg-[#3CD4AB]/5 shadow-lg shadow-[#3CD4AB]/10' 
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      {/* Selection Indicator */}
                      <div className="absolute top-4 right-4">
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductCheckbox(productName, !isSelected);
                          }}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected 
                              ? 'border-[#3CD4AB] bg-[#3CD4AB]' 
                              : 'border-white/30 bg-transparent'
                          }`}
                        >
                          {isSelected && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex items-start gap-3 mb-4 pr-8">
                        <img 
                          src={product.avatar} 
                          alt={product.title}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white/10"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-base mb-1">{product.title}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400 text-sm font-medium">ROI {product.roi}%</span>
                            <span className="text-white/30">•</span>
                            <span className="text-white/50 text-xs">Min. {product.minInvestment.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Amount Input */}
                      <div className={`transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <label className="block text-white/70 text-xs font-medium mb-2">
                          Montant à investir (MAD)
                        </label>
                        <input
                          type="number"
                          min={product.minInvestment}
                          value={currentAmount}
                          placeholder={product.minInvestment.toString()}
                          disabled={!isSelected}
                          className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#3CD4AB] focus:ring-2 focus:ring-[#3CD4AB]/30 transition-all disabled:opacity-50"
                          onChange={(e) => handleAmountChange(productName, e.target.value)}
                        />
                        {isSelected && currentAmount && parseFloat(currentAmount) < product.minInvestment && (
                          <p className="text-red-400 text-xs mt-1.5">
                            Minimum requis: {product.minInvestment.toLocaleString()} MAD
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-t border-white/10 p-6 lg:p-8 flex-shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-white/80 text-sm">
                  <span className="text-[#3CD4AB] font-bold text-lg">{getSelectedProductsCount()}</span>
                  <span className="text-white/60"> / {result?.products.length} produits sélectionnés</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowInvestmentPopup(false)}
                    className="px-6 py-3 bg-white/5 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={!canAddToCart()}
                    className="px-6 py-3 bg-gradient-to-r from-[#3CD4AB] to-emerald-500 hover:from-[#2bb894] hover:to-emerald-600 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-[#3CD4AB]/20"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert/Toast */}
      {showAlert && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 max-w-md mx-2 animate-fade-in border border-green-400">
          <div className="flex items-start justify-between gap-3">
            <span className="text-sm font-medium">{alertMessage}</span>
            <button 
              onClick={() => setShowAlert(false)}
              className="ml-2 text-white hover:bg-white/20 w-7 h-7 rounded-full transition-all flex items-center justify-center text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Recent Simulations Section */}
      {recentSimulations && recentSimulations.length > 0 && (
        <div className="bg-white/5 border border-white/20 rounded-2xl p-6 lg:p-8 w-full mt-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h3 className="text-xl lg:text-2xl font-bold text-white">Historique des simulations</h3>
            
            {/* Date Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => handleDateFilterChange("all")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  simulationDateFilter === "all"
                    ? "bg-gradient-to-r from-[#3CD4AB] to-emerald-500 text-white shadow-sm"
                    : "bg-white/10 text-white/70 hover:bg-white/20 border border-white/20"
                }`}
              >
                Tout
              </button>
              <button
                onClick={() => handleDateFilterChange("today")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  simulationDateFilter === "today"
                    ? "bg-gradient-to-r from-[#3CD4AB] to-emerald-500 text-white shadow-sm"
                    : "bg-white/10 text-white/70 hover:bg-white/20 border border-white/20"
                }`}
              >
                Aujourd'hui
              </button>
              <button
                onClick={() => handleDateFilterChange("week")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  simulationDateFilter === "week"
                    ? "bg-gradient-to-r from-[#3CD4AB] to-emerald-500 text-white shadow-sm"
                    : "bg-white/10 text-white/70 hover:bg-white/20 border border-white/20"
                }`}
              >
                7 jours
              </button>
              <button
                onClick={() => handleDateFilterChange("month")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  simulationDateFilter === "month"
                    ? "bg-gradient-to-r from-[#3CD4AB] to-emerald-500 text-white shadow-sm"
                    : "bg-white/10 text-white/70 hover:bg-white/20 border border-white/20"
                }`}
              >
                30 jours
              </button>
            </div>
          </div>
          
          {/* Loading State */}
          {isFilteringSimulations ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-[#3CD4AB]"></div>
                <p className="text-white/60 text-sm font-medium">Chargement des simulations...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Filtered Simulations List */}
              {getFilteredSimulations && getFilteredSimulations().length > 0 ? (
                <div className="space-y-4">
                  {getFilteredSimulations().map((sim, index) => (
                    <div 
                      key={index} 
                      className="bg-gradient-to-r from-white/5 to-blue-500/10 border border-white/20 rounded-xl p-5 hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-white font-bold text-lg">
                              {sim.initialCapital?.toLocaleString()} MAD
                            </span>
                            <span className="text-white/30">•</span>
                            <span className="text-white/70 text-sm font-medium">
                              {sim.duration} mois
                            </span>
                            <span className="text-white/30">•</span>
                            <span className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-blue-300 px-3 py-1 rounded-lg text-xs font-medium capitalize border border-blue-400/30">
                              {sim.riskProfile}
                            </span>
                          </div>
                          <div className="text-white/50 text-sm">
                            {new Date(sim.createdAt).toLocaleString('fr-FR')}
                          </div>
                        </div>
                        <div className="flex gap-6">
                          <div className="text-center">
                            <div className="text-white/60 text-xs mb-1 font-medium">Attendu</div>
                            <div className="text-[#3CD4AB] font-bold text-base">
                              {sim.result?.expected?.toLocaleString()} MAD
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-white/60 text-xs mb-1 font-medium">Optimiste</div>
                            <div className="text-green-400 font-bold text-base">
                              {sim.result?.optimistic?.toLocaleString()} MAD
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* No Data Message */
                <div className="bg-white/5 border border-white/20 rounded-xl p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center border border-white/20">
                      <svg 
                        className="w-10 h-10 text-white/40" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg mb-2">
                        Aucune simulation trouvée
                      </p>
                      <p className="text-white/60">
                        {simulationDateFilter === "today" && "Aucune simulation créée aujourd'hui"}
                        {simulationDateFilter === "week" && "Aucune simulation créée cette semaine"}
                        {simulationDateFilter === "month" && "Aucune simulation créée ce mois-ci"}
                        {simulationDateFilter === "all" && "Créez votre première simulation ci-dessus"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SimulationsPage;