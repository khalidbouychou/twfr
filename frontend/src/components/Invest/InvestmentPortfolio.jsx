import React, { useState } from 'react';
import { 
  IoChevronBack, 
  IoSearch, 
  IoNotifications, 
  IoInformationCircle, 
  IoArrowForward,
  IoTrendingUp,
  IoTrendingDown,
  IoClose,
  IoCheckmarkCircle,
  IoWarning,
  IoInformation
} from 'react-icons/io5';

// Custom CSS to hide default scrollbars
const customStyles = `
  /* Hide default scrollbars */
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
  
  /* For Firefox */
  * {
    scrollbar-width: none;
  }
  
  /* For IE and Edge */
  * {
    -ms-overflow-style: none;
  }
  
  /* Custom scrollbar styles for our components */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #374151;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #3CD4AB;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #2BB89A;
  }
  
  /* For Firefox custom scrollbar */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #3CD4AB #374151;
  }
`;

  // import tawfirProducts from '../Resultat/Products/Tawfir_Products.json';
  
  // Hardcoded Tawfir products data
  const tawfirProducts = [
    {
      "nom_produit": "Compte sur Carnet",
      "risque": "1",
      "duree_recommandee": "COURT",
      "enveloppe_gestion": "compte bancaire",
      "avatar": "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=400&h=400&fit=crop&crop=center"
    },
    {
      "nom_produit": "Depot a termes",
      "risque": "1",
      "duree_recommandee": "COURT/MOYEN/LONG TERME",
      "enveloppe_gestion": "compte bancaire",
      "avatar": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop&crop=center"
    },
    {
      "nom_produit": "OPCVM Actions",
      "risque": "7",
      "duree_recommandee": "LONG TERME",
      "enveloppe_gestion": "Compte Titre/PEA/Assurance-vie/Retraite",
      "avatar": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop&crop=center"
    },
    {
      "nom_produit": "Gestion sous mandat Actions",
      "risque": "7",
      "duree_recommandee": "LONG TERME",
      "enveloppe_gestion": "Compte Titre ou PEA",
      "avatar": "https://images.unsplash.com/photo-1642115958395-3f05ad94030c?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "nom_produit": "OPCVM Monétaires",
      "risque": "1",
      "duree_recommandee": "COURT TERME",
      "enveloppe_gestion": "Compte Titre/Assurance-vie/Retraite",
      "avatar": "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=400&fit=crop&crop=center"
    },
    {
      "nom_produit": "OPCVM Court Terme",
      "risque": "2",
      "duree_recommandee": "COURT TERME",
      "enveloppe_gestion": "Compte Titre/Assurance-vie/Retraite",
      "avatar": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop&crop=center"
    },
    {
      "nom_produit": "OPCVM OMLT",
      "risque": "3",
      "duree_recommandee": "MOYENLONG TERME",
      "enveloppe_gestion": "Compte Titre/Assurance-vie/Retraite",
      "avatar": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=400&fit=crop&crop=center"
    },
    {
      "nom_produit": "Capital Garanti",
      "risque": "2",
      "duree_recommandee": "COURT/MOYEN/LONG TERME",
      "enveloppe_gestion": "Compte Titre ou PEA",
      "avatar": "https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?w=400&h=400&fit=crop&crop=center"
    },
    {
      "nom_produit": "Garantie partielle",
      "risque": "3",
      "duree_recommandee": "COURT/MOYEN/LONG TERME",
      "enveloppe_gestion": "Compte Titre ou PEA",
      "avatar": "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=400&fit=crop&crop=center"
    }
  ];
  
  const InvestmentPortfolio = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('24h');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeSection, setActiveSection] = useState('investments'); // 'investments', 'history', 'recommended'
  const [showBuySellPopup, setShowBuySellPopup] = useState(false);
  const [buySellMode, setBuySellMode] = useState('buy'); // 'buy' or 'sell'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [accountBalance, setAccountBalance] = useState(14590.50);
  const [userInvestments, setUserInvestments] = useState([]);
  const [investmentHistory, setInvestmentHistory] = useState([
    {
      id: 1,
      productName: "OPCVM Actions",
      amount: 2500,
      date: "2024-07-15",
      status: "completed",
      type: "buy"
    },
    {
      id: 2,
      productName: "Compte sur Carnet",
      amount: 1500,
      date: "2024-07-10",
      status: "completed",
      type: "buy"
    },
    {
      id: 3,
      productName: "Capital Garanti",
      amount: 3000,
      date: "2024-07-05",
      status: "completed",
      type: "buy"
    },
    {
      id: 4,
      productName: "OPCVM Actions",
      amount: 800,
      date: "2024-07-20",
      status: "completed",
      type: "sell"
    }
  ]);
  const [toasts, setToasts] = useState([]);

  // Toast notification system
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Enhanced fake performance data
  const performanceData = {
    '24h': [
      { time: '00:00', value: 14500, benchmark: 14400 },
      { time: '04:00', value: 14600, benchmark: 14500 },
      { time: '08:00', value: 14700, benchmark: 14600 },
      { time: '12:00', value: 14650, benchmark: 14550 },
      { time: '16:00', value: 14590, benchmark: 14500 },
      { time: '20:00', value: 14620, benchmark: 14520 }
    ],
    '1W': [
      { time: 'Mon', value: 14400, benchmark: 14300 },
      { time: 'Tue', value: 14500, benchmark: 14400 },
      { time: 'Wed', value: 14600, benchmark: 14500 },
      { time: 'Thu', value: 14700, benchmark: 14600 },
      { time: 'Fri', value: 14650, benchmark: 14550 },
      { time: 'Sat', value: 14620, benchmark: 14520 },
      { time: 'Sun', value: 14590, benchmark: 14500 }
    ],
    '1M': [
      { time: 'Week 1', value: 14200, benchmark: 14100 },
      { time: 'Week 2', value: 14400, benchmark: 14300 },
      { time: 'Week 3', value: 14600, benchmark: 14500 },
      { time: 'Week 4', value: 14590, benchmark: 14500 }
    ],
    '1Y': [
      { time: 'Jan', value: 13500, benchmark: 13400 },
      { time: 'Feb', value: 13800, benchmark: 13700 },
      { time: 'Mar', value: 14200, benchmark: 14100 },
      { time: 'Apr', value: 14500, benchmark: 14400 },
      { time: 'May', value: 14300, benchmark: 14200 },
      { time: 'Jun', value: 14590, benchmark: 14500 }
    ]
  };

  // Investment timeline data
  const investmentTimeline = [
    { month: 'Jan', invested: 2000, current: 2100 },
    { month: 'Feb', invested: 3500, current: 3700 },
    { month: 'Mar', invested: 5000, current: 5300 },
    { month: 'Apr', invested: 6500, current: 6900 },
    { month: 'May', invested: 8000, current: 8500 },
    { month: 'Jun', invested: 10000, current: 10800 },
    { month: 'Jul', invested: 12000, current: 12900 },
    { month: 'Aug', invested: 14590, current: 15200 }
  ];

  // Mock data for account balance and performance
  const accountData = {
    balance: accountBalance,
    dailyChange: -10.25,
    dailyChangePercent: -0.67,
    lastUpdate: '4 August at 16:07',
    performanceHistory: performanceData[activeTimeframe] || performanceData['24h']
  };

  // Transform Tawfir products into investment format
  const transformProductsToInvestments = () => {
    return tawfirProducts.map((product, index) => {
      const currentValue = Math.abs(Math.random() * 5000 + 1000);
      const dailyChange = Math.abs((Math.random() - 0.5) * 200);
      const dailyChangePercent = Math.abs((Math.random() - 0.5) * 10);
      const minInvestment = 50; // Fixed minimum investment of 50 euros
      const expectedReturn = Math.floor(Math.random() * 15) + 5;
      const marketPrice = Math.abs(Math.random() * 100 + 50); // Fake market price
      const priceChange = Math.abs((Math.random() - 0.5) * 10);
      const priceChangePercent = Math.abs((Math.random() - 0.5) * 5);
      
      return {
        id: index + 1,
        name: product.nom_produit,
        symbol: product.nom_produit.split(' ').slice(0, 2).join(''),
        icon: getProductIcon(product.nom_produit),
        currentValue: isNaN(currentValue) ? 1000 : currentValue,
        dailyChange: isNaN(dailyChange) ? 0 : dailyChange,
        dailyChangePercent: isNaN(dailyChangePercent) ? 0 : dailyChangePercent,
        category: getProductCategory(product.nom_produit),
        risk: getValidRiskValue(product.risque),
        duration: product.duree_recommandee,
        envelope: product.enveloppe_gestion,
        avatar: product.avatar,
        minInvestment: minInvestment,
        expectedReturn: isNaN(expectedReturn) ? 5 : expectedReturn,
        marketPrice: isNaN(marketPrice) ? 75 : marketPrice,
        priceChange: isNaN(priceChange) ? 0 : priceChange,
        priceChangePercent: isNaN(priceChangePercent) ? 0 : priceChangePercent
      };
    });
  };

  const getProductIcon = (productName) => {
    const icons = {
      'Compte sur Carnet': '🏦',
      'Depot a termes': '💰',
      'OPCVM Actions': '📈',
      'Gestion sous mandat Actions': '🎯',
      'OPCVM Monétaires': '💱',
      'OPCVM Court Terme': '⏰',
      'OPCVM OMLT': '📊',
      'Capital Garanti': '🛡️',
      'Garantie partielle': '🔒'
    };
    return icons[productName] || '📋';
  };

  const getProductCategory = (productName) => {
    if (productName.includes('Actions')) return 'stocks';
    if (productName.includes('OPCVM')) return 'funds';
    if (productName.includes('Compte') || productName.includes('Depot')) return 'banking';
    if (productName.includes('Garanti') || productName.includes('Capital')) return 'guaranteed';
    return 'other';
  };

  const getValidRiskValue = (risk) => {
    const riskNum = parseInt(risk);
    return isNaN(riskNum) ? 1 : riskNum;
  };

  const investments = {
    all: [...userInvestments, ...transformProductsToInvestments()],
    banking: [...userInvestments, ...transformProductsToInvestments()].filter(item => item.category === 'banking'),
    stocks: [...userInvestments, ...transformProductsToInvestments()].filter(item => item.category === 'stocks'),
    funds: [...userInvestments, ...transformProductsToInvestments()].filter(item => item.category === 'funds'),
    guaranteed: [...userInvestments, ...transformProductsToInvestments()].filter(item => item.category === 'guaranteed'),
    other: [...userInvestments, ...transformProductsToInvestments()].filter(item => item.category === 'other')
  };

  // Recommended products from Tawfir
  const recommendedProducts = tawfirProducts.slice(0, 3).map((product, index) => {
    const expectedReturn = Math.floor(Math.random() * 15) + 5;
    const minInvestment = 50; // Fixed minimum investment of 50 euros
    
    return {
      id: index + 1,
      name: product.nom_produit,
      description: `${product.duree_recommandee} • ${product.enveloppe_gestion}`,
      expectedReturn: isNaN(expectedReturn) ? 5 : expectedReturn,
      risk: getValidRiskValue(product.risque),
      minInvestment: minInvestment,
      category: getProductCategory(product.nom_produit),
      icon: getProductIcon(product.nom_produit),
      avatar: product.avatar
    };
  });

  const getAllInvestments = () => {
    return investments.all;
  };

  const getFilteredInvestments = () => {
    if (selectedCategory === 'all') {
      return getAllInvestments();
    }
    return investments[selectedCategory] || [];
  };

  const formatCurrency = (amount) => {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return '€0,00';
    }
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatPercentage = (percentage) => {
    if (isNaN(percentage) || percentage === null || percentage === undefined) {
      return '+0.00%';
    }
    return `${percentage > 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  const handleInvest = () => {
    const amount = parseFloat(investmentAmount);
    
    if (!amount || amount <= 0 || isNaN(amount)) {
      showToast('Please enter a valid investment amount.', 'error');
      return;
    }

    if (amount > accountBalance) {
      showToast(`Insufficient funds. Your balance is ${formatCurrency(accountBalance)}. Please enter a smaller amount.`, 'error');
      return;
    }

    if (amount < (selectedProduct.minInvestment || 50)) {
      showToast(`Minimum investment for this product is ${formatCurrency(selectedProduct.minInvestment || 50)}.`, 'error');
      return;
    }

    // Add to user investments
    const newInvestment = {
      ...selectedProduct,
      id: Date.now(),
      investedAmount: amount,
      currentValue: amount,
      dailyChange: 0,
      dailyChangePercent: 0,
      investmentDate: new Date().toISOString()
    };

    // Add to investment history
    const newHistoryEntry = {
      id: Date.now() + 1,
      productName: selectedProduct.name,
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      status: "completed",
      type: "buy"
    };

    setUserInvestments(prev => [...prev, newInvestment]);
    setInvestmentHistory(prev => [newHistoryEntry, ...prev]);
    setAccountBalance(prev => Math.max(0, prev - amount));
    setShowBuySellPopup(false);
    setSelectedProduct(null);
    setInvestmentAmount('');

    showToast(`Successfully invested ${formatCurrency(amount)} in ${selectedProduct.name}!`, 'success');
  };

  const handleSell = () => {
    const amount = parseFloat(sellAmount);
    
    if (!amount || amount <= 0 || isNaN(amount)) {
      showToast('Please enter a valid sell amount.', 'error');
      return;
    }

    if (amount > selectedInvestment.currentValue) {
      showToast('Cannot sell more than your current investment value.', 'error');
      return;
    }

    // Calculate profit/loss with NaN protection
    const profitLoss = amount - (selectedInvestment.investedAmount || 0);
    const profitLossPercent = selectedInvestment.investedAmount && selectedInvestment.investedAmount > 0 
      ? ((amount - selectedInvestment.investedAmount) / selectedInvestment.investedAmount) * 100 
      : 0;

    // Add to investment history
    const newHistoryEntry = {
      id: Date.now() + 1,
      productName: selectedInvestment.name,
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      status: "completed",
      type: "sell"
    };

    // Update user investments
    setUserInvestments(prev => prev.map(inv => 
      inv.id === selectedInvestment.id 
        ? { ...inv, currentValue: Math.max(0, inv.currentValue - amount) }
        : inv
    ));

    // Add to account balance
    setAccountBalance(prev => prev + amount);
    setInvestmentHistory(prev => [newHistoryEntry, ...prev]);
    setShowBuySellPopup(false);
    setSelectedInvestment(null);
    setSellAmount('');

    const message = profitLoss >= 0 
      ? `Successfully sold ${formatCurrency(amount)} with a profit of ${formatCurrency(profitLoss)} (${profitLossPercent.toFixed(2)}%)!`
      : `Successfully sold ${formatCurrency(amount)} with a loss of ${formatCurrency(Math.abs(profitLoss))} (${profitLossPercent.toFixed(2)}%)!`;
    
    showToast(message, profitLoss >= 0 ? 'success' : 'warning');
  };

  const getRiskColor = (risk) => {
    const riskNum = parseInt(risk);
    if (isNaN(riskNum) || riskNum <= 2) return 'text-green-400';
    if (riskNum <= 4) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskLabel = (risk) => {
    const riskNum = parseInt(risk);
    if (isNaN(riskNum) || riskNum <= 2) return 'Low';
    if (riskNum <= 4) return 'Medium';
    return 'High';
  };

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <IoCheckmarkCircle className="w-5 h-5" />;
      case 'error':
        return <IoWarning className="w-5 h-5" />;
      case 'warning':
        return <IoWarning className="w-5 h-5" />;
      default:
        return <IoInformation className="w-5 h-5" />;
    }
  };

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-600 border-green-500';
      case 'error':
        return 'bg-red-600 border-red-500';
      case 'warning':
        return 'bg-yellow-600 border-yellow-500';
      default:
        return 'bg-blue-600 border-blue-500';
    }
  };

  return (
    <>
      {/* Inject custom styles */}
      <style>{customStyles}</style>
      
      <div className="min-h-screen bg-bg-dark text-white font-raleway">
        {/* Toast Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`${getToastStyles(toast.type)} border-l-4 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ease-in-out`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 text-white">
                  {getToastIcon(toast.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    {toast.message}
                  </p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 text-white hover:text-gray-200 transition-colors"
                >
                  <IoClose className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="sticky top-0 z-50 bg-bg-dark/95 backdrop-blur-sm border-b border-gray-800">
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <h1 className="text-xl font-bold">Portefeuille</h1>
              <p className="text-sm text-gray-400">Gestion détaillée de votre portefeuille</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-xs text-gray-400">Solde disponible</p>
                <p className="text-lg font-bold text-accent">{formatCurrency(accountBalance)}</p>
              </div>
              <button 
                onClick={() => setShowBuySellPopup(true)}
                className="bg-accent text-bg-dark px-4 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors"
              >
                + Ajouter
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-6 space-y-6">
          {/* Account Balance Section */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                {formatCurrency(accountData.balance)}
              </h2>
              <div className={`flex items-center justify-center space-x-2 mb-2 ${
                accountData.dailyChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {accountData.dailyChange >= 0 ? (
                  <IoTrendingUp className="w-4 h-4" />
                ) : (
                  <IoTrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm">
                  {formatCurrency(Math.abs(accountData.dailyChange))} • {formatPercentage(accountData.dailyChangePercent)}
                </span>
              </div>
              <p className="text-gray-400 text-xs">
                Last update: {accountData.lastUpdate}
              </p>
            </div>
          </div>

          {/* Portfolio Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Répartition des Actifs */}
            <div className="bg-gray-900 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Répartition des Actifs</h3>
              <div className="flex items-center justify-center mb-4">
                {/* Simple Pie Chart Representation */}
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 rounded-full" style={{
                    background: `conic-gradient(
                      #3CD4AB 0deg 120deg,
                      #8B5CF6 120deg 200deg,
                      #EF4444 200deg 280deg,
                      #F59E0B 280deg 360deg
                    )`
                  }}>
                    <div className="absolute inset-4 bg-gray-900 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-400">Portfolio</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-accent rounded-full"></div>
                    <span>Actions</span>
                  </div>
                  <span>45%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>Obligations</span>
                  </div>
                  <span>30%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>OPCVM</span>
                  </div>
                  <span>20%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Autres</span>
                  </div>
                  <span>5%</span>
                </div>
              </div>
            </div>

            {/* Actions Rapides & Performance */}
            <div className="space-y-4">
              {/* Actions Rapides */}
              <div className="bg-gray-900 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      setBuySellMode('buy');
                      setShowBuySellPopup(true);
                    }}
                    className="w-full bg-accent text-bg-dark py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                  >
                    Acheter des Actions
                  </button>
                  <button 
                    onClick={() => {
                      setBuySellMode('sell');
                      setShowBuySellPopup(true);
                    }}
                    className="w-full bg-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  >
                    Vendre des Positions
                  </button>
                  <button className="w-full bg-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors">
                    Rééquilibrer
                  </button>
                </div>
              </div>

              {/* Performance */}
              <div className="bg-gray-900 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold mb-4">Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rendement Total</span>
                    <span className="text-green-400 font-semibold">+5.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gain/Perte</span>
                    <span className="text-green-400 font-semibold">+520 Dhs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2 custom-scrollbar">
            {[
              { key: 'holdings', label: 'Détail des Holdings', icon: '📊', count: getFilteredInvestments().length },
              { key: 'history', label: 'Historique', icon: '📈', count: investmentHistory.length },
              { key: 'opportunities', label: 'Opportunités', icon: '💡', count: recommendedProducts.length }
            ].map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center space-x-2 ${
                  activeSection === section.key
                    ? 'bg-accent text-bg-dark shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span>{section.icon}</span>
                <span>{section.label}</span>
                <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
                  {section.count}
                </span>
              </button>
            ))}
          </div>

          {/* Dynamic Content Based on Active Section */}
          <div className="space-y-6">
            {/* Détail des Holdings Section */}
            {activeSection === 'holdings' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Détail des Holdings</h3>
                  <IoInformationCircle className="w-5 h-5 text-gray-400" />
                </div>

                {/* Holdings Table */}
                <div className="bg-gray-900 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-800">
                        <tr>
                          <th className="text-left p-3 font-medium text-gray-300">ASSET</th>
                          <th className="text-center p-3 font-medium text-gray-300">QUANTITÉ</th>
                          <th className="text-center p-3 font-medium text-gray-300">PRIX D'ACHAT</th>
                          <th className="text-center p-3 font-medium text-gray-300">PRIX ACTUEL</th>
                          <th className="text-center p-3 font-medium text-gray-300">VALEUR</th>
                          <th className="text-center p-3 font-medium text-gray-300">P&L</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: "OPCVM Actions", quantity: 100, purchasePrice: 40, currentPrice: 42, value: 4200, pl: "+5%" },
                          { name: "Obligations d'État", quantity: 100, purchasePrice: 30, currentPrice: 31.5, value: 3150, pl: "+5%" },
                          { name: "Fonds Euro", quantity: 100, purchasePrice: 20, currentPrice: 21, value: 2100, pl: "+5%" },
                          { name: "Livret A", quantity: 100, purchasePrice: 10, currentPrice: 10.5, value: 1050, pl: "+5%" }
                        ].map((holding, index) => (
                          <tr key={index} className="border-t border-gray-700 hover:bg-gray-800/50">
                            <td className="p-3 font-medium text-white">{holding.name}</td>
                            <td className="p-3 text-center text-gray-300">{holding.quantity}</td>
                            <td className="p-3 text-center text-gray-300">{holding.purchasePrice} Dhs</td>
                            <td className="p-3 text-center text-gray-300">{holding.currentPrice} Dhs</td>
                            <td className="p-3 text-center text-accent font-semibold">{formatCurrency(holding.value)}</td>
                            <td className="p-3 text-center text-green-400 font-semibold">{holding.pl}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className={`space-y-3 max-h-96 overflow-y-auto scroll-smooth ${getFilteredInvestments().length > 3 ? 'custom-scrollbar' : ''}`}>
                  {getFilteredInvestments().map((investment) => (
                    <div key={investment.id} className="bg-gray-900 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-lg">
                            {investment.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{investment.name}</h4>
                            <p className="text-gray-400 text-sm">{investment.symbol}</p>
                            <p className="text-gray-500 text-xs">Risk: {investment.risk || 1} • {investment.duration || 'N/A'}</p>
                            {/* Market Price Data Label */}
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-400">Market:</span>
                              <span className="text-xs font-medium text-white">{formatCurrency(investment.marketPrice || 75)}</span>
                              <div className={`flex items-center space-x-1 text-xs ${
                                (investment.priceChangePercent || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {(investment.priceChangePercent || 0) >= 0 ? (
                                  <IoTrendingUp className="w-2 h-2" />
                                ) : (
                                  <IoTrendingDown className="w-2 h-2" />
                                )}
                                <span>{formatPercentage(investment.priceChangePercent || 0)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-white">{formatCurrency(investment.currentValue)}</p>
                          <div className={`flex items-center space-x-1 text-sm ${
                            investment.dailyChange >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {investment.dailyChange >= 0 ? (
                              <IoTrendingUp className="w-3 h-3" />
                            ) : (
                              <IoTrendingDown className="w-3 h-3" />
                            )}
                            <span>
                              {formatCurrency(Math.abs(investment.dailyChange || 0))} • {formatPercentage(investment.dailyChangePercent || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {investment.investedAmount && (
                        <div className="flex space-x-2 mt-3">
                          <button 
                            onClick={() => {
                              setBuySellMode('sell');
                              setSelectedInvestment(investment);
                              setSellAmount(investment.currentValue.toString());
                              setShowBuySellPopup(true);
                            }}
                            className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                          >
                            Sell
                          </button>
                          <button 
                            onClick={() => {
                              setBuySellMode('buy');
                              setSelectedProduct(investment);
                              setInvestmentAmount('');
                              setShowBuySellPopup(true);
                            }}
                            className="flex-1 bg-accent text-bg-dark py-2 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
                          >
                            Buy More
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {getFilteredInvestments().length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No investments found</p>
                      <p className="text-gray-500 text-sm mt-1">Start investing to see your portfolio here</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Historique Section */}
            {activeSection === 'history' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Historique</h3>
                  <IoInformationCircle className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className={`space-y-3 max-h-96 overflow-y-auto scroll-smooth ${investmentHistory.length > 3 ? 'custom-scrollbar' : ''}`}>
                  {investmentHistory.map((history) => (
                    <div key={history.id} className="bg-gray-900 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                            history.type === 'buy' ? 'bg-green-600' : 'bg-red-600'
                          }`}>
                            {history.type === 'buy' ? '📈' : '📉'}
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{history.productName}</h4>
                            <p className="text-gray-400 text-sm capitalize">{history.type} • {history.status}</p>
                            <p className="text-gray-500 text-xs">{history.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium text-lg ${
                            history.type === 'buy' ? 'text-red-400' : 'text-green-400'
                          }`}>
                            {history.type === 'buy' ? '-' : '+'}{formatCurrency(history.amount)}
                          </p>
                          <p className="text-gray-400 text-sm capitalize">
                            {history.type === 'buy' ? 'Investment' : 'Sale'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {investmentHistory.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No transaction history</p>
                      <p className="text-gray-500 text-sm mt-1">Your investment transactions will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Opportunités Section */}
            {activeSection === 'opportunities' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Opportunités Recommandées</h3>
                  <IoInformationCircle className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className={`space-y-3 max-h-96 overflow-y-auto scroll-smooth ${recommendedProducts.length > 3 ? 'custom-scrollbar' : ''}`}>
                  {recommendedProducts.map((product) => (
                    <div key={product.id} className="bg-gray-900 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-accent rounded-xl flex items-center justify-center text-xl">
                            {product.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-white">{product.name}</h4>
                            <p className="text-gray-400 text-sm">{product.description}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-green-400 text-sm font-medium">
                                {product.expectedReturn || 5}% expected return
                              </span>
                              <span className="text-gray-400 text-sm">
                                Risk: {product.risk || 1}
                              </span>
                            </div>
                            {/* Market Price Data Label for Recommended Products */}
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-400">Market:</span>
                              <span className="text-xs font-medium text-white">{formatCurrency(product.marketPrice || 75)}</span>
                              <div className={`flex items-center space-x-1 text-xs ${
                                (product.priceChangePercent || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {(product.priceChangePercent || 0) >= 0 ? (
                                  <IoTrendingUp className="w-2 h-2" />
                                ) : (
                                  <IoTrendingDown className="w-2 h-2" />
                                )}
                                <span>{formatPercentage(product.priceChangePercent || 0)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setBuySellMode('buy');
                            setSelectedProduct(product);
                            setInvestmentAmount('');
                            setShowBuySellPopup(true);
                          }}
                          className="bg-accent text-bg-dark px-4 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                        >
                          Invest
                        </button>
                      </div>
                    </div>
                  ))}
                  {recommendedProducts.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No recommendations available</p>
                      <p className="text-gray-500 text-sm mt-1">Check back later for personalized recommendations</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Buy / Sell Popup */}
        {showBuySellPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Buy / Sell</h3>
                <button 
                  onClick={() => setShowBuySellPopup(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <IoClose className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Mode Selection */}
                <div className="flex space-x-2 mb-4">
                  <button
                    onClick={() => setBuySellMode('buy')}
                    className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                      buySellMode === 'buy'
                        ? 'bg-accent text-bg-dark'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setBuySellMode('sell')}
                    className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                      buySellMode === 'sell'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Sell
                  </button>
                </div>

                {/* Buy Mode Content */}
                {buySellMode === 'buy' && (
                  <div className="space-y-4">
                    <div className="bg-gray-800 rounded-xl p-4">
                      <h4 className="font-medium text-white mb-3">Available Products</h4>
                      <div className={`space-y-2 max-h-32 overflow-y-auto ${recommendedProducts.slice(0, 3).length > 3 ? 'custom-scrollbar' : ''}`}>
                        {recommendedProducts.slice(0, 3).map((product) => (
                          <div key={product.id} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{product.icon}</span>
                              <div>
                                <p className="text-white text-sm font-medium">{product.name}</p>
                                <p className="text-gray-400 text-xs">Min: {formatCurrency(product.minInvestment)}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                setInvestmentAmount('');
                              }}
                              className="bg-accent text-bg-dark px-3 py-1 rounded text-xs font-medium hover:bg-accent/90"
                            >
                              Select
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedProduct && (
                      <div className="space-y-4">
                        <div className="bg-gray-800 rounded-xl p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-accent rounded-xl flex items-center justify-center text-xl">
                              {selectedProduct.icon}
                            </div>
                            <div>
                              <h4 className="font-medium text-white">{selectedProduct.name}</h4>
                              <p className="text-gray-400 text-sm">{selectedProduct.description}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400">Risk Level</p>
                              <p className={`font-medium ${getRiskColor(selectedProduct.risk)}`}>
                                {getRiskLabel(selectedProduct.risk)} ({selectedProduct.risk}/7)
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400">Expected Return</p>
                              <p className="text-green-400 font-medium">{selectedProduct.expectedReturn}%</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Min Investment</p>
                              <p className="text-white font-medium">{formatCurrency(selectedProduct.minInvestment)}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Duration</p>
                              <p className="text-white font-medium">{selectedProduct.duration}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Investment Amount
                          </label>
                          <input
                            type="number"
                            value={investmentAmount}
                            onChange={(e) => setInvestmentAmount(e.target.value)}
                            placeholder={`Min: ${formatCurrency(selectedProduct.minInvestment)}`}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-accent"
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            Available: {formatCurrency(accountBalance)}
                          </p>
                        </div>
                        
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setShowBuySellPopup(false)}
                            className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleInvest}
                            className="flex-1 bg-accent text-bg-dark py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                          >
                            Confirm Investment
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Sell Mode Content */}
                {buySellMode === 'sell' && (
                  <div className="space-y-4">
                    <div className="bg-gray-800 rounded-xl p-4">
                      <h4 className="font-medium text-white mb-3">Your Investments</h4>
                      <div className={`space-y-2 max-h-32 overflow-y-auto ${userInvestments.length > 3 ? 'custom-scrollbar' : ''}`}>
                        {userInvestments.map((investment) => (
                          <div key={investment.id} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{investment.icon}</span>
                              <div>
                                <p className="text-white text-sm font-medium">{investment.name}</p>
                                <p className="text-gray-400 text-xs">Value: {formatCurrency(investment.currentValue)}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedInvestment(investment);
                                setSellAmount(investment.currentValue.toString());
                              }}
                              className="bg-red-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-700"
                            >
                              Select
                            </button>
                          </div>
                        ))}
                        {userInvestments.length === 0 && (
                          <p className="text-gray-400 text-sm text-center py-4">No investments to sell</p>
                        )}
                      </div>
                    </div>

                    {selectedInvestment && (
                      <div className="space-y-4">
                        <div className="bg-gray-800 rounded-xl p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-xl">
                              {selectedInvestment.icon}
                            </div>
                            <div>
                              <h4 className="font-medium text-white">{selectedInvestment.name}</h4>
                              <p className="text-gray-400 text-sm">Current Value: {formatCurrency(selectedInvestment.currentValue)}</p>
                              <p className="text-gray-400 text-sm">Invested: {formatCurrency(selectedInvestment.investedAmount)}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Sell Amount
                          </label>
                          <input
                            type="number"
                            value={sellAmount}
                            onChange={(e) => setSellAmount(e.target.value)}
                            placeholder="Enter amount to sell"
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            Max: {formatCurrency(selectedInvestment.currentValue)}
                          </p>
                        </div>
                        
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setShowBuySellPopup(false)}
                            className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSell}
                            className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                          >
                            Confirm Sale
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InvestmentPortfolio; 