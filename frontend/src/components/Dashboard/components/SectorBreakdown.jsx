import React from 'react';

const SectorBreakdown = ({ calculateSectorBreakdown }) => {
  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
      <h3 className="text-xl font-bold text-white mb-4">
        Répartition par Secteur
      </h3>
      <div className="space-y-4 max-h-80 overflow-y-scroll no-scrollbar">
        {calculateSectorBreakdown().length > 0 ? (
          calculateSectorBreakdown().map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
            >
              <div>
                <span className="text-white font-medium">
                  {item.sector}
                </span>
                <div className="w-32 bg-white/20 rounded-full h-2 mt-1">
                  <div
                    className="bg-[#3CD4AB] h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
              <div className="text-right">
                <div className="text-[#3CD4AB] font-semibold">
                  {item.percentage}%
                </div>
                <div className="text-white/60 text-sm">
                  {item.amount.toLocaleString()} MAD
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-white/60 py-8">
            <svg
              className="w-12 h-12 mx-auto mb-4 text-white/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              ></path>
            </svg>
            <p>Aucune répartition sectorielle</p>
            <p className="text-sm mt-1">
              Investissez dans différents secteurs pour voir la
              répartition
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectorBreakdown;