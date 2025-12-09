import { useQuery } from '@tanstack/react-query';

// News fetching functions
const getFromNewsdata = async () => {
  const NEWSDATA_KEY = "pub_a433db815e694abe98923ab9daac2de5";
  if (!NEWSDATA_KEY) throw new Error("no_newsdata_key");
  
  const q = 'finance OR bourse OR "marché boursier" OR investissement';
  const url = `https://newsdata.io/api/1/news?apikey=${NEWSDATA_KEY}&language=fr&category=business&q=${encodeURIComponent(q)}`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error("newsdata_err");
  
  const data = await response.json();
  const items = Array.isArray(data.results) ? data.results : [];
  
  return items
    .map((article) => ({
      title: article.title,
      description: article.description,
      url: article.link,
      image: article.image_url,
      source: article.source_id,
      publishedAt: article.pubDate ? new Date(article.pubDate).toISOString() : null
    }))
    .filter((article) => article.title && article.url);
};

const getFromGNews = async () => {
  const GNEWS_KEY = import.meta.env.VITE_GNEWS_KEY;
  if (!GNEWS_KEY) throw new Error("no_gnews_key");
  
  const q = 'finance OR bourse OR "marché boursier" OR investissement';
  const url = `https://gnews.io/api/v4/top-headlines?lang=fr&topic=business&max=20&apikey=${GNEWS_KEY}&q=${encodeURIComponent(q)}`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error("gnews_err");
  
  const data = await response.json();
  const items = Array.isArray(data.articles) ? data.articles : [];
  
  return items
    .map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.image,
      source: article.source?.name,
      publishedAt: article.publishedAt
    }))
    .filter((article) => article.title && article.url);
};

const getFromNewsAPI = async () => {
  const NEWSAPI_KEY = import.meta.env.VITE_NEWSAPI_KEY;
  if (!NEWSAPI_KEY) throw new Error("no_newsapi_key");
  
  const q = 'finance OR bourse OR "marché boursier" OR investissement';
  const url = `https://newsapi.org/v2/everything?language=fr&pageSize=20&sortBy=publishedAt&q=${encodeURIComponent(q)}&apiKey=${NEWSAPI_KEY}`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error("newsapi_err");
  
  const data = await response.json();
  const items = Array.isArray(data.articles) ? data.articles : [];
  
  return items
    .map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.urlToImage,
      source: article.source?.name,
      publishedAt: article.publishedAt
    }))
    .filter((article) => article.title && article.url);
};

const getFromMediastack = async () => {
  const MEDIASTACK_KEY = import.meta.env.VITE_MEDIASTACK_KEY;
  if (!MEDIASTACK_KEY) throw new Error("no_mediastack_key");
  
  const q = 'finance OR bourse OR "marché boursier" OR investissement';
  const url = `https://api.mediastack.com/v1/news?access_key=${MEDIASTACK_KEY}&languages=fr&categories=business&limit=20&sort=published_desc&keywords=${encodeURIComponent(q)}`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error("mediastack_err");
  
  const data = await response.json();
  const items = Array.isArray(data.data) ? data.data : [];
  
  return items
    .map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.image,
      source: article.source,
      publishedAt: article.published_at
    }))
    .filter((article) => article.title && article.url);
};

const getFromContextualWeb = async () => {
  const CTX_NEWS_KEY = import.meta.env.VITE_CTX_NEWS_KEY;
  const CTX_NEWS_HOST = import.meta.env.VITE_CTX_NEWS_HOST || "contextualwebsearch-websearch-v1.p.rapidapi.com";
  
  if (!CTX_NEWS_KEY) throw new Error("no_ctx_key");
  
  const q = 'finance OR bourse OR "marché boursier" OR investissement';
  const url = `https://${CTX_NEWS_HOST}/api/Search/NewsSearchAPI?q=${encodeURIComponent(q)}&pageNumber=1&pageSize=20&autoCorrect=true&fromPublishedDate=null&toPublishedDate=null&safeSearch=false&withThumbnails=true&textDecorations=false&freshness=Week&setLang=fr`;
  
  const response = await fetch(url, {
    headers: {
      "X-RapidAPI-Key": CTX_NEWS_KEY,
      "X-RapidAPI-Host": CTX_NEWS_HOST
    }
  });
  
  if (!response.ok) throw new Error("ctx_err");
  
  const data = await response.json();
  const items = Array.isArray(data.value) ? data.value : [];
  
  return items
    .map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.image?.url,
      source: article.provider?.name,
      publishedAt: article.datePublished
    }))
    .filter((article) => article.title && article.url);
};

// Main news fetching function with fallback providers
const fetchNews = async () => {
  const providers = [
    getFromNewsdata,
    getFromGNews,
    getFromNewsAPI,
    getFromMediastack,
    getFromContextualWeb
  ];
  
  for (const provider of providers) {
    try {
      const articles = await provider();
      if (articles && articles.length > 0) {
        return articles;
      }
    } catch (error) {
      console.warn(`News provider failed:`, error.message);
      // Continue to next provider
    }
  }
  
  return [];
};

// Custom hook for news data
export const useNewsData = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
    staleTime: 1000 * 60 * 10, // 10 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};