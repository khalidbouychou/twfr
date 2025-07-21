import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

const API_KEY = 'pub_b1bf302734f24ad3b8bdae575237c3f1';
const NEWS_URL = `https://newsdata.io/api/1/news?category=business,world&language=fr,en&apikey=${API_KEY}`;

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 400 : -400,
    opacity: 0,
    position: 'absolute',
  }),
  center: {
    x: 0,
    opacity: 1,
    position: 'relative',
  },
  exit: (direction) => ({
    x: direction < 0 ? 400 : -400,
    opacity: 0,
    position: 'absolute',
  }),
};

const Features = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(NEWS_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setNewsItems(Array.isArray(data.results) ? data.results.slice(0, 7) : []); // Show up to 7 news
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur lors du chargement des actualités.');
        setLoading(false);
      });
  }, []);

  const itemIndex = ((page % newsItems.length) + newsItems.length) % newsItems.length;
  const paginate = (newDirection) => setPage([page + newDirection, newDirection]);

  return (
    <section className="w-full min-h-[300px] md:min-h-[500px] bg-white flex flex-col justify-center items-center p-0">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-[#191930] w-full">Actualités financières en temps réel</h2>
      <div className="relative w-full h-[300px] md:h-[500px] flex items-center justify-center overflow-hidden bg-[#f7f7fa]">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center text-[#89559F] text-lg">Chargement...</div>
        ) : error ? (
          <div className="w-full h-full flex items-center justify-center text-red-500 text-lg">{error}</div>
        ) : newsItems.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg">Aucune actualité trouvée.</div>
        ) : (
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={itemIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, type: 'spring' }}
              className="absolute w-full h-full flex flex-col md:flex-row items-center justify-center px-4 md:px-16"
            >
              {newsItems[itemIndex].image_url && (
                <img
                  src={newsItems[itemIndex].image_url}
                  alt="news visual"
                  className="w-32 h-32 md:w-72 md:h-72 object-cover rounded-xl mb-4 md:mb-0 md:mr-8 shadow-lg border"
                />
              )}
              <div className="flex-1 flex flex-col items-center md:items-start justify-center">
                <h3 className="text-xl md:text-2xl font-semibold mb-2 text-[#89559F] text-center md:text-left">
                  {newsItems[itemIndex].title}
                </h3>
                <p className="text-gray-700 mb-2 text-center md:text-left line-clamp-4 md:line-clamp-6">
                  {newsItems[itemIndex].description}
                </p>
                <a
                  href={newsItems[itemIndex].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#3CD4AB] underline mb-1"
                >
                  Lire l'article
                </a>
                <span className="text-xs text-gray-400">Source: {newsItems[itemIndex].source_id}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
        {!loading && !error && newsItems.length > 0 && (
          <>
            <button
              onClick={() => paginate(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#3CD4AB] text-white rounded-full p-3 shadow hover:bg-[#89559F] transition-colors z-10"
              aria-label="Précédent"
            >
              &#8592;
            </button>
            <button
              onClick={() => paginate(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#3CD4AB] text-white rounded-full p-3 shadow hover:bg-[#89559F] transition-colors z-10"
              aria-label="Suivant"
            >
              &#8594;
            </button>
          </>
        )}
      </div>
      {!loading && !error && newsItems.length > 0 && (
        <div className="flex justify-center mt-4 gap-2">
          {newsItems.map((_, idx) => (
            <span
              key={idx}
              className={`w-3 h-3 rounded-full ${idx === itemIndex ? 'bg-[#89559F]' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Features;
