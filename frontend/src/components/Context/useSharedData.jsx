import { useContext, useMemo } from 'react';
import { UserContext } from './UserContext.jsx';

/**
 * Enhanced hook for accessing shared data across all components
 * Provides real-time access to user data, investments, recommendations, and financial metrics
 */
export const useSharedData = () => {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error('useSharedData must be used within a UserProvider');
  }

  // Create computed/derived values that update in real-time
  const computedData = useMemo(() => {
    const { userContext } = context;
    
    if (!userContext) return {};

    // Investment analytics
    const investmentAnalytics = {
      totalInvestments: userContext.userInvestments?.length || 0,
      averageROI: userContext.userInvestments?.length > 0 
        ? userContext.userInvestments.reduce((sum, inv) => sum + (inv.roi_product || 0), 0) / userContext.userInvestments.length
        : 0,
      bestPerformingCategory: getBestPerformingCategory(userContext.userInvestments),
      portfolioAllocation: getPortfolioAllocation(userContext.userInvestments),
      riskDistribution: getRiskDistribution(userContext.userInvestments),
    };

    // Financial health score
    const financialHealthScore = calculateFinancialHealthScore(userContext);

    // Goal progress
    const goalProgress = calculateGoalProgress(userContext.financialGoals, userContext.dashboard);

    // Market insights
    const marketInsights = {
      lastUpdate: userContext.marketData?.lastMarketUpdate,
      hasRecentNews: (userContext.marketData?.newsData || []).length > 0,
      exchangeRateChange: calculateExchangeRateChange(userContext.marketData?.exchangeRates),
    };

    return {
      investmentAnalytics,
      financialHealthScore,
      goalProgress,
      marketInsights,
    };
  }, [context.userContext]);

  return {
    // All context data
    ...context,
    
    // Computed analytics
    ...computedData,

    // Convenience methods for common operations
    actions: {
      // Quick investment actions
      buyInvestment: (product, amount) => {
        context.addUserInvestment({
          ...product,
          valueInvested: amount,
          currentValue: amount,
          date: new Date().toISOString()
        });
        context.updateAccountBalance(amount, 'subtract');
      },

      sellInvestment: (investmentId) => {
        const investment = context.userInvestments.find(inv => inv.id === investmentId);
        if (investment) {
          context.updateAccountBalance(investment.currentValue, 'add');
          context.removeUserInvestment(investmentId);
        }
      },

      // Quick profile updates
      updateRiskProfile: (riskLevel) => {
        context.updateBehaviorProfile({ 
          ...context.behaviorProfile, 
          profileType: riskLevel,
          riskTolerance: getRiskToleranceScore(riskLevel)
        });
      },

      // Quick goal management
      createGoal: (name, targetAmount, targetDate) => {
        context.addFinancialGoal({
          name,
          targetAmount,
          targetDate,
          currentAmount: 0,
          category: 'savings'
        });
      },

      // Market data refresh
      refreshMarketData: async () => {
        // This would typically fetch from an API
        const mockMarketData = {
          exchangeRates: { USD: 10.85, EUR: 11.92 },
          marketQuotes: { SP500: 4500, NASDAQ: 15000 },
          newsData: [
            { title: 'Market Update', summary: 'Positive trends continue...', date: new Date().toISOString() }
          ]
        };
        context.updateMarketData(mockMarketData);
      },

      // Real-time updates control
      toggleRealTimeUpdates: () => {
        context.updateRealTimeSettings({
          enabled: !context.realTimeUpdates.enabled
        });
      },

      setUpdateInterval: (minutes) => {
        context.updateRealTimeSettings({
          updateInterval: Math.max(1, Math.min(60, minutes)) // Between 1-60 minutes
        });
      }
    },

    // Data validation helpers
    validators: {
      hasCompleteProfile: () => context.isProfileComplete && context.fullname && context.email,
      hasInvestments: () => (context.userInvestments || []).length > 0,
      hasGoals: () => (context.financialGoals || []).length > 0,
      canInvest: (amount) => context.accountBalance >= amount,
      isDataFresh: () => {
        const lastUpdate = context.realTimeUpdates?.lastUpdate;
        if (!lastUpdate) return false;
        const minutesSinceUpdate = (Date.now() - new Date(lastUpdate).getTime()) / (1000 * 60);
        return minutesSinceUpdate < (context.realTimeUpdates?.updateInterval || 10) * 2;
      }
    }
  };
};

// Helper functions
function getBestPerformingCategory(investments = []) {
  if (!investments.length) return null;
  
  const categoryPerformance = {};
  investments.forEach(inv => {
    const category = inv.category || 'other';
    if (!categoryPerformance[category]) {
      categoryPerformance[category] = { total: 0, count: 0 };
    }
    categoryPerformance[category].total += inv.roi_product || 0;
    categoryPerformance[category].count += 1;
  });

  let bestCategory = null;
  let bestAvgROI = -Infinity;
  Object.entries(categoryPerformance).forEach(([category, data]) => {
    const avgROI = data.total / data.count;
    if (avgROI > bestAvgROI) {
      bestAvgROI = avgROI;
      bestCategory = category;
    }
  });

  return bestCategory;
}

function getPortfolioAllocation(investments = []) {
  if (!investments.length) return {};
  
  const allocation = {};
  const total = investments.reduce((sum, inv) => sum + (inv.currentValue || 0), 0);
  
  investments.forEach(inv => {
    const category = inv.category || 'other';
    allocation[category] = (allocation[category] || 0) + (inv.currentValue || 0);
  });

  // Convert to percentages
  Object.keys(allocation).forEach(category => {
    allocation[category] = total > 0 ? (allocation[category] / total) * 100 : 0;
  });

  return allocation;
}

function getRiskDistribution(investments = []) {
  if (!investments.length) return {};
  
  const distribution = { conservative: 0, moderate: 0, dynamic: 0, aggressive: 0 };
  const total = investments.reduce((sum, inv) => sum + (inv.currentValue || 0), 0);
  
  investments.forEach(inv => {
    const risk = inv.riskLevel || 'moderate';
    distribution[risk] = (distribution[risk] || 0) + (inv.currentValue || 0);
  });

  // Convert to percentages
  Object.keys(distribution).forEach(risk => {
    distribution[risk] = total > 0 ? (distribution[risk] / total) * 100 : 0;
  });

  return distribution;
}

function calculateFinancialHealthScore(userContext) {
  let score = 0;
  
  // Profile completeness (20 points)
  if (userContext.isProfileComplete) score += 20;
  
  // Has investments (30 points)
  if ((userContext.userInvestments || []).length > 0) score += 30;
  
  // Positive ROI (25 points)
  if (userContext.dashboard?.globalROI > 0) score += 25;
  
  // Diversification (15 points)
  const diversificationScore = userContext.dashboard?.diversificationScore || 0;
  score += (diversificationScore / 100) * 15;
  
  // Has goals (10 points)
  if ((userContext.financialGoals || []).length > 0) score += 10;
  
  return Math.min(100, Math.round(score));
}

function calculateGoalProgress(goals = [], dashboard = {}) {
  return goals.map(goal => {
    const progress = goal.currentAmount && goal.targetAmount 
      ? (goal.currentAmount / goal.targetAmount) * 100 
      : 0;
    
    return {
      ...goal,
      progress: Math.min(100, progress),
      isOnTrack: progress >= getExpectedProgress(goal.targetDate, goal.createdDate)
    };
  });
}

function getExpectedProgress(targetDate, createdDate) {
  if (!targetDate || !createdDate) return 0;
  
  const created = new Date(createdDate);
  const target = new Date(targetDate);
  const now = new Date();
  
  const totalTime = target.getTime() - created.getTime();
  const elapsedTime = now.getTime() - created.getTime();
  
  return totalTime > 0 ? (elapsedTime / totalTime) * 100 : 0;
}

function calculateExchangeRateChange(exchangeRates = {}) {
  // This would typically compare with previous rates
  // For now, return mock change data
  return Object.keys(exchangeRates).reduce((changes, currency) => {
    changes[currency] = {
      current: exchangeRates[currency],
      change: (Math.random() - 0.5) * 0.1, // Mock change of ±5%
      trend: Math.random() > 0.5 ? 'up' : 'down'
    };
    return changes;
  }, {});
}

function getRiskToleranceScore(riskLevel) {
  const scores = {
    conservative: 25,
    moderate: 50,
    dynamic: 75,
    aggressive: 100
  };
  return scores[riskLevel] || 50;
}

export default useSharedData;