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
         <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wallet-icon lucide-wallet"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
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
          {/* <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-[#3CD4AB] bg-[#3CD4AB]/20 rounded-lg"> */}
           <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-coins-icon lucide-coins"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>
          {/* </div> */}
          <div className="ml-4">
            <p className="text-sm font-medium text-white/60">
              Gain/Perte Total
            </p>
            <p
              className={`text-2xl font-bold $`}
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
          {/* <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-[#3CD4AB] bg-[#3CD4AB]/20 rounded-lg"> */}
           <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calculator-icon lucide-calculator"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
          {/* </div> */}
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
          {/* <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-[#3CD4AB] bg-[#3CD4AB]/20 rounded-lg"> */}
            {/* <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
            </svg> */}
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-factory-icon lucide-factory"><path d="M12 16h.01"/><path d="M16 16h.01"/><path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/><path d="M8 16h.01"/></svg>
          {/* </div> */}
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