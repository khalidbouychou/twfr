/* eslint-disable react-refresh/only-export-components */
import React, { useState, useCallback, useEffect } from 'react';
import { createContext } from 'react';

export const UserContext = createContext({
  // Unified context
  userContext: null,
  setUserContext: () => {},

  // Legacy API (backward compatibility)
  userProfileData: null,
  userResults: null,
  isProfileComplete: false,
  pendingInvestment: null,
  userInvestments: [],
  updateUserResults: () => {},
  queuePendingInvestment: () => {},
  clearPendingInvestment: () => {},
  clearUserData: () => {},
  logout: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  userAnswers: [],
  setUserAnswers: () => {},
  updateStepAnswers: () => {},
  showConfirmationPopup: false,
  setShowConfirmationPopup: () => {},
  confirmAnswers: () => {},
  modifyAnswer: () => {},
  currentEditingStep: null,
  setCurrentEditingStep: () => {},
  setUserInvestments: () => {},
  investmentProductsList: [],

  // Enhanced investment management
  addUserInvestment: () => {},
  updateUserInvestment: () => {},
  removeUserInvestment: () => {},

  // Enhanced user profile management
  updateUserProfile: () => {},
  updateAccountBalance: () => {},
  updateBehaviorProfile: () => {},

  // Financial planning & goals
  addFinancialGoal: () => {},
  updateFinancialGoal: () => {},
  addSimulation: () => {},

  // Market data & recommendations
  updateMarketData: () => {},
  updateRecommendations: () => {},

  // Transaction management
  addTransaction: () => {},

  // Real-time updates
  updateRealTimeSettings: () => {},

  // Direct access to data
  totalInvested: 0,
  totalCurrent: 0,
  totalProfit: 0,
  globalROI: 0,
  topPerformer: null,
  worstPerformer: null,
  diversificationScore: 0,
  riskScore: 0,
  performanceHistory: [],
  fullname: "",
  avatar: "",
  email: "",
  phone: "",
  accountBalance: 0,
  joinDate: null,
  marketData: {},
  exchangeRates: {},
  marketQuotes: {},
  newsData: [],
  matchedProducts: [],
  recommendationScore: 0,
  behaviorProfile: {},
  riskTolerance: 0,
  profileType: "",
  financialGoals: [],
  simulations: [],
  investmentPlanning: {},
  transactionHistory: [],
  pendingTransactions: [],
  realTimeUpdates: { enabled: true, updateInterval: 10 }
});

const initialUnifiedState = {
  // 🔹 User Personal Information
  fullname: "",
  avatar: "",
  email: "",
  phone: "",
  isLogin: false,
  isProfileComplete: false,
  accountBalance: 0,
  joinDate: null,

  // 🔹 User Questionnaire Answers
  userAnswers: [],

  // 🔹 Current Investment Portfolio
  userInvestments: [],

  // 🔹 Investment Recommendations
  matchedProducts: [],
  recommendationScore: 0,
  lastRecommendationUpdate: null,

  // 🔹 Dashboard Financial Metrics
  dashboard: {
    totalInvested: 0,
    totalCurrent: 0,
    totalProfit: 0,
    globalROI: 0,
    monthlyROI: 0,
    weeklyROI: 0,
    dailyROI: 0,
    performanceHistory: [],
    topPerformer: null,
    worstPerformer: null,
    diversificationScore: 0,
    riskScore: 0
  },

  // 🔹 User Behavioral Profile
  behaviorProfile: {
    riskTolerance: 0,
    horizon: 0,
    liquidityPreference: 0,
    diversification: 0,
    profileType: "",
    investmentGoals: [],
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsCapacity: 0
  },

  // 🔹 Market Data & News
  marketData: {
    exchangeRates: {},
    marketQuotes: {},
    newsData: [],
    lastMarketUpdate: null
  },

  // 🔹 Simulation & Planning
  simulations: [],
  financialGoals: [],
  investmentPlanning: {
    suggestedMonthlyInvestment: 0,
    targetPortfolioAllocation: {},
    timeToGoals: {}
  },

  // 🔹 Transaction History
  transactionHistory: [],
  pendingTransactions: [],

  // 🔹 Real-time Updates Settings
  realTimeUpdates: {
    enabled: true,
    updateInterval: 10, // minutes
    lastUpdate: null,
    autoRebalancing: false
  },

  // Internal: results/raw structure
  rawResults: null
};

export const UserProvider = ({ children }) => {
  // Unified state (persisted)
  const [userContext, setUserContext] = useState(() => {
    try {
      const stored = localStorage.getItem('userContext');
      return stored ? JSON.parse(stored) : initialUnifiedState;
    } catch {
      return initialUnifiedState;
    }
  });

  // Backward compatibility bits mapped to unified state
  const [pendingInvestment, setPendingInvestment] = useState(null);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [currentEditingStep, setCurrentEditingStep] = useState(null);
  // Reintroduced step answers for compatibility with profiling components
  const [stepAnswers, setStepAnswers] = useState({ 0: [], 1: [], 2: [], 3: [], 4: [] });

  // Derived aliases
  const userProfileData = userContext?.fullname
    ? { 
        fullName: userContext.fullname, 
        name: userContext.fullname,
        avatar: userContext.avatar, 
        picture: userContext.avatar, // Ensure Google compatibility
        email: userContext.email 
      }
    : null;
  const userResults = userContext?.rawResults || null;
  const isProfileComplete = Boolean(userContext?.isProfileComplete);
  const userInvestments = userContext?.userInvestments || [];
  const isLoggedIn = Boolean(userContext?.isLogin);

  // Persist unified state
  useEffect(() => {
    try {
      localStorage.setItem('userContext', JSON.stringify(userContext));
    } catch {
      // ignore
    }
  }, [userContext]);

  // Keep legacy listeners (storage) in sync
  useEffect(() => {
  const handleStorageChange = () => {
    try {
        const stored = localStorage.getItem('userContext');
        if (stored) setUserContext(JSON.parse(stored));
      } catch {
        // ignore
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Initialize from Google profile if context is empty but Google data exists
  useEffect(() => {
    if (!userContext.fullname || !userContext.avatar) {
      try {
        const googleProfile = JSON.parse(localStorage.getItem('googleProfile') || '{}');
        const userProfileData = JSON.parse(localStorage.getItem('userProfileData') || '{}');
        const isLogin = localStorage.getItem('isLogin') === 'true';
        
        if ((googleProfile.name || userProfileData.fullName) && isLogin) {
          setUserContext((prev) => ({
            ...prev,
            fullname: prev.fullname || userProfileData.fullName || googleProfile.name || '',
            avatar: prev.avatar || userProfileData.avatar || googleProfile.picture || '',
            email: prev.email || userProfileData.email || googleProfile.email || '',
            isLogin: prev.isLogin || isLogin,
            isProfileComplete: prev.isProfileComplete || Boolean(userProfileData.fullName || googleProfile.name)
          }));
        }
      } catch (e) {
        console.error('Error syncing profile data:', e);
      }
    }
  }, [userContext.fullname, userContext.avatar]);

  // Legacy updaters mapped to unified state

  const updateUserResults = useCallback((results) => {
    // results should include matchedProducts, riskProfile etc.
    setUserContext((prev) => ({
      ...prev,
      rawResults: results || null,
      matchedProducts: Array.isArray(results?.matchedProducts) ? results.matchedProducts : prev.matchedProducts
    }));
    try {
      localStorage.setItem('userResults', JSON.stringify(results));
    } catch {
      // ignore
    }
  }, []);

  const queuePendingInvestment = useCallback((investment) => setPendingInvestment(investment), []);
  const clearPendingInvestment = useCallback(() => setPendingInvestment(null), []);

  // Helper function to calculate comprehensive dashboard metrics
  const calculateDashboardMetrics = useCallback((investments) => {
    const totalInvested = investments.reduce((s, i) => s + (i.valueInvested || 0), 0);
    const totalCurrent = investments.reduce((s, i) => s + (i.currentValue || 0), 0);
    const totalProfit = totalCurrent - totalInvested;
    const globalROI = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
    
    // Calculate top and worst performers
    const performers = investments.map(inv => ({
      ...inv,
      profitPercentage: inv.valueInvested > 0 ? ((inv.currentValue - inv.valueInvested) / inv.valueInvested) * 100 : 0
    }));
    
    const topPerformer = performers.length > 0 ? performers.reduce((max, inv) => 
      inv.profitPercentage > max.profitPercentage ? inv : max
    ) : null;
    
    const worstPerformer = performers.length > 0 ? performers.reduce((min, inv) => 
      inv.profitPercentage < min.profitPercentage ? inv : min
    ) : null;
    
    // Calculate diversification score (based on category spread)
    const categories = {};
    investments.forEach(inv => {
      categories[inv.category] = (categories[inv.category] || 0) + 1;
    });
    const categoryCount = Object.keys(categories).length;
    const diversificationScore = Math.min(categoryCount * 20, 100); // Max 100 for 5+ categories
    
    // Calculate risk score (based on portfolio composition)
    const riskWeights = { conservative: 1, moderate: 2, dynamic: 3, aggressive: 4 };
    const avgRisk = investments.length > 0 
      ? investments.reduce((sum, inv) => sum + (riskWeights[inv.riskLevel] || 2), 0) / investments.length
      : 2;
    const riskScore = (avgRisk / 4) * 100;
    
    return {
      totalInvested,
      totalCurrent,
      totalProfit,
      globalROI,
      topPerformer,
      worstPerformer,
      diversificationScore,
      riskScore
    };
  }, []);

  const addUserInvestment = useCallback((investment) => {
    const newInvestment = {
      id: investment.id || Date.now() + Math.random(),
      nameProduct: investment.nameProduct || investment.name || "",
      category: investment.category || "other",
      riskLevel: investment.riskLevel || "moderate",
      valueInvested: Number(investment.valueInvested ?? investment.investedAmount ?? investment.amount ?? 0),
      currentValue: Number(investment.currentValue ?? investment.valueInvested ?? investment.investedAmount ?? investment.amount ?? 0),
      profit: Number(investment.profit ?? 0),
      roi_product: Number(investment.roi_product ?? investment.roi_annuel ?? 0),
      date: investment.date || new Date().toISOString(),
      pictureProduit: investment.picture || investment.avatar || "",
      lastUpdate: new Date().toISOString()
    };

    setUserContext((prev) => {
      const nextInvestments = [...(prev.userInvestments || []), newInvestment];
      const dashboardMetrics = calculateDashboardMetrics(nextInvestments);
      
      // Add transaction to history
      const newTransaction = {
        id: Date.now() + Math.random(),
        type: 'buy',
        productName: newInvestment.nameProduct,
        amount: newInvestment.valueInvested,
        date: new Date().toISOString(),
        status: 'completed'
      };
      
      return {
        ...prev,
        userInvestments: nextInvestments,
        dashboard: {
          ...prev.dashboard,
          ...dashboardMetrics,
          performanceHistory: prev.dashboard?.performanceHistory || []
        },
        transactionHistory: [...(prev.transactionHistory || []), newTransaction]
      };
    });

    try {
      const stored = localStorage.getItem('userContext');
      const parsed = stored ? JSON.parse(stored) : initialUnifiedState;
      parsed.userInvestments = [...(parsed.userInvestments || []), newInvestment];
      localStorage.setItem('userContext', JSON.stringify(parsed));
      localStorage.setItem('userInvestments', JSON.stringify(parsed.userInvestments)); // legacy
    } catch {
      // ignore
    }
  }, [calculateDashboardMetrics]);

  const updateUserInvestment = useCallback((investmentId, updates) => {
    setUserContext((prev) => {
      const nextInvestments = (prev.userInvestments || []).map((inv) => 
        inv.id === investmentId ? { ...inv, ...updates, lastUpdate: new Date().toISOString() } : inv
      );
      const dashboardMetrics = calculateDashboardMetrics(nextInvestments);
      
      return {
        ...prev,
        userInvestments: nextInvestments,
        dashboard: { ...prev.dashboard, ...dashboardMetrics }
      };
    });
    try {
      const stored = localStorage.getItem('userContext');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.userInvestments = parsed.userInvestments.map((inv) => 
          inv.id === investmentId ? { ...inv, ...updates, lastUpdate: new Date().toISOString() } : inv
        );
        localStorage.setItem('userContext', JSON.stringify(parsed));
        localStorage.setItem('userInvestments', JSON.stringify(parsed.userInvestments)); // legacy
      }
    } catch {
      // ignore
    }
  }, [calculateDashboardMetrics]);

  const removeUserInvestment = useCallback((investmentId) => {
    setUserContext((prev) => {
      const investmentToRemove = (prev.userInvestments || []).find(inv => inv.id === investmentId);
      const nextInvestments = (prev.userInvestments || []).filter((inv) => inv.id !== investmentId);
      const dashboardMetrics = calculateDashboardMetrics(nextInvestments);
      
      // Add sell transaction to history
      const sellTransaction = investmentToRemove ? {
        id: Date.now() + Math.random(),
        type: 'sell',
        productName: investmentToRemove.nameProduct,
        amount: investmentToRemove.currentValue || investmentToRemove.valueInvested,
        date: new Date().toISOString(),
        status: 'completed'
      } : null;
      
      return {
        ...prev,
        userInvestments: nextInvestments,
        dashboard: { ...prev.dashboard, ...dashboardMetrics },
        transactionHistory: sellTransaction 
          ? [...(prev.transactionHistory || []), sellTransaction]
          : prev.transactionHistory
      };
    });
    try {
      const stored = localStorage.getItem('userContext');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.userInvestments = parsed.userInvestments.filter((inv) => inv.id !== investmentId);
        localStorage.setItem('userContext', JSON.stringify(parsed));
        localStorage.setItem('userInvestments', JSON.stringify(parsed.userInvestments)); // legacy
      }
    } catch {
      // ignore
    }
  }, [calculateDashboardMetrics]);

  const clearUserData = useCallback(() => {
    setUserContext(initialUnifiedState);
    setPendingInvestment(null);
    setShowConfirmationPopup(false);
    setCurrentEditingStep(null);
    setStepAnswers({ 0: [], 1: [], 2: [], 3: [], 4: [] });
    try {
      localStorage.removeItem('userContext');
      localStorage.removeItem('userProfileData');
      localStorage.removeItem('userResults');
      localStorage.removeItem('userInvestments');
      localStorage.setItem('isProfileComplete', 'false');
      localStorage.removeItem('isLogin');
      localStorage.removeItem('googleProfile');
      localStorage.removeItem('googleCredential');
    } catch {
      // ignore
    }
  }, []);

  const setIsLoggedIn = useCallback((val) => {
    setUserContext((prev) => ({ ...prev, isLogin: Boolean(val) }));
    try { localStorage.setItem('isLogin', String(Boolean(val))); } catch { /* ignore */ }
  }, []);

  // Step answers handling mapped into unified userAnswers
  const updateStepAnswers = useCallback((stepIndex, answers) => {
    // Keep legacy stepAnswers in sync
    setStepAnswers((prev) => ({
      ...prev,
      [stepIndex]: answers
    }));

    // Merge into unified flat answers
    setUserContext((prev) => {
      const merged = Object.values({ [stepIndex]: answers }).flat();
      const existing = Array.isArray(prev.userAnswers) ? prev.userAnswers : [];
      const rest = existing.filter((a) => !merged.some((m) => m.q === a.q));
      return { ...prev, userAnswers: [...rest, ...merged] };
    });

    try {
      const stored = localStorage.getItem('userContext');
      const parsed = stored ? JSON.parse(stored) : initialUnifiedState;
      const merged = Object.values({ [stepIndex]: answers }).flat();
      const rest = (parsed.userAnswers || []).filter((a) => !merged.some((m) => m.q === a.q));
      parsed.userAnswers = [...rest, ...merged];
      localStorage.setItem('userContext', JSON.stringify(parsed));
      localStorage.setItem('userAnswers', JSON.stringify(parsed.userAnswers)); // legacy
    } catch {
      // ignore
    }
  }, []);

  const modifyAnswer = useCallback((stepIndex, questionId, newAnswer) => {
    setUserContext((prev) => ({
      ...prev,
      userAnswers: (prev.userAnswers || []).map((a) => (a.q === questionId ? { ...a, answer: newAnswer } : a))
    }));
  }, []);

  const confirmAnswers = useCallback(() => {
    setShowConfirmationPopup(true);
    setCurrentEditingStep(null);
  }, []);

  // New comprehensive data update methods
  const updateMarketData = useCallback((marketData) => {
    setUserContext((prev) => ({
      ...prev,
      marketData: {
        ...prev.marketData,
        ...marketData,
        lastMarketUpdate: new Date().toISOString()
      }
    }));
  }, []);

  const updateUserProfile = useCallback((profileData) => {
    setUserContext((prev) => ({
      ...prev,
      fullname: profileData?.fullName || profileData?.name || prev.fullname,
      avatar: profileData?.avatar || profileData?.picture || prev.avatar,
      email: profileData?.email || prev.email,
      phone: profileData?.phone || prev.phone,
      isProfileComplete: true,
      isLogin: prev.isLogin || true,
      joinDate: prev.joinDate || new Date().toISOString()
    }));
    try {
      localStorage.setItem('userProfileData', JSON.stringify(profileData));
      localStorage.setItem('isProfileComplete', 'true');
      localStorage.setItem('isLogin', 'true');
    } catch {
      // ignore
    }
  }, []);

  const updateAccountBalance = useCallback((amount, operation = 'set') => {
    setUserContext((prev) => {
      const newBalance = operation === 'add' 
        ? prev.accountBalance + amount
        : operation === 'subtract'
        ? prev.accountBalance - amount
        : amount;
      
      return {
        ...prev,
        accountBalance: Math.max(0, newBalance) // Prevent negative balance
      };
    });
  }, []);

  const addFinancialGoal = useCallback((goal) => {
    const newGoal = {
      id: Date.now() + Math.random(),
      ...goal,
      createdDate: new Date().toISOString(),
      progress: 0
    };
    
    setUserContext((prev) => ({
      ...prev,
      financialGoals: [...(prev.financialGoals || []), newGoal]
    }));
  }, []);

  const updateFinancialGoal = useCallback((goalId, updates) => {
    setUserContext((prev) => ({
      ...prev,
      financialGoals: (prev.financialGoals || []).map(goal =>
        goal.id === goalId ? { ...goal, ...updates } : goal
      )
    }));
  }, []);

  const addSimulation = useCallback((simulation) => {
    const newSimulation = {
      id: Date.now() + Math.random(),
      ...simulation,
      createdDate: new Date().toISOString()
    };
    
    setUserContext((prev) => ({
      ...prev,
      simulations: [...(prev.simulations || []), newSimulation]
    }));
  }, []);

  const updateBehaviorProfile = useCallback((profileData) => {
    setUserContext((prev) => ({
      ...prev,
      behaviorProfile: {
        ...prev.behaviorProfile,
        ...profileData
      }
    }));
  }, []);

  const updateRecommendations = useCallback((recommendations, score = 0) => {
    setUserContext((prev) => ({
      ...prev,
      matchedProducts: recommendations,
      recommendationScore: score,
      lastRecommendationUpdate: new Date().toISOString()
    }));
  }, []);

  const addTransaction = useCallback((transaction) => {
    const newTransaction = {
      id: Date.now() + Math.random(),
      ...transaction,
      date: transaction.date || new Date().toISOString(),
      status: transaction.status || 'pending'
    };
    
    setUserContext((prev) => ({
      ...prev,
      transactionHistory: [...(prev.transactionHistory || []), newTransaction]
    }));
  }, []);

  const updateRealTimeSettings = useCallback((settings) => {
    setUserContext((prev) => ({
      ...prev,
      realTimeUpdates: {
        ...prev.realTimeUpdates,
        ...settings
      }
    }));
  }, []);

  // Enhanced real-time updates with configurable growth
  useEffect(() => {
    const updateInterval = userContext?.realTimeUpdates?.updateInterval || 10;
    const INTERVAL_MS = updateInterval * 60 * 1000;
    
    if (!userContext?.realTimeUpdates?.enabled) return;
    
    const timerId = setInterval(() => {
      setUserContext((prev) => {
        const list = Array.isArray(prev.userInvestments) ? prev.userInvestments : [];
        if (list.length === 0) return prev;
        
        const next = list.map((inv) => {
          const base = typeof inv.currentValue === 'number' && !Number.isNaN(inv.currentValue)
            ? inv.currentValue
            : Number(inv.valueInvested ?? 0);
          
          // Variable growth based on risk level and market conditions
          const riskMultiplier = {
            conservative: 1.01, // 1% growth
            moderate: 1.03,     // 3% growth
            dynamic: 1.05,      // 5% growth
            aggressive: 1.07    // 7% growth
          };
          
          const growth = riskMultiplier[inv.riskLevel] || 1.03;
          const randomFactor = 0.95 + Math.random() * 0.1; // ±5% randomness
          const newValue = Math.round(base * growth * randomFactor);
          
          return { 
            ...inv, 
            currentValue: newValue,
            profit: newValue - inv.valueInvested,
            lastUpdate: new Date().toISOString()
          };
        });
        
        const dashboardMetrics = calculateDashboardMetrics(next);
        
        // Update performance history
        const newHistoryPoint = {
          date: new Date().toISOString(),
          totalValue: dashboardMetrics.totalCurrent,
          totalProfit: dashboardMetrics.totalProfit,
          roi: dashboardMetrics.globalROI
        };
        
        const updatedHistory = [...(prev.dashboard?.performanceHistory || []), newHistoryPoint]
          .slice(-50); // Keep last 50 data points
        
        return { 
          ...prev, 
          userInvestments: next, 
          dashboard: { 
            ...prev.dashboard, 
            ...dashboardMetrics,
            performanceHistory: updatedHistory
          },
          realTimeUpdates: {
            ...prev.realTimeUpdates,
            lastUpdate: new Date().toISOString()
          }
        };
      });
    }, INTERVAL_MS);
    
    return () => clearInterval(timerId);
  }, [userContext?.realTimeUpdates?.enabled, userContext?.realTimeUpdates?.updateInterval, calculateDashboardMetrics]);

  const value = {
    // unified context
    userContext,
    setUserContext,

    // legacy mapped values (for backward compatibility)
    userProfileData,
    userResults,
    isProfileComplete,
    pendingInvestment,
    updateUserResults,
    queuePendingInvestment,
    clearPendingInvestment,
    clearUserData,
    logout: () => setIsLoggedIn(false),
    isLoggedIn,
    setIsLoggedIn,
    userAnswers: userContext?.userAnswers || [],
    userInvestments,
    setUserAnswers: () => {},
    updateStepAnswers,
    showConfirmationPopup,
    setShowConfirmationPopup,
    confirmAnswers,
    modifyAnswer,
    currentEditingStep,
    setCurrentEditingStep,
    stepAnswers,

    // Enhanced investment management
    addUserInvestment,
    updateUserInvestment,
    removeUserInvestment,
    setUserInvestments: (fnOrArr) => {
      setUserContext((prev) => {
        const next = typeof fnOrArr === 'function' ? fnOrArr(prev.userInvestments) : fnOrArr;
        const dashboardMetrics = calculateDashboardMetrics(next);
        return { ...prev, userInvestments: next, dashboard: { ...prev.dashboard, ...dashboardMetrics } };
      });
    },

    // Enhanced user profile management
    updateUserProfile,
    updateAccountBalance,
    updateBehaviorProfile,

    // Financial planning & goals
    addFinancialGoal,
    updateFinancialGoal,
    addSimulation,

    // Market data & recommendations
    updateMarketData,
    updateRecommendations,

    // Transaction management
    addTransaction,

    // Real-time updates
    updateRealTimeSettings,

    // Computed/derived data
    investmentProductsList: (userContext?.userInvestments || []).map((inv) => ({
      nameProduct: inv.nameProduct || inv.name || inv.nameproduct || "",
      budgetInvestment: Number(inv.valueInvested ?? inv.investedAmount ?? inv.amount ?? 0),
      roi1Year: Number(inv.roi_product ?? inv.roi1Year ?? inv.roi_1y ?? 0)
    })),

    // Dashboard metrics (direct access)
    totalInvested: userContext?.dashboard?.totalInvested || 0,
    totalCurrent: userContext?.dashboard?.totalCurrent || 0,
    totalProfit: userContext?.dashboard?.totalProfit || 0,
    globalROI: userContext?.dashboard?.globalROI || 0,
    topPerformer: userContext?.dashboard?.topPerformer,
    worstPerformer: userContext?.dashboard?.worstPerformer,
    diversificationScore: userContext?.dashboard?.diversificationScore || 0,
    riskScore: userContext?.dashboard?.riskScore || 0,
    performanceHistory: userContext?.dashboard?.performanceHistory || [],

    // User info (direct access)
    fullname: userContext?.fullname || "",
    avatar: userContext?.avatar || "",
    email: userContext?.email || "",
    phone: userContext?.phone || "",
    accountBalance: userContext?.accountBalance || 0,
    joinDate: userContext?.joinDate,

    // Market data (direct access)
    marketData: userContext?.marketData || {},
    exchangeRates: userContext?.marketData?.exchangeRates || {},
    marketQuotes: userContext?.marketData?.marketQuotes || {},
    newsData: userContext?.marketData?.newsData || [],

    // Recommendations & profiling (direct access)
    matchedProducts: userContext?.matchedProducts || [],
    recommendationScore: userContext?.recommendationScore || 0,
    behaviorProfile: userContext?.behaviorProfile || {},
    riskTolerance: userContext?.behaviorProfile?.riskTolerance || 0,
    profileType: userContext?.behaviorProfile?.profileType || "",

    // Planning & goals (direct access)
    financialGoals: userContext?.financialGoals || [],
    simulations: userContext?.simulations || [],
    investmentPlanning: userContext?.investmentPlanning || {},

    // Transaction history (direct access)
    transactionHistory: userContext?.transactionHistory || [],
    pendingTransactions: userContext?.pendingTransactions || [],

    // Real-time settings (direct access)
    realTimeUpdates: userContext?.realTimeUpdates || { enabled: true, updateInterval: 10 }
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 
