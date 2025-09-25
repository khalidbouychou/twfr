import React from 'react';

const InvestmentStats = ({ 
  portfolioData, 
  calculateTotalProfits, 
  userBalance
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Total Investment - Green Gradient */}
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/20 via-green-500/10 to-teal-600/20 border border-emerald-500/30 p-6 h-32 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-teal-600/5 opacity-50"></div>
        <div className="relative flex items-center justify-between h-full">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-300 mb-1">Total Investi</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                {(portfolioData?.totalInvested || 0).toLocaleString()} MAD
              </p>
            </div>
          </div>
          <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-50 transition-opacity">
            <svg className="w-8 h-8 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Total Profits - Purple Gradient */}
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/20 via-violet-500/10 to-indigo-600/20 border border-purple-500/30 p-6 h-32 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-indigo-600/5 opacity-50"></div>
        <div className="relative flex items-center justify-between h-full">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 14l3-3 3 3 6-6-1.5-1.5L12 12 9 9 3 15l1.5 1.5L7 14z"/>
                <path d="M20 8v4h-4"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-purple-300 mb-1">Total Profits</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
                +{calculateTotalProfits().toLocaleString()} MAD
              </p>
            </div>
          </div>
          <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-50 transition-opacity">
            <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Available Balance - Blue Gradient */}
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-indigo-600/20 border border-cyan-500/30 p-6 h-32 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-indigo-600/5 opacity-50"></div>
        <div className="relative flex items-center justify-between h-full">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 7L9 19l-5.5-5.5 1.41-1.41L9 16.17 19.59 5.59 21 7z"/>
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-cyan-300 mb-1">Solde Disponible</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                {userBalance.toLocaleString()} MAD
              </p>
            </div>
          </div>
          <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-50 transition-opacity">
            <svg className="w-8 h-8 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
            </svg>
          </div>
        </div>
      </div>


    </div>
  );
};

export default InvestmentStats;