# Real-time Data Sharing System - Tawfir AI

## Overview
This enhanced context system provides comprehensive real-time data sharing across all components in the Tawfir AI application. All user data, investments, recommendations, financial metrics, and market information are automatically synchronized and updated in real-time.

## Key Features

### 🔄 Real-time Updates
- Automatic portfolio value updates every 10 minutes (configurable)
- Real-time performance tracking and ROI calculations
- Live market data integration
- Automatic rebalancing suggestions

### 📊 Comprehensive Data Access
All components now have access to:
- **User Profile**: Name, avatar, email, account balance, join date
- **Investment Portfolio**: Current investments, values, profits, ROI
- **Financial Metrics**: Total invested, current value, global ROI, performance history
- **Recommendations**: Matched products, recommendation score
- **Behavioral Profile**: Risk tolerance, investment goals, profile type
- **Market Data**: Exchange rates, market quotes, news
- **Goals & Planning**: Financial goals, simulations, investment planning
- **Transaction History**: All buy/sell transactions with timestamps

### 🎯 Smart Analytics
- Investment performance analytics
- Portfolio allocation breakdown
- Risk distribution analysis
- Financial health scoring
- Goal progress tracking
- Best/worst performer identification

## Usage

### Using the Enhanced Hook
```jsx
import { useSharedData } from '../Context/useSharedData';

const MyComponent = () => {
  const {
    // Direct data access
    fullname,
    totalInvested,
    globalROI,
    userInvestments,
    accountBalance,
    
    // Computed analytics
    investmentAnalytics,
    financialHealthScore,
    
    // Actions
    actions,
    validators
  } = useSharedData();

  return (
    <div>
      <h2>Welcome {fullname}</h2>
      <p>Portfolio Value: {totalInvested.toLocaleString()} MAD</p>
      <p>ROI: {globalROI.toFixed(2)}%</p>
      
      <button onClick={() => actions.buyInvestment(product, 1000)}>
        Quick Invest
      </button>
    </div>
  );
};
```

### Available Actions
```jsx
// Investment actions
actions.buyInvestment(product, amount)
actions.sellInvestment(investmentId)

// Profile updates
actions.updateRiskProfile(riskLevel)
actions.createGoal(name, targetAmount, targetDate)

// Market data
actions.refreshMarketData()

// Real-time controls
actions.toggleRealTimeUpdates()
actions.setUpdateInterval(minutes)
```

### Data Validators
```jsx
// Check data validity
validators.hasCompleteProfile()
validators.hasInvestments()
validators.canInvest(amount)
validators.isDataFresh()
```

## Component Integration Examples

### 1. Dashboard Components
- Real-time portfolio metrics
- Performance charts with live updates
- Investment recommendations based on current data

### 2. Investment Components
- Live investment tracking
- Real-time profit/loss calculations
- Automatic portfolio rebalancing suggestions

### 3. Simulation Components
- Projections based on current performance
- Account balance validation
- Personalized recommendations

### 4. Chart Components
- Live data visualization
- Performance history tracking
- Real-time updates indicator

## Data Flow

```
UserContext (Central State)
    ↓
useSharedData Hook (Enhanced Access)
    ↓
Individual Components (Real-time Updates)
    ↓
UI Updates (Automatic Re-rendering)
```

## Configuration

### Real-time Update Settings
```jsx
// Enable/disable real-time updates
updateRealTimeSettings({ enabled: true })

// Set update interval (1-60 minutes)
updateRealTimeSettings({ updateInterval: 5 })

// Configure growth rates per risk level
const riskMultipliers = {
  conservative: 1.01,  // 1% growth
  moderate: 1.03,      // 3% growth  
  dynamic: 1.05,       // 5% growth
  aggressive: 1.07     // 7% growth
}
```

### Data Persistence
All data is automatically persisted to localStorage and synchronized across browser tabs.

## Benefits

1. **Consistency**: All components always show the same, up-to-date data
2. **Performance**: Optimized re-rendering with useMemo and useCallback
3. **Scalability**: Easy to add new data types and components
4. **Real-time**: Live updates create engaging user experience
5. **Analytics**: Rich computed data for insights and recommendations
6. **Validation**: Built-in data validation and error handling

## Migration Guide

### For Existing Components
1. Replace `useUserContext()` with `useSharedData()`
2. Access data directly without destructuring from userContext
3. Use provided actions instead of manual state updates
4. Leverage validators for data checks

### Example Migration
```jsx
// Before
const { userInvestments, addUserInvestment } = useUserContext();

// After  
const { userInvestments, actions } = useSharedData();
// Use actions.buyInvestment() instead of addUserInvestment()
```

## Future Enhancements

- WebSocket integration for real-time market data
- Advanced analytics and ML-based recommendations
- Cross-device synchronization
- Offline support with sync on reconnection
- Performance monitoring and optimization tools