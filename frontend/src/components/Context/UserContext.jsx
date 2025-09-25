/* eslint-disable react-refresh/only-export-components */
import React, { useState, useCallback, useEffect } from 'react';
import { createContext } from 'react';

export const UserContext = createContext({
  // New unified context
  userContext: null,
  setUserContext: () => {},
  // Backward-compatible API (kept working by mapping to userContext)
  userProfileData: null,
  userResults: null,
  isProfileComplete: false,
  pendingInvestment: null,
  userInvestments: [],
  updateUserProfile: () => {},
  updateUserResults: () => {},
  queuePendingInvestment: () => {},
  clearPendingInvestment: () => {},
  addUserInvestment: () => {},
  updateUserInvestment: () => {},
  removeUserInvestment: () => {},
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
  investmentProductsList: []
});

const initialUnifiedState = {
  // 🔹 Infos utilisateur
  fullname: "",
  avatar: "",
  isLogin: false,
  isProfileComplete: false,

  // 🔹 Réponses aux questionnaires (flat list for simplicity)
  userAnswers: [],

  // 🔹 Portefeuille actuel
  userInvestments: [],

  // 🔹 Produits recommandés (subset of results)
  matchedProducts: [],

  // 🔹 Agrégations Dashboard
  dashboard: {
    totalInvested: 0,
    totalCurrent: 0,
    totalProfit: 0,
    globalROI: 0,
    performanceHistory: []
  },

  // 🔹 Profil comportemental
  behaviorProfile: {
    riskTolerance: 0,
    horizon: 0,
    liquidityPreference: 0,
    diversification: 0,
    profileType: ""
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
    ? { fullName: userContext.fullname, avatar: userContext.avatar, email: userContext.email }
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

  // Legacy updaters mapped to unified state
  const updateUserProfile = useCallback((profileData) => {
    setUserContext((prev) => ({
      ...prev,
      fullname: profileData?.fullName || profileData?.name || prev.fullname,
      avatar: profileData?.avatar || profileData?.picture || prev.avatar,
      email: profileData?.email || prev.email,
      isProfileComplete: true,
      isLogin: prev.isLogin || true
    }));
    try {
      localStorage.setItem('userProfileData', JSON.stringify(profileData));
      localStorage.setItem('isProfileComplete', 'true');
      localStorage.setItem('isLogin', 'true');
    } catch {
      // ignore
    }
  }, []);

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

  const addUserInvestment = useCallback((investment) => {
    const newInvestment = {
      id: investment.id || Date.now() + Math.random(),
      nameProduct: investment.nameProduct || investment.name || "",
      category: investment.category || "other",
      valueInvested: Number(investment.valueInvested ?? investment.investedAmount ?? investment.amount ?? 0),
      currentValue: Number(investment.currentValue ?? investment.valueInvested ?? investment.investedAmount ?? investment.amount ?? 0),
      profit: Number(investment.profit ?? 0),
      roi_product: Number(investment.roi_product ?? investment.roi_annuel ?? 0),
      date: investment.date || new Date().toISOString(),
      pictureProduit: investment.picture || investment.avatar || ""
    };

    setUserContext((prev) => {
      const nextInvestments = [...(prev.userInvestments || []), newInvestment];
      // recompute dashboard aggregates
      const totalInvested = nextInvestments.reduce((s, i) => s + (i.valueInvested || 0), 0);
      const totalCurrent = nextInvestments.reduce((s, i) => s + (i.currentValue || 0), 0);
      const totalProfit = totalCurrent - totalInvested;
      const globalROI = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
      return {
        ...prev,
        userInvestments: nextInvestments,
        dashboard: {
          ...prev.dashboard,
          totalInvested,
          totalCurrent,
          totalProfit,
          globalROI,
          performanceHistory: prev.dashboard?.performanceHistory || []
        }
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
  }, []);

  const updateUserInvestment = useCallback((investmentId, updates) => {
    setUserContext((prev) => {
      const nextInvestments = (prev.userInvestments || []).map((inv) => (inv.id === investmentId ? { ...inv, ...updates } : inv));
      const totalInvested = nextInvestments.reduce((s, i) => s + (i.valueInvested || 0), 0);
      const totalCurrent = nextInvestments.reduce((s, i) => s + (i.currentValue || 0), 0);
      const totalProfit = totalCurrent - totalInvested;
      const globalROI = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
      return {
        ...prev,
        userInvestments: nextInvestments,
        dashboard: { ...prev.dashboard, totalInvested, totalCurrent, totalProfit, globalROI }
      };
    });
    try {
      const stored = localStorage.getItem('userContext');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.userInvestments = parsed.userInvestments.map((inv) => (inv.id === investmentId ? { ...inv, ...updates } : inv));
        localStorage.setItem('userContext', JSON.stringify(parsed));
        localStorage.setItem('userInvestments', JSON.stringify(parsed.userInvestments)); // legacy
      }
    } catch {
      // ignore
    }
  }, []);

  const removeUserInvestment = useCallback((investmentId) => {
    setUserContext((prev) => {
      const nextInvestments = (prev.userInvestments || []).filter((inv) => inv.id !== investmentId);
      const totalInvested = nextInvestments.reduce((s, i) => s + (i.valueInvested || 0), 0);
      const totalCurrent = nextInvestments.reduce((s, i) => s + (i.currentValue || 0), 0);
      const totalProfit = totalCurrent - totalInvested;
      const globalROI = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
      return {
        ...prev,
        userInvestments: nextInvestments,
        dashboard: { ...prev.dashboard, totalInvested, totalCurrent, totalProfit, globalROI }
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
  }, []);

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

  // Periodic +5% currentValue growth every 10 minutes
  useEffect(() => {
    const TEN_MIN_MS = 10 * 60 * 1000;
    const timerId = setInterval(() => {
      setUserContext((prev) => {
        const list = Array.isArray(prev.userInvestments) ? prev.userInvestments : [];
        if (list.length === 0) return prev;
        const next = list.map((inv) => {
          const base = typeof inv.currentValue === 'number' && !Number.isNaN(inv.currentValue)
            ? inv.currentValue
            : Number(inv.valueInvested ?? 0);
          return { ...inv, currentValue: Math.round(base * 1.05) };
        });
        const totalInvested = next.reduce((s, i) => s + (i.valueInvested || 0), 0);
        const totalCurrent = next.reduce((s, i) => s + (i.currentValue || 0), 0);
        const totalProfit = totalCurrent - totalInvested;
        const globalROI = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
        return { ...prev, userInvestments: next, dashboard: { ...prev.dashboard, totalInvested, totalCurrent, totalProfit, globalROI } };
      });
    }, TEN_MIN_MS);
    return () => clearInterval(timerId);
  }, []);

  const value = {
    // unified
    userContext,
    setUserContext,

    // legacy mapped values
    userProfileData,
    userResults,
    isProfileComplete,
    pendingInvestment,
    updateUserProfile,
    updateUserResults,
    queuePendingInvestment,
    clearPendingInvestment,
    clearUserData,
    logout: () => setIsLoggedIn(false),
    isLoggedIn,
    setIsLoggedIn,
    userAnswers: userContext?.userAnswers || [],
    userInvestments,
    addUserInvestment,
    updateUserInvestment,
    removeUserInvestment,
    setUserAnswers: () => {},
    updateStepAnswers,
    showConfirmationPopup,
    setShowConfirmationPopup,
    confirmAnswers,
    modifyAnswer,
    currentEditingStep,
    setCurrentEditingStep,
    stepAnswers,
    setUserInvestments: (fnOrArr) => {
      setUserContext((prev) => {
        const next = typeof fnOrArr === 'function' ? fnOrArr(prev.userInvestments) : fnOrArr;
        const totalInvested = next.reduce((s, i) => s + (i.valueInvested || 0), 0);
        const totalCurrent = next.reduce((s, i) => s + (i.currentValue || 0), 0);
        const totalProfit = totalCurrent - totalInvested;
        const globalROI = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
        return { ...prev, userInvestments: next, dashboard: { ...prev.dashboard, totalInvested, totalCurrent, totalProfit, globalROI } };
      });
    },
    investmentProductsList: (userContext?.userInvestments || []).map((inv) => ({
      nameProduct: inv.nameProduct || inv.name || inv.nameproduct || "",
      budgetInvestment: Number(inv.valueInvested ?? inv.investedAmount ?? inv.amount ?? 0),
      roi1Year: Number(inv.roi_product ?? inv.roi1Year ?? inv.roi_1y ?? 0)
    }))
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 
