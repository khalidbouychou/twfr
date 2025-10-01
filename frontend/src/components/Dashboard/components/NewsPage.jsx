import React from 'react';
import { Link } from 'react-router-dom';
import ExchangeRates from './ExchangeRates';
import { 
  FaSpinner, 
  FaExclamationTriangle, 
  FaNewspaper, 
  FaBitcoin, 
  FaChartBar, 
  FaArrowRight,
  FaClock
} from 'react-icons/fa';

const NewsPage = ({ 
  newsLoading, 
  newsError, 
  newsArticles, 
  marketQuotes 
}) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white">Actualités</h1>
      </div>

      {newsLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <FaSpinner className="animate-spin text-[#3CD4AB] text-5xl mb-4 mx-auto" />
            <p className="text-white/70 text-lg">Chargement des actualités...</p>
          </div>
        </div>
      ) : newsError ? (
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
          <FaExclamationTriangle className="text-red-400 text-3xl mx-auto mb-4" />
          <div className="text-red-400 text-lg font-semibold mb-2">Erreur de chargement</div>
          <p className="text-red-300/80">
            {typeof newsError === 'string' ? newsError : newsError?.message || "Impossible de charger les actualités"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* News Articles Section - 3 columns */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {newsArticles.map((article, index) => (
                <Link
                  key={index}
                  to={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-full"
                >
                  <div className="h-full p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm transition-all duration-300 ease-out hover:bg-white/10 hover:border-[#3CD4AB]/30 hover:shadow-lg hover:shadow-[#3CD4AB]/10 hover:-translate-y-1">
                    {/* Image */}
                    <div className="relative mb-4 overflow-hidden rounded-lg">
                      <img
                        src={article.image || "/assets/marketstock.png"}
                        alt={article.title}
                        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = "/assets/marketstock.png";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col h-[calc(100%-180px)]">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#3CD4AB]/15 text-[#3CD4AB] group-hover:bg-[#3CD4AB]/25 transition-colors duration-300">
                          {article.source || "Source inconnue"}
                        </span>
                        <span className="text-white/50 text-xs">
                          {article.publishedAt
                            ? new Date(article.publishedAt).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "short"
                              })
                            : ""}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-white font-semibold text-sm leading-tight mb-3 line-clamp-3 group-hover:text-[#3CD4AB] transition-colors duration-300">
                        {article.title}
                      </h3>

                      {/* Description */}
                      {article.description && (
                        <p className="text-white/60 text-xs leading-relaxed line-clamp-3 flex-grow group-hover:text-white/80 transition-colors duration-300">
                          {article.description}
                        </p>
                      )}

                      {/* Read More */}
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2 text-[#3CD4AB] text-xs font-medium group-hover:text-[#3CD4AB]/80 transition-colors duration-300">
                          <span>Lire l'article</span>
                          <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {newsArticles.length === 0 && (
              <div className="text-center py-12">
                <FaNewspaper className="text-white/40 text-6xl mb-4 mx-auto" />
                <div className="text-white/60 text-lg mb-2">Aucune actualité disponible</div>
                <p className="text-white/40 text-sm">Les actualités seront chargées automatiquement</p>
              </div>
            )}
          </div>

          {/* Market Quotes Sidebar */}
          <div className="space-y-6">
            {/* Exchange Rates Component */}
            <ExchangeRates />
            
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-[#3CD4AB] to-[#2AB896] rounded-lg flex items-center justify-center">
                  <FaBitcoin className="text-white text-sm" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Marché Crypto
                </h3>
              </div>
              
              <div className="space-y-4">
                {marketQuotes.map((quote, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 hover:border-[#3CD4AB]/20 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-white font-semibold text-sm mb-1">
                          {quote.symbol?.replace('BINANCE:', '') || 'N/A'}
                        </div>
                        <div className="text-white/50 text-xs">
                          {quote.label || 'N/A'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold text-sm mb-1">
                          ${quote.price?.toFixed(2) || 'N/A'}
                        </div>
                        <div
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            (quote.changesPercentage || 0) >= 0
                              ? "text-[#3CD4AB] bg-[#3CD4AB]/10"
                              : "text-red-400 bg-red-400/10"
                          }`}
                        >
                          {(quote.changesPercentage || 0) >= 0 ? "+" : ""}
                          {quote.changesPercentage?.toFixed(2) || '0.00'}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {marketQuotes.length === 0 && (
                  <div className="text-center py-8">
                    <FaChartBar className="text-white/30 text-4xl mb-3 mx-auto" />
                    <div className="text-white/50 text-sm">
                      Données indisponibles
                    </div>
                  </div>
                )}
              </div>

              {/* Market Summary */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center justify-center gap-1 text-xs text-white/40">
                  <FaClock className="text-xs" />
                  <span>Mis à jour automatiquement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsPage;