import React from 'react';
import { FaWallet, FaMoneyBillTrendUp, FaSeedling } from 'react-icons/fa6';

const InvestmentStats = ({ 
  portfolioData, 
  calculateTotalProfits, 
  userBalance
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 2xl:gap-8 3xl:gap-10 mb-6 2xl:mb-10 3xl:mb-12">
      {/* Total Investment - Green Gradient */}
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/20 via-green-500/10 to-teal-600/20 border border-emerald-500/30 p-4 2xl:p-8 3xl:p-10 h-32 2xl:h-40 3xl:h-48 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-teal-600/5 opacity-50"></div>
        <div className="relative flex items-center justify-between h-full">
          <div className="flex items-center space-x-3 2xl:space-x-5 3xl:space-x-6">
            <FaSeedling className="w-10 h-10 2xl:w-14 2xl:h-14 3xl:w-16 3xl:h-16 text-[#3CD4AB]" /> 
            <div>
              <p className="text-sm 2xl:text-base 3xl:text-lg font-medium text-emerald-300 mb-1">Total Investi</p>
              <p className="text-xl 2xl:text-3xl 3xl:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                {(portfolioData?.totalInvested || 0).toLocaleString()} MAD
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Total Profits - Purple Gradient */}
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/20 via-violet-500/10 to-indigo-600/20 border border-purple-500/30 p-4 2xl:p-8 3xl:p-10 h-32 2xl:h-40 3xl:h-48 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-indigo-600/5 opacity-50"></div>
        <div className="relative flex items-center justify-between h-full">
          <div className="flex items-center space-x-3 2xl:space-x-5 3xl:space-x-6">
              <FaMoneyBillTrendUp className="w-10 h-10 2xl:w-14 2xl:h-14 3xl:w-16 3xl:h-16 text-[#c27aff]" />
            <div>
              <p className="text-sm 2xl:text-base 3xl:text-lg font-medium text-purple-300 mb-1">Total Profits</p>
              <p className="text-xl 2xl:text-3xl 3xl:text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
                +{calculateTotalProfits().toLocaleString()} MAD
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Balance - Blue Gradient */}
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-indigo-600/20 border border-cyan-500/30 p-4 2xl:p-8 3xl:p-10 h-32 2xl:h-40 3xl:h-48 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-indigo-600/5 opacity-50"></div>
        <div className="relative flex items-center justify-between h-full">
          <div className="flex items-center space-x-3 2xl:space-x-5 3xl:space-x-6">
            {/* <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-lg"> */}
              <FaWallet className="w-10 h-10 2xl:w-14 2xl:h-14 3xl:w-16 3xl:h-16 text-[#00d3f3]" />
            {/* </div> */}
            <div>
              <p className="text-sm 2xl:text-base 3xl:text-lg font-medium text-cyan-300 mb-1">Solde Disponible</p>
              <p className="text-xl 2xl:text-3xl 3xl:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                {userBalance.toLocaleString()} MAD
              </p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default InvestmentStats;