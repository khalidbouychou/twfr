import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';

const NEWS_API_KEY = 'b453f54e6b5840e4a3604f0f8d121168'; // Replace with your NewsAPI key

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brokenImages, setBrokenImages] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const keywords = encodeURIComponent('finance OR investissement OR bourse OR économie OR argent OR actions OR marché');
        const url = `https://newsapi.org/v2/everything?q=${keywords}&language=fr&sortBy=publishedAt&pageSize=20&apiKey=${NEWS_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        setArticles(data.articles || []);
      } catch {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
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
