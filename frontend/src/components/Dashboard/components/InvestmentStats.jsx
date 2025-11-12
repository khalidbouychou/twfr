import React from "react";

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
            {/* <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div> */}
            <div className="flex-shrink-0 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 14 14"
            
              >
                <g fill="none" stroke="#00ca93" strokeLinecap="round">
                  <path
                    strokeLinejoin="round"
                    d="M6.338 3.7a1 1 0 0 0-.943-.668H4.62a.893.893 0 0 0-.19 1.765l1.178.258a1 1 0 0 1-.214 1.977h-.667a1 1 0 0 1-.943-.666m1.278-3.334v-1m0 6v-1m1.907 6.467v-5.25a1.25 1.25 0 0 1 1.25-1.25v0a1.25 1.25 0 0 1 1.25 1.25v2.75h2a2 2 0 0 1 2 2v.5"
                  />
                  <path d="M5.063 9.564a4.531 4.531 0 1 1 4.489-3.911" />
                </g>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-300 mb-1">
                Total Investi
              </p>
              <p className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                {(portfolioData?.totalInvested || 0).toLocaleString()} MAD
              </p>
            </div>
          </div>
          {/* <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-50 transition-opacity">
            <svg className="w-8 h-8 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
            </svg>
          </div> */}
        </div>
      </div>

      {/* Total Profits - Purple Gradient */}
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/20 via-violet-500/10 to-indigo-600/20 border border-purple-500/30 p-6 h-32 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-indigo-600/5 opacity-50"></div>
        <div className="relative flex items-center justify-between h-full">
          <div className="flex items-center space-x-4">
            {/* <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 14l3-3 3 3 6-6-1.5-1.5L12 12 9 9 3 15l1.5 1.5L7 14z"/>
                <path d="M20 8v4h-4"/>
              </svg>
            </div> */}
            <div className="flex-shrink-0 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 48 48"
              >
                <path
                  fill="none"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.5 32.954c4.16 4.461 9.959 3.796 13.392 3.691M5.5 27.374c3.785 4.32 8.805 4.662 13.564 4.12m-.487-14.04c-15.152-3.178-17.022 10.534 0 8.954m2.817 9.894c3.953 4.1 17.297 5.02 21.106-.43m-21.106-5.837c2.961 5.45 16.717 5.376 21.106.43M21.394 24.67c6.18 6.479 17.5 4.262 21.106 0"
                />
                <path
                  fill="none"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.394 19.304c3.896 5.366 16.72 5.522 21.106.086"
                />
                <ellipse
                  cx="31.965"
                  cy="13.279"
                  fill="none"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  rx="9.872"
                  ry="4.949"
                />
                <path
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.577 17.454v8.954"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-purple-300 mb-1">
                Total Profits
              </p>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
                +{calculateTotalProfits().toLocaleString()} MAD
              </p>
            </div>
          </div>
          {/* <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-50 transition-opacity">
            <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div> */}
        </div>
      </div>

      {/* Available Balance - Blue Gradient */}
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-indigo-600/20 border border-cyan-500/30 p-6 h-32 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-indigo-600/5 opacity-50"></div>
        <div className="relative flex items-center justify-between h-full">
          <div className="flex items-center space-x-4">
            {/* <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 7L9 19l-5.5-5.5 1.41-1.41L9 16.17 19.59 5.59 21 7z"/>
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div> */}
            <div className="flex-shrink-0 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="#03badc"
                width="55"
                height="55"
                viewBox="0 0 24 24"
              >
                <path d="M16 13.5q.65 0 1.075-.425T17.5 12q0-.65-.425-1.075T16 10.5q-.65 0-1.075.425T14.5 12q0 .65.425 1.075T16 13.5ZM5 19V5v14Zm0 2q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v2.5h-2V5H5v14h14v-2.5h2V19q0 .825-.588 1.413T19 21H5Zm8-4q-.825 0-1.413-.588T11 15V9q0-.825.588-1.413T13 7h7q.825 0 1.413.588T22 9v6q0 .825-.588 1.413T20 17h-7Zm7-2V9h-7v6h7Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-cyan-300 mb-1">
                Solde Disponible
              </p>
              <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                {userBalance.toLocaleString()} MAD
              </p>
            </div>
          </div>
          {/* <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-50 transition-opacity">
            <svg className="w-8 h-8 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
            </svg>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default InvestmentStats;
