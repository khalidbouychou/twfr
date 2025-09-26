import React from 'react';
import { Link } from 'react-router-dom';
import { ROICalculator } from '../../Algo';

const InvestmentsPage = ({ 
  userResults, 
  matchedInvestments, 
  handleInvestClick 
}) => {
  return (
    <div className="flex-col">

      {/* Investment Cards */}
      {!userResults || !userResults.matchedProducts?.length ? (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-yellow-600/10 border border-orange-500/20 p-8 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-yellow-600/5 opacity-50"></div>
          <div className="relative">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-xl mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Complétez votre profil d'investisseur
              </h3>
              <p className="text-white/70 text-lg mb-6 max-w-md mx-auto">
                Aucun produit recommandé pour le moment. Complétez votre simulation pour découvrir des investissements personnalisés.
              </p>
            </div>
            <Link
              to="/simulation"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#3CD4AB] to-emerald-500 hover:from-[#2bb894] hover:to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Compléter votre profil
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {matchedInvestments.map((investment, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 via-white/10 to-white/5 border border-white/10 shadow-xl backdrop-blur-sm cursor-pointer"
              onClick={() => handleInvestClick(investment)}
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
              
              {/* Content Container */}
              <div className="relative p-6 h-full flex flex-col">
                {/* Image Container */}
                <div className="relative mb-4 overflow-hidden rounded-xl">
                  <img
                    src={investment.image}
                    alt={investment.name}
                    className="w-full h-32 object-cover"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Basic Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white mb-2">
                    {investment.name}
                  </h3>
                  <p className="text-white/60 text-sm mb-3">
                    {investment.description}
                  </p>
                </div>

                {/* Product Details - Always Visible */}
                <div className="flex-1 space-y-3">
                  {/* ROI Information */}
                  <div className="p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg backdrop-blur-sm">
                    <div className="text-xs text-blue-400 mb-2 font-semibold">
                      ROI sur 10,000 MAD
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className={`font-bold ${ROICalculator.getROIColor(investment.roi.roi1Year)}`}>
                          {ROICalculator.formatROI(investment.roi.roi1Year)}
                        </div>
                        <div className="text-white/60">1 an</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-bold ${ROICalculator.getROIColor(investment.roi.roi3Years)}`}>
                          {ROICalculator.formatROI(investment.roi.roi3Years)}
                        </div>
                        <div className="text-white/60">3 ans</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-bold ${ROICalculator.getROIColor(investment.roi.roi5Years)}`}>
                          {ROICalculator.formatROI(investment.roi.roi5Years)}
                        </div>
                        <div className="text-white/60">5 ans</div>
                      </div>
                    </div>
                  </div>

                  {/* Risk Level */}
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80 font-medium">Niveau de Risque</span>
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-white/20 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            investment.risk <= 3 
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                              : investment.risk <= 6 
                              ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                              : 'bg-gradient-to-r from-orange-500 to-red-500'
                          }`}
                          style={{ width: `${(investment.risk / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-white font-bold text-sm min-w-[2rem]">
                        {investment.risk}/10
                      </span>
                    </div>
                  </div>

                  {/* Investment Minimum */}
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80 font-medium">Investissement Min.</span>
                    <span className="text-[#3CD4AB] font-bold">
                      {investment.min.toLocaleString()} MAD
                    </span>
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <div className="text-white/60 mb-1">ROI Annuel</div>
                      <div className={`font-bold ${ROICalculator.getROIColor(investment.roi.annual)}`}>
                        {investment.roi.annual}%
                      </div>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg">
                      <div className="text-white/60 mb-1">Volatilité</div>
                      <div className="text-white font-bold">{investment.roi.volatility}%</div>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg">
                      <div className="text-white/60 mb-1">Frais</div>
                      <div className="text-white font-bold">{investment.roi.fees}%</div>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg">
                      <div className="text-white/60 mb-1">Liquidité</div>
                      <div className="text-white font-bold text-xs">{investment.roi.liquidity}</div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-4">
                  <button className="w-full bg-gradient-to-r from-[#3CD4AB] to-emerald-500 hover:from-[#2bb894] hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      Investir Maintenant
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Investment Tips Section */}
      {userResults && userResults.matchedProducts?.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl  p-6 gap-8">
          <div className="absolute inset-0 "></div>
          <div className="relative flex items-start space-x-4">
         
            <div>
              <h3 className="text-lg font-bold text-emerald-300 mb-2">
                Conseils d'investissement
              </h3>
              <ul className="text-white/70 text-sm space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Diversifiez vos investissements pour réduire les risques</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>N'investissez jamais plus de 20% de votre capital dans un seul produit</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Consultez tous les détails de chaque produit avant d'investir</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentsPage;