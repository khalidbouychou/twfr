import React, { useState } from 'react';
import { useSharedData } from '../../Context/useSharedData.js';

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

const SimulationsPage = ({ userBalance }) => {
  const {
    profileType,
    accountBalance, // Fallback balance from context
    totalInvested,
    globalROI,
    actions,
    validators
  } = useSharedData();

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
  const [selectedProducts, setSelectedProducts] = useState([]); // Cart
  const [currentStep, setCurrentStep] = useState('products'); // 'products' | 'cart' | 'loading' | 'confirmed'
  const [investmentAmounts, setInvestmentAmounts] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Investment flow functions
  const openInvestmentPopup = () => {
    setShowInvestmentPopup(true);
    setCurrentStep('products');
    setSelectedProducts([]);
    setInvestmentAmounts({});
  };

  const addToCart = (product, amount) => {
    const productDetails = getProductDetails(product);
    setSelectedProducts(prev => [...prev, { ...productDetails, amount: parseFloat(amount) }]);
    setInvestmentAmounts(prev => ({ ...prev, [product]: parseFloat(amount) }));
  };

  const removeFromCart = (productIndex) => {
    setSelectedProducts(prev => prev.filter((_, index) => index !== productIndex));
  };

  const getTotalInvestment = () => {
    return selectedProducts.reduce((total, product) => total + product.amount, 0);
  };

  const handleConfirmInvestment = async () => {
    const totalInvestment = getTotalInvestment();
    
    // Check if user has sufficient balance
    if (totalInvestment > currentBalance) {
      setAlertMessage(`Solde insuffisant. Vous avez ${currentBalance.toLocaleString()} MAD mais vous voulez investir ${totalInvestment.toLocaleString()} MAD.`);
      setShowAlert(true);
      return;
    }

    setCurrentStep('loading');
    
    // Simulate loading time
    setTimeout(() => {
      // Process investments
      selectedProducts.forEach(product => {
        actions.buyInvestment({
          nameProduct: product.title,
          category: 'investment',
          roi_product: product.roi,
          avatar: product.avatar
        }, product.amount);
      });
      
      setCurrentStep('confirmed');
      
      // Close popup after 2 seconds
      setTimeout(() => {
        setShowInvestmentPopup(false);
        setCurrentStep('products');
        setSelectedProducts([]);
      }, 2000);
    }, 2000);
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
    <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-8 justify-center mt-4 lg:mt-8 px-4 lg:px-0" >
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
            {currentStep === 'products' && (
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-4 lg:mb-6">
                  {result?.products.map((productName, index) => {
                    const product = getProductDetails(productName);
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-3 lg:p-4 hover:border-[#3CD4AB] transition-colors">
                        <div className="flex items-center mb-3 lg:mb-4">
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
                        
                        <div className="mb-3 lg:mb-4">
                          <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
                            Montant à investir (Min: {product.minInvestment.toLocaleString()} MAD)
                          </label>
                          <input
                            type="number"
                            min={product.minInvestment}
                            placeholder={product.minInvestment.toString()}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#3CD4AB] text-sm lg:text-base"
                            onChange={(e) => {
                              const amount = parseFloat(e.target.value);
                              if (amount >= product.minInvestment) {
                                setInvestmentAmounts(prev => ({ ...prev, [productName]: amount }));
                              }
                            }}
                          />
                        </div>
                        
                        <button
                          onClick={() => {
                            const amount = investmentAmounts[productName];
                            if (amount >= product.minInvestment) {
                              addToCart(productName, amount);
                            } else {
                              setAlertMessage(`Montant minimum requis: ${product.minInvestment.toLocaleString()} MAD`);
                              setShowAlert(true);
                            }
                          }}
                          disabled={!investmentAmounts[productName] || investmentAmounts[productName] < product.minInvestment}
                          className="w-full bg-[#3CD4AB] text-white py-2 rounded-md hover:bg-[#2ea885] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
                        >
                          Ajouter au panier
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t gap-3">
                  <div className="text-gray-600 text-sm lg:text-base">
                    Produits sélectionnés: {selectedProducts.length}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                    <button
                      onClick={() => setShowInvestmentPopup(false)}
                      className="px-4 lg:px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm lg:text-base"
                    >
                      Annuler
                    </button>
                    {selectedProducts.length > 0 && (
                      <button
                        onClick={() => setCurrentStep('cart')}
                        className="px-4 lg:px-6 py-2 bg-[#3CD4AB] text-white rounded-md hover:bg-[#2ea885] transition-colors text-sm lg:text-base"
                      >
                        Voir le panier ({selectedProducts.length})
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Cart Step */}
            {currentStep === 'cart' && (
              <div className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <h3 className="text-lg lg:text-2xl font-bold text-gray-800">Votre sélection</h3>
                  <button 
                    onClick={() => setShowInvestmentPopup(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
                  {selectedProducts.map((product, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 lg:p-4 border border-gray-200 rounded-lg gap-3">
                      <div className="flex items-center">
                        <img 
                          src={product.avatar} 
                          alt={product.title}
                          className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover mr-2 lg:mr-3"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm lg:text-base">{product.title}</h4>
                          <p className="text-gray-600 text-xs lg:text-sm">ROI: {product.roi}%</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <span className="font-semibold text-gray-800 text-sm lg:text-base">{product.amount.toLocaleString()} MAD</span>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-red-500 hover:text-red-700 text-xl"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 p-3 lg:p-4 rounded-lg mb-4 lg:mb-6">
                  <div className="flex justify-between items-center text-base lg:text-lg font-semibold">
                    <span>Total d'investissement:</span>
                    <span className="text-[#3CD4AB]">{getTotalInvestment().toLocaleString()} MAD</span>
                  </div>
                  <div className="flex justify-between items-center text-xs lg:text-sm text-gray-600 mt-2">
                    <span>Solde disponible:</span>
                    <span>{currentBalance.toLocaleString()} MAD</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                  <button
                    onClick={() => setCurrentStep('products')}
                    className="flex-1 px-4 lg:px-6 py-2 lg:py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm lg:text-base"
                  >
                    Retour
                  </button>
                  <button
                    onClick={() => setShowInvestmentPopup(false)}
                    className="flex-1 px-4 lg:px-6 py-2 lg:py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm lg:text-base"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleConfirmInvestment}
                    className="flex-1 px-4 lg:px-6 py-2 lg:py-3 bg-[#3CD4AB] text-white rounded-md hover:bg-[#2ea885] transition-colors text-sm lg:text-base"
                  >
                    Confirmer l'investissement
                  </button>
                </div>
              </div>
            )}

            {/* Loading Step */}
            {currentStep === 'loading' && (
              <div className="p-4 lg:p-6 text-center">
                <div className="flex flex-col items-center justify-center py-8 lg:py-12">
                  <div className="animate-spin rounded-full h-12 w-12 lg:h-16 lg:w-16 border-b-2 border-[#3CD4AB] mb-4"></div>
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">Traitement en cours...</h3>
                  <p className="text-gray-600 text-sm lg:text-base px-4">Veuillez patienter pendant que nous traitons votre investissement</p>
                </div>
              </div>
            )}

            {/* Confirmed Step */}
            {currentStep === 'confirmed' && (
              <div className="p-4 lg:p-6 text-center">
                <div className="flex flex-col items-center justify-center py-8 lg:py-12">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">Investissement confirmé!</h3>
                  <p className="text-gray-600 mb-4 text-sm lg:text-base px-4">
                    Votre investissement de {getTotalInvestment().toLocaleString()} MAD a été traité avec succès.
                  </p>
                  <p className="text-xs lg:text-sm text-gray-500">Cette fenêtre se fermera automatiquement...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Alert/Toast */}
      {showAlert && (
        <div className="fixed top-2 right-2 lg:top-4 lg:right-4 bg-red-500 text-white px-4 lg:px-6 py-3 lg:py-4 rounded-lg shadow-lg z-50 max-w-sm lg:max-w-md mx-2">
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
    </div>
  );
};

export default SimulationsPage;