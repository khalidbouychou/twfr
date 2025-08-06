import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, AreaChart, Area } from 'recharts';
import { RecommendationEngine } from '../Algo';
import { useUserContext } from '../Context/UserContext';

const UserDashboard = () => {
  const { userProfileData } = useUserContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [balanceOperation, setBalanceOperation] = useState('add'); // 'add' or 'withdraw'
  const [balanceAmount, setBalanceAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('paypal');
  
  // Profit management states
  const [showProfitModal, setShowProfitModal] = useState(false);
  const [profitOperation, setProfitOperation] = useState('withdraw'); // 'withdraw' or 'reinvest'
  const [userBalance, setUserBalance] = useState(0); // Start with zero balance
  const [recommendationEngine] = useState(new RecommendationEngine());
  const [portfolioData, setPortfolioData] = useState({
    totalInvested: 0, // Start at 0
    globalPerformance: 0, // Start at 0
    dailyVariation: 0, // Start at 0
    monthlyGrowth: 0, // Start at 0
    portfolioBreakdown: [], // Start empty
    performanceHistory: [
      { date: 'Jan', value: 0, benchmark: 0 },
      { date: 'Fév', value: 0, benchmark: 0 },
      { date: 'Mar', value: 0, benchmark: 0 },
      { date: 'Avr', value: 0, benchmark: 0 },
      { date: 'Mai', value: 0, benchmark: 0 },
      { date: 'Juin', value: 0, benchmark: 0 }
    ],
    products: [] // Start empty, will be populated with real investments
  });

  const [, setRecommendations] = useState([]);
  const [userRiskProfile, setUserRiskProfile] = useState(null);

  useEffect(() => {
    if (userProfileData && Object.keys(userProfileData).length > 0) {
      const results = recommendationEngine.generateCompleteRecommendation(userProfileData);
      
      const newPortfolioData = {
        ...portfolioData,
        portfolioBreakdown: results.allocation.map(item => ({
          name: item.name,
          value: (item.value / 100) * portfolioData.totalInvested,
          color: item.color
        })),
        products: results.matchedProducts.slice(0, 4).map((product) => ({
          name: product.nom_produit,
          currentValue: Math.round((product.overallCompatibility / 100) * (portfolioData.totalInvested / 4) * 1.05),
          investedAmount: Math.round((product.overallCompatibility / 100) * (portfolioData.totalInvested / 4)),
          performance: Math.round(product.overallCompatibility * 0.1),
          risk: parseInt(product.risque),
          category: product.nom_produit.split(' ')[0]
        }))
      };

      setPortfolioData(newPortfolioData);
      setRecommendations(results.recommendations);
      setUserRiskProfile(results.riskProfile);
    }
  }, [userProfileData]);



  const [notifications, setNotifications] = useState([]);

  // Investment popup states
  const [showInvestPopup, setShowInvestPopup] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [investAmount, setInvestAmount] = useState('');
  const [investmentHistory, setInvestmentHistory] = useState([]);

  // Notification dropdown state
  const [showNotifications, setShowNotifications] = useState(false);

  // Notification details and history states
  const [showNotificationDetails, setShowNotificationDetails] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notificationHistory, setNotificationHistory] = useState([]);

  // Ref for notification dropdown
  const notificationRef = useRef(null);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle balance operations (add/withdraw)
  const handleBalanceOperation = () => {
    const amount = parseFloat(balanceAmount);
    if (!amount || amount <= 0) return;

    // Get payment method display name
    const paymentMethodNames = {
      'paypal': 'PayPal',
      'card': 'Visa/MasterCard',
      'usdt': 'USDT (Crypto)'
    };
    const paymentMethodName = paymentMethodNames[selectedPaymentMethod] || 'PayPal';

    if (balanceOperation === 'add') {
      // Add balance
      setUserBalance(prev => prev + amount);
      
      // Add notification for deposit
      setNotifications(prev => [{
        id: Date.now(),
        message: `Solde ajouté: +${amount.toLocaleString()} Dhs via ${paymentMethodName}`,
        time: 'À l\'instant',
        type: 'success',
        title: 'Dépôt Réussi',
        details: `Votre solde a été augmenté de ${amount.toLocaleString()} Dhs via ${paymentMethodName}. Votre nouveau solde disponible est de ${(userBalance + amount).toLocaleString()} Dhs. Vous pouvez maintenant utiliser ces fonds pour de nouveaux investissements.`,
        astuce: '💡 Astuce: Gardez toujours une réserve d\'urgence équivalente à 3-6 mois de dépenses avant d\'investir.',
        isRead: false
      }, ...prev.slice(0, 2)]);
    } else if (balanceOperation === 'withdraw') {
      // Check if sufficient balance for withdrawal
      if (amount > userBalance) {
        // Add error notification
        setNotifications(prev => [{
          id: Date.now(),
          message: `Retrait échoué: Solde insuffisant`,
          time: 'À l\'instant',
          type: 'error',
          title: 'Retrait Échoué',
          details: `Impossible de retirer ${amount.toLocaleString()} Dhs. Votre solde actuel est de ${userBalance.toLocaleString()} Dhs. Veuillez ajuster le montant du retrait.`,
          astuce: '💡 Astuce: Vérifiez toujours votre solde disponible avant d\'effectuer un retrait.',
          isRead: false
        }, ...prev.slice(0, 2)]);
        return;
      }

      // Withdraw balance
      setUserBalance(prev => prev - amount);
      
      // Add notification for withdrawal
      setNotifications(prev => [{
        id: Date.now(),
        message: `Retrait effectué: -${amount.toLocaleString()} Dhs vers ${paymentMethodName}`,
        time: 'À l\'instant',
        type: 'info',
        title: 'Retrait Réussi',
        details: `Votre retrait de ${amount.toLocaleString()} Dhs vers ${paymentMethodName} a été traité avec succès. Votre nouveau solde disponible est de ${(userBalance - amount).toLocaleString()} Dhs. Les fonds seront transférés sous 1-3 jours ouvrables.`,
        astuce: '💡 Astuce: Les retraits peuvent prendre 1-3 jours ouvrables selon la méthode de paiement choisie.',
        isRead: false
      }, ...prev.slice(0, 2)]);
    }

    // Reset form and close modal
    setBalanceAmount('');
    setSelectedPaymentMethod('paypal');
    setShowBalanceModal(false);
  };

  // Handle profit operations (withdraw/reinvest)
  const handleProfitOperation = () => {
    const totalProfits = calculateTotalProfits();
    
    if (totalProfits <= 0) {
      // Add error notification
      setNotifications(prev => [{
        id: Date.now(),
        message: `Aucun profit disponible`,
        time: 'À l\'instant',
        type: 'warning',
        title: 'Aucun Profit Disponible',
        details: `Vous n'avez actuellement aucun profit à retirer. Vos investissements doivent générer des gains positifs avant de pouvoir retirer les profits.`,
        astuce: '💡 Astuce: Les profits sont calculés en temps réel. Attendez que vos investissements génèrent des rendements positifs.',
        isRead: false
      }, ...prev.slice(0, 2)]);
      return;
    }

    if (profitOperation === 'withdraw') {
      // Get payment method display name
      const paymentMethodNames = {
        'paypal': 'PayPal',
        'card': 'Visa/MasterCard',
        'usdt': 'USDT'
      };
      const paymentMethodName = paymentMethodNames[selectedPaymentMethod] || 'PayPal';

      // Withdraw profits to payment method
      setNotifications(prev => [{
        id: Date.now(),
        message: `Profits retirés: ${totalProfits.toLocaleString()} Dhs vers ${paymentMethodName}`,
        time: 'À l\'instant',
        type: 'success',
        title: 'Profits Retirés avec Succès',
        details: `Vos profits de ${totalProfits.toLocaleString()} Dhs ont été retirés vers ${paymentMethodName}. Les fonds seront transférés sous 1-3 jours ouvrables. Vos investissements continuent de fonctionner avec le capital initial.`,
        astuce: '💡 Astuce: Retirer régulièrement vos profits vous permet de sécuriser vos gains tout en gardant votre capital investi.',
        isRead: false
      }, ...prev.slice(0, 2)]);

      // Reset investments to original amounts (remove all profits)
      setInvestmentHistory(prevHistory => 
        prevHistory.map(inv => ({
          ...inv,
          currentValue: inv.amount, // Reset to original investment amount
          profit: 0, // Reset profit to zero
          return: '+0.0%' // Reset return percentage
        }))
      );

    } else if (profitOperation === 'reinvest') {
      // Add profits to balance for reinvestment
      setUserBalance(prev => prev + totalProfits);
      
      setNotifications(prev => [{
        id: Date.now(),
        message: `Profits réinvestis: +${totalProfits.toLocaleString()} Dhs ajoutés au solde`,
        time: 'À l\'instant',
        type: 'success',
        title: 'Profits Réinvestis',
        details: `Vos profits de ${totalProfits.toLocaleString()} Dhs ont été ajoutés à votre solde disponible. Vous pouvez maintenant utiliser ces fonds pour de nouveaux investissements et profiter de l'effet de capitalisation.`,
        astuce: '💡 Astuce: Réinvestir vos profits permet de profiter des intérêts composés et d\'accélérer la croissance de votre portefeuille.',
        isRead: false
      }, ...prev.slice(0, 2)]);
    }

    // Reset payment method and close modal
    setSelectedPaymentMethod('paypal');
    setShowProfitModal(false);
  };

  // Navigation handler
  const handleNavigation = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  // Portfolio statistics calculation
  const calculatePortfolioStats = (investments) => {
    if (!investments || investments.length === 0) {
      return {
        totalInvested: 0,
        globalPerformance: 0,
        dailyVariation: 0,
        monthlyGrowth: 0,
        portfolioBreakdown: [],
        products: []
      };
    }

    // Calculate total invested
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    
    // Group investments by product for breakdown
    const productGroups = {};
    const colors = ['#3CD4AB', '#89559F', '#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF'];
    
    investments.forEach((inv) => {
      if (!productGroups[inv.name]) {
        productGroups[inv.name] = {
          name: inv.name,
          totalInvested: 0,
          currentValue: 0,
          color: colors[Object.keys(productGroups).length % colors.length],
          investments: []
        };
      }
      
      // Simulate current value with some growth (2-8% random growth)
      const growthRate = 0.02 + Math.random() * 0.06; // 2-8% growth
      const currentValue = inv.amount * (1 + growthRate);
      
      productGroups[inv.name].totalInvested += inv.amount;
      productGroups[inv.name].currentValue += currentValue;
      productGroups[inv.name].investments.push({
        ...inv,
        currentValue
      });
    });

    // Create portfolio breakdown
    const portfolioBreakdown = Object.values(productGroups).map(group => ({
      name: group.name,
      value: group.totalInvested,
      color: group.color
    }));

    // Create products array
    const products = Object.values(productGroups).map(group => {
      const performance = ((group.currentValue - group.totalInvested) / group.totalInvested) * 100;
      return {
        name: group.name,
        currentValue: Math.round(group.currentValue),
        investedAmount: group.totalInvested,
        performance: Math.round(performance * 100) / 100,
        risk: Math.floor(Math.random() * 7) + 1, // Random risk 1-7
        category: group.name.split(' ')[0]
      };
    });

    // Calculate overall performance
    const totalCurrentValue = Object.values(productGroups).reduce((sum, group) => sum + group.currentValue, 0);
    const globalPerformance = totalInvested > 0 ? ((totalCurrentValue - totalInvested) / totalInvested) * 100 : 0;
    
    // Simulate daily and monthly variations
    const dailyVariation = (Math.random() - 0.5) * 2; // -1% to +1%
    const monthlyGrowth = globalPerformance * 0.3; // Approximate monthly from total

    return {
      totalInvested,
      globalPerformance: Math.round(globalPerformance * 100) / 100,
      dailyVariation: Math.round(dailyVariation * 100) / 100,
      monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
      portfolioBreakdown,
      products
    };
  };

  // Update portfolio data when investments change
  const updatePortfolioData = () => {
    const stats = calculatePortfolioStats(investmentHistory);
    setPortfolioData(prev => ({
      ...prev,
      ...stats,
      // Keep performance history for charts
      performanceHistory: prev.performanceHistory.map((entry, index) => ({
        ...entry,
        value: stats.totalInvested * (0.95 + index * 0.02), // Simulate growth over time
        benchmark: stats.totalInvested * (0.92 + index * 0.015)
      }))
    }));
  };

  // Calculate sector breakdown from real investments
  const calculateSectorBreakdown = () => {
    if (!investmentHistory || investmentHistory.length === 0) {
      return [];
    }

    // Map investment products to sectors
    const sectorMapping = {
      'OPCVM Actions Maroc': 'Finance',
      'Obligations d\'État': 'Finance', 
      'Fonds Euro Diversifié': 'Finance',
      'Actions Tech Global': 'Technologie',
      'Immobilier REIT': 'Immobilier',
      'Matières Premières': 'Matières Premières',
      'Actions': 'Finance',
      'Obligations': 'Finance',
      'Fonds Euro': 'Finance',
      'Livret A': 'Finance'
    };

    // Group investments by sector
    const sectorTotals = {};
    const totalInvestment = investmentHistory.reduce((sum, inv) => sum + inv.amount, 0);

    investmentHistory.forEach(investment => {
      const sector = sectorMapping[investment.name] || 'Autres';
      if (!sectorTotals[sector]) {
        sectorTotals[sector] = 0;
      }
      sectorTotals[sector] += investment.amount;
    });

    // Convert to array with percentages
    return Object.entries(sectorTotals).map(([sector, amount]) => ({
      sector,
      amount,
      percentage: Math.round((amount / totalInvestment) * 100)
    })).sort((a, b) => b.amount - a.amount); // Sort by amount descending
  };

  // Calculate enhanced investment history with returns
  const calculateInvestmentHistoryWithReturns = () => {
    return investmentHistory.map(investment => {
      // Use stored profit if available, otherwise calculate based on time
      if (investment.currentValue && investment.currentValue !== investment.amount) {
        // Use existing current value (already has profits calculated)
        const profit = investment.currentValue - investment.amount;
        const returnPercentage = (profit / investment.amount) * 100;
        
        return {
          ...investment,
          return: `${returnPercentage >= 0 ? '+' : ''}${returnPercentage.toFixed(1)}%`,
          currentValue: investment.currentValue,
          profit: profit
        };
      } else {
        // Calculate new profits based on time elapsed
        const daysSinceInvestment = Math.floor((new Date() - new Date(investment.date)) / (1000 * 60 * 60 * 24));
        const baseReturn = Math.max(0, (daysSinceInvestment / 365) * 0.08); // 8% annual base return
        
        // Add some randomness but make it consistent per investment
        const seed = investment.id || investment.amount; // Use ID or amount as seed
        const randomFactor = (seed % 100) / 1000; // 0-0.1 additional return
        const totalReturnRate = baseReturn + randomFactor;
        
        const currentValue = Math.round(investment.amount * (1 + totalReturnRate));
        const profit = currentValue - investment.amount;
        const returnPercentage = (profit / investment.amount) * 100;

        return {
          ...investment,
          return: `${returnPercentage >= 0 ? '+' : ''}${returnPercentage.toFixed(1)}%`,
          currentValue: currentValue,
          profit: profit
        };
      }
    });
  };

  // Calculate total profits available
  const calculateTotalProfits = () => {
    if (!investmentHistory || investmentHistory.length === 0) return 0;
    
    const enhancedHistory = calculateInvestmentHistoryWithReturns();
    const totalProfits = enhancedHistory.reduce((sum, inv) => {
      return sum + (inv.profit || 0);
    }, 0);
    
    return Math.max(0, totalProfits);
  };

  // Simulation handlers
  const handleSimulationFormChange = (field, value) => {
    setSimulationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateSimulationResult = (capital, duration, riskProfile) => {
    // Base return rates by risk profile
    const baseReturns = {
      'conservateur': 0.04, // 4% annual
      'modere': 0.07,       // 7% annual
      'dynamique': 0.10,    // 10% annual
      'agressif': 0.15      // 15% annual
    };

    // Duration multipliers
    const durationMonths = parseInt(duration);
    const years = durationMonths / 12;

    // Calculate compound return
    const baseReturn = baseReturns[riskProfile] || 0.04;
    const volatility = Math.random() * 0.02 - 0.01; // ±1% volatility
    const finalReturn = baseReturn + volatility;
    
    const finalValue = capital * Math.pow(1 + finalReturn, years);
    const totalReturn = ((finalValue - capital) / capital) * 100;

    return {
      finalValue: Math.round(finalValue),
      totalReturn: Math.round(totalReturn * 100) / 100,
      monthlyGrowth: Math.round((finalReturn / 12) * 100 * 100) / 100
    };
  };

  const handleCreateSimulation = () => {
    const capital = parseFloat(simulationForm.initialCapital);
    
    if (!capital || capital <= 0) {
      alert('Veuillez entrer un capital initial valide');
      return;
    }

    if (capital > userBalance) {
      alert('Capital insuffisant dans votre solde');
      return;
    }

    const result = calculateSimulationResult(
      capital,
      simulationForm.duration,
      simulationForm.riskProfile
    );

    const newSimulation = {
      id: Date.now(),
      name: `Simulation ${simulationForm.riskProfile.charAt(0).toUpperCase() + simulationForm.riskProfile.slice(1)}`,
      initialCapital: capital,
      currentValue: result.finalValue,
      performance: result.totalReturn,
      duration: simulationForm.duration === '6' ? '6 mois' : 
                simulationForm.duration === '12' ? '1 an' :
                simulationForm.duration === '24' ? '2 ans' : '5 ans',
      riskProfile: simulationForm.riskProfile.charAt(0).toUpperCase() + simulationForm.riskProfile.slice(1),
      createdAt: new Date().toLocaleDateString('fr-FR'),
      status: 'active'
    };

    setRecentSimulations(prev => [newSimulation, ...prev]);

    // Add success notification
    setNotifications(prev => [{
      id: Date.now(),
      message: `Simulation créée avec succès: ${result.totalReturn.toFixed(1)}% de rendement projeté`,
      time: 'À l\'instant',
      type: 'success',
      title: 'Simulation Créée',
      details: `Votre simulation avec un capital de ${capital.toLocaleString()} Dhs a été créée. Rendement projeté: ${result.totalReturn.toFixed(1)}% sur ${newSimulation.duration}.`,
      astuce: '💡 Astuce: Les simulations vous aident à comprendre les risques et rendements potentiels avant d\'investir réellement.',
      isRead: false
    }, ...prev.slice(0, 2)]);

    // Reset form
    setSimulationForm({
      initialCapital: '',
      duration: '6',
      riskProfile: 'conservateur'
    });
  };

  const getFilteredSimulations = () => {
    const now = new Date();
    const filterDate = new Date();

    switch (simulationDateFilter) {
      case 'today':
        filterDate.setHours(0, 0, 0, 0);
        return recentSimulations.filter(sim => new Date(sim.createdAt) >= filterDate);
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        return recentSimulations.filter(sim => new Date(sim.createdAt) >= filterDate);
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        return recentSimulations.filter(sim => new Date(sim.createdAt) >= filterDate);
      default:
        return recentSimulations;
    }
  };

  // Notification handlers
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setShowNotificationDetails(true);
    setShowNotifications(false);
  };

  const handleMarkAsRead = (notificationId) => {
    // Mark notification as read
    const updatedNotifications = notifications.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    );
    
    // Move read notification to history
    const readNotification = notifications.find(notif => notif.id === notificationId);
    if (readNotification && !readNotification.isRead) {
      setNotificationHistory(prev => [{
        ...readNotification,
        isRead: true,
        readAt: new Date().toLocaleString('fr-FR')
      }, ...prev]);
    }

    // Remove from active notifications
    setNotifications(updatedNotifications.filter(notif => notif.id !== notificationId));
    setShowNotificationDetails(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-4 h-4 text-[#3CD4AB]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-[#3CD4AB]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
          </svg>
        );
    }
  };

  // Investment handlers
  const handleInvestClick = (investment) => {
    setSelectedInvestment(investment);
    setInvestAmount('');
    setShowInvestPopup(true);
  };

  const handleInvestAmountChange = (e) => {
    const value = e.target.value;
    setInvestAmount(value);
  };

  const calculateRemainingBalance = () => {
    const amount = parseFloat(investAmount) || 0;
    return userBalance - amount;
  };

  const handleConfirmInvestment = () => {
    const amount = parseFloat(investAmount);
    
    if (!amount || amount <= 0) {
      alert('Veuillez entrer un montant valide');
      return;
    }

    if (amount < selectedInvestment.min) {
      alert(`Le montant minimum d'investissement est de ${selectedInvestment.min.toLocaleString()} Dhs`);
      return;
    }

    if (amount > userBalance) {
      alert('Solde insuffisant');
      return;
    }

    // Update balance
    setUserBalance(prev => prev - amount);

    // Add to investment history
    const newInvestment = {
      id: Date.now(),
      name: selectedInvestment.name,
      amount: amount,
      currentValue: amount, // Start with same value as investment
      profit: 0, // No profit initially
      date: new Date().toLocaleDateString('fr-FR'),
      return: '+0.0%' // Initial return
    };
    setInvestmentHistory(prev => [newInvestment, ...prev]);

    // Add success notification
    setNotifications(prev => [{
      id: Date.now(),
      message: `Investissement de ${amount.toLocaleString()} Dhs dans ${selectedInvestment.name} effectué avec succès`,
      time: 'À l\'instant',
      type: 'success',
      title: 'Investissement Réussi',
      details: `Votre investissement de ${amount.toLocaleString()} Dhs dans ${selectedInvestment.name} a été traité avec succès. Votre portefeuille a été mis à jour et vous pouvez suivre la performance de cet investissement dans la section Portefeuille.`,
      astuce: '💡 Astuce: Diversifiez vos investissements pour réduire les risques. N\'investissez jamais plus de 20% de votre capital dans un seul produit.',
      isRead: false
    }, ...prev.slice(0, 2)]);

    // Close popup
    setShowInvestPopup(false);
    setSelectedInvestment(null);
    setInvestAmount('');
  };

  // Simulation states
  const [simulationForm, setSimulationForm] = useState({
    initialCapital: '',
    duration: '6',
    riskProfile: 'conservateur'
  });
  const [recentSimulations, setRecentSimulations] = useState([]);
  const [simulationDateFilter, setSimulationDateFilter] = useState('all');

  // Update portfolio data when investment history changes
  useEffect(() => {
    updatePortfolioData();
  }, [investmentHistory]);

  // Simulate investment growth over time
  useEffect(() => {
    if (investmentHistory.length === 0) return;

    const interval = setInterval(() => {
      setInvestmentHistory(prevHistory => {
        return prevHistory.map(investment => {
          // Skip if already has significant profits to avoid exponential growth
          const currentProfit = investment.profit || 0;
          const profitRatio = currentProfit / investment.amount;
          
          if (profitRatio > 0.5) return investment; // Cap at 50% profit
          
          // Small random growth each interval (0.1% to 0.5%)
          const growthRate = (Math.random() * 0.004) + 0.001; // 0.1% to 0.5%
          const additionalProfit = investment.amount * growthRate;
          
          const newCurrentValue = (investment.currentValue || investment.amount) + additionalProfit;
          const newProfit = newCurrentValue - investment.amount;
          const returnPercentage = (newProfit / investment.amount) * 100;
          
          return {
            ...investment,
            currentValue: Math.round(newCurrentValue),
            profit: Math.round(newProfit),
            return: `${returnPercentage >= 0 ? '+' : ''}${returnPercentage.toFixed(1)}%`
          };
        });
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [investmentHistory.length]);

  return (
    <>
    <div className="bg-[#0F0F19] min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="bg-[#0F0F19] border-b border-white/10 px-4 py-2.5 fixed left-0 right-0 top-0 z-50">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex justify-start items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-white rounded cursor-pointer md:hidden hover:text-[#3CD4AB] hover:bg-white/10 focus:bg-white/10"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
              </svg>
            </button>
            <a href="/" className="flex items-center justify-between mr-4">
              {/* <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">Tawfir</span> */}
              <img src="../../../public/logo.svg" alt="logo" className="w-12 h-12" />
            </a>
          </div>
          <div className="flex items-center lg:order-2 space-x-4">
            {/* Balance Display */}
            <div className="flex items-center bg-white/10 rounded-lg px-4 py-2 border border-white/20">
              <svg className="w-5 h-5 text-[#3CD4AB] mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
              </svg>
              <span className="text-white font-semibold">{userBalance.toLocaleString()} Dhs</span>
            </div>
            
            {/* Balance Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setBalanceOperation('add');
                  setShowBalanceModal(true);
                }}
                className="bg-[#3CD4AB] hover:bg-[#3CD4AB]/80 text-[#0F0F19] font-medium rounded-lg px-4 py-2 transition-colors duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Ajouter
              </button>
              
              <button
                onClick={() => {
                  setBalanceOperation('withdraw');
                  setShowBalanceModal(true);
                }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-lg px-4 py-2 transition-colors duration-200 flex items-center"
                disabled={userBalance <= 0}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4m16 0l-4-4m4 4l-4 4" />
                </svg>
                Retirer
              </button>
            </div>

            <button
              type="button"
              className="mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300"
              id="user-menu-button"
            >
              <span className="sr-only">Open user menu</span>
              <img className="w-8 h-8 rounded-full" src="/public/assets/avatars/mediumavatar.jpg" alt="user photo" />
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-white hover:bg-white/10 hover:text-[#3CD4AB] focus:ring-4 focus:ring-[#3CD4AB]/20 rounded-lg text-sm p-2.5 inline-flex items-center relative"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                </svg>
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#3CD4AB] text-[#0F0F19] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[#0F0F19] border border-white/20 rounded-lg shadow-lg z-50" ref={notificationRef}>
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-white font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className="p-4 border-b border-white/10 hover:bg-white/5 cursor-pointer transition-colors duration-200"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-[#3CD4AB]/20 rounded-full flex items-center justify-center">
                                {getNotificationIcon(notification.type)}
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white">{notification.message}</p>
                              <p className="text-sm text-white/60">{notification.time}</p>
                              <p className="text-xs text-[#3CD4AB] mt-1">Cliquer pour plus de détails</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-white/60">
                        Aucune notification
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-white/10">
                    <button
                      onClick={() => {
                        setNotifications([]);
                        setShowNotifications(false);
                      }}
                      className="w-full text-sm text-[#3CD4AB] hover:text-[#3CD4AB]/80"
                    >
                      Effacer toutes les notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-[#0F0F19] border-r border-white/10 md:translate-x-0`}>
        <div className="h-full px-3 pb-4 overflow-y-auto bg-[#0F0F19]">
          <ul className="space-y-2 pt-4">
            <li>
              <button 
                onClick={() => handleNavigation('dashboard')}
                className={`flex items-center w-full p-2 text-base font-normal rounded-lg transition-colors duration-200 ${
                  currentPage === 'dashboard' 
                    ? 'bg-[#3CD4AB] text-[#0F0F19]' 
                    : 'text-white hover:bg-white/10 hover:text-[#3CD4AB]'
                }`}
              >
                <svg className="w-6 h-6 transition duration-75" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                </svg>
                <span className="ml-3">Dashboard</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('portfolio')}
                className={`flex items-center w-full p-2 text-base font-normal rounded-lg transition-colors duration-200 ${
                  currentPage === 'portfolio' 
                    ? 'bg-[#3CD4AB] text-[#0F0F19]' 
                    : 'text-white hover:bg-white/10 hover:text-[#3CD4AB]'
                }`}
              >
                <svg className="flex-shrink-0 w-6 h-6 transition duration-75" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"></path>
                </svg>
                <span className="ml-3">Portefeuille</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('investments')}
                className={`flex items-center w-full p-2 text-base font-normal rounded-lg transition-colors duration-200 ${
                  currentPage === 'investments' 
                    ? 'bg-[#3CD4AB] text-[#0F0F19]' 
                    : 'text-white hover:bg-white/10 hover:text-[#3CD4AB]'
                }`}
              >
                <svg className="flex-shrink-0 w-6 h-6 transition duration-75" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-.89l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-3">Investissements</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('simulations')}
                className={`flex items-center w-full p-2 text-base font-normal rounded-lg transition-colors duration-200 ${
                  currentPage === 'simulations' 
                    ? 'bg-[#3CD4AB] text-[#0F0F19]' 
                    : 'text-white hover:bg-white/10 hover:text-[#3CD4AB]'
                }`}
              >
                <svg className="flex-shrink-0 w-6 h-6 transition duration-75" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
                  <path d="M3 5a2 2 0 012-2h1V1a1 1 0 112 0v1h1a2 2 0 012 2v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM3 11a2 2 0 012-2h10a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4z"></path>
                </svg>
                <span className="ml-3">Simulations</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('news')}
                className={`flex items-center w-full p-2 text-base font-normal rounded-lg transition-colors duration-200 ${
                  currentPage === 'news' 
                    ? 'bg-[#3CD4AB] text-[#0F0F19]' 
                    : 'text-white hover:bg-white/10 hover:text-[#3CD4AB]'
                }`}
              >
                <svg className="flex-shrink-0 w-6 h-6 transition duration-75" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-3">Actualités</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="p-4 md:ml-64 pt-20">
        <div className="p-4 bg-[#0F0F19] border border-white/10 rounded-lg shadow-sm sm:p-6">
          {/* Render different pages based on currentPage */}
          {currentPage === 'dashboard' && (
            <div>
      {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-white/60">Vue d'ensemble de vos investissements</p>
          {userRiskProfile && (
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#3CD4AB]/20 text-[#3CD4AB] border border-[#3CD4AB]/30">
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                Profil de risque: {userRiskProfile}
            </div>
          )}
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
              <div className="flex items-center">
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-[#3CD4AB] bg-[#3CD4AB]/20 rounded-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/60">Total Investi</p>
                  <p className="text-2xl font-bold text-white">{portfolioData.totalInvested.toLocaleString()} Dhs</p>
        </div>
      </div>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
              <div className="flex items-center">
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-[#3CD4AB] bg-[#3CD4AB]/20 rounded-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/60">Performance Globale</p>
                  <p className={`text-2xl font-bold ${portfolioData.globalPerformance >= 0 ? 'text-[#3CD4AB]' : 'text-red-400'}`}>
                    {portfolioData.globalPerformance >= 0 ? '+' : ''}{portfolioData.globalPerformance}%
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
              <div className="flex items-center">
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-[#3CD4AB] bg-[#3CD4AB]/20 rounded-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/60">Variation Journalière</p>
                  <p className={`text-2xl font-bold ${portfolioData.dailyVariation >= 0 ? 'text-[#3CD4AB]' : 'text-red-400'}`}>
                    {portfolioData.dailyVariation >= 0 ? '+' : ''}{portfolioData.dailyVariation}%
                  </p>
            </div>
          </div>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
              <div className="flex items-center">
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-[#3CD4AB] bg-[#3CD4AB]/20 rounded-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/60">Croissance Mensuelle</p>
                  <p className={`text-2xl font-bold ${portfolioData.monthlyGrowth >= 0 ? 'text-[#3CD4AB]' : 'text-red-400'}`}>
                    {portfolioData.monthlyGrowth >= 0 ? '+' : ''}{portfolioData.monthlyGrowth}%
                  </p>
                </div>
            </div>
            </div>
          </div>

          {/* Profits Management Section */}
          <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="inline-flex items-center justify-center flex-shrink-0 w-10 h-10 text-[#3CD4AB] bg-[#3CD4AB]/20 rounded-lg mr-4">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Profits Disponibles</h3>
                  <p className="text-3xl font-bold text-[#3CD4AB] mt-1">
                    {calculateTotalProfits().toLocaleString()} Dhs
                  </p>
                  <p className="text-white/60 text-sm mt-1">
                    Gains générés par vos investissements
                  </p>
                </div>
              </div>
              
              {calculateTotalProfits() > 0 && (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setProfitOperation('withdraw');
                      setShowProfitModal(true);
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg px-4 py-2 transition-colors duration-200 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Retirer
                  </button>
                  
                  <button
                    onClick={() => {
                      setProfitOperation('reinvest');
                      setShowProfitModal(true);
                    }}
                    className="bg-[#3CD4AB] hover:bg-[#3CD4AB]/80 text-[#0F0F19] font-medium rounded-lg px-4 py-2 transition-colors duration-200 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Réinvestir
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Performance Chart */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-white">Évolution de la Performance</h5>
                <button 
                  onClick={() => handleNavigation('portfolio')}
                  className="text-sm font-medium text-[#3CD4AB] hover:underline"
                >
                  Voir tout
                </button>
            </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={portfolioData.performanceHistory} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="date" stroke="#ffffff80" />
                    <YAxis stroke="#ffffff80" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0F0F19', 
                        border: '1px solid #ffffff20', 
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                    />
                    <Bar dataKey="value" fill="#3CD4AB" name="Portefeuille" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="benchmark" fill="#89559F" name="Benchmark" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
          </div>
        </div>

            {/* Portfolio Breakdown */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-white">Répartition du Portefeuille</h5>
                <button 
                  onClick={() => handleNavigation('portfolio')}
                  className="text-sm font-medium text-[#3CD4AB] hover:underline"
                >
                  Voir tout
                </button>
        </div>
              <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={portfolioData.portfolioBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {portfolioData.portfolioBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              {portfolioData.portfolioBreakdown.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {portfolioData.portfolioBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium text-white">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold text-[#3CD4AB]">
                        {((item.value / portfolioData.totalInvested) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-white/60 py-8 mt-4">
                  <svg className="w-12 h-12 mx-auto mb-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  <p>Aucun investissement pour le moment</p>
                  <p className="text-sm mt-1">Commencez par investir dans la section Investissements</p>
                </div>
              )}
              </div>
              </div>

          {/* Products Table */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-xl font-bold leading-none text-white">Produits d'Investissement</h5>
              <button 
                onClick={() => handleNavigation('investments')}
                className="text-sm font-medium text-[#3CD4AB] hover:underline"
              >
                Voir tout
              </button>
            </div>
            <div className="relative overflow-x-auto">
              {portfolioData.products.length > 0 ? (
                <table className="w-full text-sm text-left text-white/60">
                  <thead className="text-xs text-white/80 uppercase bg-white/5">
                    <tr>
                      <th scope="col" className="px-6 py-3">Produit</th>
                      <th scope="col" className="px-6 py-3">Valeur Actuelle</th>
                      <th scope="col" className="px-6 py-3">Montant Investi</th>
                      <th scope="col" className="px-6 py-3">Performance</th>
                      <th scope="col" className="px-6 py-3">Risque</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioData.products.map((product, index) => (
                      <tr key={index} className="bg-white/5 border-b border-white/10 hover:bg-white/10">
                        <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 text-[#3CD4AB]">
                          {product.currentValue.toLocaleString()} Dhs
                        </td>
                        <td className="px-6 py-4 text-white/60">
                          {product.investedAmount.toLocaleString()} Dhs
                        </td>
                        <td className={`px-6 py-4 font-medium ${
                          product.performance >= 0 ? 'text-[#3CD4AB]' : 'text-red-400'
                        }`}>
                          {product.performance >= 0 ? '+' : ''}{product.performance}%
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-16 bg-white/20 rounded-full h-2 mr-2">
                              <div 
                                className="bg-[#3CD4AB] h-2 rounded-full"
                                style={{ width: `${(product.risk / 7) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-white/60">{product.risk}/7</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-white/60 py-12">
                  <svg className="w-16 h-16 mx-auto mb-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                  </svg>
                  <h3 className="text-lg font-medium text-white mb-2">Aucun produit d'investissement</h3>
                  <p className="text-sm">Vos investissements apparaîtront ici une fois que vous aurez commencé à investir.</p>
                  <button 
                    onClick={() => handleNavigation('investments')}
                    className="mt-4 bg-[#3CD4AB] hover:bg-[#3CD4AB]/80 text-[#0F0F19] font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Découvrir les investissements
                  </button>
                </div>
              )}
            </div>
          </div>


            </div>
          )}

          {/* Portfolio Page */}
          {currentPage === 'portfolio' && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Portefeuille</h1>
                <p className="text-white/60">Gestion détaillée de votre portefeuille d'investissement</p>
              </div>

              {/* Portfolio Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
                  <div className="flex items-center">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-[#3CD4AB] bg-[#3CD4AB]/20 rounded-lg">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-white/60">Valeur Totale</p>
                      <p className="text-2xl font-bold text-white">
                        {calculateInvestmentHistoryWithReturns().reduce((sum, inv) => sum + inv.currentValue, 0).toLocaleString()} Dhs
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
                  <div className="flex items-center">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-[#3CD4AB] bg-[#3CD4AB]/20 rounded-lg">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-white/60">Gain/Perte Total</p>
                      <p className={`text-2xl font-bold ${portfolioData.globalPerformance >= 0 ? 'text-[#3CD4AB]' : 'text-red-400'}`}>
                        {portfolioData.globalPerformance >= 0 ? '+' : ''}{(calculateInvestmentHistoryWithReturns().reduce((sum, inv) => sum + inv.currentValue, 0) - portfolioData.totalInvested).toLocaleString()} Dhs
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
                  <div className="flex items-center">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-[#3CD4AB] bg-[#3CD4AB]/20 rounded-lg">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-white/60">Nombre d'Investissements</p>
                      <p className="text-2xl font-bold text-white">{investmentHistory.length}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
                  <div className="flex items-center">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-[#3CD4AB] bg-[#3CD4AB]/20 rounded-lg">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-white/60">Secteurs Diversifiés</p>
                      <p className="text-2xl font-bold text-white">{calculateSectorBreakdown().length}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-6 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-4">Répartition par Secteur</h3>
                  <div className="space-y-4">
                    {calculateSectorBreakdown().length > 0 ? (
                      calculateSectorBreakdown().map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <div>
                            <span className="text-white font-medium">{item.sector}</span>
                            <div className="w-32 bg-white/20 rounded-full h-2 mt-1">
                              <div 
                                className="bg-[#3CD4AB] h-2 rounded-full"
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[#3CD4AB] font-semibold">{item.percentage}%</div>
                            <div className="text-white/60 text-sm">{item.amount.toLocaleString()} Dhs</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-white/60 py-8">
                        <svg className="w-12 h-12 mx-auto mb-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                        <p>Aucune répartition sectorielle</p>
                        <p className="text-sm mt-1">Investissez dans différents secteurs pour voir la répartition</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-4">Historique d'Investissements</h3>
                  <div className="space-y-4">
                    {calculateInvestmentHistoryWithReturns().map((investment) => (
                      <div key={investment.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <div>
                          <div className="flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full mr-2 bg-[#3CD4AB]"></span>
                            <span className="text-white font-medium">{investment.name}</span>
                          </div>
                          <div className="text-white/60 text-sm">{investment.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">{investment.amount.toLocaleString()} Dhs</div>
                          <div className="flex items-center justify-end space-x-2">
                            <div className={`text-sm font-medium ${
                              investment.return.startsWith('+') ? 'text-[#3CD4AB]' : 'text-red-400'
                            }`}>
                              {investment.return}
                            </div>
                            <div className="text-white/60 text-xs">
                              ({investment.currentValue.toLocaleString()} Dhs)
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {investmentHistory.length === 0 && (
                      <div className="text-center text-white/60 py-4">
                        Aucun investissement pour le moment
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notification History Section */}
              <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-4">Historique des Notifications</h3>
                <div className="space-y-4">
                  {notificationHistory.length > 0 ? (
                    notificationHistory.map((notification) => (
                      <div key={notification.id} className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-[#3CD4AB]/20 rounded-full flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm">{notification.title}</h4>
                          <p className="text-white/60 text-sm mt-1">{notification.message}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-white/40 text-xs">Lu le {notification.readAt}</span>
                            <span className="text-[#3CD4AB] text-xs">✓ Lu</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-white/60 py-8">
                      <svg className="w-12 h-12 mx-auto mb-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-5 5v-5zM12 19l-7-7 3-3 7 7-3 3z"></path>
                      </svg>
                      <p>Aucune notification lue pour le moment</p>
                      <p className="text-sm mt-1">Les notifications que vous marquez comme lues apparaîtront ici</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Investments Page */}
          {currentPage === 'investments' && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Investissements</h1>
                <p className="text-white/60">Découvrez les opportunités d'investissement disponibles</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'OPCVM Actions Maroc', risk: 6, return: '8.5%', min: 1000, description: 'Fonds diversifié sur le marché marocain', image: '/public/assets/marketstock.png' },
                  { name: 'Obligations d\'État', risk: 2, return: '4.2%', min: 500, description: 'Investissement sécurisé à revenu fixe', image: '/public/assets/savingaccount.jpg' },
                  { name: 'Fonds Euro Diversifié', risk: 4, return: '6.1%', min: 2000, description: 'Exposition aux marchés européens', image: '/public/assets/OPCVM.jpg' },
                  { name: 'Actions Tech Global', risk: 8, return: '12.3%', min: 5000, description: 'Secteur technologique international', image: '/public/assets/stock.png' },
                  { name: 'Immobilier REIT', risk: 5, return: '7.8%', min: 3000, description: 'Investissement immobilier diversifié', image: '/public/assets/managed.jpg' },
                  { name: 'Matières Premières', risk: 7, return: '9.2%', min: 2500, description: 'Exposition aux commodités', image: '/public/assets/deposit.svg' }
                ].map((investment, index) => (
                  <div key={index} className="p-6 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm hover:bg-white/10 transition-colors duration-200">
                    <div className="mb-4">
                      <img 
                        src={investment.image} 
                        alt={investment.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-white">{investment.name}</h3>
                        <div className="text-[#3CD4AB] font-semibold text-xl">{investment.return}</div>
                      </div>
                    </div>
                    <p className="text-white/60 text-sm mb-4">{investment.description}</p>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/60">Risque</span>
                        <div className="flex items-center">
                          <div className="w-16 bg-white/20 rounded-full h-2 mr-2">
                            <div 
                              className="bg-[#3CD4AB] h-2 rounded-full"
                              style={{ width: `${(investment.risk / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-white text-sm">{investment.risk}/10</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Investissement min.</span>
                        <span className="text-white">{investment.min.toLocaleString()} Dhs</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleInvestClick(investment)}
                      className="w-full mt-4 bg-[#3CD4AB] hover:bg-[#3CD4AB]/80 text-[#0F0F19] font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Investir
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Simulations Page */}
          {currentPage === 'simulations' && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Simulations</h1>
                <p className="text-white/60">Testez vos stratégies d'investissement sans risque</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="p-6 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-6">Créer une Simulation</h3>
                  <div className="space-y-4">
                    {/* Balance Info */}
                    <div className="p-3 bg-[#3CD4AB]/10 border border-[#3CD4AB]/20 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80 text-sm">Solde disponible:</span>
                        <span className="text-[#3CD4AB] font-semibold">{userBalance.toLocaleString()} Dhs</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Capital Initial (Dhs)</label>
                      <input 
                        type="number" 
                        value={simulationForm.initialCapital}
                        onChange={(e) => handleSimulationFormChange('initialCapital', e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:border-[#3CD4AB] focus:outline-none"
                        placeholder="10000"
                        max={userBalance}
                      />
                      {simulationForm.initialCapital && parseFloat(simulationForm.initialCapital) > userBalance && (
                        <p className="text-red-400 text-sm mt-1">Capital supérieur au solde disponible</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Durée</label>
                      <select 
                        value={simulationForm.duration}
                        onChange={(e) => handleSimulationFormChange('duration', e.target.value)}
                        className="w-full bg-[#0F0F19] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#3CD4AB] focus:outline-none"
                        style={{ 
                          backgroundColor: '#0F0F19',
                          color: 'white'
                        }}
                      >
                        <option value="6" style={{ backgroundColor: '#0F0F19', color: 'white' }}>6 mois</option>
                        <option value="12" style={{ backgroundColor: '#0F0F19', color: 'white' }}>1 an</option>
                        <option value="24" style={{ backgroundColor: '#0F0F19', color: 'white' }}>2 ans</option>
                        <option value="60" style={{ backgroundColor: '#0F0F19', color: 'white' }}>5 ans</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Profil de Risque</label>
                      <select 
                        value={simulationForm.riskProfile}
                        onChange={(e) => handleSimulationFormChange('riskProfile', e.target.value)}
                        className="w-full bg-[#0F0F19] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#3CD4AB] focus:outline-none"
                        style={{ 
                          backgroundColor: '#0F0F19',
                          color: 'white'
                        }}
                      >
                        <option value="conservateur" style={{ backgroundColor: '#0F0F19', color: 'white' }}>Conservateur (4% annuel)</option>
                        <option value="modere" style={{ backgroundColor: '#0F0F19', color: 'white' }}>Modéré (7% annuel)</option>
                        <option value="dynamique" style={{ backgroundColor: '#0F0F19', color: 'white' }}>Dynamique (10% annuel)</option>
                        <option value="agressif" style={{ backgroundColor: '#0F0F19', color: 'white' }}>Agressif (15% annuel)</option>
                      </select>
                    </div>
                    <button 
                      onClick={handleCreateSimulation}
                      disabled={!simulationForm.initialCapital || parseFloat(simulationForm.initialCapital) <= 0 || parseFloat(simulationForm.initialCapital) > userBalance}
                      className="w-full bg-[#3CD4AB] hover:bg-[#3CD4AB]/80 text-[#0F0F19] font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Lancer la Simulation
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-6">Simulations Actives</h3>
                  <div className="space-y-4">
                    {recentSimulations.filter(sim => sim.status === 'active').slice(0, 3).map((sim) => (
                      <div key={sim.id} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-medium">{sim.name}</h4>
                          <span className={`font-semibold ${sim.performance >= 0 ? 'text-[#3CD4AB]' : 'text-red-400'}`}>
                            {sim.performance >= 0 ? '+' : ''}{sim.performance}%
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-white/60">Capital initial</span>
                            <div className="text-white">{sim.initialCapital.toLocaleString()} Dhs</div>
                          </div>
                          <div>
                            <span className="text-white/60">Valeur actuelle</span>
                            <div className="text-[#3CD4AB]">{sim.currentValue.toLocaleString()} Dhs</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="text-xs text-white/60">Durée: {sim.duration}</div>
                          <div className="text-xs text-white/60">Créé le {sim.createdAt}</div>
                        </div>
                      </div>
                    ))}
                    {recentSimulations.filter(sim => sim.status === 'active').length === 0 && (
                      <div className="text-center text-white/60 py-4">
                        Aucune simulation active
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Simulations Section */}
              <div className="p-6 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Simulations Récentes</h3>
                  <div className="flex items-center space-x-2">
                    <label className="text-white/60 text-sm">Filtrer par:</label>
                    <select 
                      value={simulationDateFilter}
                      onChange={(e) => setSimulationDateFilter(e.target.value)}
                      className="bg-[#0F0F19] border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:border-[#3CD4AB] focus:outline-none"
                      style={{ 
                        backgroundColor: '#0F0F19',
                        color: 'white'
                      }}
                    >
                      <option value="all" style={{ backgroundColor: '#0F0F19', color: 'white' }}>Toutes</option>
                      <option value="today" style={{ backgroundColor: '#0F0F19', color: 'white' }}>Aujourd'hui</option>
                      <option value="week" style={{ backgroundColor: '#0F0F19', color: 'white' }}>Cette semaine</option>
                      <option value="month" style={{ backgroundColor: '#0F0F19', color: 'white' }}>Ce mois</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredSimulations().map((simulation) => (
                    <div key={simulation.id} className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors duration-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-white font-medium">{simulation.name}</h4>
                          <p className="text-white/60 text-sm">{simulation.riskProfile}</p>
                        </div>
                        <div className="text-right">
                          <span className={`font-semibold text-lg ${simulation.performance >= 0 ? 'text-[#3CD4AB]' : 'text-red-400'}`}>
                            {simulation.performance >= 0 ? '+' : ''}{simulation.performance}%
                          </span>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            simulation.status === 'active' ? 'bg-[#3CD4AB]/20 text-[#3CD4AB]' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {simulation.status === 'active' ? 'Actif' : 'Terminé'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/60">Capital initial:</span>
                          <span className="text-white">{simulation.initialCapital.toLocaleString()} Dhs</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Valeur actuelle:</span>
                          <span className="text-[#3CD4AB]">{simulation.currentValue.toLocaleString()} Dhs</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Durée:</span>
                          <span className="text-white">{simulation.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Créé le:</span>
                          <span className="text-white">{simulation.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {getFilteredSimulations().length === 0 && (
                    <div className="col-span-full text-center text-white/60 py-8">
                      <svg className="w-12 h-12 mx-auto mb-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                      <p>Aucune simulation trouvée pour cette période</p>
                      <p className="text-sm mt-1">Créez une nouvelle simulation pour commencer</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* News Page */}
          {currentPage === 'news' && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Actualités</h1>
                <p className="text-white/60">Restez informé des dernières nouvelles financières</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {[
                    {
                      title: 'Marché boursier marocain : Une semaine de hausse continue',
                      summary: 'L\'indice MASI affiche une progression de 2.8% cette semaine, porté par les valeurs bancaires et les télécommunications.',
                      category: 'Marché Local',
                      time: '2h',
                      image: '/public/assets/marketstock.png'
                    },
                    {
                      title: 'Nouveau fonds ESG lancé par Tawfir Asset Management',
                      summary: 'Un fonds d\'investissement responsable axé sur les critères environnementaux, sociaux et de gouvernance.',
                      category: 'Produits',
                      time: '4h',
                      image: '/public/assets/OPCVM.jpg'
                    },
                    {
                      title: 'Réglementation : Nouvelles règles pour les investisseurs retail',
                      summary: 'Bank Al-Maghrib annonce de nouvelles mesures de protection pour les investisseurs particuliers.',
                      category: 'Réglementation',
                      time: '6h',
                      image: '/public/assets/saving.svg'
                    },
                    {
                      title: 'Analyse : Les secteurs porteurs pour 2024',
                      summary: 'Focus sur les opportunités d\'investissement dans la technologie, l\'énergie renouvelable et la santé.',
                      category: 'Analyse',
                      time: '1j',
                      image: '/public/assets/products.svg'
                    }
                  ].map((article, index) => (
                    <div key={index} className="p-6 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm hover:bg-white/10 transition-colors duration-200">
                      <div className="flex gap-4">
                        <img src={article.image} alt={article.title} className="w-24 h-24 object-cover rounded-lg" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="inline-block bg-[#3CD4AB]/20 text-[#3CD4AB] px-2 py-1 rounded text-xs font-medium">
                              {article.category}
                            </span>
                            <span className="text-white/60 text-sm">{article.time}</span>
                          </div>
                          <h3 className="text-white font-semibold text-lg mb-2">{article.title}</h3>
                          <p className="text-white/60 text-sm">{article.summary}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-4">Indices du Jour</h3>
                    <div className="space-y-4">
                      {[
                        { name: 'MASI', value: '12,845.32', change: '+2.1%', positive: true },
                        { name: 'MADEX', value: '10,234.67', change: '+1.8%', positive: true },
                        { name: 'S&P 500', value: '4,567.89', change: '-0.3%', positive: false },
                        { name: 'CAC 40', value: '7,123.45', change: '+0.7%', positive: true }
                      ].map((index, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white font-medium">{index.name}</span>
                          <div className="text-right">
                            <div className="text-white">{index.value}</div>
                            <div className={`text-sm font-semibold ${
                              index.positive ? 'text-[#3CD4AB]' : 'text-red-400'
                            }`}>
                              {index.change}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-4">Alertes Personnalisées</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-[#3CD4AB]/20 border border-[#3CD4AB]/30 rounded-lg">
                        <div className="text-[#3CD4AB] font-medium text-sm">Objectif Atteint</div>
                        <div className="text-white text-sm">AAPL a atteint votre prix cible de 180$</div>
                      </div>
                      <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                        <div className="text-yellow-400 font-medium text-sm">Volatilité Élevée</div>
                        <div className="text-white text-sm">TSLA affiche une volatilité inhabituelle</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Balance Modal */}
          {showBalanceModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-[#0F0F19] border border-white/20 rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">
                    {balanceOperation === 'add' ? 'Ajouter du Solde' : 'Retirer du Solde'}
                  </h3>
                  <button
                    onClick={() => setShowBalanceModal(false)}
                    className="text-white/60 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      {balanceOperation === 'add' ? 'Montant à ajouter (Dhs)' : 'Montant à retirer (Dhs)'}
                    </label>
                    <input
                      type="number"
                      value={balanceAmount}
                      onChange={(e) => setBalanceAmount(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:border-[#3CD4AB] focus:outline-none"
                      placeholder="1000"
                      min="1"
                      max={balanceOperation === 'withdraw' ? userBalance : undefined}
                    />
                    {balanceOperation === 'withdraw' && (
                      <p className="text-white/60 text-sm mt-1">
                        Solde disponible: {userBalance.toLocaleString()} Dhs
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-3">Méthode de Paiement</label>
                    <div className="grid grid-cols-1 gap-3">
                      {/* PayPal */}
                      <div 
                        onClick={() => setSelectedPaymentMethod('paypal')}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedPaymentMethod === 'paypal' 
                            ? 'border-[#3CD4AB] bg-[#3CD4AB]/10' 
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            selectedPaymentMethod === 'paypal' ? 'border-[#3CD4AB] bg-[#3CD4AB]' : 'border-white/40'
                          }`}>
                            {selectedPaymentMethod === 'paypal' && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                          <div className="flex items-center">
                            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="#0070ba">
                              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a.696.696 0 0 1-.045-.288c.078-.815-.191-1.35-.821-1.85-.619-.49-1.555-.73-2.786-.73H8.618l-.9 5.712h2.712c2.508 0 4.416-.816 5.195-3.844z"/>
                            </svg>
                            <span className="text-white font-medium">PayPal</span>
                          </div>
                        </div>
                      </div>

                      {/* Visa/MasterCard */}
                      <div 
                        onClick={() => setSelectedPaymentMethod('card')}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedPaymentMethod === 'card' 
                            ? 'border-[#3CD4AB] bg-[#3CD4AB]/10' 
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            selectedPaymentMethod === 'card' ? 'border-[#3CD4AB] bg-[#3CD4AB]' : 'border-white/40'
                          }`}>
                            {selectedPaymentMethod === 'card' && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                          <div className="flex items-center">
                            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="#1a1f71">
                              <path d="M15.245 17.831h-6.49l-1.716-6.277c-.108-.394-.455-.394-.602-.394H2.881c-.147 0-.295.147-.295.295v.443c0 .147.147.295.295.295h3.114l2.466 9.095c.049.147.196.295.344.295h7.636c.147 0 .295-.147.295-.295v-.443c0-.196-.147-.295-.295-.295h-7.341l-.344-1.324h6.539c.147 0 .295-.147.295-.295v-.443c.049-.147-.098-.295-.245-.295z"/>
                            </svg>
                            <span className="text-white font-medium">Visa / MasterCard</span>
                          </div>
                        </div>
                      </div>

                      {/* USDT */}
                      <div 
                        onClick={() => setSelectedPaymentMethod('usdt')}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedPaymentMethod === 'usdt' 
                            ? 'border-[#3CD4AB] bg-[#3CD4AB]/10' 
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            selectedPaymentMethod === 'usdt' ? 'border-[#3CD4AB] bg-[#3CD4AB]' : 'border-white/40'
                          }`}>
                            {selectedPaymentMethod === 'usdt' && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                          <div className="flex items-center">
                            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="#26a17b">
                              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.94 9.435c-.011-.009-1.482-.827-4.464-.827-2.982 0-4.453.818-4.464.827L8.999 8.46c.021-.016 2.015-1.112 4.521-1.112s4.5 1.096 4.521 1.112l-.101.975zm-.484 1.634v1.78c0 .827-.675 1.502-1.502 1.502h-8.908c-.827 0-1.502-.675-1.502-1.502v-1.78c0-.827.675-1.502 1.502-1.502h8.908c.827 0 1.502.675 1.502 1.502z"/>
                            </svg>
                            <span className="text-white font-medium">USDT (Crypto)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowBalanceModal(false)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleBalanceOperation}
                      className={`flex-1 font-medium py-3 px-4 rounded-lg transition-colors duration-200 ${
                        balanceOperation === 'add' 
                          ? 'bg-[#3CD4AB] hover:bg-[#3CD4AB]/80 text-[#0F0F19]'
                          : 'bg-orange-500 hover:bg-orange-600 text-white'
                      }`}
                      disabled={
                        !balanceAmount || 
                        parseFloat(balanceAmount) <= 0 || 
                        (balanceOperation === 'withdraw' && parseFloat(balanceAmount) > userBalance)
                      }
                    >
                      {balanceOperation === 'add' ? 'Ajouter' : 'Retirer'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profit Management Modal */}
          {showProfitModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-[#0F0F19] border border-white/20 rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">
                    {profitOperation === 'withdraw' ? 'Retirer les Profits' : 'Réinvestir les Profits'}
                  </h3>
                  <button
                    onClick={() => setShowProfitModal(false)}
                    className="text-white/60 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-[#3CD4AB]/10 border border-[#3CD4AB]/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Profits disponibles:</span>
                      <span className="text-2xl font-bold text-[#3CD4AB]">
                        {calculateTotalProfits().toLocaleString()} Dhs
                      </span>
                    </div>
                  </div>

                  {profitOperation === 'withdraw' && (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-3">Méthode de Retrait</label>
                      <div className="grid grid-cols-1 gap-3">
                        {/* PayPal */}
                        <div 
                          onClick={() => setSelectedPaymentMethod('paypal')}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedPaymentMethod === 'paypal' 
                              ? 'border-[#3CD4AB] bg-[#3CD4AB]/10' 
                              : 'border-white/20 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                              selectedPaymentMethod === 'paypal' ? 'border-[#3CD4AB] bg-[#3CD4AB]' : 'border-white/40'
                            }`}>
                              {selectedPaymentMethod === 'paypal' && (
                                <div className="w-full h-full rounded-full bg-white scale-50"></div>
                              )}
                            </div>
                            <div className="flex items-center">
                              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="#0070ba">
                                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a.696.696 0 0 1-.045-.288c.078-.815-.191-1.35-.821-1.85-.619-.49-1.555-.73-2.786-.73H8.618l-.9 5.712h2.712c2.508 0 4.416-.816 5.195-3.844z"/>
                              </svg>
                              <span className="text-white font-medium">PayPal</span>
                            </div>
                          </div>
                        </div>

                        {/* Visa/MasterCard */}
                        <div 
                          onClick={() => setSelectedPaymentMethod('card')}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedPaymentMethod === 'card' 
                              ? 'border-[#3CD4AB] bg-[#3CD4AB]/10' 
                              : 'border-white/20 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                              selectedPaymentMethod === 'card' ? 'border-[#3CD4AB] bg-[#3CD4AB]' : 'border-white/40'
                            }`}>
                              {selectedPaymentMethod === 'card' && (
                                <div className="w-full h-full rounded-full bg-white scale-50"></div>
                              )}
                            </div>
                            <div className="flex items-center">
                              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="#1a1f71">
                                <path d="M15.245 17.831h-6.49l-1.716-6.277c-.108-.394-.455-.394-.602-.394H2.881c-.147 0-.295.147-.295.295v.443c0 .147.147.295.295.295h3.114l2.466 9.095c.049.147.196.295.344.295h7.636c.147 0 .295-.147.295-.295v-.443c0-.196-.147-.295-.295-.295h-7.341l-.344-1.324h6.539c.147 0 .295-.147.295-.295v-.443c.049-.147-.098-.295-.245-.295z"/>
                              </svg>
                              <span className="text-white font-medium">Visa / MasterCard</span>
                            </div>
                          </div>
                        </div>

                        {/* USDT */}
                        <div 
                          onClick={() => setSelectedPaymentMethod('usdt')}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedPaymentMethod === 'usdt' 
                              ? 'border-[#3CD4AB] bg-[#3CD4AB]/10' 
                              : 'border-white/20 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                              selectedPaymentMethod === 'usdt' ? 'border-[#3CD4AB] bg-[#3CD4AB]' : 'border-white/40'
                            }`}>
                              {selectedPaymentMethod === 'usdt' && (
                                <div className="w-full h-full rounded-full bg-white scale-50"></div>
                              )}
                            </div>
                            <div className="flex items-center">
                              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="#26a17b">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.94 9.435c-.011-.009-1.482-.827-4.464-.827-2.982 0-4.453.818-4.464.827L8.999 8.46c.021-.016 2.015-1.112 4.521-1.112s4.5 1.096 4.521 1.112l-.101.975zm-.484 1.634v1.78c0 .827-.675 1.502-1.502 1.502h-8.908c-.827 0-1.502-.675-1.502-1.502v-1.78c0-.827.675-1.502 1.502-1.502h8.908c.827 0 1.502.675 1.502 1.502z"/>
                              </svg>
                              <span className="text-white font-medium">USDT (Crypto)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {profitOperation === 'reinvest' && (
                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                      <p className="text-white/80 text-sm">
                        Vos profits seront ajoutés à votre solde disponible pour de nouveaux investissements.
                        Cela vous permettra de profiter de l'effet de capitalisation.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowProfitModal(false)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleProfitOperation}
                      className={`flex-1 font-medium py-3 px-4 rounded-lg transition-colors duration-200 ${
                        profitOperation === 'withdraw' 
                          ? 'bg-orange-500 hover:bg-orange-600 text-white'
                          : 'bg-[#3CD4AB] hover:bg-[#3CD4AB]/80 text-[#0F0F19]'
                      }`}
                      disabled={calculateTotalProfits() <= 0}
                    >
                      {profitOperation === 'withdraw' ? 'Retirer les Profits' : 'Réinvestir'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Investment Popup */}
          {showInvestPopup && selectedInvestment && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-[#0F0F19] border border-white/20 rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Investir dans {selectedInvestment.name}</h3>
                  <button
                    onClick={() => setShowInvestPopup(false)}
                    className="text-white/60 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Product Image */}
                <div className="mb-4">
                  <img 
                    src={selectedInvestment.image} 
                    alt={selectedInvestment.name}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>

                {/* Product Details */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-2">{selectedInvestment.name}</h4>
                  <p className="text-white/60 text-sm mb-3">{selectedInvestment.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/60">Rendement:</span>
                      <span className="text-[#3CD4AB] font-semibold ml-2">{selectedInvestment.return}</span>
                    </div>
                    <div>
                      <span className="text-white/60">Risque:</span>
                      <span className="text-white ml-2">{selectedInvestment.risk}/10</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-white/60">Investissement minimum:</span>
                      <span className="text-white font-semibold ml-2">{selectedInvestment.min.toLocaleString()} Dhs</span>
                    </div>
                  </div>
                </div>

                {/* Balance Info */}
                <div className="mb-4 p-3 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/60">Solde disponible:</span>
                    <span className="text-[#3CD4AB] font-semibold">{userBalance.toLocaleString()} Dhs</span>
                  </div>
                  {investAmount && (
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Solde après investissement:</span>
                      <span className={`font-semibold ${calculateRemainingBalance() >= 0 ? 'text-[#3CD4AB]' : 'text-red-400'}`}>
                        {calculateRemainingBalance().toLocaleString()} Dhs
                      </span>
                    </div>
                  )}
                </div>

                {/* Investment Amount Input */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Montant à investir (Dhs)
                    </label>
                    <input
                      type="number"
                      value={investAmount}
                      onChange={handleInvestAmountChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:border-[#3CD4AB] focus:outline-none"
                      placeholder={`Minimum ${selectedInvestment.min.toLocaleString()} Dhs`}
                      min={selectedInvestment.min}
                      max={userBalance}
                    />
                    {investAmount && parseFloat(investAmount) < selectedInvestment.min && (
                      <p className="text-red-400 text-sm mt-1">
                        Le montant minimum est de {selectedInvestment.min.toLocaleString()} Dhs
                      </p>
                    )}
                    {investAmount && parseFloat(investAmount) > userBalance && (
                      <p className="text-red-400 text-sm mt-1">
                        Solde insuffisant
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowInvestPopup(false)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleConfirmInvestment}
                      disabled={!investAmount || parseFloat(investAmount) < selectedInvestment.min || parseFloat(investAmount) > userBalance}
                      className="flex-1 bg-[#3CD4AB] hover:bg-[#3CD4AB]/80 text-[#0F0F19] font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirmer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Details Popup */}
          {showNotificationDetails && selectedNotification && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-[#0F0F19] border border-white/20 rounded-lg p-6 w-full max-w-lg mx-4">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#3CD4AB]/20 rounded-full flex items-center justify-center">
                      {getNotificationIcon(selectedNotification.type)}
                    </div>
                    <h3 className="text-xl font-bold text-white">{selectedNotification.title}</h3>
                  </div>
                  <button
                    onClick={() => setShowNotificationDetails(false)}
                    className="text-white/60 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Notification Details */}
                <div className="mb-6">
                  <div className="mb-4 p-4 bg-white/5 rounded-lg">
                    <p className="text-white text-sm leading-relaxed">{selectedNotification.details}</p>
                  </div>

                  {/* Astuce Section */}
                  <div className="mb-4 p-4 bg-[#3CD4AB]/10 border border-[#3CD4AB]/20 rounded-lg">
                    <h4 className="text-[#3CD4AB] font-semibold text-sm mb-2">Astuce</h4>
                    <p className="text-white/80 text-sm">{selectedNotification.astuce}</p>
                  </div>

                  {/* Timestamp */}
                  <div className="text-white/60 text-xs">
                    Reçu {selectedNotification.time}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowNotificationDetails(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Fermer
                  </button>
                  <button
                    onClick={() => handleMarkAsRead(selectedNotification.id)}
                    className="flex-1 bg-[#3CD4AB] hover:bg-[#3CD4AB]/80 text-[#0F0F19] font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Marquer comme lu
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default UserDashboard; 
