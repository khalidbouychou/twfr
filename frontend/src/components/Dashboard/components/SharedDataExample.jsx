import React from 'react';
import { useSharedData } from '../../Context/useSharedData.js';

/**
 * Example component demonstrating real-time data sharing
 * This component shows how to access and display user data, investments, and financial metrics
 * that update automatically across all components
 */
const SharedDataExample = () => {
  const {
    // User profile data
    fullname,
    avatar,
    email,
    accountBalance,
    isProfileComplete,
    
    // Investment data
    userInvestments,
    totalInvested,
    totalCurrent,
    totalProfit,
    globalROI,
    topPerformer,
    worstPerformer,
    performanceHistory,
    
    // Recommendations
    matchedProducts,
    recommendationScore,
    
    // Behavioral profile
    behaviorProfile,
    riskTolerance,
    profileType,
    
    // Market data
    marketData,
    exchangeRates,
    newsData,
    
    // Goals and planning
    financialGoals,
    simulations,
    
    // Real-time settings
    realTimeUpdates,
    
    // Computed analytics
    investmentAnalytics,
    financialHealthScore,
    goalProgress,
    marketInsights,
    
    // Actions
    actions,
    validators
  } = useSharedData();

  return (
    <div className="p-6 bg-white/5 border border-white/20 rounded-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Shared Data Dashboard</h2>
      
      {/* User Profile Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Profile Info</h3>
          <div className="space-y-2 text-white/80">
            <p><strong>Name:</strong> {fullname || 'Not set'}</p>
            <p><strong>Email:</strong> {email || 'Not set'}</p>
            <p><strong>Balance:</strong> {accountBalance.toLocaleString()} MAD</p>
            <p><strong>Profile Complete:</strong> {isProfileComplete ? '✅' : '❌'}</p>
            <p><strong>Risk Profile:</strong> {profileType || 'Not set'}</p>
          </div>
        </div>

        {/* Investment Summary */}
        <div className="bg-white/10 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Investment Summary</h3>
          <div className="space-y-2 text-white/80">
            <p><strong>Total Invested:</strong> {totalInvested.toLocaleString()} MAD</p>
            <p><strong>Current Value:</strong> {totalCurrent.toLocaleString()} MAD</p>
            <p><strong>Total Profit:</strong> {totalProfit.toLocaleString()} MAD</p>
            <p><strong>Global ROI:</strong> {globalROI.toFixed(2)}%</p>
            <p><strong>Investments Count:</strong> {investmentAnalytics?.totalInvestments || 0}</p>
          </div>
        </div>

        {/* Financial Health */}
        <div className="bg-white/10 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Financial Health</h3>
          <div className="space-y-2 text-white/80">
            <p><strong>Health Score:</strong> {financialHealthScore}%</p>
            <p><strong>Diversification:</strong> {investmentAnalytics?.portfolioAllocation ? 
              Object.keys(investmentAnalytics.portfolioAllocation).length : 0} categories</p>
            <p><strong>Top Category:</strong> {investmentAnalytics?.bestPerformingCategory || 'None'}</p>
            <p><strong>Goals:</strong> {financialGoals?.length || 0}</p>
          </div>
        </div>
      </div>
      
      {/* Performance Section */}
      {topPerformer || worstPerformer ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {topPerformer && (
            <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/30">
              <h3 className="text-lg font-semibold text-green-400 mb-3">🏆 Top Performer</h3>
              <div className="text-white/80">
                <p><strong>{topPerformer.nameProduct}</strong></p>
                <p>ROI: {topPerformer.roi_product?.toFixed(2) || 0}%</p>
                <p>Value: {(topPerformer.currentValue || 0).toLocaleString()} MAD</p>
              </div>
            </div>
          )}
          
          {worstPerformer && (
            <div className="bg-red-500/20 p-4 rounded-lg border border-red-500/30">
              <h3 className="text-lg font-semibold text-red-400 mb-3">📉 Needs Attention</h3>
              <div className="text-white/80">
                <p><strong>{worstPerformer.nameProduct}</strong></p>
                <p>ROI: {worstPerformer.roi_product?.toFixed(2) || 0}%</p>
                <p>Value: {(worstPerformer.currentValue || 0).toLocaleString()} MAD</p>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Real-time Updates Section */}
      <div className="bg-white/10 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Real-time Updates</h3>
        <div className="flex flex-wrap items-center gap-4 text-white/80">
          <p>Status: {realTimeUpdates?.enabled ? '🟢 Active' : '🔴 Disabled'}</p>
          <p>Interval: {realTimeUpdates?.updateInterval || 10} minutes</p>
          <p>Data Fresh: {validators?.isDataFresh() ? '✅' : '⚠️'}</p>
          {realTimeUpdates?.lastUpdate && (
            <p>Last Update: {new Date(realTimeUpdates.lastUpdate).toLocaleTimeString()}</p>
          )}
        </div>
        
        <div className="flex gap-2 mt-3">
          <button
            onClick={actions?.toggleRealTimeUpdates}
            className={`px-4 py-2 rounded ${
              realTimeUpdates?.enabled 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white transition-colors`}
          >
            {realTimeUpdates?.enabled ? 'Disable' : 'Enable'} Updates
          </button>
          
          <button
            onClick={() => actions?.setUpdateInterval(5)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
          >
            Set 5min Updates
          </button>
          
          <button
            onClick={actions?.refreshMarketData}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors"
          >
            Refresh Market Data
          </button>
        </div>
      </div>

      {/* Market Data Section */}
      {marketInsights?.hasRecentNews && (
        <div className="bg-white/10 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Market Insights</h3>
          <div className="space-y-2 text-white/80">
            {Object.entries(exchangeRates).map(([currency, rate]) => (
              <p key={currency}>
                <strong>{currency}:</strong> {rate} MAD
                {marketInsights?.exchangeRateChange?.[currency] && (
                  <span className={`ml-2 ${
                    marketInsights.exchangeRateChange[currency].trend === 'up' 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    {marketInsights.exchangeRateChange[currency].trend === 'up' ? '↗️' : '↘️'}
                    {(marketInsights.exchangeRateChange[currency].change * 100).toFixed(2)}%
                  </span>
                )}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white/10 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => actions?.createGoal('Emergency Fund', 50000, new Date(Date.now() + 365*24*60*60*1000).toISOString())}
            className="px-4 py-2 bg-[#3CD4AB] hover:bg-[#89559F] text-white rounded transition-colors"
            disabled={!validators?.hasCompleteProfile()}
          >
            Create Goal
          </button>
          
          <button
            onClick={() => actions?.updateRiskProfile('dynamic')}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
          >
            Set Dynamic Risk
          </button>
          
          <button
            onClick={() => {
              if (validators?.canInvest(1000)) {
                actions?.buyInvestment({ 
                  nameProduct: 'Test Investment', 
                  category: 'stocks',
                  riskLevel: 'moderate'
                }, 1000);
              }
            }}
            disabled={!validators?.canInvest(1000)}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors disabled:opacity-50"
          >
            Quick Invest 1000 MAD
          </button>
        </div>
        
        <div className="mt-3 text-sm text-white/60">
          <p>Account validation: {validators?.hasCompleteProfile() ? '✅ Complete' : '❌ Incomplete'}</p>
          <p>Investment ready: {validators?.hasInvestments() ? '✅ Has investments' : 'ℹ️ No investments'}</p>
          <p>Can invest 1000 MAD: {validators?.canInvest(1000) ? '✅ Sufficient balance' : '❌ Insufficient balance'}</p>
        </div>
      </div>
    </div>
  );
};

export default SharedDataExample;