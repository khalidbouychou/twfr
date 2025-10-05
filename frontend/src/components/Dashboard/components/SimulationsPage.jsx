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
    <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-8 justify-center mt-4 lg:mt-8 px-4 lg:px-0 h-full overflow-y-auto" >
      <div className="bg-white/5 border border-white/20 rounded-xl p-4 lg:p-6 w-full lg:max-w-2xl">
        <h3 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6">Simulation d'investissement</h3>
        
        {/* User Context Info */}
        {validators.hasCompleteProfile() && (
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 lg:p-4 mb-4 lg:mb-6">
            <h4 className="text-blue-400 font-medium mb-2 text-sm lg:text-base">📊 Basé sur votre profil</h4>
            <div className="text-xs lg:text-sm text-white/80 space-y-1">
              <p>• Solde disponible: {currentBalance.toLocaleString()} MAD</p>
              <p>• Total investi: {totalInvested.toLocaleString()} MAD</p>
              <p>• Performance actuelle: {globalROI.toFixed(2)}%</p>
              <p>• Profil de risque: {profileType || 'Non défini'}</p>
            </div>
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Capital initial (MAD)</label>
            <input
              type="number"
              value={form.initialCapital}
              onChange={(e) => handleChange('initialCapital', e.target.value)}
              className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/60 focus:outline-none transition-colors"
              placeholder="10000"
              min={0}
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Durée</label>
            <select
              value={form.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
              className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white focus:border-white/60 focus:outline-none transition-colors [&>option]:text-black [&>option]:bg-white"
            >
              <option value="6" className="text-black bg-white">6 mois</option>
              <option value="12" className="text-black bg-white">1 an</option>
              <option value="24" className="text-black bg-white">2 ans</option>
              <option value="60" className="text-black bg-white">5 ans</option>
            </select>
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Profil de risque</label>
            <select
              value={form.riskProfile}
              onChange={(e) => handleChange('riskProfile', e.target.value)}
              className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white focus:border-white/60 focus:outline-none transition-colors [&>option]:text-black [&>option]:bg-white"
            >
              {riskProfiles.map((r) => (
                <option key={r.value} value={r.value} className="text-black bg-white">{r.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              onClick={handleSimulate}
              disabled={!form.initialCapital || parseFloat(form.initialCapital) <= 0}
              className="flex-1 bg-[#3CD4AB] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#89559F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
            >
              Lancer la simulation
            </button>
            
            {result && currentBalance >= parseFloat(form.initialCapital) && (
              <button
                onClick={openInvestmentPopup}
                className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm lg:text-base"
                title="Investir dans les produits recommandés"
              >
                💰 Investir
              </button>
            )}
          </div>
          
          {currentBalance < parseFloat(form.initialCapital) && form.initialCapital && (
            <p className="text-red-400 text-sm mt-2">
              ⚠️ Solde insuffisant. Solde disponible: {currentBalance.toLocaleString()} MAD
            </p>
          )}
        </div>
      </div>

      {result && (
        <div className="bg-white/10 border border-white/20 rounded-xl p-4 lg:p-6 w-full lg:w-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h4 className="text-base lg:text-lg font-semibold text-white">Résultats & recommandations</h4>
            {result.basedOnCurrentPerformance && (
              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                ✨ Optimisé par vos performances
              </span>
            )}
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm text-white/80">
              <p>Profil: <span className="text-white">{result.profileLabel}</span></p>
              <p>Rendement projeté: <span className="text-white">{result.projectedAnnualReturn}%</span></p>
              {result.userROIBonus > 0 && (
                <p className="col-span-2 text-green-400">
                  +1% bonus basé sur vos performances actuelles ({globalROI.toFixed(2)}%)
                </p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 mb-4">
            <div className="bg-[#191930] rounded-lg p-4 text-center border border-red-500/30">
              <div className="text-red-300 text-xs mb-1">Scénario pessimiste</div>
              <div className="text-2xl font-bold text-red-400">{result.pessimistic.toLocaleString()} MAD</div>
              <div className="text-red-300/70 text-xs mt-1">
                +{((result.pessimistic - parseFloat(form.initialCapital)) / parseFloat(form.initialCapital) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-[#191930] rounded-lg p-4 text-center border border-[#3CD4AB]/30">
              <div className="text-[#3CD4AB]/70 text-xs mb-1">Scénario attendu</div>
              <div className="text-2xl font-bold text-[#3CD4AB]">{result.expected.toLocaleString()} MAD</div>
              <div className="text-[#3CD4AB]/70 text-xs mt-1">
                +{((result.expected - parseFloat(form.initialCapital)) / parseFloat(form.initialCapital) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-[#191930] rounded-lg p-4 text-center border border-green-500/30">
              <div className="text-green-300 text-xs mb-1">Scénario optimiste</div>
              <div className="text-2xl font-bold text-green-400">{result.optimistic.toLocaleString()} MAD</div>
              <div className="text-green-300/70 text-xs mt-1">
                +{((result.optimistic - parseFloat(form.initialCapital)) / parseFloat(form.initialCapital) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
          
          {!result.canAfford && (
            <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4 mb-4">
              <p className="text-orange-400 text-sm">
                ⚠️ Montant supérieur à votre solde actuel ({currentBalance.toLocaleString()} MAD)
              </p>
            </div>
          )}
          
          <div className="mt-4">
            <div className="text-white/80 font-medium mb-2">Produits recommandés pour votre profil ({result.profileLabel}) :</div>
            <div className="flex flex-wrap gap-2">
              {result.products.map((product, idx) => (
                <span key={idx} className="bg-[#3CD4AB]/20 text-[#3CD4AB] px-3 py-1 rounded-full text-sm">
                  {product}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Investment Popup */}
      {showInvestmentPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 lg:p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] lg:max-h-[90vh] overflow-y-auto mx-2 lg:mx-0">
            
            {/* Products Selection Step */}
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h3 className="text-lg lg:text-2xl font-bold text-gray-800">Sélectionnez vos investissements</h3>
                <button 
                  onClick={() => setShowInvestmentPopup(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              {/* Capital and Total Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3 lg:p-4 mb-4 lg:mb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div>
                    <span className="text-sm lg:text-base text-gray-700">Capital initial: </span>
                    <span className="font-bold text-[#3CD4AB] text-base lg:text-lg">{parseFloat(form.initialCapital).toLocaleString()} MAD</span>
                  </div>
                  <div>
                    <span className="text-sm lg:text-base text-gray-700">Total sélectionné: </span>
                    <span className={`font-bold text-base lg:text-lg ${getTotalSelectedAmount() > parseFloat(form.initialCapital) ? 'text-red-500' : 'text-gray-800'}`}>
                      {getTotalSelectedAmount().toLocaleString()} MAD
                    </span>
                  </div>
                  <div>
                    <span className="text-sm lg:text-base text-gray-700">Restant: </span>
                    <span className={`font-bold text-base lg:text-lg ${(parseFloat(form.initialCapital) - getTotalSelectedAmount()) < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                      {(parseFloat(form.initialCapital) - getTotalSelectedAmount()).toLocaleString()} MAD
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-4 lg:mb-6">
                {result?.products.map((productName, index) => {
                  const product = getProductDetails(productName);
                  const isSelected = selectedProductsForSelection[productName];
                  const currentAmount = investmentAmounts[productName] || '';
                  
                  return (
                    <div 
                      key={index} 
                      className={`border-2 rounded-lg p-3 lg:p-4 transition-all ${
                        isSelected 
                          ? 'border-[#3CD4AB] bg-[#3CD4AB]/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {/* Checkbox and Product Header */}
                      <div className="flex items-start mb-3">
                        <input
                          type="checkbox"
                          checked={isSelected || false}
                          onChange={(e) => handleProductCheckbox(productName, e.target.checked)}
                          className="mt-1 mr-3 w-5 h-5 text-[#3CD4AB] rounded focus:ring-[#3CD4AB] cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <img 
                              src={product.avatar} 
                              alt={product.title}
                              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover mr-2 lg:mr-3"
                            />
                            <div>
                              <h4 className="font-semibold text-gray-800 text-sm lg:text-base">{product.title}</h4>
                              <p className="text-green-600 font-medium text-xs lg:text-sm">ROI: {product.roi}%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Amount Input */}
                      <div className={isSelected ? '' : 'opacity-50 pointer-events-none'}>
                        <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
                          Montant à investir (Min: {product.minInvestment.toLocaleString()} MAD)
                        </label>
                        <input
                          type="number"
                          min={product.minInvestment}
                          value={currentAmount}
                          placeholder={product.minInvestment.toString()}
                          disabled={!isSelected}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#3CD4AB] text-sm lg:text-base disabled:bg-gray-100"
                          onChange={(e) => handleAmountChange(productName, e.target.value)}
                        />
                        {isSelected && currentAmount && parseFloat(currentAmount) < product.minInvestment && (
                          <p className="text-red-500 text-xs mt-1">
                            Minimum requis: {product.minInvestment.toLocaleString()} MAD
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer with Actions */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t gap-3">
                <div className="text-gray-600 text-sm lg:text-base">
                  Produits sélectionnés: {getSelectedProductsCount()} / {result?.products.length}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                  <button
                    onClick={() => setShowInvestmentPopup(false)}
                    className="px-4 lg:px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm lg:text-base"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={!canAddToCart()}
                    className="px-4 lg:px-6 py-2 bg-gradient-to-r from-[#3CD4AB] to-emerald-500 hover:from-[#2bb894] hover:to-emerald-600 text-white rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base font-semibold flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Ajouter au panier ({getSelectedProductsCount()})
                  </button>
                </div>
              </div>
              
              {getTotalSelectedAmount() > parseFloat(form.initialCapital) && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">
                    ⚠️ Le montant total sélectionné dépasse votre capital initial. Veuillez ajuster les montants.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Alert/Toast */}
      {showAlert && (
        <div className="fixed top-2 right-2 lg:top-4 lg:right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 lg:px-6 py-3 lg:py-4 rounded-lg shadow-lg z-50 max-w-sm lg:max-w-md mx-2 animate-fade-in">
          <div className="flex items-start justify-between">
            <span className="text-xs lg:text-sm pr-2">{alertMessage}</span>
            <button 
              onClick={() => setShowAlert(false)}
              className="ml-2 text-white hover:text-gray-200 text-lg lg:text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Recent Simulations Section */}
      {recentSimulations && recentSimulations.length > 0 && (
        <div className="bg-white/5 border border-white/20 rounded-xl p-4 lg:p-6 w-full mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <h3 className="text-lg lg:text-xl font-semibold text-white">Historique des simulations</h3>
            
            {/* Date Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => handleDateFilterChange("all")}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  simulationDateFilter === "all"
                    ? "bg-[#3CD4AB] text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                Tout
              </button>
              <button
                onClick={() => handleDateFilterChange("today")}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  simulationDateFilter === "today"
                    ? "bg-[#3CD4AB] text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                Aujourd'hui
              </button>
              <button
                onClick={() => handleDateFilterChange("week")}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  simulationDateFilter === "week"
                    ? "bg-[#3CD4AB] text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                7 jours
              </button>
              <button
                onClick={() => handleDateFilterChange("month")}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  simulationDateFilter === "month"
                    ? "bg-[#3CD4AB] text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                30 jours
              </button>
            </div>
          </div>
          
          {/* Loading State */}
          {isFilteringSimulations ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3CD4AB]"></div>
                <p className="text-white/60 text-sm">Chargement des simulations...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Filtered Simulations List */}
              {getFilteredSimulations && getFilteredSimulations().length > 0 ? (
                <div className="space-y-3">
                  {getFilteredSimulations().map((sim, index) => (
                    <div 
                      key={index} 
                      className="bg-white/10 border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-white font-medium">
                              {sim.initialCapital?.toLocaleString()} MAD
                            </span>
                            <span className="text-white/50">•</span>
                            <span className="text-white/70 text-sm">
                              {sim.duration} mois
                            </span>
                            <span className="text-white/50">•</span>
                            <span className="text-white/70 text-sm capitalize">
                              {sim.riskProfile}
                            </span>
                          </div>
                          <div className="text-white/50 text-xs">
                            {new Date(sim.createdAt).toLocaleString('fr-FR')}
                          </div>
                        </div>
                        <div className="flex gap-4 text-sm">
                          <div className="text-center">
                            <div className="text-white/60 text-xs mb-1">Attendu</div>
                            <div className="text-[#3CD4AB] font-medium">
                              {sim.result?.expected?.toLocaleString()} MAD
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-white/60 text-xs mb-1">Optimiste</div>
                            <div className="text-green-400 font-medium">
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
                <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <svg 
                      className="w-16 h-16 text-white/30" 
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
                    <div>
                      <p className="text-white/70 font-medium mb-1">
                        Aucune simulation trouvée
                      </p>
                      <p className="text-white/50 text-sm">
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