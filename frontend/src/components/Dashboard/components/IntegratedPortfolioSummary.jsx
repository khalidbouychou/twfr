import React from 'react';
import { useSharedData } from '../../Context/useSharedData.js';

/**
 * Example of how to easily convert an existing component to use shared data
 * 
 * BEFORE (old way):
 * import { useUserContext } from '../Context/useUserContext';
 * const { userInvestments, addUserInvestment } = useUserContext();
 * 
 * AFTER (new way):
 * import { useSharedData } from '../../Context/useSharedData.js';
 * const { userInvestments, actions } = useSharedData();
 */

// Example: Portfolio Summary Component
const IntegratedPortfolioSummary = () => {
  const {
    // Direct access to all data - no need to destructure from userContext
    fullname,
    totalInvested,
    totalCurrent,
    totalProfit,
    globalROI,
    userInvestments,
    topPerformer,
  
    
    // Real-time status
    realTimeUpdates,
    
    // Computed analytics
    investmentAnalytics,
    financialHealthScore,
    
    // Actions for quick operations
    actions,
    
    // Validators for data checks
    validators
  } = useSharedData();

  return (
    <div className="bg-white/5 border border-white/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          Welcome back, {fullname || 'Investor'}! 👋
        </h2>
        
        {realTimeUpdates?.enabled && (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Live Updates Active
          </div>
        )}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg p-4 border border-blue-500/30">
          <h3 className="text-blue-300 text-sm font-medium">Total Invested</h3>
          <p className="text-2xl font-bold text-white">{totalInvested?.toLocaleString() || 0} MAD</p>
        </div>
        
        <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg p-4 border border-green-500/30">
          <h3 className="text-green-300 text-sm font-medium">Current Value</h3>
          <p className="text-2xl font-bold text-white">{totalCurrent?.toLocaleString() || 0} MAD</p>
        </div>
        
        <div className={`rounded-lg p-4 border ${
          totalProfit >= 0 
            ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border-emerald-500/30' 
            : 'bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-500/30'
        }`}>
          <h3 className={`text-sm font-medium ${totalProfit >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
            Total Profit/Loss
          </h3>
          <p className="text-2xl font-bold text-white">
            {totalProfit >= 0 ? '+' : ''}{totalProfit?.toLocaleString() || 0} MAD
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg p-4 border border-purple-500/30">
          <h3 className="text-purple-300 text-sm font-medium">Global ROI</h3>
          <p className="text-2xl font-bold text-white">{globalROI?.toFixed(2) || 0}%</p>
        </div>
      </div>

      {/* Investment Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Portfolio List */}
        <div className="bg-white/10 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3">📊 Your Investments</h3>
          {userInvestments?.length > 0 ? (
            <div className="space-y-3">
              {userInvestments.slice(0, 5).map((investment) => (
                <div key={investment.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{investment.nameProduct}</p>
                    <p className="text-white/60 text-sm">{investment.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white">{investment.currentValue?.toLocaleString()} MAD</p>
                    <p className={`text-sm ${(investment.roi_product || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(investment.roi_product || 0) >= 0 ? '+' : ''}{investment.roi_product?.toFixed(2) || 0}%
                    </p>
                  </div>
                </div>
              ))}
              
              {userInvestments.length > 5 && (
                <p className="text-white/60 text-sm text-center">
                  +{userInvestments.length - 5} more investments...
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-white/60">
              <p>No investments yet</p>
              <button 
                onClick={() => console.log('Navigate to investment page')}
                className="mt-2 px-4 py-2 bg-[#3CD4AB] hover:bg-[#89559F] text-white rounded-lg transition-colors"
              >
                Start Investing
              </button>
            </div>
          )}
        </div>

        {/* Performance Highlights */}
        <div className="bg-white/10 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3">🎯 Performance Highlights</h3>
          
          <div className="space-y-4">
            {/* Health Score */}
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80">Financial Health Score</span>
                <span className="text-[#3CD4AB] font-bold">{financialHealthScore}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-[#3CD4AB] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${financialHealthScore}%` }}
                ></div>
              </div>
            </div>

            {/* Top Performer */}
            {topPerformer && (
              <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                <h4 className="text-green-400 text-sm mb-1">🏆 Top Performer</h4>
                <p className="text-white font-medium">{topPerformer.nameProduct}</p>
                <p className="text-green-300 text-sm">+{topPerformer.roi_product?.toFixed(2)}% ROI</p>
              </div>
            )}

            {/* Analytics Summary */}
            <div className="p-3 bg-white/5 rounded-lg">
              <h4 className="text-white/80 text-sm mb-2">📈 Quick Stats</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-white/70">
                  <span>Total Investments:</span>
                  <span>{investmentAnalytics?.totalInvestments || 0}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Average ROI:</span>
                  <span>{investmentAnalytics?.averageROI?.toFixed(1) || 0}%</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Best Category:</span>
                  <span>{investmentAnalytics?.bestPerformingCategory || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/10 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-3">⚡ Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => actions.refreshMarketData()}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
          >
            🔄 Refresh Market Data
          </button>
          
          <button 
            onClick={() => actions.toggleRealTimeUpdates()}
            className={`px-4 py-2 text-white rounded-lg transition-colors text-sm ${
              realTimeUpdates?.enabled 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {realTimeUpdates?.enabled ? '⏸️ Pause' : '▶️ Start'} Real-time Updates
          </button>
          
          <button 
            onClick={() => {
              actions.createGoal('New Goal', 50000, new Date(Date.now() + 365*24*60*60*1000).toISOString());
            }}
            disabled={!validators.hasCompleteProfile()}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm disabled:opacity-50"
          >
            🎯 Create Goal
          </button>
          
          <button 
            onClick={() => console.log('Open simulation')}
            className="px-4 py-2 bg-[#3CD4AB] hover:bg-[#89559F] text-white rounded-lg transition-colors text-sm"
          >
            🎮 Run Simulation
          </button>
        </div>
        
        <div className="mt-3 text-xs text-white/60">
          <p>Data Status: {validators.isDataFresh() ? '✅ Fresh' : '⚠️ Stale'}</p>
          <p>Profile: {validators.hasCompleteProfile() ? '✅ Complete' : '❌ Incomplete'}</p>
          <p>Last Update: {realTimeUpdates?.lastUpdate ? 
            new Date(realTimeUpdates.lastUpdate).toLocaleTimeString() : 'Never'}</p>
        </div>
      </div>
    </div>
  );
};

export default IntegratedPortfolioSummary;