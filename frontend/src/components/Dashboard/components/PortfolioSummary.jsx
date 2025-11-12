import React from "react";

const PortfolioSummary = ({
  calculateInvestmentHistoryWithReturns,
  portfolioData,
  investmentHistory,
  calculateSectorBreakdown
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
      {/* Valeur Totale - Blue Gradient */}
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 via-sky-500/10 to-cyan-600/20 border border-blue-500/30 p-6 h-32 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-cyan-600/5 opacity-50"></div>
        <div className="relative flex items-center justify-between h-full">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 p-3 rounded-xl  shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#52d4fe"
                  d="M23.596 13.43H11.562a2.46 2.46 0 0 0-2.639 2.231l-.001.009a2.472 2.472 0 0 0 2.683 2.239l-.009.001h12a.57.57 0 0 0 .621-.527v-3.424a.61.61 0 0 0-.604-.529h-.018zm-12.034 3.638a1.43 1.43 0 1 1 1.43-1.43v.004c0 .788-.639 1.426-1.426 1.426h-.004zM3.295 0v6.404h1.368V3.668c.138.034.298.056.462.062h.004a1.871 1.871 0 0 0 1.866-1.865a2.098 2.098 0 0 0-.066-.481l.003.015h7.492a2.324 2.324 0 0 0-.062.462v.004a1.871 1.871 0 0 0 1.865 1.866c.168-.006.329-.028.483-.066l-.016.003v2.736h1.401V0zm15.389 5.626h1.741a2.266 2.266 0 0 0-1.727-1.49l-.014-.002z"
                />
                <path
                  fill="#5e95ed"
                  d="M11.471 12.684h11.938V9.047a2.066 2.066 0 0 0-2.217-1.865h.007h-18.96a.097.097 0 0 0-.062-.031a.814.814 0 0 1-.466-.682v-.002a.886.886 0 0 1 .647-.776l.006-.001V4.105C1.057 4.167 0 6.032 0 8.364v13.772A2.067 2.067 0 0 0 2.215 24h-.007h18.96a2.065 2.065 0 0 0 2.207-1.857l.001-.008v-3.637H11.504c-1.927 0-3.482-1.306-3.482-2.891c0-1.616 1.554-2.922 3.45-2.922z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-300 mb-1">
                Valeur Totale
              </p>
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                {calculateInvestmentHistoryWithReturns()
                  .reduce((sum, inv) => sum + inv.currentValue, 0)
                  .toLocaleString()}{" "}
                MAD
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gain/Perte Total - Gradient based on performance */}
      <div
        className={`group relative overflow-hidden rounded-2xl ${
          portfolioData.globalPerformance >= 0
            ? "bg-gradient-to-br from-emerald-500/20 via-green-500/10 to-teal-600/20 border border-emerald-500/30 hover:shadow-emerald-500/20"
            : "bg-gradient-to-br from-red-500/20 via-rose-500/10 to-pink-600/20 border border-red-500/30 hover:shadow-red-500/20"
        } p-6 h-32 hover:shadow-xl transition-all duration-300`}
      >
        <div
          className={`absolute inset-0 ${
            portfolioData.globalPerformance >= 0
              ? "bg-gradient-to-br from-emerald-400/5 to-teal-600/5"
              : "bg-gradient-to-br from-red-400/5 to-pink-600/5"
          } opacity-50`}
        ></div>
        <div className="relative flex items-center justify-between h-full">
          <div className="flex items-center space-x-4">
            <div
              className={`flex-shrink-0 p-3 rounded-xl shadow-lg ${
                portfolioData.globalPerformance >= 0
                  ? " to-teal-600"
                  : " from-red-500"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 24 24"
                fill="none"
                stroke={
                  portfolioData.globalPerformance >= 0 ? "#3CD4AB" : "#FF6B6B"
                }
              >
                <path
                  fill-rule="evenodd"
                  d="M11.943 1.25h.114c2.309 0 4.118 0 5.53.19c1.444.194 2.584.6 3.479 1.494c.895.895 1.3 2.035 1.494 3.48c.19 1.411.19 3.22.19 5.529v.114c0 2.309 0 4.118-.19 5.53c-.194 1.444-.6 2.584-1.494 3.479c-.895.895-2.035 1.3-3.48 1.494c-1.411.19-3.22.19-5.529.19h-.114c-2.309 0-4.118 0-5.53-.19c-1.444-.194-2.584-.6-3.479-1.494c-.895-.895-1.3-2.035-1.494-3.48c-.19-1.411-.19-3.22-.19-5.529v-.114c0-2.309 0-4.118.19-5.53c.194-1.444.6-2.584 1.494-3.479c.895-.895 2.035-1.3 3.48-1.494c1.411-.19 3.22-.19 5.529-.19Zm-5.33 1.676c-1.278.172-2.049.5-2.618 1.069c-.57.57-.897 1.34-1.069 2.619c-.174 1.3-.176 3.008-.176 5.386s.002 4.086.176 5.386c.119.882.311 1.522.606 2.021L19.407 3.532c-.499-.295-1.139-.487-2.02-.606c-1.3-.174-3.009-.176-5.387-.176c-2.378 0-4.086.002-5.386.176Zm13.855 1.667L4.593 20.468c.499.295 1.139.487 2.02.606c1.3.174 3.009.176 5.387.176c2.378 0 4.086-.002 5.386-.176c1.279-.172 2.05-.5 2.62-1.069c.569-.57.896-1.34 1.068-2.619c.174-1.3.176-3.008.176-5.386s-.002-4.086-.176-5.386c-.119-.882-.311-1.522-.606-2.021ZM8 4.75a.75.75 0 0 1 .75.75v1.75h1.75a.75.75 0 0 1 0 1.5H8.75v1.75a.75.75 0 0 1-1.5 0V8.75H5.5a.75.75 0 0 1 0-1.5h1.75V5.5A.75.75 0 0 1 8 4.75ZM12.25 17a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p
                className={`text-sm font-medium mb-1 ${
                  portfolioData.globalPerformance >= 0
                    ? "text-emerald-300"
                    : "text-red-300"
                }`}
              >
                Gain/Perte Total
              </p>
              <p
                className={`text-2xl font-bold ${
                  portfolioData.globalPerformance >= 0
                    ? "bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent"
                    : "bg-gradient-to-r from-red-400 to-pink-300 bg-clip-text text-transparent"
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
      </div>

      {/* Nombre d'Investissements - Orange Gradient */}
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-yellow-600/20 border border-orange-500/30 p-6  hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-yellow-600/5 opacity-50"></div>
        <div className="relative flex items-center justify-between h-full">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0  rounded-xl bg-gradient-to-br shadow-lg">
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 24 24"
              >
                <g fill="none">
                  <path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" />
                  <path
                    fill="#fe8d04"
                    d="M19 3a2 2 0 0 1 1.995 1.85L21 5v14a2 2 0 0 1-1.85 1.995L19 21H5a2 2 0 0 1-1.995-1.85L3 19V5a2 2 0 0 1 1.85-1.995L5 3h14Zm0 2H5v14h14V5ZM7.793 13.379l.707.707l.707-.707a1 1 0 0 1 1.414 1.414l-.707.707l.707.707a1 1 0 0 1-1.414 1.414l-.707-.707l-.707.707a1 1 0 0 1-1.414-1.414l.707-.707l-.707-.707a1 1 0 1 1 1.414-1.414ZM17 15.75a1 1 0 0 1 .117 1.993L17 17.75h-3a1 1 0 0 1-.117-1.993L14 15.75h3Zm0-2.5a1 1 0 1 1 0 2h-3a1 1 0 1 1 0-2h3ZM15.5 6.5a1 1 0 0 1 1 1V8h.5a1 1 0 1 1 0 2h-.5v.5a1 1 0 1 1-2 0V10H14a1 1 0 1 1 0-2h.5v-.5a1 1 0 0 1 1-1ZM10 8a1 1 0 1 1 0 2H7a1 1 0 0 1 0-2h3Z"
                  />
                </g>
              </svg> */}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="70"
                height="70"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="#fe8d04"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 17V7l7 10V7m4 10h5m-5-7a2.5 3 0 1 0 5 0a2.5 3 0 1 0-5 0"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-orange-300 mb-1">
                Nombre d'Investissements
              </p>
              <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                {investmentHistory.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Secteurs Diversifiés - Purple Gradient */}
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/20 via-violet-500/10 to-indigo-600/20 border border-purple-500/30 p-6 h-32 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-indigo-600/5 opacity-50"></div>
        <div className="relative flex items-center justify-between h-full">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 p-3  shadow-lg">
              {/* <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
              </svg> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#c17efe"
                  d="M4 21q-.825 0-1.413-.588T2 19V5q0-.825.588-1.413T4 3h6q.825 0 1.413.588T12 5v2h8q.825 0 1.413.588T22 9v10q0 .825-.588 1.413T20 21H4Zm0-2h2v-2H4v2Zm0-4h2v-2H4v2Zm0-4h2V9H4v2Zm0-4h2V5H4v2Zm4 12h2v-2H8v2Zm0-4h2v-2H8v2Zm0-4h2V9H8v2Zm0-4h2V5H8v2Zm4 12h8V9h-8v2h2v2h-2v2h2v2h-2v2Zm4-6v-2h2v2h-2Zm0 4v-2h2v2h-2Z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-purple-300 mb-1">
                Secteurs Diversifiés
              </p>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
                {calculateSectorBreakdown().length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;
