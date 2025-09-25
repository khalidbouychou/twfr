import React from 'react';
import { useExchangeRates } from '../../../hooks/useExchangeRates';
import { 
  FaDollarSign, 
  FaSpinner, 
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaEuroSign,
  FaPoundSign,
  FaYenSign,
  FaCoins,
  FaDollarSign as FaCanadianDollar,
  FaDollarSign as FaAustralianDollar,
  FaYenSign as FaYuanSign,
  FaExchangeAlt,
  FaClock,
  FaGlobe
} from 'react-icons/fa';

const ExchangeRates = () => {
  const { data: exchangeData, isLoading, error } = useExchangeRates();

  // Function to render the appropriate currency icon
  const getCurrencyIcon = (iconName, color) => {
    const iconProps = { className: "text-lg", style: { color } };
    
    switch (iconName) {
      case 'FaMapMarkerAlt':
        return <FaMapMarkerAlt {...iconProps} />;
      case 'FaEuroSign':
        return <FaEuroSign {...iconProps} />;
      case 'FaPoundSign':
        return <FaPoundSign {...iconProps} />;
      case 'FaYenSign':
        return <FaYenSign {...iconProps} />;
      case 'FaCoins':
        return <FaCoins {...iconProps} />;
      case 'FaDollarSign':
        return <FaDollarSign {...iconProps} />;
      default:
        return <FaExchangeAlt {...iconProps} />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
            <FaExchangeAlt className="text-white text-sm" />
          </div>
          <h3 className="text-xl font-bold text-white">Taux de Change</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin text-yellow-500 text-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
            <FaExchangeAlt className="text-white text-sm" />
          </div>
          <h3 className="text-xl font-bold text-white">Taux de Change</h3>
        </div>
        <div className="text-center py-6">
          <FaExclamationTriangle className="text-red-400 text-xl mx-auto mb-2" />
          <div className="text-red-400 text-sm">
            {error?.message || 'Erreur de chargement'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
          <FaExchangeAlt className="text-white text-sm" />
        </div>
        <h3 className="text-xl font-bold text-white">Taux de Change</h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {exchangeData?.currencies?.map((currency, index) => (
          <div
            key={currency.code}
            className="p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 hover:border-yellow-500/20 transition-all duration-300 hover:shadow-md group cursor-default"
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="group-hover:scale-110 transition-transform duration-300 inline-block">
                    {getCurrencyIcon(currency.iconName, currency.color)}
                  </div>
                  {currency.code === 'MAD' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#3CD4AB] rounded-full animate-pulse"></div>
                  )}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm flex items-center gap-2 group-hover:text-yellow-300 transition-colors">
                    {currency.code}
                    {currency.code === 'MAD' && (
                      <span className="px-1.5 py-0.5 bg-[#3CD4AB]/20 text-[#3CD4AB] text-xs rounded animate-pulse">
                        Local
                      </span>
                    )}
                  </div>
                  <div className="text-white/50 text-xs group-hover:text-white/70 transition-colors">
                    {currency.name}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-sm group-hover:text-yellow-300 transition-colors">
                  1 USD = {currency.rate?.toFixed(4) || 'N/A'} {currency.code}
                </div>
                <div
                  className={`text-xs font-semibold px-2 py-1 rounded-full transition-all duration-300 group-hover:scale-105 ${
                    (currency.change || 0) >= 0
                      ? "text-[#3CD4AB] bg-[#3CD4AB]/10 group-hover:bg-[#3CD4AB]/20"
                      : "text-red-400 bg-red-400/10 group-hover:bg-red-400/20"
                  }`}
                >
                  {(currency.change || 0) >= 0 ? "+" : ""}
                  {currency.change?.toFixed(2) || '0.00'}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer with update info */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-white/40">
          <div className="flex items-center gap-1">
            <FaGlobe className="text-xs" />
            <span>Base: {exchangeData?.baseCurrency || 'USD'}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaClock className="text-xs" />
            <span>
              Mis à jour: {
                exchangeData?.lastUpdated 
                  ? new Date(exchangeData.lastUpdated).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'N/A'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeRates;