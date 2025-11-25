import React from 'react';
import { FaWallet, FaMoneyBillTrendUp, FaSeedling } from 'react-icons/fa6';

const InvestmentStats = ({ 
  portfolioData, 
  calculateTotalProfits, 
  userBalance
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4 2xl:gap-6 3xl:gap-8 mb-4 lg:mb-6 2xl:mb-8 3xl:mb-10">
      {/* Total Investment - Green Gradient */}
      <div className="group relative overflow-hidden rounded-xl border border-emerald-500/30 p-3 lg:p-4 2xl:p-6 3xl:p-8 h-24 lg:h-28 2xl:h-32 3xl:h-36 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300">
        <div className="relative flex items-center justify-between h-full">
          <div className="flex items-center space-x-2 lg:space-x-3 2xl:space-x-4 3xl:space-x-5">
            <FaSeedling className="w-8 h-8 lg:w-10 lg:h-10 2xl:w-12 2xl:h-12 3xl:w-14 3xl:h-14 text-[#3CD4AB]" /> 
            <div>
              <p className="text-xs lg:text-sm 2xl:text-base 3xl:text-lg font-medium text-emerald-300 mb-0.5 lg:mb-1">Total Investi</p>
              <p className="text-base lg:text-xl 2xl:text-2xl 3xl:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                {(portfolioData?.totalInvested || 0).toLocaleString()} MAD
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Total Profits - Purple Gradient */}
      <div className="group relative overflow-hidden rounded-xl border border-purple-500/30 p-3 lg:p-4 2xl:p-6 3xl:p-8 h-24 lg:h-28 2xl:h-32 3xl:h-36 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
        <div className="relative flex items-center justify-between h-full">
          <div className="flex items-center space-x-2 lg:space-x-3 2xl:space-x-4 3xl:space-x-5">
              <FaMoneyBillTrendUp className="w-8 h-8 lg:w-10 lg:h-10 2xl:w-12 2xl:h-12 3xl:w-14 3xl:h-14 text-[#c27aff]" />
            <div>
              <p className="text-xs lg:text-sm 2xl:text-base 3xl:text-lg font-medium text-purple-300 mb-0.5 lg:mb-1">Total Profits</p>
              <p className="text-base lg:text-xl 2xl:text-2xl 3xl:text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
                +{calculateTotalProfits().toLocaleString()} MAD
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Balance - Blue Gradient */}
      <div className="group relative overflow-hidden rounded-xl border border-cyan-500/30 p-3 lg:p-4 2xl:p-6 3xl:p-8 h-24 lg:h-28 2xl:h-32 3xl:h-36 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300">
        <div className="relative flex items-center justify-between h-full">
          <div className="flex items-center space-x-2 lg:space-x-3 2xl:space-x-4 3xl:space-x-5">
              <FaWallet className="w-8 h-8 lg:w-10 lg:h-10 2xl:w-12 2xl:h-12 3xl:w-14 3xl:h-14 text-[#00d3f3]" />
            <div>
              <p className="text-xs lg:text-sm 2xl:text-base 3xl:text-lg font-medium text-cyan-300 mb-0.5 lg:mb-1">Solde Disponible</p>
              <p className="text-base lg:text-xl 2xl:text-2xl 3xl:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
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