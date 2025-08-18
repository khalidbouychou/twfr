import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { useUserContext } from "../Context/useUserContext";

const UserDashboard = () => {
  const { pendingInvestment, clearPendingInvestment } = useUserContext();
  
  // Mock user data since we removed authentication
  const userData = {
    name: 'KHALID',
    email: 'demo@tawfir.ai',
    avatar: 'https://cdn.intra.42.fr/users/74758a0eee89f55f72d656fc0645b523/khbouych.jpg',
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

  const [userBalance, setUserBalance] = useState(0);

  const [recommendationEngine] = useState(new RecommendationEngine());
  const [portfolioData, setPortfolioData] = useState({
    totalInvested: 0, // Start at 0
    globalPerformance: 0, // Start at 0
    dailyVariation: 0, // Start at 0
    monthlyGrowth: 0, // Start at 0
    portfolioBreakdown: [], // Start empty
    performanceHistory: [
      { date: "Jan", value: 0, benchmark: 0 },
      { date: "Fév", value: 0, benchmark: 0 },
      { date: "Mar", value: 0, benchmark: 0 },
      { date: "Avr", value: 0, benchmark: 0 },
      { date: "Mai", value: 0, benchmark: 0 },
      { date: "Juin", value: 0, benchmark: 0 }
    ],
    products: [] // Start empty, will be populated with real investments
  });

  const [, setRecommendations] = useState([]);
  const [, setUserRiskProfile] = useState(null);

  // News + Marchés (NASDAQ/S&P/CAC 40)
  const [newsArticles, setNewsArticles] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState(null);
  const [marketQuotes, setMarketQuotes] = useState([]);

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Read userProfileData and userResults from localStorage
  const [userProfileData, setUserProfileData] = useState(null);
  const [userResults, setUserResults] = useState(null);

  // Read data from localStorage
  useEffect(() => {
    const storedUserProfile = localStorage.getItem('userProfileData');
    if (storedUserProfile) {
      try {
        const parsedUserProfile = JSON.parse(storedUserProfile);
        setUserProfileData(parsedUserProfile);
      } catch (error) {
        console.error('Error parsing stored userProfileData:', error);
        setUserProfileData(null);
      }
    }

    const storedUserResults = localStorage.getItem('userResults');
    if (storedUserResults) {
      try {
        const parsedUserResults = JSON.parse(storedUserResults);
        setUserResults(parsedUserResults);
      } catch (error) {
        console.error('Error parsing stored userResults:', error);
        setUserResults(null);
      }
    }
  }, []);

  useEffect(() => {
    // Actualités via fournisseurs multiples (FR): Newsdata -> GNews -> NewsAPI -> Mediastack -> ContextualWeb
    const NEWSDATA_KEY = 'pub_a433db815e694abe98923ab9daac2de5';
    const GNEWS_KEY = import.meta.env.VITE_GNEWS_KEY;
    const NEWSAPI_KEY = import.meta.env.VITE_NEWSAPI_KEY;
    const MEDIASTACK_KEY = import.meta.env.VITE_MEDIASTACK_KEY;
    const CTX_NEWS_KEY = import.meta.env.VITE_CTX_NEWS_KEY; // RapidAPI key
    const CTX_NEWS_HOST = import.meta.env.VITE_CTX_NEWS_HOST || 'contextualwebsearch-websearch-v1.p.rapidapi.com';

    const q = 'finance OR bourse OR "marché boursier" OR investissement';

    const getFromNewsdata = async () => {
      if (!NEWSDATA_KEY) throw new Error('no_newsdata_key');
      const url = `https://newsdata.io/api/1/news?apikey=${NEWSDATA_KEY}&language=fr&category=business&q=${encodeURIComponent(q)}`;
      const r = await fetch(url);
      if (!r.ok) throw new Error('newsdata_err');
      const data = await r.json();
      const items = Array.isArray(data.results) ? data.results : [];
      return items.map(a => ({
        title: a.title,
        description: a.description,
        url: a.link,
        image: a.image_url,
        source: a.source_id,
        publishedAt: a.pubDate ? new Date(a.pubDate).toISOString() : null,
      })).filter(n => n.title && n.url);
    };

    const getFromGNews = async () => {
      if (!GNEWS_KEY) throw new Error('no_gnews_key');
      const url = `https://gnews.io/api/v4/top-headlines?lang=fr&topic=business&max=20&apikey=${GNEWS_KEY}&q=${encodeURIComponent(q)}`;
      const r = await fetch(url);
      if (!r.ok) throw new Error('gnews_err');
      const data = await r.json();
      const items = Array.isArray(data.articles) ? data.articles : [];
      return items.map(a => ({
        title: a.title,
        description: a.description,
        url: a.url,
        image: a.image,
        source: a.source?.name,
        publishedAt: a.publishedAt,
      })).filter(n => n.title && n.url);
    };

    const getFromNewsAPI = async () => {
      if (!NEWSAPI_KEY) throw new Error('no_newsapi_key');
      const url = `https://newsapi.org/v2/everything?language=fr&pageSize=20&sortBy=publishedAt&q=${encodeURIComponent(q)}&apiKey=${NEWSAPI_KEY}`;
      const r = await fetch(url);
      if (!r.ok) throw new Error('newsapi_err');
      const data = await r.json();
      const items = Array.isArray(data.articles) ? data.articles : [];
      return items.map(a => ({
        title: a.title,
        description: a.description,
        url: a.url,
        image: a.urlToImage,
        source: a.source?.name,
        publishedAt: a.publishedAt,
      })).filter(n => n.title && n.url);
    };

    const getFromMediastack = async () => {
      if (!MEDIASTACK_KEY) throw new Error('no_mediastack_key');
      const url = `https://api.mediastack.com/v1/news?access_key=${MEDIASTACK_KEY}&languages=fr&categories=business&limit=20&sort=published_desc&keywords=${encodeURIComponent(q)}`;
      const r = await fetch(url);
      if (!r.ok) throw new Error('mediastack_err');
      const data = await r.json();
      const items = Array.isArray(data.data) ? data.data : [];
      return items.map(a => ({
        title: a.title,
        description: a.description,
        url: a.url,
        image: a.image,
        source: a.source,
        publishedAt: a.published_at,
      })).filter(n => n.title && n.url);
    };

    const getFromContextualWeb = async () => {
      if (!CTX_NEWS_KEY) throw new Error('no_ctx_key');
      const url = `https://${CTX_NEWS_HOST}/api/Search/NewsSearchAPI?q=${encodeURIComponent(q)}&pageNumber=1&pageSize=20&autoCorrect=true&fromPublishedDate=null&toPublishedDate=null&safeSearch=false&withThumbnails=true&textDecorations=false&freshness=Week&setLang=fr`;
      const r = await fetch(url, {
        headers: {
          'X-RapidAPI-Key': CTX_NEWS_KEY,
          'X-RapidAPI-Host': CTX_NEWS_HOST,
        }
      });
      if (!r.ok) throw new Error('ctx_err');
      const data = await r.json();
      const items = Array.isArray(data.value) ? data.value : [];
      return items.map(a => ({
        title: a.title,
        description: a.description,
        url: a.url,
        image: a.image?.url,
        source: a.provider?.name,
        publishedAt: a.datePublished,
      })).filter(n => n.title && n.url);
    };

    const loadNews = async () => {
      setNewsLoading(true);
      setNewsError(null);
      let articles = [];
      const providers = [getFromNewsdata, getFromGNews, getFromNewsAPI, getFromMediastack, getFromContextualWeb];
      for (const fn of providers) {
        try {
          articles = await fn();
          if (articles && articles.length) break;
        } catch {
          // try next provider
        }
      }
      setNewsArticles(articles || []);
      setNewsLoading(false);
    };

    loadNews();

    // Indices via Finnhub (avec fallback ETF)
    const FINNHUB_TOKEN = 'd1ofk41r01qjadrjqv70d1ofk41r01qjadrjqv7g';
    // Crypto marché (Binance pairs)
    const symbols = [
      { sym: 'BINANCE:BTCUSDT', label: 'Bitcoin (BTC/USDT)' },
      { sym: 'BINANCE:ETHUSDT', label: 'Ethereum (ETH/USDT)' },
      { sym: 'BINANCE:SOLUSDT', label: 'Solana (SOL/USDT)' },
    ];
    const fetchQuote = (symbol) =>
      fetch(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_TOKEN}`)
        .then(r => r.ok ? r.json() : Promise.reject('q_err'));

    const loadQuotes = async () => {
      const out = [];
      for (const s of symbols) {
        try {
          const q = await fetchQuote(s.sym);
          if (q && typeof q.c === 'number') {
            out.push({ symbol: s.sym, label: s.label, price: q.c, change: q.d || 0, changesPercentage: q.dp || 0 });
          }
        } catch {
          console.warn('Quote fetch failed for', s.sym);
        }
      }
      setMarketQuotes(out);
    };

    loadQuotes();
  }, []);

  useEffect(() => {
    if (userProfileData && Object.keys(userProfileData).length > 0) {
      const results =
        recommendationEngine.generateCompleteRecommendation(userProfileData);

      const newPortfolioData = {
        ...portfolioData,
        portfolioBreakdown: results.allocation.map((item) => ({
          name: item.name,
          value: (item.value / 100) * portfolioData.totalInvested,
          color: item.color
        })),
        products: results.matchedProducts.slice(0, 4).map((product) => ({
          name: product.nom_produit,
          currentValue: Math.round(
            (product.overallCompatibility / 100) *
              (portfolioData.totalInvested / 4) *
              1.05
          ),
          investedAmount: Math.round(
            (product.overallCompatibility / 100) *
              (portfolioData.totalInvested / 4)
          ),
          performance: Math.round(product.overallCompatibility * 0.1),
          risk: parseInt(product.risque),
          category: product.nom_produit.split(" ")[0]
        }))
      };

      setPortfolioData(newPortfolioData);
      setRecommendations(results.recommendations);
      setUserRiskProfile(results.riskProfile);
    }
  }, [userProfileData]);

  const [notifications, setNotifications] = useState([]);

  const [showInvestPopup, setShowInvestPopup] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [investAmount, setInvestAmount] = useState("");
  const [investmentHistory, setInvestmentHistory] = useState([]);

  const [showNotificationDetails, setShowNotificationDetails] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [transactionsHistory, setTransactionsHistory] = useState([]);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateFilter, setDateFilter] = useState('6months');
  
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (showMobileMenu && !event.target.closest('.mobile-menu-container')) {
        setShowMobileMenu(false);
      }
      if (showUserMenu) {
        setShowUserMenu(false);
      }
      if (showSettingsModal) {
        setShowSettingsModal(false);
      }
      if (showDateFilter && !event.target.closest('.date-filter-container')) {
        setShowDateFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMobileMenu, showUserMenu, showSettingsModal]);

  const handleBalanceOperation = () => {
    const amount = parseFloat(balanceAmount);
    if (!amount || amount <= 0) return;

    const paymentMethodNames = {
      paypal: "PayPal",
      card: "Visa/MasterCard",
      usdt: "USDT (Crypto)"
    };
    const paymentMethodName =
      paymentMethodNames[selectedPaymentMethod] || "PayPal";

    if (balanceOperation === "add") {
      setUserBalance((prev) => prev + amount);
      setTransactionsHistory((prev) => [
        {
          id: Date.now(),
          type: "deposit",
          amount,
          method: paymentMethodName,
          date: new Date().toLocaleString("fr-FR"),
        },
        ...prev,
      ]);
      const newNotif = {
        id: Date.now(),
        message: `Solde ajouté: +${amount.toLocaleString()} Dhs via ${paymentMethodName}`,
        time: "À l'instant",
        type: "success",
        title: "Dépôt Réussi",
        details: `Votre solde a été augmenté de ${amount.toLocaleString()} Dhs via ${paymentMethodName}. Votre nouveau solde disponible est de ${(
          userBalance + amount
        ).toLocaleString()} Dhs. Vous pouvez maintenant utiliser ces fonds pour de nouveaux investissements.`,
        astuce:
          "💡 Astuce: Gardez toujours une réserve d'urgence équivalente à 3-6 mois de dépenses avant d'investir.",
        isRead: false
      };
      setNotifications((prev) => [newNotif, ...prev.slice(0, 2)]);
      setNotificationHistory((prev) => [
        { ...newNotif, receivedAt: new Date().toLocaleString("fr-FR") },
        ...prev,
      ]);
    } else if (balanceOperation === "withdraw") {
      if (amount > userBalance) {
        const failNotif = {
          id: Date.now(),
          message: `Retrait échoué: Solde insuffisant`,
          time: "À l'instant",
          type: "error",
          title: "Retrait Échoué",
          details: `Impossible de retirer ${amount.toLocaleString()} Dhs. Votre solde actuel est de ${userBalance.toLocaleString()} Dhs. Veuillez ajuster le montant du retrait.`,
          astuce:
            "💡 Astuce: Vérifiez toujours votre solde disponible avant d'effectuer un retrait.",
          isRead: false
        };
        setNotifications((prev) => [failNotif, ...prev.slice(0, 2)]);
        setNotificationHistory((prev) => [
          { ...failNotif, receivedAt: new Date().toLocaleString("fr-FR") },
          ...prev,
        ]);
        return;
      }

      setUserBalance((prev) => prev - amount);
      setTransactionsHistory((prev) => [
        {
          id: Date.now(),
          type: "withdraw",
          amount,
          method: paymentMethodName,
          date: new Date().toLocaleString("fr-FR"),
        },
        ...prev,
      ]);
      const successNotif = {
        id: Date.now(),
        message: `Retrait effectué: -${amount.toLocaleString()} Dhs vers ${paymentMethodName}`,
        time: "À l'instant",
        type: "info",
        title: "Retrait Réussi",
        details: `Votre retrait de ${amount.toLocaleString()} Dhs vers ${paymentMethodName} a été traité avec succès. Votre nouveau solde disponible est de ${(
          userBalance - amount
        ).toLocaleString()} Dhs. Les fonds seront transférés sous 1-3 jours ouvrables.`,
        astuce:
          "💡 Astuce: Les retraits peuvent prendre 1-3 jours ouvrables selon la méthode de paiement choisie.",
        isRead: false
      };
      setNotifications((prev) => [successNotif, ...prev.slice(0, 2)]);
      setNotificationHistory((prev) => [
        { ...successNotif, receivedAt: new Date().toLocaleString("fr-FR") },
        ...prev,
      ]);
    }

    setBalanceAmount("");
    setSelectedPaymentMethod("paypal");
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
        ...prev,
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
        message: `Profits retirés: ${totalProfits.toLocaleString()} Dhs vers ${paymentMethodName}`,
        time: "À l'instant",
        type: "success",
        title: "Profits Retirés avec Succès",
        details: `Vos profits de ${totalProfits.toLocaleString()} Dhs ont été retirés vers ${paymentMethodName}. Les fonds seront transférés sous 1-3 jours ouvrables. Vos investissements continuent de fonctionner avec le capital initial.`,
        astuce:
          "💡 Astuce: Retirer régulièrement vos profits vous permet de sécuriser vos gains tout en gardant votre capital investi.",
        isRead: false
      };
      setNotifications((prev) => [profitWithdrawNotif, ...prev.slice(0, 2)]);
      setNotificationHistory((prev) => [
        { ...profitWithdrawNotif, receivedAt: new Date().toLocaleString("fr-FR") },
        ...prev,
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
          date: new Date().toLocaleString("fr-FR"),
        },
        ...prev,
      ]);
    } else if (profitOperation === "add") {
      setUserBalance((prev) => prev + totalProfits);

      const profitAddNotif = {
        id: Date.now(),
        message: `Profits ajoutés au solde: +${totalProfits.toLocaleString()} Dhs`,
        time: "À l'instant",
        type: "success",
        title: "Profits Ajoutés au Solde",
        details: `Vos profits de ${totalProfits.toLocaleString()} Dhs ont été ajoutés à votre solde disponible. Vous pouvez maintenant utiliser ces fonds pour de nouveaux investissements.`,
        astuce:
          "💡 Astuce: Ajouter vos profits au solde vous permet de réinvestir immédiatement dans de nouveaux produits.",
        isRead: false
      };
      setNotifications((prev) => [profitAddNotif, ...prev.slice(0, 2)]);
      setNotificationHistory((prev) => [
        { ...profitAddNotif, receivedAt: new Date().toLocaleString("fr-FR") },
        ...prev,
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
          date: new Date().toLocaleString("fr-FR"),
        },
        ...prev,
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

      const growthRate = 0.02 + Math.random() * 0.06; // 2-8% growth
      const currentValue = inv.amount * (1 + growthRate);

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
    setPortfolioData((prev) => ({
      ...prev,
      ...stats,
      performanceHistory: prev.performanceHistory.map((entry, index) => ({
        ...entry,
        value: stats.totalInvested * (0.95 + index * 0.02), // Simulate growth over time
        benchmark: stats.totalInvested * (0.92 + index * 0.015)
      }))
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
      const sector = sectorMapping[investment.name] || "Autres";
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

  const calculateTotalProfits = () => {
    if (!investmentHistory || investmentHistory.length === 0) return 0;

    const totalProfits = investmentHistory.reduce((sum, inv) => {
      return sum + (inv.profit || 0);
    }, 0);

    return Math.max(0, totalProfits);
  };

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
      details: `Votre simulation avec un capital de ${capital.toLocaleString()} Dhs a été créée. Rendement projeté: ${result.totalReturn.toFixed(
        1
      )}% sur ${newSimulation.duration}.`,
      astuce:
        "💡 Astuce: Les simulations vous aident à comprendre les risques et rendements potentiels avant d'investir réellement.",
      isRead: false
    };
    setNotifications((prev) => [simNotif, ...prev.slice(0, 2)]);
    setNotificationHistory((prev) => [
      { ...simNotif, receivedAt: new Date().toLocaleString("fr-FR") },
      ...prev,
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
        `Le montant minimum d'investissement est de ${selectedInvestment.min.toLocaleString()} Dhs`
      );
      return;
    }

    if (amount > userBalance) {
      alert("Solde insuffisant");
      return;
    }

    setUserBalance((prev) => prev - amount);

    const initialProfit = Math.max(1, Math.round(amount * 0.001));

    const newInvestment = {
      id: Date.now(),
      name: selectedInvestment.name,
      amount: amount,
      currentValue: amount + initialProfit,
      profit: initialProfit,
      date: new Date().toLocaleDateString("fr-FR"),
      return: `+${((initialProfit / amount) * 100).toFixed(1)}%`
    };
    setInvestmentHistory((prev) => [newInvestment, ...prev]);

    setTransactionsHistory((prev) => [
      {
        id: Date.now(),
        type: "invest",
        amount,
        method: selectedInvestment.name,
        date: new Date().toLocaleString("fr-FR"),
      },
      ...prev,
    ]);

    const investNotif = {
      id: Date.now(),
      message: `Investissement de ${amount.toLocaleString()} Dhs dans ${
        selectedInvestment.name
      } effectué avec succès`,
      time: "À l'instant",
      type: "success",
      title: "Investissement Réussi",
      details: `Votre investissement de ${amount.toLocaleString()} Dhs dans ${
        selectedInvestment.name
      } a été traité avec succès. Votre portefeuille a été mis à jour et vous pouvez suivre la performance de cet investissement dans la section Portefeuille.`,
      astuce:
        "💡 Astuce: Diversifiez vos investissements pour réduire les risques. N'investissez jamais plus de 20% de votre capital dans un seul produit.",
      isRead: false
    };
    setNotifications((prev) => [investNotif, ...prev.slice(0, 2)]);
    setNotificationHistory((prev) => [
      { ...investNotif, receivedAt: new Date().toLocaleString("fr-FR") },
      ...prev,
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
  const [recentSimulations, setRecentSimulations] = useState([]);
  const [simulationDateFilter, setSimulationDateFilter] = useState("all");

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

          const growthRate = Math.random() * 0.004 + 0.001; // 0.1% to 0.5%
          const additionalProfit = investment.amount * growthRate;

          const newCurrentValue =
            (investment.currentValue || investment.amount) + additionalProfit;
          const newProfit = newCurrentValue - investment.amount;
          const returnPercentage = (newProfit / investment.amount) * 100;

          return {
            ...investment,
            currentValue: Math.round(newCurrentValue),
            profit: Math.round(newProfit),
            return: `${
              returnPercentage >= 0 ? "+" : ""
            }${returnPercentage.toFixed(1)}%`
          };
        });
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [investmentHistory.length]);

  useEffect(() => {
    if (pendingInvestment) {
      setSelectedInvestment(pendingInvestment.product);
      setInvestAmount(String(pendingInvestment.amount || pendingInvestment.product?.min || ""));
      setCurrentPage("investments");
      setShowInvestPopup(true);
      clearPendingInvestment();
    }
  }, [pendingInvestment, clearPendingInvestment]);

  const matchedInvestments = useMemo(() => {
    if (!userResults || !userResults.matchedProducts) return [];
    return userResults.matchedProducts.map((p) => {
      // Calculate ROI for different investment amounts
                          const roi1Year = ROICalculator.calculateSimpleROI(10000, p.roi_annuel !== undefined ? p.roi_annuel : 5, 1);
                    const roi3Years = ROICalculator.calculateSimpleROI(10000, p.roi_annuel !== undefined ? p.roi_annuel : 5, 3);
                    const roi5Years = ROICalculator.calculateSimpleROI(10000, p.roi_annuel !== undefined ? p.roi_annuel : 5, 5);
      
      return {
        name: p.nom_produit,
        risk: Number(p.risque) || 3,
        return: `${Math.max(3, Math.min(12, Math.round((p.overallCompatibility/10)+5)))}%`,
        min: 1000,
        description: p.duree_recommandee,
        image: p.avatar || "/public/assets/marketstock.png",
        roi: {
                                  annual: p.roi_annuel !== undefined ? p.roi_annuel : 5,
          roi1Year: roi1Year.roiPercentage,
          roi3Years: roi3Years.roiPercentage,
          roi5Years: roi5Years.roiPercentage,
          volatility: p.volatilite || 5,
          fees: p.frais_annuels || 1,
          dividends: p.volatilite || 0,
          liquidity: p.liquidite || 'Standard'
        }
      };
    });
  }, [userResults]);

  return (
    <>
      <div className="bg-[#0F0F19] min-h-screen">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-[#0F0F19] border-b border-[#89559F]/20">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#89559F] rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="text-white font-semibold text-lg hidden sm:block">TawfirAI</span>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Desktop Header Content */}
              <div className="hidden lg:flex items-center space-x-3">
                {/* Balance Display */}
                <div className="flex items-center bg-white/10 rounded-lg px-3 py-2 border border-white/20">
                  <svg
                    className="w-4 h-4 text-[#3CD4AB] mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="text-white font-semibold text-sm">
                    {userBalance.toLocaleString()} Dhs
                  </span>
                </div>

                {/* Balance Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setBalanceOperation("add");
                      setShowBalanceModal(true);
                    }}
                    className="bg-[#3CD4AB] hover:bg-[#3CD4AB]/80 text-[#0F0F19] font-medium rounded-lg px-3 py-2 transition-colors duration-200 flex items-center text-sm"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span className="hidden sm:inline">Ajouter</span>
                    <span className="sm:hidden">+</span>
                  </button>

                  <button
                    onClick={() => {
                      setBalanceOperation("withdraw");
                      setShowBalanceModal(true);
                    }}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-lg px-3 py-2 transition-colors duration-200 flex items-center text-sm"
                    disabled={userBalance <= 0}
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4m16 0l-4-4m4 4l-4 4"
                      />
                    </svg>
                    <span className="hidden sm:inline">Retirer</span>
                    <span className="sm:hidden">→</span>
                  </button>
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <img 
                      src={userData?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'} 
                      alt="Avatar" 
                      className="w-7 h-7 rounded-full"
                    />
                    <span className="text-white text-sm hidden xl:block">{userData?.name || 'Utilisateur'}</span>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#0F0F19] border border-[#89559F]/30 rounded-lg shadow-lg z-50">
                      <div className="p-3 border-b border-white/10">
                        <div className="text-white font-medium">{userData?.name}</div>
                      </div>
                      <div className="p-1">
                        <button
                          onClick={() => { setShowUserMenu(false); setShowSettingsModal(true); }}
                          className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-md transition-colors"
                        >
                          ⚙️ Paramètres
                        </button>
                        <button
                          onClick={() => {
                            console.log('Logout button clicked in user menu');
                            setShowUserMenu(false);
                            console.log('Logout function called, navigating to signin');
                            navigate('/signin');
                          }}
                          className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                        >
                          🚪 Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notification Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="text-white hover:bg-white/10 hover:text-[#3CD4AB] focus:ring-4 focus:ring-[#3CD4AB]/20 rounded-lg text-sm p-2.5 inline-flex items-center relative"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
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
                    <div
                      className="absolute right-0 mt-2 w-80 bg-[#0F0F19] border border-white/20 rounded-lg shadow-lg z-50"
                      ref={notificationRef}
                    >
                      <div className="p-4 border-b border-white/10">
                        <h3 className="text-white font-semibold">
                          Notifications
                        </h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className="p-4 border-b border-white/10 hover:bg-white/5 cursor-pointer transition-colors duration-200"
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                            >
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 bg-[#3CD4AB]/20 rounded-full flex items-center justify-center">
                                    {getNotificationIcon(notification.type)}
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-white">
                                    {notification.message}
                                  </p>
                                  <p className="text-sm text-white/60">
                                    {notification.time}
                                  </p>
                                  <p className="text-xs text-[#3CD4AB] mt-1">
                                    Cliquer pour plus de détails
                                  </p>
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
                            if (notifications.length > 0) {
                              const clearedAt = new Date().toLocaleString("fr-FR");
                              setNotificationHistory((prev) => [
                                ...notifications.map((n) => ({
                                  ...n,
                                  isRead: n.isRead || false,
                                  clearedAt
                                })),
                                ...prev,
                              ]);
                            }
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
          </div>
        </header>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="mobile-menu-container fixed top-16 left-0 right-0 z-30 bg-[#0F0F19] border-b border-[#89559F]/20 lg:hidden">
            <div className="p-4 space-y-4">
              {/* Balance Display */}
              <div className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-3 border border-white/20">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-[#3CD4AB] mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="text-white font-semibold">
                    {userBalance.toLocaleString()} Dhs
                  </span>
                </div>
              </div>

              {/* Balance Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setBalanceOperation("add");
                    setShowBalanceModal(true);
                    setShowMobileMenu(false);
                  }}
                  className="bg-[#3CD4AB] hover:bg-[#3CD4AB]/80 text-[#0F0F19] font-medium rounded-lg py-3 px-4 transition-colors duration-200 flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Ajouter
                </button>

                <button
                  onClick={() => {
                    setBalanceOperation("withdraw");
                    setShowBalanceModal(true);
                    setShowMobileMenu(false);
                  }}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-lg py-3 px-4 transition-colors duration-200 flex items-center justify-center"
                  disabled={userBalance <= 0}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4m16 0l-4-4m4 4l-4 4"
                    />
                  </svg>
                  Retirer
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <img 
                  src={userData?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'} 
                  alt="Avatar" 
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="text-white font-semibold">{userData?.name || 'Utilisateur'}</div>
                  <div className="text-white/60 text-sm">{userData?.email}</div>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setShowSettingsModal(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center"
                >
                  ⚙️ Paramètres
                </button>
                <button
                  onClick={() => {
                    setShowNotifications(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center"
                >
                  🔔 Notifications ({notifications.length})
                </button>
                <button
                  onClick={() => {
                    // logout();
                    navigate('/signin');
                  }}
                  className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex items-center"
                >
                  🚪 Déconnexion
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } bg-[#0F0F19] border-r border-white/10 md:translate-x-0`}
        >
          <div className="h-full px-3 pb-4 overflow-y-auto bg-[#0F0F19]">
            <ul className="space-y-2 pt-4">
              <li>
                <button
                  onClick={() => handleNavigation("dashboard")}
                  className={`flex items-center w-full p-2 text-base font-normal rounded-lg transition-colors duration-200 ${
                    currentPage === "dashboard"
                      ? "bg-[#3CD4AB] text-[#0F0F19]"
                      : "text-white hover:bg-white/10 hover:text-[#3CD4AB]"
                  }`}
                >
                  <svg
                    className="w-6 h-6 transition duration-75"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                  </svg>
                  <span className="ml-3">Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("portfolio")}
                  className={`flex items-center w-full p-2 text-base font-normal rounded-lg transition-colors duration-200 ${
                    currentPage === "portfolio"
                      ? "bg-[#3CD4AB] text-[#0F0F19]"
                      : "text-white hover:bg-white/10 hover:text-[#3CD4AB]"
                  }`}
                >
                  <svg
                    className="flex-shrink-0 w-6 h-6 transition duration-75"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"></path>
                  </svg>
                  <span className="ml-3">Portefeuille</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("investments")}
                  className={`flex items-center w-full p-2 text-base font-normal rounded-lg transition-colors duration-200 ${
                    currentPage === "investments"
                      ? "bg-[#3CD4AB] text-[#0F0F19]"
                      : "text-white hover:bg-white/10 hover:text-[#3CD4AB]"
                  }`}
                >
                  <svg
                    className="flex-shrink-0 w-6 h-6 transition duration-75"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-.89l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="ml-3">Investissements</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("simulations")}
                  className={`flex items-center w-full p-2 text-base font-normal rounded-lg transition-colors duration-200 ${
                    currentPage === "simulations"
                      ? "bg-[#3CD4AB] text-[#0F0F19]"
                      : "text-white hover:bg-white/10 hover:text-[#3CD4AB]"
                  }`}
                >
                  <svg
                    className="flex-shrink-0 w-6 h-6 transition duration-75"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
                    <path d="M3 5a2 2 0 012-2h1V1a1 1 0 112 0v1h1a2 2 0 012 2v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM3 11a2 2 0 012-2h10a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4z"></path>
                  </svg>
                  <span className="ml-3">Simulations</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("news")}
                  className={`flex items-center w-full p-2 text-base font-normal rounded-lg transition-colors duration-200 ${
                    currentPage === "news"
                      ? "bg-[#3CD4AB] text-[#0F0F19]"
                      : "text-white hover:bg-white/10 hover:text-[#3CD4AB]"
                  }`}
                >
                  <svg
                    className="flex-shrink-0 w-6 h-6 transition duration-75"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="ml-3">Actualités</span>
                </button>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <div className="p-2 md:p-4 md:ml-64 pt-20 md:pt-20">
          <div className="p-3 md:p-6 bg-[#0F0F19] border border-[#89559F]/20 rounded-lg shadow-sm">
            {/* Render different pages based on currentPage */}
            {currentPage === "dashboard" && (
              <div>
                <div className="mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-white/60">Vue d'ensemble simple</p>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {/* Solde */}
                  <div className="p-4 bg-white/5 border border-[#89559F]/30 rounded-lg shadow backdrop-blur-sm">
                    <div className="flex items-center">
                      <div className="inline-flex items-center justify-center flex-shrink-0 w-10 h-10 text-[#3CD4AB] bg-[#3CD4AB]/20 rounded-lg">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-white/60">Solde</p>
                        <p className="text-2xl font-bold text-white">{userBalance.toLocaleString()} Dhs</p>
                      </div>
                    </div>
                  </div>

                  {/* Total Investi */}
                  <div className="p-4 bg-white/5 border border-[#89559F]/30 rounded-lg shadow backdrop-blur-sm">
                    <div className="flex items-center">
                      <div className="inline-flex items-center justify-center flex-shrink-0 w-10 h-10 text-[#3CD4AB] bg-[#3CD4AB]/20 rounded-lg">
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

                  {/* Profits Totaux */}
                  <div className="p-4 bg-white/5 border border-[#89559F]/30 rounded-lg shadow backdrop-blur-sm">
                    <div className="flex items-center">
                      <div className="inline-flex items-center justify-center flex-shrink-0 w-10 h-10 text-green-400 bg-green-500/10 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-white/60">Profits Totaux</p>
                        <p className="text-2xl font-bold text-green-400">{calculateTotalProfits().toLocaleString()} Dhs</p>
                      </div>
                    </div>
                  </div>

                  {/* Nombre d'Investissements */}
                  <div className="p-4 bg-white/5 border border-[#89559F]/30 rounded-lg shadow backdrop-blur-sm">
                    <div className="flex items-center">
                      <div className="inline-flex items-center justify-center flex-shrink-0 w-10 h-10 text-[#3CD4AB] bg-[#3CD4AB]/20 rounded-lg">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-white/60">Investissements</p>
                        <p className="text-2xl font-bold text-white">{investmentHistory.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        setBalanceOperation("add");
                        setShowBalanceModal(true);
                      }}
                      className="bg-[#3CD4AB] hover:bg-[#3CD4AB]/80 text-[#0F0F19] font-medium px-4 py-2 rounded-lg"
                    >
                      Ajouter du Solde
                    </button>
                    <button
                      onClick={() => {
                        setBalanceOperation("withdraw");
                        setShowBalanceModal(true);
                      }}
                      className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-4 py-2 rounded-lg disabled:opacity-50"
                      disabled={userBalance <= 0}
                    >
                      Retirer du Solde
                    </button>
                    {calculateTotalProfits() > 0 && (
                      <>
                        <button
                          onClick={() => {
                            setProfitOperation("withdraw");
                            setShowProfitModal(true);
                          }}
                          className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-lg"
                        >
                          Retirer les Profits
                        </button>
                        <button
                          onClick={() => {
                            setProfitOperation("add");
                            setShowProfitModal(true);
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg"
                        >
                          Ajouter les Profits au Solde
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Charts and Withdraw History */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                  {/* Portfolio Performance Chart */}
                  <div className="p-4 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">Évolution du Portefeuille</h3>
                    </div>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={portfolioData.performanceHistory} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3CD4AB" stopOpacity={0.6}/>
                              <stop offset="95%" stopColor="#3CD4AB" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#89559F" stopOpacity={0.5}/>
                              <stop offset="95%" stopColor="#89559F" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                          <XAxis dataKey="date" stroke="#ffffff80" />
                          <YAxis stroke="#ffffff80" />
                          <Tooltip contentStyle={{ backgroundColor: '#0F0F19', border: '1px solid #ffffff20', borderRadius: '8px', color: '#ffffff' }} />
                          <Legend />
                          <Area type="monotone" dataKey="value" name="Portefeuille" stroke="#3CD4AB" fillOpacity={1} fill="url(#colorValue)" />
                          <Area type="monotone" dataKey="benchmark" name="Benchmark" stroke="#89559F" fillOpacity={1} fill="url(#colorBenchmark)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Transactions History */}
                  <div className="p-4 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">Historique des Transactions</h3>
                    </div>
                    {transactionsHistory.length === 0 ? (
                      <p className="text-white/60">Aucune transaction pour le moment.</p>
                    ) : (
                      <ul className="divide-y divide-white/10">
                        {transactionsHistory.slice(0, 8).map((t) => (
                          <li key={t.id} className="py-3 flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">
                                {t.type === 'deposit' && <span className="text-[#3CD4AB]">+{t.amount.toLocaleString()} Dhs</span>}
                                {t.type === 'withdraw' && <span className="text-red-400">-{t.amount.toLocaleString()} Dhs</span>}
                                {t.type === 'profit_withdraw' && <span className="text-orange-400">-{t.amount.toLocaleString()} Dhs</span>}
                                {t.type === 'profit_to_balance' && <span className="text-green-400">+{t.amount.toLocaleString()} Dhs</span>}
                              </p>
                              <p className="text-white/60 text-sm">{t.method} • {t.date}</p>
                            </div>
                            <span className="text-white/60 text-xs bg-white/10 px-2 py-1 rounded">
                              {t.type === 'deposit' && 'Dépôt'}
                              {t.type === 'withdraw' && 'Retrait'}
                              {t.type === 'profit_withdraw' && 'Retrait Profits'}
                              {t.type === 'profit_to_balance' && 'Profits → Solde'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Portfolio Page */}
            {currentPage === "portfolio" && (
              <div>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-white">
                    Portefeuille
                  </h1>
                  <p className="text-white/60">
                    Gestion détaillée de votre portefeuille d'investissement
                  </p>
                </div>

                {/* Portfolio Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
                    <div className="flex items-center">
                      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-[#3CD4AB] bg-[#3CD4AB]/20 rounded-lg">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-white/60">
                          Valeur Totale
                        </p>
                        <p className="text-2xl font-bold text-white">
                          {calculateInvestmentHistoryWithReturns()
                            .reduce((sum, inv) => sum + inv.currentValue, 0)
                            .toLocaleString()}{" "}
                          Dhs
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
                    <div className="flex items-center">
                      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-[#3CD4AB] bg-[#3CD4AB]/20 rounded-lg">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-white/60">
                          Gain/Perte Total
                        </p>
                        <p
                          className={`text-2xl font-bold ${
                            portfolioData.globalPerformance >= 0
                              ? "text-[#3CD4AB]"
                              : "text-red-400"
                          }`}
                        >
                          {portfolioData.globalPerformance >= 0 ? "+" : ""}
                          {(
                            calculateInvestmentHistoryWithReturns().reduce(
                              (sum, inv) => sum + inv.currentValue,
                              0
                            ) - portfolioData.totalInvested
                          ).toLocaleString()}{" "}
                          Dhs
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
                    <div className="flex items-center">
                      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-[#3CD4AB] bg-[#3CD4AB]/20 rounded-lg">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-white/60">
                          Nombre d'Investissements
                        </p>
                        <p className="text-2xl font-bold text-white">
                          {investmentHistory.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
                    <div className="flex items-center">
                      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-[#3CD4AB] bg-[#3CD4AB]/20 rounded-lg">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-white/60">
                          Secteurs Diversifiés
                        </p>
                        <p className="text-2xl font-bold text-white">
                          {calculateSectorBreakdown().length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Répartition par Secteur
                    </h3>
                    <div className="space-y-4">
                      {calculateSectorBreakdown().length > 0 ? (
                        calculateSectorBreakdown().map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                          >
                            <div>
                              <span className="text-white font-medium">
                                {item.sector}
                              </span>
                              <div className="w-32 bg-white/20 rounded-full h-2 mt-1">
                                <div
                                  className="bg-[#3CD4AB] h-2 rounded-full"
                                  style={{ width: `${item.percentage}%` }}
                                />
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[#3CD4AB] font-semibold">
                                {item.percentage}%
                              </div>
                              <div className="text-white/60 text-sm">
                                {item.amount.toLocaleString()} Dhs
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-white/60 py-8">
                          <svg
                            className="w-12 h-12 mx-auto mb-4 text-white/40"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            ></path>
                          </svg>
                          <p>Aucune répartition sectorielle</p>
                          <p className="text-sm mt-1">
                            Investissez dans différents secteurs pour voir la
                            répartition
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Historique d'Investissements
                    </h3>
                    <div className="space-y-4">
                      {calculateInvestmentHistoryWithReturns().map(
                        (investment) => (
                          <div
                            key={investment.id}
                            className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                          >
                            <div>
                              <div className="flex items-center">
                                <span className="inline-block w-2 h-2 rounded-full mr-2 bg-[#3CD4AB]"></span>
                                <span className="text-white font-medium">
                                  {investment.name}
                                </span>
                              </div>
                              <div className="text-white/60 text-sm">
                                {investment.date}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-semibold">
                                {investment.amount.toLocaleString()} Dhs
                              </div>
                              <div className="flex items-center justify-end space-x-2">
                                <div
                                  className={`text-sm font-medium ${
                                    investment.return.startsWith("+")
                                      ? "text-[#3CD4AB]"
                                      : "text-red-400"
                                  }`}
                                >
                                  {investment.return}
                                </div>
                                <div className="text-white/60 text-xs">
                                  ({investment.currentValue.toLocaleString()}{" "}
                                  Dhs)
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                      {investmentHistory.length === 0 && (
                        <div className="text-center text-white/60 py-4">
                          Aucun investissement pour le moment
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notification History Section */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Historique des Notifications
                  </h3>
                  <div className="space-y-4">
                    {notificationHistory.length > 0 ? (
                      notificationHistory.map((notification) => (
                        <div
                          key={notification.id}
                          className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg"
                        >
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-[#3CD4AB]/20 rounded-full flex items-center justify-center">
                              {getNotificationIcon(notification.type)}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-medium text-sm">
                              {notification.title}
                            </h4>
                            <p className="text-white/60 text-sm mt-1">
                              {notification.message}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-white/40 text-xs">
                                Lu le {notification.readAt}
                              </span>
                              <span className="text-[#3CD4AB] text-xs">
                                ✓ Lu
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-white/60 py-8">
                        <svg
                          className="w-12 h-12 mx-auto mb-4 text-white/40"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M15 17h5l-5 5v-5zM12 19l-7-7 3-3 7 7-3 3z"
                          ></path>
                        </svg>
                        <p>Aucune notification lue pour le moment</p>
                        <p className="text-sm mt-1">
                          Les notifications que vous marquez comme lues
                          apparaîtront ici
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Investment Revenue Chart */}
                                 <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm flex justify-center">
                   <div className="w-full max-w-sm bg-white/5 rounded-lg shadow-sm border border-white/10 p-4 md:p-6">
                    <div className="flex justify-between border-white/20 border-b pb-3">
                      <dl>
                        <dt className="text-base font-normal text-white/60 pb-1">Profit</dt>
                        <dd className="leading-none text-3xl font-bold text-white">
                          {calculateTotalProfits().toLocaleString()} Dhs
                        </dd>
                      </dl>
                      <div>
                        <span className="bg-green-500/20 text-green-400 text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-md">
                          <svg className="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13V1m0 0L1 5m4-4 4 4"/>
                          </svg>
                          Profit rate {portfolioData.globalPerformance.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 py-3">
                      <dl>
                        <dt className="text-base font-normal text-white/60 pb-1">Investi</dt>
                        <dd className="leading-none text-xl font-bold text-[#3CD4AB]">
                          {portfolioData.totalInvested.toLocaleString()} Dhs
                        </dd>
                      </dl>
                      <dl>
                        <dt className="text-base font-normal text-white/60 pb-1">Revenus</dt>
                        <dd className="leading-none text-xl font-bold text-green-400">
                          +{calculateTotalProfits().toLocaleString()} Dhs
                        </dd>
                      </dl>
                    </div>

                    {/* Simple Bar Chart using CSS */}
                    <div className="h-32 flex items-end justify-between space-x-2 mb-4">
                      {portfolioData.performanceHistory
                        .slice(dateFilter === 'today' ? -1 : dateFilter === 'week' ? -7 : dateFilter === 'month' ? -30 : dateFilter === 'quarter' ? -90 : dateFilter === '6months' ? -6 : -12)
                        .map((entry, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-[#3CD4AB]/60 rounded-t transition-all duration-300 hover:bg-[#3CD4AB]"
                            style={{ 
                              height: `${Math.max(10, (entry.value / Math.max(...portfolioData.performanceHistory.map(e => e.value))) * 100)}%` 
                            }}
                          ></div>
                          <span className="text-white/60 text-xs mt-2">{entry.date}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 items-center border-white/20 border-t justify-between">
                      <div className="flex justify-between items-center pt-5">
                        {/* Date Filter Button */}
                        <div className="relative date-filter-container">
                          <button
                            onClick={() => setShowDateFilter(!showDateFilter)}
                            className="text-sm font-medium text-white/70 hover:text-white text-center inline-flex items-center transition-all duration-200 px-4 py-2 rounded-lg hover:bg-white/10 border border-white/20 hover:border-white/30"
                            type="button">
                            {dateFilter === 'today' ? 'Aujourd\'hui' : 
                             dateFilter === 'week' ? 'Cette semaine' : 
                             dateFilter === 'month' ? 'Ce mois' : 
                             dateFilter === 'quarter' ? 'Ce trimestre' : 
                             dateFilter === '6months' ? 'Derniers 6 mois' : 
                             dateFilter === 'year' ? 'Cette année' : 'Derniers 6 mois'}
                            <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${showDateFilter ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          
                          {/* Date Filter Dropdown */}
                          {showDateFilter && (
                            <div className="absolute bottom-full left-0 mb-2 w-48 bg-[#0F0F19] border border-white/30 rounded-lg shadow-xl z-50 backdrop-blur-sm">
                              <div className="p-2">
                                <div className="text-xs text-white/40 px-3 py-1 mb-1 border-b border-white/10">Période</div>
                                <ul className="space-y-1">
                                  <li>
                                    <button
                                      onClick={() => {
                                        setDateFilter('today');
                                        setShowDateFilter(false);
                                      }}
                                      className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 text-sm ${
                                        dateFilter === 'today' 
                                          ? 'bg-[#3CD4AB]/20 text-[#3CD4AB] border border-[#3CD4AB]/30' 
                                          : 'text-white/80 hover:text-white hover:bg-white/10'
                                      }`}>
                                      <div className="flex items-center justify-between">
                                        <span>Aujourd'hui</span>
                                        {dateFilter === 'today' && <span className="text-[#3CD4AB]">✓</span>}
                                      </div>
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      onClick={() => {
                                        setDateFilter('week');
                                        setShowDateFilter(false);
                                      }}
                                      className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 text-sm ${
                                        dateFilter === 'week' 
                                          ? 'bg-[#3CD4AB]/20 text-[#3CD4AB] border border-[#3CD4AB]/30' 
                                          : 'text-white/80 hover:text-white hover:bg-white/10'
                                      }`}>
                                      <div className="flex items-center justify-between">
                                        <span>Cette semaine</span>
                                        {dateFilter === 'week' && <span className="text-[#3CD4AB]">✓</span>}
                                      </div>
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      onClick={() => {
                                        setDateFilter('month');
                                        setShowDateFilter(false);
                                      }}
                                      className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 text-sm ${
                                        dateFilter === 'month' 
                                          ? 'bg-[#3CD4AB]/20 text-[#3CD4AB] border border-[#3CD4AB]/30' 
                                          : 'text-white/80 hover:text-white hover:bg-white/10'
                                      }`}>
                                      <div className="flex items-center justify-between">
                                        <span>Ce mois</span>
                                        {dateFilter === 'month' && <span className="text-[#3CD4AB]">✓</span>}
                                      </div>
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      onClick={() => {
                                        setDateFilter('quarter');
                                        setShowDateFilter(false);
                                      }}
                                      className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 text-sm ${
                                        dateFilter === 'quarter' 
                                          ? 'bg-[#3CD4AB]/20 text-[#3CD4AB] border border-[#3CD4AB]/30' 
                                          : 'text-white/80 hover:text-white hover:bg-white/10'
                                      }`}>
                                      <div className="flex items-center justify-between">
                                        <span>Ce trimestre</span>
                                        {dateFilter === 'quarter' && <span className="text-[#3CD4AB]">✓</span>}
                                      </div>
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      onClick={() => {
                                        setDateFilter('6months');
                                        setShowDateFilter(false);
                                      }}
                                      className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 text-sm ${
                                        dateFilter === '6months' 
                                          ? 'bg-[#3CD4AB]/20 text-[#3CD4AB] border border-[#3CD4AB]/30' 
                                          : 'text-white/80 hover:text-white hover:bg-white/10'
                                      }`}>
                                      <div className="flex items-center justify-between">
                                        <span>Derniers 6 mois</span>
                                        {dateFilter === '6months' && <span className="text-[#3CD4AB]">✓</span>}
                                      </div>
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      onClick={() => {
                                        setDateFilter('year');
                                        setShowDateFilter(false);
                                      }}
                                      className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 text-sm ${
                                        dateFilter === 'year' 
                                          ? 'bg-[#3CD4AB]/20 text-[#3CD4AB] border border-[#3CD4AB]/30' 
                                          : 'text-white/80 hover:text-white hover:bg-white/10'
                                      }`}>
                                      <div className="flex items-center justify-between">
                                        <span>Cette année</span>
                                        {dateFilter === 'year' && <span className="text-[#3CD4AB]">✓</span>}
                                      </div>
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Revenue Report Link */}
                        <button
                          onClick={() => setCurrentPage("portfolio")}
                          className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-[#3CD4AB] hover:text-[#3CD4AB] hover:bg-[#3CD4AB]/10 px-4 py-2 transition-all duration-200 border border-[#3CD4AB]/30 hover:border-[#3CD4AB]/50 group">
                          <span>Rapport Complet</span>
                          <svg className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>

            )}

            {/* Investments Page */}
            {currentPage === "investments" && (
              <div>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-white">
                    Investissements
                  </h1>
                  <p className="text-white/60">
                    Découvrez les opportunités d'investissement disponibles
                  </p>
                </div>

                {!userResults || !userResults.matchedProducts?.length ? (
                  <div className="p-6 bg-white/5 border border-white/10 rounded-lg text-center">
                    <p className="text-white/70 mb-3">Aucun produit recommandé pour le moment.</p>
                    <Link to="/simulation" className="inline-block px-4 py-2 rounded-lg bg-[#3CD4AB] text-[#0F0F19] hover:bg-[#2bb894] font-semibold">Compléter votre profil</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matchedInvestments.map((investment, index) => (
                      <div
                        key={index}
                        className="p-6 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm hover:bg-white/10 transition-colors duration-200"
                      >
                        <div className="mb-4">
                          <img
                            src={investment.image}
                            alt={investment.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold text-white">
                              {investment.name}
                            </h3>
                            <div className="text-[#3CD4AB] font-semibold text-xl">
                              {investment.return}
                            </div>
                          </div>
                        </div>
                        <p className="text-white/60 text-sm mb-4">
                          {investment.description}
                        </p>
                        <div className="space-y-3">
                          {/* ROI Information */}
                          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <div className="text-xs text-blue-400 mb-2 font-medium">ROI sur 10,000 Dhs</div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="text-center">
                                <div className={`font-semibold ${ROICalculator.getROIColor(investment.roi.roi1Year)}`}>
                                  {ROICalculator.formatROI(investment.roi.roi1Year)}
                                </div>
                                <div className="text-white/60">1 an</div>
                              </div>
                              <div className="text-center">
                                <div className={`font-semibold ${ROICalculator.getROIColor(investment.roi.roi3Years)}`}>
                                  {ROICalculator.formatROI(investment.roi.roi3Years)}
                                </div>
                                <div className="text-white/60">3 ans</div>
                              </div>
                              <div className="text-center">
                                <div className={`font-semibold ${ROICalculator.getROIColor(investment.roi.roi5Years)}`}>
                                  {ROICalculator.formatROI(investment.roi.roi5Years)}
                                </div>
                                <div className="text-white/60">5 ans</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-white/60">Risque</span>
                            <div className="flex items-center">
                              <div className="w-16 bg-white/20 rounded-full h-2 mr-2">
                                <div
                                  className="bg-[#3CD4AB] h-2 rounded-full"
                                  style={{
                                    width: `${(investment.risk / 10) * 100}%`
                                  }}
                                />
                              </div>
                              <span className="text-white text-sm">
                                {investment.risk}/10
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-white/60">
                              Investissement min.
                            </span>
                            <span className="text-white">
                              {investment.min.toLocaleString()} Dhs
                            </span>
                          </div>
                          
                          {/* Additional ROI Details */}
                          <div className="text-xs text-white/60 space-y-1 pt-2 border-t border-white/10">
                            <div className="flex justify-between">
                              <span>ROI annuel:</span>
                              <span className={`font-medium ${ROICalculator.getROIColor(investment.roi.annual)}`}>
                                {investment.roi.annual}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Volatilité:</span>
                              <span>{investment.roi.volatility}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Frais:</span>
                              <span>{investment.roi.fees}%</span>
                            </div>
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
                )}
              </div>
            )}

            {/* Simulations Page */}
            {currentPage === "simulations" && (
              <div>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-white">Simulations</h1>
                  <p className="text-white/60">
                    Testez vos stratégies d'investissement sans risque
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-6">
                      Créer une Simulation
                    </h3>
                    <div className="space-y-4">
                      {/* Balance Info */}
                      <div className="p-3 bg-[#3CD4AB]/10 border border-[#3CD4AB]/20 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-white/80 text-sm">
                            Solde disponible:
                          </span>
                          <span className="text-[#3CD4AB] font-semibold">
                            {userBalance.toLocaleString()} Dhs
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          Capital Initial (Dhs)
                        </label>
                        <input
                          type="number"
                          value={simulationForm.initialCapital}
                          onChange={(e) =>
                            handleSimulationFormChange(
                              "initialCapital",
                              e.target.value
                            )
                          }
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:border-[#3CD4AB] focus:outline-none"
                          placeholder="10000"
                          max={userBalance}
                        />
                        {simulationForm.initialCapital &&
                          parseFloat(simulationForm.initialCapital) >
                            userBalance && (
                            <p className="text-red-400 text-sm mt-1">
                              Capital supérieur au solde disponible
                            </p>
                          )}
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          Durée
                        </label>
                        <select
                          value={simulationForm.duration}
                          onChange={(e) =>
                            handleSimulationFormChange(
                              "duration",
                              e.target.value
                            )
                          }
                          className="w-full bg-[#0F0F19] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#3CD4AB] focus:outline-none"
                          style={{
                            backgroundColor: "#0F0F19",
                            color: "white"
                          }}
                        >
                          <option
                            value="6"
                            style={{
                              backgroundColor: "#0F0F19",
                              color: "white"
                            }}
                          >
                            6 mois
                          </option>
                          <option
                            value="12"
                            style={{
                              backgroundColor: "#0F0F19",
                              color: "white"
                            }}
                          >
                            1 an
                          </option>
                          <option
                            value="24"
                            style={{
                              backgroundColor: "#0F0F19",
                              color: "white"
                            }}
                          >
                            2 ans
                          </option>
                          <option
                            value="60"
                            style={{
                              backgroundColor: "#0F0F19",
                              color: "white"
                            }}
                          >
                            5 ans
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          Profil de Risque
                        </label>
                        <select
                          value={simulationForm.riskProfile}
                          onChange={(e) =>
                            handleSimulationFormChange(
                              "riskProfile",
                              e.target.value
                            )
                          }
                          className="w-full bg-[#0F0F19] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#3CD4AB] focus:outline-none"
                          style={{
                            backgroundColor: "#0F0F19",
                            color: "white"
                          }}
                        >
                          <option
                            value="conservateur"
                            style={{
                              backgroundColor: "#0F0F19",
                              color: "white"
                            }}
                          >
                            Conservateur (4% annuel)
                          </option>
                          <option
                            value="modere"
                            style={{
                              backgroundColor: "#0F0F19",
                              color: "white"
                            }}
                          >
                            Modéré (7% annuel)
                          </option>
                          <option
                            value="dynamique"
                            style={{
                              backgroundColor: "#0F0F19",
                              color: "white"
                            }}
                          >
                            Dynamique (10% annuel)
                          </option>
                          <option
                            value="agressif"
                            style={{
                              backgroundColor: "#0F0F19",
                              color: "white"
                            }}
                          >
                            Agressif (15% annuel)
                          </option>
                        </select>
                      </div>
                      <button
                        onClick={handleCreateSimulation}
                        disabled={
                          !simulationForm.initialCapital ||
                          parseFloat(simulationForm.initialCapital) <= 0 ||
                          parseFloat(simulationForm.initialCapital) >
                            userBalance
                        }
                        className="w-full bg-[#3CD4AB] hover:bg-[#3CD4AB]/80 text-[#0F0F19] font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Lancer la Simulation
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-6">
                      Simulations Actives
                    </h3>
                    <div className="space-y-4">
                      {recentSimulations
                        .filter((sim) => sim.status === "active")
                        .slice(0, 3)
                        .map((sim) => (
                          <div
                            key={sim.id}
                            className="p-4 bg-white/5 border border-white/10 rounded-lg"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-white font-medium">
                                {sim.name}
                              </h4>
                              <span
                                className={`font-semibold ${
                                  sim.performance >= 0
                                    ? "text-[#3CD4AB]"
                                    : "text-red-400"
                                }`}
                              >
                                {sim.performance >= 0 ? "+" : ""}
                                {sim.performance}%
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-white/60">
                                  Capital initial
                                </span>
                                <div className="text-white">
                                  {sim.initialCapital.toLocaleString()} Dhs
                                </div>
                              </div>
                              <div>
                                <span className="text-white/60">
                                  Valeur actuelle
                                </span>
                                <div className="text-[#3CD4AB]">
                                  {sim.currentValue.toLocaleString()} Dhs
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <div className="text-xs text-white/60">
                                Durée: {sim.duration}
                              </div>
                              <div className="text-xs text-white/60">
                                Créé le {sim.createdAt}
                              </div>
                            </div>
                          </div>
                        ))}
                      {recentSimulations.filter(
                        (sim) => sim.status === "active"
                      ).length === 0 && (
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
                    <h3 className="text-xl font-bold text-white">
                      Simulations Récentes
                    </h3>
                    <div className="flex items-center space-x-2">
                      <label className="text-white/60 text-sm">
                        Filtrer par:
                      </label>
                      <select
                        value={simulationDateFilter}
                        onChange={(e) =>
                          setSimulationDateFilter(e.target.value)
                        }
                        className="bg-[#0F0F19] border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:border-[#3CD4AB] focus:outline-none"
                        style={{
                          backgroundColor: "#0F0F19",
                          color: "white"
                        }}
                      >
                        <option
                          value="all"
                          style={{ backgroundColor: "#0F0F19", color: "white" }}
                        >
                          Toutes
                        </option>
                        <option
                          value="today"
                          style={{ backgroundColor: "#0F0F19", color: "white" }}
                        >
                          Aujourd'hui
                        </option>
                        <option
                          value="week"
                          style={{ backgroundColor: "#0F0F19", color: "white" }}
                        >
                          Cette semaine
                        </option>
                        <option
                          value="month"
                          style={{ backgroundColor: "#0F0F19", color: "white" }}
                        >
                          Ce mois
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getFilteredSimulations().map((simulation) => (
                      <div
                        key={simulation.id}
                        className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors duration-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-white font-medium">
                              {simulation.name}
                            </h4>
                            <p className="text-white/60 text-sm">
                              {simulation.riskProfile}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`font-semibold text-lg ${
                                simulation.performance >= 0
                                  ? "text-[#3CD4AB]"
                                  : "text-red-400"
                              }`}
                            >
                              {simulation.performance >= 0 ? "+" : ""}
                              {simulation.performance}%
                            </span>
                            <div
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                simulation.status === "active"
                                  ? "bg-[#3CD4AB]/20 text-[#3CD4AB]"
                                  : "bg-gray-500/20 text-gray-400"
                              }`}
                            >
                              {simulation.status === "active"
                                ? "Actif"
                                : "Terminé"}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/60">
                              Capital initial:
                            </span>
                            <span className="text-white">
                              {simulation.initialCapital.toLocaleString()} Dhs
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">
                              Valeur actuelle:
                            </span>
                            <span className="text-[#3CD4AB]">
                              {simulation.currentValue.toLocaleString()} Dhs
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Durée:</span>
                            <span className="text-white">
                              {simulation.duration}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Créé le:</span>
                            <span className="text-white">
                              {simulation.createdAt}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {getFilteredSimulations().length === 0 && (
                      <div className="col-span-full text-center text-white/60 py-8">
                        <svg
                          className="w-12 h-12 mx-auto mb-4 text-white/40"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          ></path>
                        </svg>
                        <p>Aucune simulation trouvée pour cette période</p>
                        <p className="text-sm mt-1">
                          Créez une nouvelle simulation pour commencer
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* News Page */}
            {currentPage === "news" && (
              <div>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-white">Actualités</h1>
                  {/* <p className="text-white/60">
                    Restez informé des dernières nouvelles financières et des marchés (NASDAQ, S&P 500, CAC 40)
                  </p> */}
                </div>

                {newsLoading ? (
                  <div className="p-6 bg-white/5 border border-white/10 rounded-lg text-center text-white/70">
                    Chargement des actualités...
                  </div>
                ) : newsError ? (
                  <div className="p-6 bg-white/5 border border-white/10 rounded-lg text-center text-red-400">
                    {newsError}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                      {newsArticles.map((article, index) => (
                        <Link
                          key={index}
                          to={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-6 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm hover:bg-white/10 transition-colors duration-200"
                        >
                          <div className="flex gap-4">
                            <img
                              src={article.image || "/public/assets/marketstock.png"}
                              alt={article.title}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <span className="inline-block bg-[#3CD4AB]/20 text-[#3CD4AB] px-2 py-1 rounded text-xs font-medium">
                                  {article.source || 'Source inconnue'}
                                </span>
                                <span className="text-white/60 text-sm">
                                  {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                                </span>
                              </div>
                              <h3 className="text-white font-semibold text-lg mb-2">
                                {article.title}
                              </h3>
                              {article.description && (
                                <p className="text-white/60 text-sm">
                                  {article.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                      {newsArticles.length === 0 && (
                        <div className="p-6 bg-white/5 border border-white/10 rounded-lg text-center text-white/60">
                          Aucune actualité trouvée.
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div className="p-6 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
                        <h3 className="text-xl font-bold text-white mb-4">Marché Crypto</h3>
                        <div className="space-y-4">
                          {marketQuotes.map((q, idx) => {
                            const change = q.change || 0;
                            const changePct = q.changesPercentage || 0;
                            const positive = change >= 0;
                            return (
                              <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                <span className="text-white font-medium">{q.label || q.symbol}</span>
                                <div className="text-right">
                                  <div className="text-white">{q.price ? q.price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '--'}</div>
                                  <div className={`text-sm font-semibold ${positive ? 'text-[#3CD4AB]' : 'text-red-400'}`}>
                                    {positive ? '+' : ''}{change.toFixed ? change.toFixed(2) : change} ({changePct.toFixed ? changePct.toFixed(2) : changePct}%)
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {marketQuotes.length === 0 && (
                            <div className="text-center text-white/60">Données indisponibles</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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

                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        {balanceOperation === "add"
                          ? "Montant à ajouter (Dhs)"
                          : "Montant à retirer (Dhs)"}
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
                          Solde disponible: {userBalance.toLocaleString()} Dhs
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-3">
                        Méthode de Paiement
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

                        {/* Visa/MasterCard */}
                        <div
                          onClick={() => setSelectedPaymentMethod("card")}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedPaymentMethod === "card"
                              ? "border-[#3CD4AB] bg-[#3CD4AB]/10"
                              : "border-white/20 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-4 h-4 rounded-full border-2 mr-3 ${
                                selectedPaymentMethod === "card"
                                  ? "border-[#3CD4AB] bg-[#3CD4AB]"
                                  : "border-white/40"
                              }`}
                            >
                              {selectedPaymentMethod === "card" && (
                                <div className="w-full h-full rounded-full bg-white scale-50"></div>
                              )}
                            </div>
                            <div className="flex items-center">
                              <svg
                                className="w-6 h-6 mr-2"
                                viewBox="0 0 24 24"
                                fill="#1a1f71"
                              >
                                <path d="M15.245 17.831h-6.49l-1.716-6.277c-.108-.394-.455-.394-.602-.394H2.881c-.147 0-.295.147-.295.295v.443c0 .147.147.295.295.295h3.114l2.466 9.095c.049.147.196.295.344.295h7.636c.147 0 .295-.147.295-.295v-.443c0-.196-.147-.295-.295-.295h-7.341l-.344-1.324h6.539c.147 0 .295-.147.295-.295v-.443c.049-.147-.098-.295-.245-.295z" />
                              </svg>
                              <span className="text-white font-medium">
                                Visa / MasterCard
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* USDT */}
                        <div
                          onClick={() => setSelectedPaymentMethod("usdt")}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedPaymentMethod === "usdt"
                              ? "border-[#3CD4AB] bg-[#3CD4AB]/10"
                              : "border-white/20 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-4 h-4 rounded-full border-2 mr-3 ${
                                selectedPaymentMethod === "usdt"
                                  ? "border-[#3CD4AB] bg-[#3CD4AB]"
                                  : "border-white/40"
                              }`}
                            >
                              {selectedPaymentMethod === "usdt" && (
                                <div className="w-full h-full rounded-full bg-white scale-50"></div>
                              )}
                            </div>
                            <div className="flex items-center">
                              <svg
                                className="w-6 h-6 mr-2"
                                viewBox="0 0 24 24"
                                fill="#26a17b"
                              >
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.94 9.435c-.011-.009-1.482-.827-4.464-.827-2.982 0-4.453.818-4.464.827L8.999 8.46c.021-.016 2.015-1.112 4.521-1.112s4.5 1.096 4.521 1.112l-.101.975zm-.484 1.634v1.78c0 .827-.675 1.502-1.502 1.502h-8.908c-.827 0-1.502-.675-1.502-1.502v-1.78c0-.827.675-1.502 1.502-1.502h8.908c.827 0 1.502.675 1.502 1.502z" />
                              </svg>
                              <span className="text-white font-medium">
                                USDT (Crypto)
                              </span>
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
                          {calculateTotalProfits().toLocaleString()} Dhs
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

                          {/* Visa/MasterCard */}
                          <div
                            onClick={() => setSelectedPaymentMethod("card")}
                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                              selectedPaymentMethod === "card"
                                ? "border-[#3CD4AB] bg-[#3CD4AB]/10"
                                : "border-white/20 bg-white/5 hover:bg-white/10"
                            }`}
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-4 h-4 rounded-full border-2 mr-3 ${
                                  selectedPaymentMethod === "card"
                                    ? "border-[#3CD4AB] bg-[#3CD4AB]"
                                    : "border-white/40"
                                }`}
                              >
                                {selectedPaymentMethod === "card" && (
                                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                )}
                              </div>
                              <div className="flex items-center">
                                <svg
                                  className="w-6 h-6 mr-2"
                                  viewBox="0 0 24 24"
                                  fill="#1a1f71"
                                >
                                  <path d="M15.245 17.831h-6.49l-1.716-6.277c-.108-.394-.455-.394-.602-.394H2.881c-.147 0-.295.147-.295.295v.443c0 .147.147.295.295.295h3.114l2.466 9.095c.049.147.196.295.344.295h7.636c.147 0 .295-.147.295-.295v-.443c0-.196-.147-.295-.295-.295h-7.341l-.344-1.324h6.539c.147 0 .295-.147.295-.295v-.443c.049-.147-.098-.295-.245-.295z" />
                                </svg>
                                <span className="text-white font-medium">
                                  Visa / MasterCard
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* USDT */}
                          <div
                            onClick={() => setSelectedPaymentMethod("usdt")}
                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                              selectedPaymentMethod === "usdt"
                                ? "border-[#3CD4AB] bg-[#3CD4AB]/10"
                                : "border-white/20 bg-white/5 hover:bg-white/10"
                            }`}
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-4 h-4 rounded-full border-2 mr-3 ${
                                  selectedPaymentMethod === "usdt"
                                    ? "border-[#3CD4AB] bg-[#3CD4AB]"
                                    : "border-white/40"
                                }`}
                              >
                                {selectedPaymentMethod === "usdt" && (
                                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                )}
                              </div>
                              <div className="flex items-center">
                                <svg
                                  className="w-6 h-6 mr-2"
                                  viewBox="0 0 24 24"
                                  fill="#26a17b"
                                >
                                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.94 9.435c-.011-.009-1.482-.827-4.464-.827-2.982 0-4.453.818-4.464.827L8.999 8.46c.021-.016 2.015-1.112 4.521-1.112s4.5 1.096 4.521 1.112l-.101.975zm-.484 1.634v1.78c0 .827-.675 1.502-1.502 1.502h-8.908c-.827 0-1.502-.675-1.502-1.502v-1.78c0-.827.675-1.502 1.502-1.502h8.908c.827 0 1.502.675 1.502 1.502z" />
                                </svg>
                                <span className="text-white font-medium">
                                  USDT (Crypto)
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
                      src={selectedInvestment.image}
                      alt={selectedInvestment.name}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {selectedInvestment.name}
                    </h4>
                    <p className="text-white/60 text-sm mb-3">
                      {selectedInvestment.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-white/60">Rendement:</span>
                        <span className="text-[#3CD4AB] font-semibold ml-2">
                          {selectedInvestment.return}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/60">Risque:</span>
                        <span className="text-white ml-2">
                          {selectedInvestment.risk}/10
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-white/60">
                          Investissement minimum:
                        </span>
                        <span className="text-white font-semibold ml-2">
                          {selectedInvestment.min.toLocaleString()} Dhs
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Balance Info */}
                  <div className="mb-4 p-3 bg-white/5 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/60">Solde disponible:</span>
                      <span className="text-[#3CD4AB] font-semibold">
                        {userBalance.toLocaleString()} Dhs
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
                      {investAmount &&
                        parseFloat(investAmount) < selectedInvestment.min && (
                          <p className="text-red-400 text-sm mt-1">
                            Le montant minimum est de{" "}
                            {selectedInvestment.min.toLocaleString()} Dhs
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
                          parseFloat(investAmount) < selectedInvestment.min ||
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
            {showNotificationDetails && selectedNotification && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-[#0F0F19] border border-white/20 rounded-lg p-6 w-full max-w-lg mx-4">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#3CD4AB]/20 rounded-full flex items-center justify-center">
                        {getNotificationIcon(selectedNotification.type)}
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {selectedNotification.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowNotificationDetails(false)}
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

                  {/* Notification Details */}
                  <div className="mb-6">
                    <div className="mb-4 p-4 bg-white/5 rounded-lg">
                      <p className="text-white text-sm leading-relaxed">
                        {selectedNotification.details}
                      </p>
                    </div>

                    {/* Astuce Section */}
                    <div className="mb-4 p-4 bg-[#3CD4AB]/10 border border-[#3CD4AB]/20 rounded-lg">
                      <h4 className="text-[#3CD4AB] font-semibold text-sm mb-2">
                        Astuce
                      </h4>
                      <p className="text-white/80 text-sm">
                        {selectedNotification.astuce}
                      </p>
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

            {/* Settings Modal */}
            {showSettingsModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-[#0F0F19] border border-white/20 rounded-lg p-6 w-full max-w-md mx-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Paramètres</h3>
                    <button
                      onClick={() => setShowSettingsModal(false)}
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
                    {/* User Info Display */}
                    <div className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-4 mb-4">
                        <img 
                          src={userData?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'} 
                          alt="Avatar" 
                          className="w-16 h-16 rounded-full"
                        />
                        <div>
                          <h4 className="text-white font-semibold">{userData?.name || 'Utilisateur'}</h4>
                          <p className="text-white/60 text-sm">{userData?.email}</p>
                          <p className="text-white/40 text-xs">Membre depuis {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('fr-FR') : 'récemment'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Account Actions */}
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          setShowSettingsModal(false);
                          // Add reset data functionality here
                          if (window.confirm('Êtes-vous sûr de vouloir réinitialiser toutes vos données ? Cette action est irréversible.')) {
                            setUserBalance(0);
                            setInvestmentHistory([]);
                            setTransactionsHistory([]);
                            setNotifications([]);
                            setNotificationHistory([]);
                            setRecentSimulations([]);
                            setPortfolioData({
                              totalInvested: 0,
                              globalPerformance: 0,
                              dailyVariation: 0,
                              monthlyGrowth: 0,
                              portfolioBreakdown: [],
                              performanceHistory: [
                                { date: "Jan", value: 0, benchmark: 0 },
                                { date: "Fév", value: 0, benchmark: 0 },
                                { date: "Mar", value: 0, benchmark: 0 },
                                { date: "Avr", value: 0, benchmark: 0 },
                                { date: "Mai", value: 0, benchmark: 0 },
                                { date: "Juin", value: 0, benchmark: 0 }
                              ],
                              products: []
                            });
                          }
                        }}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                      >
                        🔄 Réinitialiser toutes les données
                      </button>
                      
                      <button
                        onClick={() => {
                          console.log('Logout button clicked in settings modal');
                          // logout();
                          console.log('Logout function called from settings, navigating to signin');
                          navigate('/signin');
                        }}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                      >
                        🚪 Se déconnecter
                      </button>
                    </div>
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
