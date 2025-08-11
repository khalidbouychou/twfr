import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';

const FINNHUB_TOKEN = 'd1ofk41r01qjadrjqv70d1ofk41r01qjadrjqv7g';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brokenImages, setBrokenImages] = useState([]);

  useEffect(() => {
    const loadNews = async () => {
      try {
        // Try Finnhub first
        const newsUrl = `https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_TOKEN}`;
        const response = await fetch(newsUrl);
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            const formattedArticles = data.slice(0, 20).map(article => ({
              title: article.headline,
              description: article.summary,
              url: article.url,
              urlToImage: article.image || 'https://via.placeholder.com/300x200?text=Actualité',
              publishedAt: new Date(article.datetime * 1000).toISOString(),
              source: { name: article.source }
            }));
            setArticles(formattedArticles);
            setLoading(false);
            return;
          }
        }
        
        // Fallback to GNews
        const gnewsUrl = `https://gnews.io/api/v4/search?q=finance&lang=fr&country=fr&max=20&apikey=YOUR_GNEWS_KEY`;
        const gnewsResponse = await fetch(gnewsUrl);
        
        if (gnewsResponse.ok) {
          const gnewsData = await gnewsResponse.json();
          if (gnewsData && gnewsData.articles && gnewsData.articles.length > 0) {
            const formattedArticles = gnewsData.articles.map(article => ({
              title: article.title,
              description: article.description,
              url: article.url,
              urlToImage: article.image || 'https://via.placeholder.com/300x200?text=Actualité',
              publishedAt: article.publishedAt,
              source: { name: article.source.name }
            }));
            setArticles(formattedArticles);
            setLoading(false);
            return;
          }
        }
        
        // Final fallback - create sample articles
        const sampleArticles = [
          {
            title: "Marché financier en hausse",
            description: "Les marchés financiers montrent des signes de reprise avec une augmentation des indices principaux.",
            url: "#",
            urlToImage: "https://via.placeholder.com/300x200?text=Finance",
            publishedAt: new Date().toISOString(),
            source: { name: "TawfirAI" }
          },
          {
            title: "Nouvelles opportunités d'investissement",
            description: "Découvrez les dernières tendances et opportunités dans le monde de l'investissement.",
            url: "#",
            urlToImage: "https://via.placeholder.com/300x200?text=Investissement",
            publishedAt: new Date().toISOString(),
            source: { name: "TawfirAI" }
          },
          {
            title: "Économie mondiale en évolution",
            description: "Analyse des changements économiques globaux et leur impact sur les marchés.",
            url: "#",
            urlToImage: "https://via.placeholder.com/300x200?text=Économie",
            publishedAt: new Date().toISOString(),
            source: { name: "TawfirAI" }
          }
        ];
        setArticles(sampleArticles);
        
      } catch (error) {
        console.error('Error loading news:', error);
        // Set sample articles on error
        const sampleArticles = [
          {
            title: "Actualités financières",
            description: "Restez informé des dernières nouvelles du monde financier et des opportunités d'investissement.",
            url: "#",
            urlToImage: "https://via.placeholder.com/300x200?text=Actualités",
            publishedAt: new Date().toISOString(),
            source: { name: "TawfirAI" }
          }
        ];
        setArticles(sampleArticles);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  // Only articles with a non-empty image URL and not in brokenImages
  const articlesWithImages = articles.filter(
    article =>
      typeof article.urlToImage === 'string' &&
      article.urlToImage.trim() !== '' &&
      !brokenImages.includes(article.urlToImage)
  );

  if (loading) return <div>Loading news...</div>;
  if (!articlesWithImages.length) return <div>No news found.</div>;

  return (
    <div className="mx-auto py-20   ">
      <h2 className="text-3xl font-bold mb-8 text-center text-[#3CD4AB]">Actualités du jour</h2>
      <Swiper
        modules={[Navigation, Autoplay]}
        
        spaceBetween={30}
        slidesPerView={1}
        centeredSlides={true}
        loop={true}
        autoplay={{ delay: 1500, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {articlesWithImages.map((article, idx) => (
          <SwiperSlide key={idx}>
            <div className= "bg-[#0b0b17] relative rounded-3xl flex flex-col items-center transition-transform duration-100 hover:bg-[#3CD4AB] mx-auto group w-[400px] h-[430px]">
              <div className='w-[300px] h-[300px] mb-4 mt-4'>
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-full object-cover rounded-lg"
                  onError={() =>
                    setBrokenImages(prev => [...prev, article.urlToImage])
                  }
                />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-center line-clamp-2 text-white">{article.title}</h3>
              <p className="text-xs text-gray-400 mb-1 text-center">
                {new Date(article.publishedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-sm text-gray-600 mb-2 text-center line-clamp-3">
                {article.description?.slice(0, 100)}...
              </p>
              {/* Overlay Read more link centered on hover */}
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xl font-bold text-[#3CD4AB] bg-black/60 rounded-3xl cursor-pointer"
                style={{ pointerEvents: 'auto' }}
              >
                Lire l'article
              </a>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default News;
