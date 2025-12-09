import { useQuery } from '@tanstack/react-query';

// Exchange rates fetching function
const fetchExchangeRates = async () => {
  const API_KEY = import.meta.env.VITE_EXCHANGE_RATES_API_KEY;
  
  if (!API_KEY) {
    throw new Error("API key for exchange rates is not configured");
  }

  // Fetch USD as base currency with major currencies
  const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch exchange rates: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.result !== 'success') {
    throw new Error(data['error-type'] || 'Failed to fetch exchange rates');
  }

  // Extract major currencies for Morocco/MENA region and global markets
  const majorCurrencies = {
    MAD: data.conversion_rates.MAD, // Moroccan Dirham
    EUR: data.conversion_rates.EUR, // Euro
    GBP: data.conversion_rates.GBP, // British Pound
    JPY: data.conversion_rates.JPY, // Japanese Yen
    CHF: data.conversion_rates.CHF, // Swiss Franc
    CAD: data.conversion_rates.CAD, // Canadian Dollar
    AUD: data.conversion_rates.AUD, // Australian Dollar
    CNY: data.conversion_rates.CNY, // Chinese Yuan
  };

  // Convert to array format with currency info
  const currencies = Object.entries(majorCurrencies).map(([code, rate]) => {
    const currencyInfo = getCurrencyInfo(code);
    return {
      code,
      rate,
      name: currencyInfo.name,
      symbol: currencyInfo.symbol,
      iconName: currencyInfo.iconName,
      color: currencyInfo.color,
      change: calculateDailyChange(code), // Simulated daily change
    };
  });

  return {
    baseCurrency: 'USD',
    lastUpdated: data.time_last_update_utc,
    currencies,
  };
};

// Helper function to get currency information
const getCurrencyInfo = (code) => {
  const currencyMap = {
    MAD: { name: 'Dirham Marocain', symbol: 'MAD', iconName: 'FaMapMarkerAlt', color: '#FF6B6B' },
    EUR: { name: 'Euro', symbol: '€', iconName: 'FaEuroSign', color: '#4ECDC4' },
    GBP: { name: 'Livre Sterling', symbol: '£', iconName: 'FaPoundSign', color: '#45B7D1' },
    JPY: { name: 'Yen Japonais', symbol: '¥', iconName: 'FaYenSign', color: '#96CEB4' },
    CHF: { name: 'Franc Suisse', symbol: 'CHF', iconName: 'FaCoins', color: '#FFEAA7' },
    CAD: { name: 'Dollar Canadien', symbol: 'C$', iconName: 'FaDollarSign', color: '#DDA0DD' },
    AUD: { name: 'Dollar Australien', symbol: 'A$', iconName: 'FaDollarSign', color: '#98D8C8' },
    CNY: { name: 'Yuan Chinois', symbol: '¥', iconName: 'FaYenSign', color: '#F7DC6F' },
  };
  
  return currencyMap[code] || { name: code, symbol: code, iconName: 'FaExchangeAlt', color: '#89559F' };
};

// Simulate daily change (in a real app, you'd compare with yesterday's rates)
const calculateDailyChange = (code) => {
  // Generate consistent but varied changes based on currency code
  const seed = code.charCodeAt(0) + code.charCodeAt(1) + code.charCodeAt(2);
  const random = (seed * 9301 + 49297) % 233280 / 233280; // Simple PRNG
  
  // Generate change between -2% and +2%
  const change = (random - 0.5) * 4;
  return Math.round(change * 100) / 100;
};

// Custom hook for exchange rates
export const useExchangeRates = () => {
  return useQuery({
    queryKey: ['exchangeRates'],
    queryFn: fetchExchangeRates,
    staleTime: 1000 * 60 * 15, // 15 minutes (exchange rates don't change too frequently)
    cacheTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 15, // Refetch every 15 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};