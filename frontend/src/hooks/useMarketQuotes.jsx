import { useQuery } from '@tanstack/react-query';

// Market quotes fetching function
const fetchMarketQuotes = async () => {
  const FINNHUB_TOKEN = "d1ofk41r01qjadrjqv70d1ofk41r01qjadrjqv7g";
  
  const symbols = [
    { sym: "BINANCE:BTCUSDT", label: "Bitcoin (BTC/USDT)" },
    { sym: "BINANCE:ETHUSDT", label: "Ethereum (ETH/USDT)" },
    { sym: "BINANCE:SOLUSDT", label: "Solana (SOL/USDT)" }
  ];

  const fetchQuote = async (symbol) => {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_TOKEN}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch quote for ${symbol}`);
    }
    
    return response.json();
  };

  const quotes = [];
  
  for (const symbolInfo of symbols) {
    try {
      const quote = await fetchQuote(symbolInfo.sym);
      
      if (quote && typeof quote.c === "number") {
        quotes.push({
          symbol: symbolInfo.sym,
          label: symbolInfo.label,
          price: quote.c,
          change: quote.d || 0,
          changesPercentage: quote.dp || 0
        });
      }
    } catch (error) {
      console.warn(`Quote fetch failed for ${symbolInfo.sym}:`, error.message);
    }
  }
  
  return quotes;
};

// Custom hook for market quotes
export const useMarketQuotes = () => {
  return useQuery({
    queryKey: ['marketQuotes'],
    queryFn: fetchMarketQuotes,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};