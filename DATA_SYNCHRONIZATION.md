# Data Synchronization Implementation

## Overview
All components now share and synchronize data through the UserContext, ensuring that any update in one component is reflected across the entire application.

## Synchronized Data

### 1. Account Balance (`accountBalance`)
**Source of Truth**: `UserContext.accountBalance`

**Synchronized Components**:
- ✅ UserDashboard (via `updateBalance` wrapper)
- ✅ Header (cart validation, balance display)
- ✅ All balance-related operations

**How it works**:
```javascript
// In UserDashboard.jsx
const { accountBalance, updateAccountBalance } = useContext(UserContext);

// Wrapper function for seamless sync
const updateBalance = useCallback((value) => {
  if (typeof value === 'function') {
    setUserBalance(prev => {
      const newValue = value(prev);
      updateAccountBalance(newValue, 'set');
      return newValue;
    });
  } else {
    setUserBalance(value);
    updateAccountBalance(value, 'set');
  }
}, [updateAccountBalance]);
```

**Operations that sync**:
- ✅ Add funds
- ✅ Withdraw funds
- ✅ Investment purchases
- ✅ Profit additions
- ✅ Cart checkout

### 2. User Investments (`userInvestments`)
**Source of Truth**: `UserContext.userInvestments`

**Synchronized Components**:
- ✅ UserDashboard (via `investmentHistory` state sync)
- ✅ Header (cart validation → addUserInvestment)
- ✅ Portfolio charts (SimplePieChart, PortfolioPerformanceChart)
- ✅ InvestmentsPage

**How it works**:
```javascript
// Sync from UserContext to local state
useEffect(() => {
  if (userInvestments && Array.isArray(userInvestments) && userInvestments.length > 0) {
    const convertedInvestments = userInvestments.map(inv => ({
      id: inv.id,
      name: inv.nameProduct || inv.name || 'Produit',
      amount: inv.valueInvested || inv.amount || 0,
      currentValue: inv.currentValue || inv.valueInvested || 0,
      profit: inv.profit || ((inv.currentValue || 0) - (inv.valueInvested || 0)),
      date: inv.date ? new Date(inv.date).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR'),
      sector: inv.category || inv.sector || 'autre',
      return: inv.roi_product ? `+${inv.roi_product}%` : '+0%'
    }));
    
    // Update local state
    setInvestmentHistory(prev => {
      const existingMap = new Map(prev.map(inv => [inv.id, inv]));
      const merged = convertedInvestments.map(newInv => {
        const existing = existingMap.get(newInv.id);
        return existing ? { ...existing, ...newInv } : newInv;
      });
      
      if (JSON.stringify(merged) !== JSON.stringify(prev)) {
        return merged;
      }
      return prev;
    });
  }
}, [userInvestments]);
```

### 3. User Profile Data (`userProfileData`)
**Source of Truth**: `UserContext.fullname`, `UserContext.avatar`, `UserContext.email`

**Synchronized Components**:
- ✅ Navbar (dropdown menu)
- ✅ Header (user avatar, name)
- ✅ UserDashboard (userData object)
- ✅ SettingsModal

**Data Fields**:
- Full name
- Avatar/Picture
- Email
- Phone
- Join date

### 4. Logout Data Clearing
**Synchronized Components**:
- ✅ Navbar (logout button)
- ✅ Header (logout button - mobile & desktop)
- ✅ SettingsModal (logout button)

**What gets cleared**:
```javascript
// Authentication data
localStorage.removeItem('isLogin');
localStorage.removeItem('googleProfile');
localStorage.removeItem('googleCredential');
localStorage.removeItem('userProfileData');

// User personal data
localStorage.removeItem('userContext');
localStorage.removeItem('userName');
localStorage.removeItem('userAvatar');
localStorage.removeItem('userEmail');
localStorage.removeItem('fullName');
```

### 5. Transactions History
**Source of Truth**: `localStorage.transactionsHistory` (local state in UserDashboard)

**Note**: This could be moved to UserContext for better synchronization

### 6. Notifications
**Source of Truth**: `localStorage.notifications` (local state in UserDashboard)

**Note**: This could be moved to UserContext for better synchronization

## Data Flow

### Adding an Investment (via Cart)
```
User adds to cart (Header) 
  → CartContext updates
  → User clicks "Valider les investissements"
  → Header calls addUserInvestment() 
  → UserContext.userInvestments updates
  → localStorage.userContext syncs
  → Header calls setUserBalance (updateBalance)
  → UserContext.accountBalance updates
  → UserDashboard detects userInvestments change
  → investmentHistory syncs
  → Pie chart re-renders with new data
```

### Adding an Investment (via Dashboard)
```
User clicks invest on product
  → handleConfirmInvestment() called
  → updateBalance() deducts amount
  → UserContext.accountBalance updates
  → setInvestmentHistory() adds investment
  → addUserInvestment() called
  → UserContext.userInvestments updates
  → Both states stay in sync
```

### Balance Operations
```
User adds/withdraws funds
  → updateBalance() called
  → setUserBalance() updates local state
  → updateAccountBalance() updates context
  → localStorage.userContext syncs
  → All components showing balance reflect new value
```

## Benefits

1. **Single Source of Truth**: UserContext holds the canonical data
2. **Automatic Persistence**: UserContext syncs to localStorage
3. **Real-time Updates**: useEffect hooks keep local state in sync
4. **No Duplicate Data**: Local states are derived from context
5. **Easy Debugging**: All data changes go through defined functions

## Future Improvements

### Recommended Enhancements:
1. Move `transactionsHistory` to UserContext
2. Move `notifications` to UserContext
3. Add real-time sync service for multi-device support
4. Add optimistic updates for better UX
5. Add data validation layer
6. Add conflict resolution for concurrent updates

### Architecture Suggestions:
```javascript
// Centralized update function
const updateGlobalState = (updates) => {
  setUserContext(prev => ({
    ...prev,
    ...updates,
    lastUpdate: new Date().toISOString()
  }));
};

// Usage
updateGlobalState({
  accountBalance: newBalance,
  userInvestments: [...prev.userInvestments, newInvestment],
  transactionHistory: [...prev.transactionHistory, newTransaction]
});
```

## Testing Checklist

- [x] Balance updates in dashboard → reflects in header
- [x] Cart checkout → updates balance and investments
- [x] Direct investment → updates both balance and portfolio
- [x] Logout → clears all user data
- [x] Page refresh → data persists from context
- [x] Investment chart → shows latest investments
- [ ] Multi-tab testing (future: sync across tabs)
- [ ] Network failure handling (future: offline support)

## Known Issues

1. ⚠️ Some components still use local state as primary (e.g., transactions, notifications)
2. ⚠️ No optimistic updates - UI waits for state changes
3. ⚠️ No cross-tab synchronization
4. ⚠️ Large investment lists may cause performance issues

## Maintenance

To add a new synchronized field:

1. Add to `initialUnifiedState` in UserContext.jsx
2. Export from UserContext
3. Create update function (e.g., `updateNewField`)
4. Use in components via `useContext(UserContext)`
5. Add to localStorage persistence
6. Document in this file

## File Locations

- **Context**: `frontend/src/components/Context/UserContext.jsx`
- **Main Consumer**: `frontend/src/components/Dashboard/UserDashboard.jsx`
- **Header**: `frontend/src/components/Dashboard/components/Header.jsx`
- **Navbar**: `frontend/src/components/Navbar.jsx`
