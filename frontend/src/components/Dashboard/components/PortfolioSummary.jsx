import React from 'react';

const PortfolioSummary = ({ 
  calculateInvestmentHistoryWithReturns, 
  portfolioData, 
  investmentHistory, 
  calculateSectorBreakdown 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Valeur Totale */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
        <div className="flex items-center">
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-[#3CD4AB] bg-[#3CD4AB]/20 rounded-lg">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-white/60">
              Valeur Totale
            </p>
            <p className="text-2xl font-bold text-white">
              {calculateInvestmentHistoryWithReturns()
                .reduce((sum, inv) => sum + inv.currentValue, 0)
                .toLocaleString()}{" "}
              MAD
            </p>
          </div>
        </div>
      </div>

      {/* Gain/Perte Total */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
        <div className="flex items-center">
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-[#3CD4AB] bg-[#3CD4AB]/20 rounded-lg">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-white/60">
              Gain/Perte Total
            </p>
            <p
              className={`text-2xl font-bold ${
                portfolioData.globalPerformance >= 0
                  ? "text-[#3CD4AB]"
                  : "text-red-400"
              }`}
            >
              {portfolioData.globalPerformance >= 0 ? "+" : ""}
              {(
                calculateInvestmentHistoryWithReturns().reduce(
                  (sum, inv) => sum + inv.currentValue,
                  0
                ) - portfolioData.totalInvested
              ).toLocaleString()}{" "}
              MAD
            </p>
          </div>
        </div>
      </div>

      {/* Nombre d'Investissements */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
        <div className="flex items-center">
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-[#3CD4AB] bg-[#3CD4AB]/20 rounded-lg">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-white/60">
              Nombre d'Investissements
            </p>
            <p className="text-2xl font-bold text-white">
              {investmentHistory.length}
            </p>
          </div>
        </div>
      </div>

      {/* Secteurs Diversifiés */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
        <div className="flex items-center">
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-[#3CD4AB] bg-[#3CD4AB]/20 rounded-lg">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-white/60">
              Secteurs Diversifiés
            </p>
            <p className="text-2xl font-bold text-white">
              {calculateSectorBreakdown().length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;