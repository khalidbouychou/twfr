import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const initialState = {
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
    updateInterval: 10,
    lastUpdate: null,
    autoRebalancing: false
  },

  // 🔹 Internal
  rawResults: null,
  pendingInvestment: null,
  showConfirmationPopup: false,
  currentEditingStep: null,
  stepAnswers: { 0: [], 1: [], 2: [], 3: [], 4: [] }
};

// Helper: Calculate dashboard metrics
const calculateDashboardMetrics = (investments) => {
  const totalInvested = investments.reduce((s, i) => s + (i.valueInvested || 0), 0);
  const totalCurrent = investments.reduce((s, i) => s + (i.currentValue || 0), 0);
  const totalProfit = totalCurrent - totalInvested;
  const globalROI = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
  
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
  
  const categories = {};
  investments.forEach(inv => {
    categories[inv.category] = (categories[inv.category] || 0) + 1;
  });
  const categoryCount = Object.keys(categories).length;
  const diversificationScore = Math.min(categoryCount * 20, 100);
  
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
};

export const useUserStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // 🔹 Authentication
      setIsLoggedIn: (isLogin) => set({ isLogin }),
      
      logout: () => {
        // Clear all data
        localStorage.removeItem('isLogin');
        localStorage.removeItem('googleProfile');
        localStorage.removeItem('googleCredential');
        localStorage.removeItem('userProfileData');
        localStorage.removeItem('userContext');
        localStorage.removeItem('userName');
        localStorage.removeItem('userAvatar');
        localStorage.removeItem('userEmail');
        
        set(initialState);
      },

      // 🔹 User Profile Management
      updateUserProfile: (profileData) => set((state) => ({
        fullname: profileData.fullName || profileData.name || state.fullname,
        avatar: profileData.avatar || profileData.picture || state.avatar,
        email: profileData.email || state.email,
        phone: profileData.phone || state.phone,
        isProfileComplete: true,
        isLogin: true
      })),

      updateAccountBalance: (balance) => set({ accountBalance: balance }),

      updateBehaviorProfile: (profile) => set((state) => ({
        behaviorProfile: { ...state.behaviorProfile, ...profile }
      })),

      // 🔹 User Answers Management
      setUserAnswers: (answers) => set({ userAnswers: answers }),
      
      updateStepAnswers: (step, answers) => set((state) => ({
        stepAnswers: { ...state.stepAnswers, [step]: answers }
      })),

      // 🔹 Results Management
      updateUserResults: (results) => set({
        rawResults: results || null,
        matchedProducts: Array.isArray(results?.matchedProducts) ? results.matchedProducts : []
      }),

      // 🔹 Investment Management
      addUserInvestment: (investment) => set((state) => {
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

        const nextInvestments = [...state.userInvestments, newInvestment];
        const dashboardMetrics = calculateDashboardMetrics(nextInvestments);

        const newTransaction = {
          id: Date.now() + Math.random(),
          type: 'buy',
          productName: newInvestment.nameProduct,
          amount: newInvestment.valueInvested,
          date: new Date().toISOString(),
          status: 'completed'
        };

        return {
          userInvestments: nextInvestments,
          dashboard: { ...state.dashboard, ...dashboardMetrics },
          transactionHistory: [...state.transactionHistory, newTransaction]
        };
      }),

      updateUserInvestment: (investmentId, updates) => set((state) => {
        const nextInvestments = state.userInvestments.map((inv) => 
          inv.id === investmentId ? { ...inv, ...updates, lastUpdate: new Date().toISOString() } : inv
        );
        const dashboardMetrics = calculateDashboardMetrics(nextInvestments);

        return {
          userInvestments: nextInvestments,
          dashboard: { ...state.dashboard, ...dashboardMetrics }
        };
      }),

      removeUserInvestment: (investmentId) => set((state) => {
        const investment = state.userInvestments.find(inv => inv.id === investmentId);
        const nextInvestments = state.userInvestments.filter(inv => inv.id !== investmentId);
        const dashboardMetrics = calculateDashboardMetrics(nextInvestments);

        const newTransaction = investment ? {
          id: Date.now() + Math.random(),
          type: 'sell',
          productName: investment.nameProduct,
          amount: investment.currentValue,
          date: new Date().toISOString(),
          status: 'completed'
        } : null;

        return {
          userInvestments: nextInvestments,
          dashboard: { ...state.dashboard, ...dashboardMetrics },
          transactionHistory: newTransaction ? [...state.transactionHistory, newTransaction] : state.transactionHistory
        };
      }),

      setUserInvestments: (investments) => set((state) => {
        const dashboardMetrics = calculateDashboardMetrics(investments);
        return {
          userInvestments: investments,
          dashboard: { ...state.dashboard, ...dashboardMetrics }
        };
      }),

      // 🔹 Pending Investment
      queuePendingInvestment: (investment) => set({ pendingInvestment: investment }),
      
      clearPendingInvestment: () => set({ pendingInvestment: null }),

      // 🔹 Confirmation Popup
      setShowConfirmationPopup: (show) => set({ showConfirmationPopup: show }),
      
      confirmAnswers: () => set({ showConfirmationPopup: false }),
      
      modifyAnswer: (step) => set({ 
        showConfirmationPopup: false,
        currentEditingStep: step
      }),

      setCurrentEditingStep: (step) => set({ currentEditingStep: step }),

      // 🔹 Financial Goals
      addFinancialGoal: (goal) => set((state) => ({
        financialGoals: [...state.financialGoals, { ...goal, id: Date.now() + Math.random() }]
      })),

      updateFinancialGoal: (goalId, updates) => set((state) => ({
        financialGoals: state.financialGoals.map(goal => 
          goal.id === goalId ? { ...goal, ...updates } : goal
        )
      })),

      // 🔹 Simulations
      addSimulation: (simulation) => set((state) => ({
        simulations: [...state.simulations, { ...simulation, id: Date.now() + Math.random(), date: new Date().toISOString() }]
      })),

      // 🔹 Market Data
      updateMarketData: (data) => set((state) => ({
        marketData: { ...state.marketData, ...data, lastMarketUpdate: new Date().toISOString() }
      })),

      // 🔹 Recommendations
      updateRecommendations: (products, score) => set({
        matchedProducts: products,
        recommendationScore: score,
        lastRecommendationUpdate: new Date().toISOString()
      }),

      // 🔹 Transactions
      addTransaction: (transaction) => set((state) => ({
        transactionHistory: [...state.transactionHistory, { ...transaction, id: Date.now() + Math.random() }]
      })),

      // 🔹 Real-time Settings
      updateRealTimeSettings: (settings) => set((state) => ({
        realTimeUpdates: { ...state.realTimeUpdates, ...settings }
      })),

      // 🔹 Clear All Data
      clearUserData: () => set(initialState),

      // 🔹 Get computed values (selectors)
      getUserProfileData: () => {
        const state = get();
        return state.fullname ? {
          fullName: state.fullname,
          name: state.fullname,
          avatar: state.avatar,
          picture: state.avatar,
          email: state.email,
          phone: state.phone
        } : null;
      }
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        fullname: state.fullname,
        avatar: state.avatar,
        email: state.email,
        phone: state.phone,
        isLogin: state.isLogin,
        isProfileComplete: state.isProfileComplete,
        accountBalance: state.accountBalance,
        joinDate: state.joinDate,
        userAnswers: state.userAnswers,
        userInvestments: state.userInvestments,
        matchedProducts: state.matchedProducts,
        dashboard: state.dashboard,
        behaviorProfile: state.behaviorProfile,
        marketData: state.marketData,
        simulations: state.simulations,
        financialGoals: state.financialGoals,
        transactionHistory: state.transactionHistory,
        realTimeUpdates: state.realTimeUpdates
      })
    }
  )
);
