import React, { useState, useEffect, useRef, useMemo, useContext, useCallback } from "react";
import { UserContext } from "../Context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, UserRoundCog } from "lucide-react";
import { useNewsData } from "../../hooks/useNewsData";
import { useMarketQuotes } from "../../hooks/useMarketQuotes";
import Dashboardchart from "../Charts/Dashboardchart";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area
} from "recharts";
import { RecommendationEngine, ROICalculator } from "../Algo";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "../ui/chart.jsx";
import { useUserContext } from "../Context/useUserContext";
import { RadarChart as RChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

// Import new components
import {
  Sidebar,
  Header,
  InvestmentStats,
  PortfolioPerformanceChart,
  TransactionsHistory,
  RadarChart,
  SimplePieChart,
  NotificationHistory,
  PortfolioSummary,
  SimulationsPage,
  SectorBreakdown,
  NewsPage,
  NotificationDetailsPopup,
  SettingsModal,
  InvestmentsPage,
  AIAssistant
} from './components';

const UserDashboard = () => {
  const { setIsLoggedIn, userProfileData, userInvestments, accountBalance, updateAccountBalance } = useContext(UserContext);
  const { pendingInvestment, clearPendingInvestment, addUserInvestment } = useUserContext();

  // Prefer profile from context (Google or manual); fallback simple
  const fallbackAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=User";
  
  // Get avatar from multiple possible sources including Google profile
  const getAvatarSrc = () => {
    // First check userProfileData (unified context)
    if (userProfileData?.avatar) return userProfileData?.avatar;
    if (userProfileData?.picture) return userProfileData?.picture;
    if (userProfileData?.imageUrl) return userProfileData?.imageUrl;
    
    // Check Google profile in localStorage
    try {
      const googleProfile = JSON.parse(localStorage.getItem('googleProfile') || '{}');
      if (googleProfile.picture) return googleProfile.picture;
    } catch (e) {
      console.error('Error parsing Google profile:', e);
    }
    
    // Check alternative profile data in localStorage
    try {
      const profileData = JSON.parse(localStorage.getItem('userProfileData') || '{}');
      if (profileData.avatar) return profileData.avatar;
      if (profileData.picture) return profileData.picture;
    } catch (e) {
      console.error('Error parsing profile data:', e);
    }
    
    return fallbackAvatar;
  };
  
  const userData = {
    name: userProfileData?.fullName || userProfileData?.name || "Utilisateur",
    email: userProfileData?.email || "",
    avatar: getAvatarSrc(),
    createdAt: new Date()
  };

  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showProfitModal, setShowProfitModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [balanceOperation, setBalanceOperation] = useState("add"); // 'add' or 'withdraw'
  const [balanceAmount, setBalanceAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("paypal");
  const [profitOperation, setProfitOperation] = useState("withdraw");

  // Use context balance with local state fallback for backward compatibility
  const [userBalance, setUserBalance] = useState(() => {
    // Try to sync with context balance first
    if (accountBalance > 0) return accountBalance;
    // Otherwise check localStorage
    const storedBalance = localStorage.getItem('userBalance');
    return storedBalance ? parseFloat(storedBalance) : 0;
  });
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  
  // Sync local balance with context balance (only when context changes)
  useEffect(() => {
    if (accountBalance >= 0 && accountBalance !== userBalance) {
      setUserBalance(accountBalance);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountBalance]);
  
  // Wrapped setter that updates both local and context
  const updateBalance = useCallback((value) => {
    if (typeof value === 'function') {
      setUserBalance(prev => {
        const newValue = value(prev);
        updateAccountBalance(newValue, 'set');
        return newValue;
      });
    } else {
      setUserBalance(value);
      updateAccountBalance(value, 'set');
    }
  }, [updateAccountBalance]);

  const [recommendationEngine] = useState(new RecommendationEngine());
  const [portfolioData, setPortfolioData] = useState(() => {
    const storedPortfolio = localStorage.getItem('portfolioData');
    if (storedPortfolio) {
      try {
        return JSON.parse(storedPortfolio);
      } catch (error) {
        console.error('Error parsing stored portfolio data:', error);
      }
    }
    return {
      totalInvested: 0, // Start at 0
      globalPerformance: 0, // Start at 0
      dailyVariation: 0, // Start at 0
      monthlyGrowth: 0, // Start at 0
      portfolioBreakdown: [], // Start empty
      products: [] // Start empty, will be populated with real investments
    };
  });

  const [, setRecommendations] = useState([]);
  const [, setUserRiskProfile] = useState(null);

  // News + Marchés (NASDAQ/S&P/CAC 40) - Using React Query
  const { data: newsArticles = [], isLoading: newsLoading, error: newsError } = useNewsData();
  const { data: marketQuotes = [] } = useMarketQuotes();

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Simulation state variables
  const [simulationDateFilter, setSimulationDateFilter] = useState("all");

  // Read userProfileData and userResults from localStorage
  const [, setUserProfileData] = useState(null);
  const [userResults, setUserResults] = useState(null);
  const [localUserAnswers, setLocalUserAnswers] = useState(null);

useEffect(() => {
    const storedUserProfile = localStorage.getItem("userProfileData");
    if (storedUserProfile) {
      try {
        const parsedUserProfile = JSON.parse(storedUserProfile);
        setUserProfileData(parsedUserProfile);
      } catch (error) {
        console.error("Error parsing stored userProfileData:", error);
        setUserProfileData(null);
      }
    }

    const storedUserResults = localStorage.getItem("userResults");
    if (storedUserResults) {
      try {
        const parsedUserResults = JSON.parse(storedUserResults);
        setUserResults(parsedUserResults);
      } catch (error) {
        console.error("Error parsing stored userResults:", error);
        setUserResults(null);
      }
    }

    const storedUserAnswers = localStorage.getItem("userAnswers");
    if (storedUserAnswers) {
      try {
        const parsedUserAnswers = JSON.parse(storedUserAnswers);
        setLocalUserAnswers(parsedUserAnswers);
      } catch (error) {
        console.error("Error parsing stored userAnswers:", error);
        setLocalUserAnswers(null);
      }
    }
  }, []);

useEffect(() => {
    // When userAnswers exist, (re)generate recommendations and persist them
    if (localUserAnswers && Array.isArray(localUserAnswers) && localUserAnswers.length > 0) {
      try {
        const results = recommendationEngine.generateCompleteRecommendation(localUserAnswers);
        setUserResults(results);
        try {
          localStorage.setItem("userResults", JSON.stringify(results));
        } catch {
          // ignore
        }

        // Update portfolio widgets based on results
        if (results && results.allocation) {
          const newPortfolioData = {
            ...portfolioData,
            portfolioBreakdown: results.allocation.map((item) => ({
              name: item.name,
              value: (item.value / 100) * portfolioData.totalInvested,
            })),
          };
          setPortfolioData(newPortfolioData);
        }
      } catch (error) {
        console.error("Error generating recommendations:", error);
      }
    }
  }, [localUserAnswers]);

useEffect(() => {
    // If we already have userResults (from storage or generation), reflect them into portfolio widgets too
    if (userResults && userResults.allocation) {
      const newPortfolioData = {
        ...portfolioData,
        portfolioBreakdown: userResults.allocation.map((item) => ({
          name: item.name,
          value: (item.value / 100) * portfolioData.totalInvested,
          color: item.color
        })),
        products: (userResults.matchedProducts || []).slice(0, 4).map((product) => ({
          name: product.nom_produit,
          currentValue: Math.round(
            (product.overallCompatibility / 100) * (portfolioData.totalInvested / 4) * 1.05
          ),
          investedAmount: Math.round(
            (product.overallCompatibility / 100) * (portfolioData.totalInvested / 4)
          ),
          performance: Math.round((product.overallCompatibility || 0) * 0.1),
          risk: parseInt(product.risque) || 0,
          category: product.nom_produit.split(" ")[0]
        }))
      };

      setPortfolioData(newPortfolioData);
      setRecommendations(userResults.recommendations || []);
      setUserRiskProfile(userResults.riskProfile || null);
    }
  }, [userResults]);

  // Persist userBalance to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userBalance', userBalance.toString());
  }, [userBalance]);

  // Persist portfolioData to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
  }, [portfolioData]);

  // News and market data are now handled by React Query hooks above

  const [notifications, setNotifications] = useState(() => {
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      try {
        return JSON.parse(storedNotifications);
      } catch (error) {
        console.error('Error parsing stored notifications:', error);
      }
    }
    return [];
  });

  const [showInvestPopup, setShowInvestPopup] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [investAmount, setInvestAmount] = useState("");
  const [investmentHistory, setInvestmentHistory] = useState(() => {
    // First try to get from UserContext if available
    if (userInvestments && Array.isArray(userInvestments) && userInvestments.length > 0) {
      return userInvestments.map(inv => ({
        id: inv.id,
        name: inv.nameProduct || inv.name || 'Produit',
        amount: inv.valueInvested || inv.amount || 0,
        currentValue: inv.currentValue || inv.valueInvested || 0,
        profit: inv.profit || ((inv.currentValue || 0) - (inv.valueInvested || 0)),
        date: inv.date ? new Date(inv.date).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR'),
        sector: inv.category || inv.sector || 'autre',
        return: inv.roi_product ? `+${inv.roi_product}%` : '+0%'
      }));
    }
    
    // Otherwise try localStorage
    const storedHistory = localStorage.getItem('investmentHistory');
    if (storedHistory) {
      try {
        return JSON.parse(storedHistory);
      } catch (error) {
        console.error('Error parsing stored investment history:', error);
      }
    }
    return [];
  });

  const [showNotificationDetails, setShowNotificationDetails] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notificationHistory, setNotificationHistory] = useState(() => {
    const storedNotifications = localStorage.getItem('notificationHistory');
    if (storedNotifications) {
      try {
        return JSON.parse(storedNotifications);
      } catch (error) {
        console.error('Error parsing stored notification history:', error);
      }
    }
    return [];
  });
  const [transactionsHistory, setTransactionsHistory] = useState(() => {
    const storedTransactions = localStorage.getItem('transactionsHistory');
    if (storedTransactions) {
      try {
        return JSON.parse(storedTransactions);
      } catch (error) {
        console.error('Error parsing stored transactions history:', error);
      }
    }
    return [];
  });

  // Add sample data for chart demonstration
  useEffect(() => {
    if (transactionsHistory.length === 0) {
      const now = Date.now();
      const sampleTransactions = [
        {
          id: now - 30 * 24 * 60 * 60 * 1000, // 30 days ago
          type: "invest",
          amount: 5000,
          method: "Actions Tech Global",
          date: new Date(now - 30 * 24 * 60 * 60 * 1000).toLocaleString("fr-FR")
        },
        {
          id: now - 25 * 24 * 60 * 60 * 1000, // 25 days ago
          type: "invest",
          amount: 3000,
          method: "Obligations d'État",
          date: new Date(now - 25 * 24 * 60 * 60 * 1000).toLocaleString("fr-FR")
        },
        {
          id: now - 20 * 24 * 60 * 60 * 1000, // 20 days ago
          type: "invest",
          amount: 2500,
          method: "Fonds Euro Diversifié",
          date: new Date(now - 20 * 24 * 60 * 60 * 1000).toLocaleString("fr-FR")
        },
        {
          id: now - 15 * 24 * 60 * 60 * 1000, // 15 days ago
          type: "invest",
          amount: 4000,
          method: "OPCVM Actions Maroc",
          date: new Date(now - 15 * 24 * 60 * 60 * 1000).toLocaleString("fr-FR")
        },
        {
          id: now - 12 * 24 * 60 * 60 * 1000, // 12 days ago
          type: "invest",
          amount: 1800,
          method: "Immobilier REIT",
          date: new Date(now - 12 * 24 * 60 * 60 * 1000).toLocaleString("fr-FR")
        },
        {
          id: now - 8 * 24 * 60 * 60 * 1000, // 8 days ago
          type: "invest",
          amount: 3500,
          method: "Actions Tech Global",
          date: new Date(now - 8 * 24 * 60 * 60 * 1000).toLocaleString("fr-FR")
        },
        {
          id: now - 5 * 24 * 60 * 60 * 1000, // 5 days ago
          type: "invest",
          amount: 2200,
          method: "Matières Premières",
          date: new Date(now - 5 * 24 * 60 * 60 * 1000).toLocaleString("fr-FR")
        },
        {
          id: now - 2 * 24 * 60 * 60 * 1000, // 2 days ago
          type: "invest",
          amount: 2800,
          method: "Fonds Euro Diversifié",
          date: new Date(now - 2 * 24 * 60 * 60 * 1000).toLocaleString("fr-FR")
        }
      ];
      setTransactionsHistory(sampleTransactions);
    }
  }, []);

  // Initialize new users with starting balance and welcome notification
  useEffect(() => {
    const hasInitialized = localStorage.getItem('userInitialized');
    if (!hasInitialized) {
      // This is a new user, give them a starting balance
      const startingBalance = 10000; // Starting balance of 10,000 MAD
      setUserBalance(startingBalance);
      
      // Add a welcome notification
      const welcomeNotification = {
        id: Date.now(),
        type: 'welcome',
        title: 'Bienvenue sur Tawfir AI! 🎉',
        message: `Vous avez reçu ${startingBalance.toLocaleString()} MAD pour commencer votre parcours d'investissement.`,
        time: new Date().toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' }),
        isRead: false
      };
      
      setNotifications(prev => [welcomeNotification, ...prev]);
      
      // Mark user as initialized
      localStorage.setItem('userInitialized', 'true');
    }
  }, []);

  // Synchronize userInvestments from UserContext with local investmentHistory
  useEffect(() => {
    if (userInvestments && Array.isArray(userInvestments) && userInvestments.length > 0) {
      // Convert UserContext investments to local investmentHistory format
      const convertedInvestments = userInvestments.map(inv => ({
        id: inv.id,
        name: inv.nameProduct || inv.name || 'Produit',
        amount: inv.valueInvested || inv.amount || 0,
        currentValue: inv.currentValue || inv.valueInvested || 0,
        profit: inv.profit || ((inv.currentValue || 0) - (inv.valueInvested || 0)),
        date: inv.date ? new Date(inv.date).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR'),
        sector: inv.category || inv.sector || 'autre',
        return: inv.roi_product ? `+${inv.roi_product}%` : '+0%'
      }));
      
      // Update investmentHistory with the converted data
      setInvestmentHistory(prev => {
        // Create a map of existing investments by id for quick lookup
        const existingMap = new Map(prev.map(inv => [inv.id, inv]));
        
        // Update existing and add new investments
        const merged = convertedInvestments.map(newInv => {
          const existing = existingMap.get(newInv.id);
          // If exists and data changed, update it; otherwise keep the new one
          return existing ? { ...existing, ...newInv } : newInv;
        });
        
        // Check if there's actually a change before updating
        if (JSON.stringify(merged) !== JSON.stringify(prev)) {
          return merged;
        }
        return prev;
      });
    }
  }, [userInvestments]);

  // Persistence hooks - save data to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('investmentHistory', JSON.stringify(investmentHistory));
  }, [investmentHistory]);

  useEffect(() => {
    localStorage.setItem('transactionsHistory', JSON.stringify(transactionsHistory));
  }, [transactionsHistory]);

  useEffect(() => {
    localStorage.setItem('notificationHistory', JSON.stringify(notificationHistory));
  }, [notificationHistory]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const [showDateFilter, setShowDateFilter] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  // const [investRange] = useState("month"); // Unused variable

  const notificationRef = useRef(null);
  const invListRef = useRef(null);

  const scrollInvestments = (delta) => {
    const el = invListRef.current;
    if (!el) return;
    const firstItem = el.querySelector('[data-inv-item]');
    const itemH = firstItem ? firstItem.offsetHeight + 16 : 72; // item height + gap
    el.scrollBy({ top: delta * itemH, behavior: 'smooth' });
  };

useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (showMobileMenu && !event.target.closest(".mobile-menu-container")) {
        setShowMobileMenu(false);
      }
      if (showUserMenu) {
        setShowUserMenu(false);
      }
      if (showSettingsModal) {
        setShowSettingsModal(false);
      }
      if (showDateFilter && !event.target.closest(".date-filter-container")) {
        setShowDateFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBalanceOperation = () => {
    const amount = parseFloat(balanceAmount);
    if (!amount || amount <= 0 || isNaN(amount)) return;

    if (balanceOperation === "add") {
      updateBalance((prev) => prev + amount);
      setTransactionsHistory((prev) => [
        {
          id: Date.now(),
          type: "deposit",
          amount,
          method: "Direct",
          date: new Date().toLocaleString("fr-FR")
        },
        ...prev
      ]);
      const newNotif = {
        id: Date.now(),
        message: `Solde ajouté: +${(!isNaN(amount) ? amount.toLocaleString() : '0')} MAD`,
        time: "À l'instant",
        type: "success",
        title: "Dépôt Réussi",
        details: `Votre solde a été augmenté de ${(!isNaN(amount) ? amount.toLocaleString() : '0')} MAD. Votre nouveau solde disponible est de ${(
          !isNaN(userBalance + amount) ? (userBalance + amount).toLocaleString() : '0'
        )} MAD. Vous pouvez maintenant utiliser ces fonds pour de nouveaux investissements.`,
        astuce:
          "💡 Astuce: Gardez toujours une réserve d'urgence équivalente à 3-6 mois de dépenses avant d'investir.",
        isRead: false
      };
      setNotifications((prev) => [newNotif, ...prev.slice(0, 2)]);
      setNotificationHistory((prev) => [
        { ...newNotif, receivedAt: new Date().toLocaleString("fr-FR") },
        ...prev
      ]);
    } else if (balanceOperation === "withdraw") {
      updateBalance((prev) => prev - amount);
      setTransactionsHistory((prev) => [
        {
          id: Date.now(),
          type: "withdrawal",
          amount,
          method: "Direct",
          date: new Date().toLocaleString("fr-FR")
        },
        ...prev
      ]);
      const newNotif = {
        id: Date.now(),
        message: `Solde retiré: -${(!isNaN(amount) ? amount.toLocaleString() : '0')} MAD`,
        time: "À l'instant",
        type: "info",
        title: "Retrait Réussi",
        details: `Vous avez retiré ${(!isNaN(amount) ? amount.toLocaleString() : '0')} MAD de votre solde. Votre nouveau solde disponible est de ${(
          !isNaN(userBalance - amount) ? (userBalance - amount).toLocaleString() : '0'
        )} MAD.`,
        astuce:
          "💡 Astuce: Gardez un œil sur votre solde pour éviter les frais de découvert.",
        isRead: false
      };
      setNotifications((prev) => [newNotif, ...prev.slice(0, 2)]);
      setNotificationHistory((prev) => [
        { ...newNotif, receivedAt: new Date().toLocaleString("fr-FR") },
        ...prev
      ]);
    }

    setBalanceAmount("");
    setShowBalanceModal(false);
  };

  const handleProfitOperation = () => {
    const totalProfits = calculateTotalProfits();

    if (totalProfits <= 0) {
      const noProfitNotif = {
        id: Date.now(),
        message: `Aucun profit disponible`,
        time: "À l'instant",
        type: "warning",
        title: "Aucun Profit Disponible",
        details: `Vous n'avez actuellement aucun profit à retirer. Vos investissements doivent générer des gains positifs avant de pouvoir retirer les profits.`,
        astuce:
          "💡 Astuce: Les profits sont calculés en temps réel. Attendez que vos investissements génèrent des rendements positifs.",
        isRead: false
      };
      setNotifications((prev) => [noProfitNotif, ...prev.slice(0, 2)]);
      setNotificationHistory((prev) => [
        { ...noProfitNotif, receivedAt: new Date().toLocaleString("fr-FR") },
        ...prev
      ]);
      return;
    }

    if (profitOperation === "withdraw") {
      const paymentMethodNames = {
        paypal: "PayPal",
        card: "Visa/MasterCard",
        usdt: "USDT"
      };
      const paymentMethodName =
        paymentMethodNames[selectedPaymentMethod] || "PayPal";

      const profitWithdrawNotif = {
        id: Date.now(),
        message: `Profits retirés: ${totalProfits.toLocaleString()} MAD vers ${paymentMethodName}`,
        time: "À l'instant",
        type: "success",
        title: "Profits Retirés avec Succès",
        details: `Vos profits de ${totalProfits.toLocaleString()} MAD ont été retirés vers ${paymentMethodName}. Les fonds seront transférés sous 1-3 jours ouvrables. Vos investissements continuent de fonctionner avec le capital initial.`,
        astuce:
          "💡 Astuce: Retirer régulièrement vos profits vous permet de sécuriser vos gains tout en gardant votre capital investi.",
        isRead: false
      };
      setNotifications((prev) => [profitWithdrawNotif, ...prev.slice(0, 2)]);
      setNotificationHistory((prev) => [
        {
          ...profitWithdrawNotif,
          receivedAt: new Date().toLocaleString("fr-FR")
        },
        ...prev
      ]);

      setInvestmentHistory((prevHistory) =>
        prevHistory.map((inv) => ({
          ...inv,
          currentValue: inv.amount, // Reset to original investment amount
          profit: 0, // Reset profit to zero
          return: "+0.0%" // Reset return percentage
        }))
      );
      setTransactionsHistory((prev) => [
        {
          id: Date.now(),
          type: "profit_withdraw",
          amount: totalProfits,
          method: paymentMethodName,
          date: new Date().toLocaleString("fr-FR")
        },
        ...prev
      ]);
    } else if (profitOperation === "add") {
      updateBalance((prev) => prev + totalProfits);

      const profitAddNotif = {
        id: Date.now(),
        message: `Profits ajoutés au solde: +${totalProfits.toLocaleString()} MAD`,
        time: "À l'instant",
        type: "success",
        title: "Profits Ajoutés au Solde",
        details: `Vos profits de ${totalProfits.toLocaleString()} MAD ont été ajoutés à votre solde disponible. Vous pouvez maintenant utiliser ces fonds pour de nouveaux investissements.`,
        astuce:
          "💡 Astuce: Ajouter vos profits au solde vous permet de réinvestir immédiatement dans de nouveaux produits.",
        isRead: false
      };
      setNotifications((prev) => [profitAddNotif, ...prev.slice(0, 2)]);
      setNotificationHistory((prev) => [
        { ...profitAddNotif, receivedAt: new Date().toLocaleString("fr-FR") },
        ...prev
      ]);

      setInvestmentHistory((prevHistory) =>
        prevHistory.map((inv) => ({
          ...inv,
          currentValue: inv.amount,
          profit: 0,
          return: "+0.0%"
        }))
      );
      setTransactionsHistory((prev) => [
        {
          id: Date.now(),
          type: "profit_to_balance",
          amount: totalProfits,
          method: "internal",
          date: new Date().toLocaleString("fr-FR")
        },
        ...prev
      ]);
    }

    setSelectedPaymentMethod("paypal");
    setShowProfitModal(false);
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

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

    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);

    const productGroups = {};
    const colors = [
      "#3CD4AB",
      "#89559F",
      "#FF6B6B",
      "#4ECDC4",
      "#FFE66D",
      "#A8E6CF"
    ];

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

      // Use actual current value from investment (amount + profit)
      // If currentValue doesn't exist, calculate it from profit
      const currentValue = inv.currentValue || (inv.amount + (inv.profit || 0));

      productGroups[inv.name].totalInvested += inv.amount;
      productGroups[inv.name].currentValue += currentValue;
      productGroups[inv.name].investments.push({
        ...inv,
        currentValue
      });
    });

    const portfolioBreakdown = Object.values(productGroups).map((group) => ({
      name: group.name,
      value: group.totalInvested,
      color: group.color
    }));

    const products = Object.values(productGroups).map((group) => {
      const performance =
        ((group.currentValue - group.totalInvested) / group.totalInvested) *
        100;
      return {
        name: group.name,
        currentValue: Math.round(group.currentValue),
        investedAmount: group.totalInvested,
        performance: Math.round(performance * 100) / 100,
        risk: Math.floor(Math.random() * 7) + 1, // Random risk 1-7
        category: group.name.split(" ")[0]
      };
    });

    const totalCurrentValue = Object.values(productGroups).reduce(
      (sum, group) => sum + group.currentValue,
      0
    );
    const globalPerformance =
      totalInvested > 0
        ? ((totalCurrentValue - totalInvested) / totalInvested) * 100
        : 0;

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

  const updatePortfolioData = () => {
    const stats = calculatePortfolioStats(investmentHistory);

    // Build last 6 months labels in fr
    const monthFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'short' });
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const label = monthFormatter.format(d);
      return label.charAt(0).toUpperCase() + label.slice(1);
    });

    const performanceHistory = months.map((label, index) => ({
      date: label,
      value: stats.totalInvested * (0.95 + index * 0.02),
      benchmark: stats.totalInvested * (0.92 + index * 0.015)
    }));

    setPortfolioData((prev) => ({
      ...prev,
      ...stats,
      performanceHistory
    }));
  };

  const calculateSectorBreakdown = () => {
    if (!investmentHistory || investmentHistory.length === 0) {
      return [];
    }

    const sectorMapping = {
      "OPCVM Actions Maroc": "Finance",
      "Obligations d'État": "Finance",
      "Fonds Euro Diversifié": "Finance",
      "Actions Tech Global": "Technologie",
      "Immobilier REIT": "Immobilier",
      "Matières Premières": "Matières Premières",
      Actions: "Finance",
      Obligations: "Finance",
      "Fonds Euro": "Finance",
      "Livret A": "Finance"
    };

    const sectorTotals = {};
    const totalInvestment = investmentHistory.reduce(
      (sum, inv) => sum + inv.amount,
      0
    );

    investmentHistory.forEach((investment) => {
      const sector = investment.sector || sectorMapping[investment.name] || getSectorFromName(investment.name) || "Autres";
      if (!sectorTotals[sector]) {
        sectorTotals[sector] = 0;
      }
      sectorTotals[sector] += investment.amount;
    });

    return Object.entries(sectorTotals)
      .map(([sector, amount]) => ({
        sector,
        amount,
        percentage: Math.round((amount / totalInvestment) * 100)
      }))
      .sort((a, b) => b.amount - a.amount); // Sort by amount descending
  };

  const calculateInvestmentHistoryWithReturns = () => {
    return investmentHistory.map((investment) => {
      if (
        investment.currentValue &&
        investment.currentValue !== investment.amount &&
        investment.profit !== 0
      ) {
        const profit = investment.currentValue - investment.amount;
        const returnPercentage = (profit / investment.amount) * 100;

        return {
          ...investment,
          return: `${
            returnPercentage >= 0 ? "+" : ""
          }${returnPercentage.toFixed(1)}%`,
          currentValue: investment.currentValue,
          profit: profit
        };
      } else {
        const daysSinceInvestment = Math.floor(
          (new Date() - new Date(investment.date)) / (1000 * 60 * 60 * 24)
        );
        const baseReturn = Math.max(0, (daysSinceInvestment / 365) * 0.08); // 8% annual base return

        const seed = investment.id || investment.amount; // Use ID or amount as seed
        const randomFactor = (seed % 100) / 1000; // 0-0.1 additional return
        const totalReturnRate = baseReturn + randomFactor;

        const currentValue = Math.round(
          investment.amount * (1 + totalReturnRate)
        );
        const profit = currentValue - investment.amount;
        const returnPercentage = (profit / investment.amount) * 100;

        return {
          ...investment,
          return: `${
            returnPercentage >= 0 ? "+" : ""
          }${returnPercentage.toFixed(1)}%`,
          currentValue: currentValue,
          profit: profit
        };
      }
    });
  };

  const calculateTotalProfits = useCallback(() => {
    if (!investmentHistory || investmentHistory.length === 0) return 0;

    const totalProfits = investmentHistory.reduce((sum, inv) => {
      return sum + (inv.profit || 0);
    }, 0);

    return Math.max(0, totalProfits);
  }, [investmentHistory]);

  const handleSimulationFormChange = (field, value) => {
    setSimulationForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateSimulationResult = (capital, duration, riskProfile) => {
    const baseReturns = {
      conservateur: 0.04, // 4% annual
      modere: 0.07, // 7% annual
      dynamique: 0.1, // 10% annual
      agressif: 0.15 // 15% annual
    };

    const durationMonths = parseInt(duration);
    const years = durationMonths / 12;

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

  // Infer sector from product name using simple keyword mapping
  const getSectorFromName = (name = "") => {
    const n = String(name).toLowerCase();
    if (/(immobilier|reit)/i.test(n)) return "Immobilier";
    if (/(tech|technologie|it|software|saas)/i.test(n)) return "Technologie";
    if (/(actions|equity|stock)/i.test(n)) return "Finance";
    if (/(obligation|bond|état)/i.test(n)) return "Finance";
    if (/(matière|commodit|or|pétrole)/i.test(n)) return "Matières Premières";
    if (/(euro|fonds euro)/i.test(n)) return "Finance";
    if (/(livret|épargne)/i.test(n)) return "Finance";
    if (/(opcv m|opcvm)/i.test(n)) return "Finance";
    return "Autres";
  };

  const handleCreateSimulation = () => {
    const capital = parseFloat(simulationForm.initialCapital);

    if (!capital || capital <= 0) {
      alert("Veuillez entrer un capital initial valide");
      return;
    }

    if (capital > userBalance) {
      alert("Capital insuffisant dans votre solde");
      return;
    }

    const result = calculateSimulationResult(
      capital,
      simulationForm.duration,
      simulationForm.riskProfile
    );

    const newSimulation = {
      id: Date.now(),
      name: `Simulation ${
        simulationForm.riskProfile.charAt(0).toUpperCase() +
        simulationForm.riskProfile.slice(1)
      }`,
      initialCapital: capital,
      currentValue: result.finalValue,
      performance: result.totalReturn,
      duration:
        simulationForm.duration === "6"
          ? "6 mois"
          : simulationForm.duration === "12"
          ? "1 an"
          : simulationForm.duration === "24"
          ? "2 ans"
          : "5 ans",
      riskProfile:
        simulationForm.riskProfile.charAt(0).toUpperCase() +
        simulationForm.riskProfile.slice(1),
      createdAt: new Date().toLocaleDateString("fr-FR"),
      status: "active"
    };

    setRecentSimulations((prev) => [newSimulation, ...prev]);

    const simNotif = {
      id: Date.now(),
      message: `Simulation créée avec succès: ${result.totalReturn.toFixed(
        1
      )}% de rendement projeté`,
      time: "À l'instant",
      type: "success",
      title: "Simulation Créée",
      details: `Votre simulation avec un capital de ${capital.toLocaleString()} MAD a été créée. Rendement projeté: ${result.totalReturn.toFixed(
        1
      )}% sur ${newSimulation.duration}.`,
      astuce:
        "💡 Astuce: Les simulations vous aident à comprendre les risques et rendements potentiels avant d'investir réellement.",
      isRead: false
    };
    setNotifications((prev) => [simNotif, ...prev.slice(0, 2)]);
    setNotificationHistory((prev) => [
      { ...simNotif, receivedAt: new Date().toLocaleString("fr-FR") },
      ...prev
    ]);

    setSimulationForm({
      initialCapital: "",
      duration: "6",
      riskProfile: "conservateur"
    });
  };

  const getFilteredSimulations = () => {
    const now = new Date();
    const filterDate = new Date();

    switch (simulationDateFilter) {
      case "today":
        filterDate.setHours(0, 0, 0, 0);
        return recentSimulations.filter(
          (sim) => new Date(sim.createdAt) >= filterDate
        );
      case "week":
        filterDate.setDate(now.getDate() - 7);
        return recentSimulations.filter(
          (sim) => new Date(sim.createdAt) >= filterDate
        );
      case "month":
        filterDate.setMonth(now.getMonth() - 1);
        return recentSimulations.filter(
          (sim) => new Date(sim.createdAt) >= filterDate
        );
      default:
        return recentSimulations;
    }
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setShowNotificationDetails(true);
    setShowNotifications(false);
  };

  const handleMarkAsRead = (notificationId) => {
    const updatedNotifications = notifications.map((notif) =>
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    );

    const readNotification = notifications.find(
      (notif) => notif.id === notificationId
    );
    if (readNotification) {
      const readAt = new Date().toLocaleString("fr-FR");
      setNotificationHistory((prev) => {
        const exists = prev.some((n) => n.id === readNotification.id);
        if (exists) {
          return prev.map((n) =>
            n.id === readNotification.id ? { ...n, isRead: true, readAt } : n
          );
        }
        return [
          {
            ...readNotification,
            isRead: true,
            readAt
          },
          ...prev
        ];
      });
    }

    setNotifications(
      updatedNotifications.filter((notif) => notif.id !== notificationId)
    );
    setShowNotificationDetails(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <svg
            className="w-4 h-4 text-[#3CD4AB]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            ></path>
          </svg>
        );
      case "warning":
        return (
          <svg
            className="w-4 h-4 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        );
      default:
        return (
          <svg
            className="w-4 h-4 text-[#3CD4AB]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            ></path>
          </svg>
        );
    }
  };

  const handleInvestClick = (investment) => {
    setSelectedInvestment(investment);
    setInvestAmount("");
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
      alert("Veuillez entrer un montant valide");
      return;
    }

    if (amount < selectedInvestment.min) {
      alert(
        `Le montant minimum d'investissement est de ${selectedInvestment.min.toLocaleString()} MAD`
      );
      return;
    }

    if (amount > userBalance) {
      alert("Solde insuffisant");
      return;
    }

    updateBalance((prev) => prev - amount);

    const initialProfit = Math.max(1, Math.round(amount * 0.001));

    const newInvestment = {
      id: Date.now(),
      name: selectedInvestment?.name,
      amount: amount,
      currentValue: amount + initialProfit,
      profit: initialProfit,
      date: new Date().toLocaleDateString("fr-FR"),
      sector: getSectorFromName(selectedInvestment?.name),
      return: `+${((initialProfit / amount) * 100).toFixed(1)}%`
    };
    setInvestmentHistory((prev) => [newInvestment, ...prev]);

    // Add to shared context so Dashboardchart receives data
    try {
      addUserInvestment({
        picture: selectedInvestment?.image || "",
        nameProduct: selectedInvestment?.name,
        category: getSectorFromName(selectedInvestment?.name) || "other",
        valueInvested: amount,
        currentValue: amount + initialProfit,
        date: new Date().toISOString(),
        roi_product: Number(String(selectedInvestment.return).replace(/[^0-9.-]/g, "")) || 0
      });
    } catch {
      // ignore
    }

    setTransactionsHistory((prev) => [
      {
        id: Date.now(),
        type: "invest",
        amount,
        method: selectedInvestment.name,
        date: new Date().toLocaleString("fr-FR")
      },
      ...prev
    ]);

    const investNotif = {
      id: Date.now(),
      message: `Investissement de ${amount.toLocaleString()} MAD dans ${
        selectedInvestment.name
      } effectué avec succès`,
      time: "À l'instant",
      type: "success",
      title: "Investissement Réussi",
      details: `Votre investissement de ${amount.toLocaleString()} MAD dans ${
        selectedInvestment.name
      } a été traité avec succès. Votre portefeuille a été mis à jour et vous pouvez suivre la performance de cet investissement dans la section Portefeuille.`,
      astuce:
        "💡 Astuce: Diversifiez vos investissements pour réduire les risques. N'investissez jamais plus de 20% de votre capital dans un seul produit.",
      isRead: false
    };
    setNotifications((prev) => [investNotif, ...prev.slice(0, 2)]);
    setNotificationHistory((prev) => [
      { ...investNotif, receivedAt: new Date().toLocaleString("fr-FR") },
      ...prev
    ]);

    setShowInvestPopup(false);
    setSelectedInvestment(null);
    setInvestAmount("");
  };

  const [simulationForm, setSimulationForm] = useState({
    initialCapital: "",
    duration: "6",
    riskProfile: "conservateur"
  });
  const [recentSimulations, setRecentSimulations] = useState(() => {
    const storedSimulations = localStorage.getItem('recentSimulations');
    if (storedSimulations) {
      try {
        return JSON.parse(storedSimulations);
      } catch (error) {
        console.error('Error parsing stored recent simulations:', error);
      }
    }
    return [];
  });

  // Persist recentSimulations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('recentSimulations', JSON.stringify(recentSimulations));
  }, [recentSimulations]);

useEffect(() => {
    updatePortfolioData();
  }, [investmentHistory]);

useEffect(() => {
    if (investmentHistory.length === 0) return;

    const interval = setInterval(() => {
      setInvestmentHistory((prevHistory) => {
        return prevHistory.map((investment) => {
          const currentProfit = investment.profit || 0;
          const profitRatio = currentProfit / investment.amount;

          if (profitRatio > 0.5) return investment; // Cap at 50% profit

          // Increase profit by 5-9% randomly every tick (30s)
          const randomGrowth = 1 + (Math.random() * 0.04 + 0.05); // 5% to 9% growth
          const newProfit = Math.round(currentProfit * randomGrowth);
          const newCurrentValue = investment.amount + newProfit;
          const returnPercentage = (newProfit / investment.amount) * 100;

          return {
            ...investment,
            currentValue: Math.round(newCurrentValue),
            profit: Math.round(newProfit),
            return: `${returnPercentage >= 0 ? "+" : ""}${returnPercentage.toFixed(1)}%`
          };
        });
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [investmentHistory.length]);

useEffect(() => {
    if (pendingInvestment) {
      setSelectedInvestment(pendingInvestment.product);
      setInvestAmount(
        String(pendingInvestment.amount || pendingInvestment.product?.min || "")
      );
      setCurrentPage("investments");
      setShowInvestPopup(true);
      clearPendingInvestment();
    }
  }, [pendingInvestment, clearPendingInvestment]);

  // Update pie chart data in real-time based on investmentHistory changes
  useEffect(() => {
    const updatePieChartData = () => {
      if (!investmentHistory || investmentHistory.length === 0) {
        setPieChartData([]);
        return;
      }

      const colors = ['#3CD4AB', '#89559F', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
      
      // Group investments by product name and use ACTUAL profit values from investmentHistory
      const groupedInvestments = investmentHistory.reduce((acc, investment) => {
        const productName = investment?.name || `Produit ${acc.size + 1}`;
        
        if (acc.has(productName)) {
          // Product already exists - add to existing amounts
          const existing = acc.get(productName);
          existing.invested += investment?.amount || 0;
          existing.roi += investment?.profit || 0; // Sum actual current profits
        } else {
          // New product - create new entry
          acc.set(productName, {
            name: productName,
            invested: investment?.amount || 0,
            roi: investment?.profit || 0 // Use actual current profit
          });
        }
        
        return acc;
      }, new Map());

      // Convert Map to Array and build chart data
      const uniqueProducts = Array.from(groupedInvestments.values());
      
      // Always use actual values from investmentHistory (no independent incrementing)
      const newPieChartData = uniqueProducts.map((product, index) => ({
        name: product.name,
        invested: product.invested,
        roi: product.roi, // This is the sum of actual current profits
        total: product.invested + product.roi,
        color: colors[index % colors.length]
      }));
      
      setPieChartData(newPieChartData);
    };

    // Update immediately when investmentHistory changes
    updatePieChartData();

  }, [investmentHistory]); // Re-run whenever investmentHistory changes (including profit updates)

  const matchedInvestments = useMemo(() => {
    if (!userResults || !userResults.matchedProducts) return [];
    return userResults.matchedProducts.map((p) => {
      // Calculate ROI for different investment amounts
      const roi1Year = ROICalculator.calculateSimpleROI(
        10000,
        p.roi_annuel !== undefined ? p.roi_annuel : 5,
        1
      );
      const roi3Years = ROICalculator.calculateSimpleROI(
        10000,
        p.roi_annuel !== undefined ? p.roi_annuel : 5,
        3
      );
      const roi5Years = ROICalculator.calculateSimpleROI(
        10000,
        p.roi_annuel !== undefined ? p.roi_annuel : 5,
        5
      );

      return {
        id: p.id || p.nom_produit, // Add unique id for cart functionality
        name: p.nom_produit,
        risk: Number(p.risque) || 3,
        return: `${Math.max(
          3,
          Math.min(12, Math.round(p.overallCompatibility / 10 + 5))
        )}%`,
        min: 1000,
        description: p.duree_recommandee,
        image: p?.avatar || "/public/assets/marketstock.png",
        roi: {
          annual: p.roi_annuel !== undefined ? p.roi_annuel : 5,
          roi1Year: roi1Year.roiPercentage,
          roi3Years: roi3Years.roiPercentage,
          roi5Years: roi5Years.roiPercentage,
          volatility: p.volatilite || 5,
          fees: p.frais_annuels || 1,
          dividends: p.volatilite || 0,
          liquidity: p.liquidite || "Standard"
        }
      };
    });
  }, [userResults]);

  // Radar Chart: compute behavioral profile from current investments and/or user results
  const radarData = useMemo(() => {
    const invs = Array.isArray(userInvestments) ? userInvestments : [];
    const totalInvested = invs.reduce((sum, inv) => sum + (Number(inv.valueInvested ?? inv.investedAmount ?? inv.amount ?? 0) || 0), 0);

    // Category heuristics
    const getCategory = (name = "") => {
      const n = String(name).toLowerCase();
      if (/(epargne|livret|compte|deposit|épargne)/i.test(n)) return "epargne";
      if (/(obligat|bond|etat|état)/i.test(n)) return "obligations";
      if (/(opcvm|fonds|fund)/i.test(n)) return "opcvm";
      if (/(action|equity|stock|tech|indice)/i.test(n)) return "actions";
      return "autres";
    };

    // Weighted scores (0-100)
    // Risque: actions 90, opcvm 60, obligations 30, epargne 10, autres 50
    const riskWeights = { actions: 90, opcvm: 60, obligations: 30, epargne: 10, autres: 50 };
    // Liquidité: epargne 90, obligations 60, opcvm 50, actions 30, autres 50
    const liqWeights = { epargne: 90, obligations: 60, opcvm: 50, actions: 30, autres: 50 };
    // Horizon (long): actions 85, opcvm 70, obligations 60, epargne 30, autres 50
    const horizonWeights = { actions: 85, opcvm: 70, obligations: 60, epargne: 30, autres: 50 };

    const weighted = invs.reduce(
      (acc, inv) => {
        const amt = Number(inv.valueInvested ?? inv.investedAmount ?? inv.amount ?? 0) || 0;
        const cat = getCategory(inv.nameProduct || inv.name || "");
        acc.risk += amt * (riskWeights[cat] ?? 50);
        acc.liq += amt * (liqWeights[cat] ?? 50);
        acc.horizon += amt * (horizonWeights[cat] ?? 50);
        return acc;
      },
      { risk: 0, liq: 0, horizon: 0 }
    );

    const avg = (v) => (totalInvested > 0 ? Math.round(v / totalInvested) : 50);
    let Risque = avg(weighted.risk);
    let Liquidité = avg(weighted.liq);
    let Horizon = avg(weighted.horizon);

    // Diversification: based on number of distinct products and categories
    const distinctNames = new Set(invs.map((i) => i.nameProduct || i.name).filter(Boolean));
    const distinctCats = new Set(invs.map((i) => getCategory(i.nameProduct || i.name)).filter(Boolean));
    const Diversification = Math.max(0, Math.min(100, (distinctNames.size * 15) + (distinctCats.size * 10)));

    // Confiance: proxy by unrealized profit ratio (current - invested)
    const totalCurrent = invs.reduce((s, i) => s + (Number(i.currentValue ?? 0) || 0), 0);
    const totalProfit = Math.max(0, totalCurrent - totalInvested);
    const profitRatio = totalInvested > 0 ? totalProfit / totalInvested : 0;
    const Confiance = Math.max(10, Math.min(100, Math.round(40 + profitRatio * 200))); // center ~40, up with gains

    // If userResults has riskProfile, nudge risk and horizon
    const riskLevel = userResults?.riskProfile?.riskLevel || "";
    if (/agressif/i.test(riskLevel)) {
      Risque = Math.min(100, Risque + 15);
      Horizon = Math.min(100, Horizon + 10);
      Liquidité = Math.max(0, Liquidité - 10);
    } else if (/prudent|conservateur/i.test(riskLevel)) {
      Risque = Math.max(0, Risque - 15);
      Liquidité = Math.min(100, Liquidité + 10);
    }

    return [
      { metric: "Risque", value: Risque },
      { metric: "Liquidité", value: Liquidité },
      { metric: "Horizon", value: Horizon },
      { metric: "Diversification", value: Diversification },
      { metric: "Confiance", value: Confiance }
    ];
  }, [userInvestments, userResults]);

  // Interactive Area Chart state: day / month / year
  const [areaRange, setAreaRange] = useState("month");
  
  // Pie Chart data for products investment and ROI
  const [pieChartData, setPieChartData] = useState([]);
  
  const areaSeries = useMemo(() => {
    const investedTotal = portfolioData?.totalInvested || 0;
    const profitsTotal = calculateTotalProfits();

    const now = new Date();
    const makePoint = (dateLabel, idx, count) => {
      const investBase = investedTotal * (0.8 + (idx / Math.max(1, count - 1)) * 0.4); // 80% -> 120%
      const roiBase = profitsTotal * (0.5 + (idx / Math.max(1, count - 1)) * 0.8); // 50% -> 130%
      return {
        date: dateLabel,
        invested: Math.max(0, Math.round(investBase)),
        roi: Math.max(0, Math.round(roiBase))
      };
    };

    if (areaRange === "day") {
      const points = 30;
      return Array.from({ length: points }, (_, i) => {
        const d = new Date(now);
        d.setDate(now.getDate() - (points - 1 - i));
        const label = d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
        return makePoint(label, i, points);
      });
    }
    if (areaRange === "year") {
      const points = 5;
      return Array.from({ length: points }, (_, i) => {
        const d = new Date(now);
        d.setFullYear(now.getFullYear() - (points - 1 - i));
        const label = d.getFullYear().toString();
        return makePoint(label, i, points);
      });
    }
    // default: month (last 12 months)
    const points = 12;
    return Array.from({ length: points }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (points - 1 - i), 1);
      const label = d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
      return makePoint(label.charAt(0).toUpperCase() + label.slice(1), i, points);
    });
  }, [areaRange, portfolioData?.totalInvested, calculateTotalProfits]);

  return (
    <>
      <div className="bg-[#0F0F19] min-h-screen ">
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        
        {/* Header */}
        <Header 
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
          userBalance={userBalance}
          setUserBalance={updateBalance}
          setBalanceOperation={setBalanceOperation}
          setShowBalanceModal={setShowBalanceModal}
          userData={userData}
          fallbackAvatar={fallbackAvatar}
          showUserMenu={showUserMenu}
          setShowUserMenu={setShowUserMenu}
          setShowSettingsModal={setShowSettingsModal}
          setIsLoggedIn={setIsLoggedIn}
          navigate={navigate}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          notifications={notifications}
          getNotificationIcon={getNotificationIcon}
          handleNotificationClick={handleNotificationClick}
          setNotificationHistory={setNotificationHistory}
          setNotifications={setNotifications}
          notificationRef={notificationRef}
          portfolioData={portfolioData}
          calculateTotalProfits={calculateTotalProfits}
          setShowProfitModal={setShowProfitModal}
          setProfitOperation={setProfitOperation}
          setInvestmentHistory={setInvestmentHistory}
          addUserInvestment={addUserInvestment}
          getSectorFromName={getSectorFromName}
        />

        {/* Sidebar */}
        <Sidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isSidebarHovered={isSidebarHovered}
          setIsSidebarHovered={setIsSidebarHovered}
          currentPage={currentPage}
          handleNavigation={handleNavigation}
        />

        {/* Main Content */}
        <div className={`p-2 sm:p-3 lg:p-4 pt-32 sm:pt-36 lg:pt-20 pb-24 lg:pb-8 transition-all duration-200 ${isSidebarHovered ? 'lg:ml-64' : 'lg:ml-16'} h-screen overflow-y-auto`}>
          <div className="p-2 sm:p-4 lg:p-6 bg-[#0F0F19] border border-[#89559F]/20 rounded-lg shadow-sm min-h-full">
            {/* Render different pages based on currentPage */}
            {currentPage === "dashboard" && (
              <div>

                {/* Investment Stats */}
                <InvestmentStats 
                  userBalance={userBalance}
                  portfolioData={portfolioData}
                  calculateTotalProfits={calculateTotalProfits}
                />

                {/* Profil d'Investisseur et Répartition des Investissements */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 lg:gap-4 mb-4 lg:mb-6">
                  {/* Profil d'Investisseur - Radar Chart */}
                  <RadarChart 
                    radarData={radarData}
                  />

                  {/* Répartition des Investissements - Simple Pie Chart */}
                  <SimplePieChart 
                    pieChartData={pieChartData}
                    setCurrentPage={setCurrentPage}
                  />
                </div>

                {/* Tableau détaillé par produit avec valeur actuelle et performance */}
                <div className="flex flex-col">
                  {/* Portfolio Performance Chart */}
                  <PortfolioPerformanceChart 
                    userInvestments={userInvestments}
                  />

                  {/* Transactions History */}
                  <TransactionsHistory 
                    transactionsHistory={transactionsHistory}
                  />
                </div>
+

              </div>
            )}

            {/* Portfolio Page */}
            {currentPage === "portfolio" && (
              <div className="flex-col">

                {/* Portfolio Summary */}
                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <PortfolioSummary 
                    calculateInvestmentHistoryWithReturns={calculateInvestmentHistoryWithReturns}
                    portfolioData={portfolioData}
                    investmentHistory={investmentHistory}
                    calculateSectorBreakdown={calculateSectorBreakdown}
                  />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 xl:gap-8">
                  {/* Sector Breakdown - Enhanced Container */}
                  <div className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                    <SectorBreakdown 
                      calculateSectorBreakdown={calculateSectorBreakdown}
                    />
                  </div>

                  {/* Investment History - Enhanced Design */}
                  <div className="group relative overflow-hidden rounded-2xl   p-6 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                    <div className="absolute inset-0  bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm"></div>
                    
                    {/* Header with Icon */}
                    <div className="relative flex items-center justify-between mb-2 ">
                      <div className="flex items-center space-x-3">
      
                        <h3 className="text-xl font-bold text-gray-50">
                          Historique d'Investissements
                        </h3>
                      </div>
                      
                      {/* Scroll Controls - Enhanced */}
                      {calculateInvestmentHistoryWithReturns().length > 3 && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => scrollInvestments(-1)}
                            className="group/btn p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 text-white border border-purple-500/30 hover:border-purple-400/50 transition-all duration-200 hover:scale-110"
                          >
                            <svg className="w-4 h-4 transform group-hover/btn:-translate-y-0.5 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => scrollInvestments(1)}
                            className="group/btn p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 text-white border border-purple-500/30 hover:border-purple-400/50 transition-all duration-200 hover:scale-110"
                          >
                            <svg className="w-4 h-4 transform group-hover/btn:translate-y-0.5 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Investment List */}
                    <div className="relative">
                      <div
                        ref={invListRef}
                        className={`${calculateInvestmentHistoryWithReturns().length > 3 ? "max-h-60 overflow-y-auto" : ""}`}
                        style={{ 
                          scrollBehavior: "smooth",
                          scrollbarWidth: "none",
                          msOverflowStyle: "none"
                        }}
                      >
                        <div className="space-y-3">
                          {calculateInvestmentHistoryWithReturns().map(
                            (investment) => (
                              <div
                                key={investment.id}
                                data-inv-item
                                className="group/item relative overflow-hidden rounded-xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10 p-4 hover:from-white/10 hover:to-white/15 hover:border-purple-400/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-indigo-600/5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                                
                                <div className="relative flex justify-between items-center">
                                  <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                      <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-r from-[#3CD4AB] to-emerald-400 shadow-lg"></span>
                                    </div>
                                    <div>
                                      <span className="text-white font-semibold group-hover/item:text-purple-200 transition-colors">
                                        {investment.name}
                                      </span>
                                      <div className="text-white/60 text-sm mt-1">
                                        {investment.date}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="text-right">
                                    <div className="text-white font-bold text-lg group-hover/item:text-purple-200 transition-colors">
                                      {investment.amount.toLocaleString()} MAD
                                    </div>
                                    <div className="flex items-center justify-end space-x-2 mt-1">
                                      <div
                                        className={`text-sm font-semibold px-2 py-1 rounded-full ${
                                          investment.return.startsWith("+")
                                            ? "text-[#3CD4AB] bg-[#3CD4AB]/10"
                                            : "text-red-400 bg-red-400/10"
                                        }`}
                                      >
                                        {investment.return}
                                      </div>
                                      <div className="text-white/60 text-xs">
                                        ({investment.currentValue.toLocaleString()} MAD)
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      
                      {/* Empty State */}
                      {investmentHistory.length === 0 && (
                        <div className="relative text-center py-12">
                          <div className="absolute inset-0 flex items-center justify-center opacity-10">
                            <svg className="w-24 h-24 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                          </div>
                          <div className="relative">
                            <p className="text-white/60 mb-2">Aucun investissement pour le moment</p>
                            <p className="text-white/40 text-sm">Vos futurs investissements apparaîtront ici</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notification History Section - Enhanced */}
                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <NotificationHistory 
                    notificationHistory={notificationHistory}
                    getNotificationIcon={getNotificationIcon}
                  />
                </div>

                {/* Investment Revenue Chart Section Placeholder */}
                <div className="h-4">
                </div>
              </div>
            )}

            {/* Investments Page */}
            {currentPage === "investments" && (
              <InvestmentsPage 
                userResults={userResults}
                matchedInvestments={matchedInvestments}
                handleInvestClick={handleInvestClick}
                userBalance={userBalance}
              />
            )}

            {/* Simulations Page */}
            {currentPage === "simulations" && (
              <SimulationsPage 
                userBalance={userBalance}
                simulationForm={simulationForm}
                handleSimulationFormChange={handleSimulationFormChange}
                handleCreateSimulation={handleCreateSimulation}
                recentSimulations={recentSimulations}
                simulationDateFilter={simulationDateFilter}
                setSimulationDateFilter={setSimulationDateFilter}
                getFilteredSimulations={getFilteredSimulations}
              />
            )}

            {/* News Page */}
            {currentPage === "news" && (
              <NewsPage 
                newsLoading={newsLoading}
                newsError={newsError}
                newsArticles={newsArticles}
                marketQuotes={marketQuotes}
              />
            )}

            {/* Balance Modal */}
            {showBalanceModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-[#0F0F19] border border-white/20 rounded-lg p-6 w-full max-w-md mx-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">
                      {balanceOperation === "add"
                        ? "Ajouter du Solde"
                        : "Retirer du Solde"}
                    </h3>
                    <button
                      onClick={() => setShowBalanceModal(false)}
                      className="text-white/60 hover:text-white"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        {balanceOperation === "add"
                          ? "Montant à ajouter (MAD)"
                          : "Montant à retirer (MAD)"}
                      </label>
                      <input
                        type="number"
                        value={balanceAmount}
                        onChange={(e) => setBalanceAmount(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:border-[#3CD4AB] focus:outline-none"
                        placeholder="1000"
                        min="1"
                        max={
                          balanceOperation === "withdraw"
                            ? userBalance
                            : undefined
                        }
                      />
                      {balanceOperation === "withdraw" && (
                        <p className="text-white/60 text-sm mt-1">
                          Solde disponible: {userBalance.toLocaleString()} MAD
                        </p>
                      )}
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
                          balanceOperation === "add"
                            ? "bg-[#3CD4AB] hover:bg-[#3CD4AB]/80 text-[#0F0F19]"
                            : "bg-orange-500 hover:bg-orange-600 text-white"
                        }`}
                        disabled={
                          !balanceAmount ||
                          parseFloat(balanceAmount) <= 0 ||
                          (balanceOperation === "withdraw" &&
                            parseFloat(balanceAmount) > userBalance)
                        }
                      >
                        {balanceOperation === "add" ? "Ajouter" : "Retirer"}
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
                      {profitOperation === "withdraw"
                        ? "Retirer les Profits"
                        : "Ajouter au Solde"}
                    </h3>
                    <button
                      onClick={() => setShowProfitModal(false)}
                      className="text-white/60 hover:text-white"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-[#3CD4AB]/10 border border-[#3CD4AB]/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">
                          Profits disponibles:
                        </span>
                        <span className="text-2xl font-bold text-[#3CD4AB]">
                          {calculateTotalProfits().toLocaleString()} MAD
                        </span>
                      </div>
                    </div>

                    {profitOperation === "withdraw" && (
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-3">
                          Méthode de Retrait
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                          {/* PayPal */}
                          <div
                            onClick={() => setSelectedPaymentMethod("paypal")}
                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                              selectedPaymentMethod === "paypal"
                                ? "border-[#3CD4AB] bg-[#3CD4AB]/10"
                                : "border-white/20 bg-white/5 hover:bg-white/10"
                            }`}
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-4 h-4 rounded-full border-2 mr-3 ${
                                  selectedPaymentMethod === "paypal"
                                    ? "border-[#3CD4AB] bg-[#3CD4AB]"
                                    : "border-white/40"
                                }`}
                              >
                                {selectedPaymentMethod === "paypal" && (
                                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                )}
                              </div>
                              <div className="flex items-center">
                                <svg
                                  className="w-6 h-6 mr-2"
                                  viewBox="0 0 24 24"
                                  fill="#0070ba"
                                >
                                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a.696.696 0 0 1-.045-.288c.078-.815-.191-1.35-.821-1.85-.619-.49-1.555-.73-2.786-.73H8.618l-.9 5.712h2.712c2.508 0 4.416-.816 5.195-3.844z" />
                                </svg>
                                <span className="text-white font-medium">
                                  PayPal
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {profitOperation === "add" && (
                      <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                        <p className="text-white/80 text-sm">
                          Vos profits seront ajoutés à votre solde disponible
                          pour de nouveaux investissements. Cela vous permettra
                          de profiter de l'effet de capitalisation.
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
                          profitOperation === "withdraw"
                            ? "bg-orange-500 hover:bg-orange-600 text-white"
                            : "bg-[#3CD4AB] hover:bg-[#3CD4AB]/80 text-[#0F0F19]"
                        }`}
                        disabled={calculateTotalProfits() <= 0}
                      >
                        {profitOperation === "withdraw"
                          ? "Retirer les Profits"
                          : "Ajouter au Solde"}
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
                    <h3 className="text-xl font-bold text-white">
                      Investir dans {selectedInvestment.name}
                    </h3>
                    <button
                      onClick={() => setShowInvestPopup(false)}
                      className="text-white/60 hover:text-white"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Product Image */}
                  <div className="mb-4">
                    <img
                      src={selectedInvestment?.image}
                      alt={selectedInvestment?.name}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {selectedInvestment?.name}
                    </h4>
                    <p className="text-white/60 text-sm mb-3">
                      {selectedInvestment?.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-white/60">Rendement:</span>
                        <span className="text-[#3CD4AB] font-semibold ml-2">
                          {selectedInvestment?.return}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/60">Risque:</span>
                        <span className="text-white ml-2">
                          {selectedInvestment?.risk}/10
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-white/60">
                          Investissement minimum:
                        </span>
                        <span className="text-white font-semibold ml-2">
                          {selectedInvestment?.min?.toLocaleString()} MAD
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Balance Info */}
                  <div className="mb-4 p-3 bg-white/5 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/60">Solde disponible:</span>
                      <span className="text-[#3CD4AB] font-semibold">
                        {userBalance.toLocaleString()} MAD
                      </span>
                    </div>
                    {investAmount && (
                      <div className="flex justify-between items-center">
                        <span className="text-white/60">
                          Solde après investissement:
                        </span>
                        <span
                          className={`font-semibold ${
                            calculateRemainingBalance() >= 0
                              ? "text-[#3CD4AB]"
                              : "text-red-400"
                          }`}
                        >
                          {calculateRemainingBalance().toLocaleString()} MAD
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Investment Amount Input */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Montant à investir (MAD)
                      </label>
                      <input
                        type="number"
                        value={investAmount}
                        onChange={handleInvestAmountChange}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:border-[#3CD4AB] focus:outline-none"
                        placeholder={`Minimum ${selectedInvestment?.min.toLocaleString()} MAD`}
                        min={selectedInvestment?.min}
                        max={userBalance}
                      />
                      {investAmount &&
                        parseFloat(investAmount) < selectedInvestment.min && (
                          <p className="text-red-400 text-sm mt-1">
                            Le montant minimum est de{" "}
                            {selectedInvestment?.min.toLocaleString()} MAD
                          </p>
                        )}
                      {investAmount &&
                        parseFloat(investAmount) > userBalance && (
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
                        disabled={
                          !investAmount ||
                          parseFloat(investAmount) < selectedInvestment?.min ||
                          parseFloat(investAmount) > userBalance
                        }
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
            <NotificationDetailsPopup 
              showNotificationDetails={showNotificationDetails}
              selectedNotification={selectedNotification}
              setShowNotificationDetails={setShowNotificationDetails}
              getNotificationIcon={getNotificationIcon}
              handleMarkAsRead={handleMarkAsRead}
            />

            {/* Settings Modal */}
            <SettingsModal 
              showSettingsModal={showSettingsModal}
              setShowSettingsModal={setShowSettingsModal}
              userData={userData}
              fallbackAvatar={fallbackAvatar}
              setIsLoggedIn={setIsLoggedIn}
              navigate={navigate}
            />

            {/* AI Assistant */}
            <AIAssistant 
              isOpen={showAIAssistant}
              onClose={() => setShowAIAssistant(false)}
              userBalance={userBalance}
              userInvestments={userInvestments}
              portfolioData={portfolioData}
            />
          </div>
        </div>

        {/* Floating AI Assistant Button */}
        <div className="fixed bottom-20 lg:bottom-6 right-6 z-40">
          <button
            onClick={() => setShowAIAssistant(true)}
            className="group relative w-14 h-14 bg-gradient-to-r from-[#3CD4AB] to-emerald-400 hover:from-[#3CD4AB]/90 hover:to-emerald-400/90 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-110"
          >
            {/* Robot AI Icon */}
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              {/* Robot head */}
              <rect x="6" y="6" width="12" height="10" rx="2" fill="currentColor"/>
              {/* Robot antenna */}
              <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="2" r="1.5" fill="currentColor"/>
              {/* Robot eyes */}
              <circle cx="9" cy="10" r="1.5" fill="white"/>
              <circle cx="15" cy="10" r="1.5" fill="white"/>
              {/* Robot mouth */}
              <rect x="10" y="13" width="4" height="1" fill="white"/>
              {/* Robot body */}
              <rect x="8" y="16" width="8" height="6" rx="1" fill="currentColor"/>
              {/* Robot arms */}
              <rect x="4" y="18" width="3" height="2" rx="1" fill="currentColor"/>
              <rect x="17" y="18" width="3" height="2" rx="1" fill="currentColor"/>
            </svg>
            
            {/* Pulse animation */}
            <div className="absolute inset-0 rounded-full bg-[#2a78633e] animate-ping opacity-20"></div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Assistant IA
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;

















