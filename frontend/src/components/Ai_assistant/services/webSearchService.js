/**
 * Web Search Service for external data retrieval
 * Provides real-time market data and news
 */

/**
 * Search using DuckDuckGo Instant Answer API (No API key required)
 */
export const searchDuckDuckGo = async (query) => {
  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(
      query
    )}&format=json&no_html=1&skip_disambig=1`;

    const response = await fetch(url);
    const data = await response.json();

    return {
      success: true,
      abstract: data.Abstract,
      abstractText: data.AbstractText,
      relatedTopics:
        data.RelatedTopics?.slice(0, 3).map((topic) => ({
          text: topic.Text,
          url: topic.FirstURL,
        })) || [],
      source: data.AbstractSource,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Search financial news using existing NewsData API
 */
export const searchFinancialNews = async (query) => {
  const apiKey = import.meta.env.VITE_API_KEY_NEWS_DATA;

  if (!apiKey) {
    console.warn("NewsData API key not configured");
    return { success: false, error: "API key not configured" };
  }

  try {
    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(
      query
    )}&language=fr,en&category=business`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "success" && data.results) {
      return {
        success: true,
        articles: data.results.slice(0, 3).map((article) => ({
          title: article.title,
          description: article.description,
          url: article.link,
          source: article.source_id,
          pubDate: article.pubDate,
        })),
      };
    }

    return { success: false, error: "No results found" };
  } catch (error) {
    console.error("NewsData API error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get market data using Finnhub API
 */
export const getMarketData = async (symbol = "AAPL") => {
  const apiKey = import.meta.env.VITE_FINNHUB_TOKEN;

  if (!apiKey) {
    console.warn("Finnhub API key not configured");
    return { success: false, error: "API key not configured" };
  }

  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.c) {
      return {
        success: true,
        symbol: symbol,
        currentPrice: data.c,
        change: data.d,
        percentChange: data.dp,
        high: data.h,
        low: data.l,
        open: data.o,
        previousClose: data.pc,
      };
    }

    return { success: false, error: "Invalid symbol or no data" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Search Wikipedia for general information (Free, no API key)
 */
export const searchWikipedia = async (query, lang = "fr") => {
  try {
    const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      query
    )}`;

    const response = await fetch(url);

    if (!response.ok) {
      return { success: false, error: "Not found" };
    }

    const data = await response.json();

    return {
      success: true,
      title: data.title,
      extract: data.extract,
      url: data.content_urls?.desktop?.page,
      thumbnail: data.thumbnail?.source,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get exchange rates
 */
export const getExchangeRates = async (base = "MAD") => {
  const apiKey = import.meta.env.VITE_EXCHANGE_RATES_API_KEY;

  if (!apiKey) {
    console.warn("Exchange rates API key not configured");
    return { success: false, error: "API key not configured" };
  }

  try {
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.result === "success") {
      return {
        success: true,
        base: data.base_code,
        rates: {
          USD: data.conversion_rates.USD,
          EUR: data.conversion_rates.EUR,
          GBP: data.conversion_rates.GBP,
        },
        lastUpdate: data.time_last_update_utc,
      };
    }

    return { success: false, error: "Failed to fetch rates" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Main search function that combines multiple sources
 */
export const webSearch = async (query, type = "auto") => {
  const results = {
    query: query,
    timestamp: new Date().toISOString(),
    sources: [],
  };

  // Determine search type based on query
  const queryLower = query.toLowerCase();

  if (type === "auto") {
    if (queryLower.includes("news") || queryLower.includes("actualité")) {
      type = "news";
    } else if (
      queryLower.includes("cours") ||
      queryLower.includes("price") ||
      queryLower.includes("action")
    ) {
      type = "market";
    } else if (
      queryLower.includes("taux") ||
      queryLower.includes("exchange") ||
      queryLower.includes("devise")
    ) {
      type = "exchange";
    } else {
      type = "general";
    }
  }

  try {
    switch (type) {
      case "news": {
        const news = await searchFinancialNews(query);
        if (news.success) {
          results.sources.push({
            type: "news",
            data: news.articles,
            summary: `Dernières actualités sur "${query}"`,
          });
        }
        break;
      }

      case "market": {
        // Extract symbol if present
        const symbolMatch = query.match(/\b[A-Z]{1,5}\b/);
        const symbol = symbolMatch ? symbolMatch[0] : "AAPL";
        const marketData = await getMarketData(symbol);
        if (marketData.success) {
          results.sources.push({
            type: "market",
            data: marketData,
            summary: `Données de marché pour ${symbol}: ${marketData.currentPrice} (${marketData.percentChange}%)`,
          });
        }
        break;
      }

      case "exchange": {
        const exchangeRates = await getExchangeRates("MAD");
        if (exchangeRates.success) {
          results.sources.push({
            type: "exchange",
            data: exchangeRates,
            summary: `Taux de change: 1 MAD = ${exchangeRates.rates.USD} USD, ${exchangeRates.rates.EUR} EUR`,
          });
        }
        break;
      }

      case "general":
      default: {
        // Try DuckDuckGo
        const ddgResults = await searchDuckDuckGo(query);
        if (ddgResults.success && ddgResults.abstractText) {
          results.sources.push({
            type: "web",
            data: ddgResults,
            summary: ddgResults.abstractText,
          });
        }

        // Try Wikipedia as fallback
        if (results.sources.length === 0) {
          const wikiResults = await searchWikipedia(query);
          if (wikiResults.success) {
            results.sources.push({
              type: "wiki",
              data: wikiResults,
              summary: wikiResults.extract,
            });
          }
        }
        break;
      }
    }

    return {
      success: results.sources.length > 0,
      ...results,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      query: query,
    };
  }
};

/**
 * Format web search results for LLM context
 */
export const formatWebSearchForLLM = (searchResults) => {
  if (!searchResults.success || !searchResults.sources.length) {
    return "Aucune donnée externe trouvée pour cette recherche.";
  }

  let formatted = "DONNÉES EXTERNES:\n\n";

  searchResults.sources.forEach((source) => {
    formatted += `[Source: ${source.type.toUpperCase()}]\n`;
    formatted += `${source.summary}\n`;

    if (source.type === "news" && source.data) {
      source.data.forEach((article) => {
        formatted += `- ${article.title}\n`;
      });
    }

    formatted += "\n";
  });

  return formatted;
};

export default {
  webSearch,
  searchFinancialNews,
  getMarketData,
  getExchangeRates,
  searchDuckDuckGo,
  searchWikipedia,
  formatWebSearchForLLM,
};
