# Migration from Context API to Zustand

## Overview
The application has been migrated from React Context API to Zustand for improved performance, simpler API, and better developer experience.

## What Changed

### ✅ Benefits of Zustand
- **Better Performance**: No unnecessary re-renders
- **Simpler API**: No providers needed
- **DevTools Support**: Built-in Redux DevTools integration
- **Smaller Bundle**: Much smaller than Context API
- **Persistence**: Built-in localStorage persistence
- **TypeScript Ready**: Better type inference

## Store Structure

### `useUserStore` - User & Profile Management
Replaces: `UserContext`

```javascript
import { useUserStore } from '@/stores';

// In your component:
const user = useUserStore();

// Access state
const { fullname, avatar, email, isLogin } = user;

// Access methods
const { updateUserProfile, logout, addUserInvestment } = user;
```

### `useCartStore` - Shopping Cart Management
Replaces: `CartContext`

```javascript
import { useCartStore } from '@/stores';

// In your component:
const cart = useCartStore();

// Access state
const { cartItems } = cart;

// Access methods
const { addToCart, removeFromCart, clearCart } = cart;
```

## Migration Guide

### Before (Context API):
```javascript
import { UserContext } from './components/Context/UserContext';
import { useContext } from 'react';

function MyComponent() {
  const { userProfileData, updateUserProfile, isLoggedIn } = useContext(UserContext);
  
  return <div>{userProfileData?.fullName}</div>;
}
```

### After (Zustand):
```javascript
import { useUserStore } from '@/stores';

function MyComponent() {
  const { fullname, updateUserProfile, isLogin } = useUserStore();
  
  return <div>{fullname}</div>;
}
```

## Selective Subscriptions (Performance Optimization)

One of Zustand's biggest advantages is selective subscriptions - only re-render when specific state changes:

```javascript
// ❌ Bad: Component re-renders on ANY user store change
const user = useUserStore();

// ✅ Good: Only re-renders when fullname changes
const fullname = useUserStore(state => state.fullname);

// ✅ Good: Only re-renders when isLogin changes
const isLogin = useUserStore(state => state.isLogin);

// ✅ Good: Multiple values
const { fullname, avatar } = useUserStore(state => ({
  fullname: state.fullname,
  avatar: state.avatar
}));
```

## Common Patterns

### 1. User Authentication
```javascript
// Login
const { updateUserProfile, setIsLoggedIn } = useUserStore();

const handleGoogleLogin = (profile) => {
  updateUserProfile({
    fullName: profile.name,
    avatar: profile.picture,
    email: profile.email
  });
  setIsLoggedIn(true);
};

// Logout
const { logout } = useUserStore();
const handleLogout = () => {
  logout(); // Clears all user data
  navigate('/login');
};
```

### 2. Investment Management
```javascript
const { addUserInvestment, userInvestments } = useUserStore();

const handleInvest = (investment) => {
  addUserInvestment({
    nameProduct: investment.name,
    valueInvested: investment.amount,
    category: investment.category,
    riskLevel: investment.risk
  });
};
```

### 3. Cart Operations
```javascript
const { addToCart, cartItems, clearCart } = useCartStore();

const handleAddToCart = (product, amount) => {
  addToCart(product, amount);
  showNotification('Product added to cart!', 'success');
};

const handleCheckout = () => {
  // Process cart...
  clearCart();
};
```

### 4. Dashboard Metrics
```javascript
const dashboard = useUserStore(state => state.dashboard);

const { totalInvested, totalProfit, globalROI } = dashboard;
```

## API Reference

### useUserStore

#### State
| Property | Type | Description |
|----------|------|-------------|
| `fullname` | string | User's full name |
| `avatar` | string | User's avatar URL |
| `email` | string | User's email |
| `phone` | string | User's phone number |
| `isLogin` | boolean | Login status |
| `isProfileComplete` | boolean | Profile completion status |
| `accountBalance` | number | Account balance |
| `userAnswers` | array | Questionnaire answers |
| `userInvestments` | array | User's investments |
| `matchedProducts` | array | Recommended products |
| `dashboard` | object | Dashboard metrics |
| `behaviorProfile` | object | User behavior profile |
| `marketData` | object | Market data |
| `simulations` | array | Saved simulations |
| `financialGoals` | array | Financial goals |
| `transactionHistory` | array | Transaction history |

#### Methods
| Method | Parameters | Description |
|--------|------------|-------------|
| `setIsLoggedIn(status)` | boolean | Set login status |
| `logout()` | - | Logout and clear data |
| `updateUserProfile(data)` | object | Update user profile |
| `updateAccountBalance(balance)` | number | Update balance |
| `setUserAnswers(answers)` | array | Set questionnaire answers |
| `updateStepAnswers(step, answers)` | number, array | Update step answers |
| `updateUserResults(results)` | object | Update results |
| `addUserInvestment(investment)` | object | Add investment |
| `updateUserInvestment(id, updates)` | string, object | Update investment |
| `removeUserInvestment(id)` | string | Remove investment |
| `setUserInvestments(investments)` | array | Set all investments |
| `queuePendingInvestment(investment)` | object | Queue pending investment |
| `clearPendingInvestment()` | - | Clear pending investment |
| `setShowConfirmationPopup(show)` | boolean | Show/hide confirmation |
| `confirmAnswers()` | - | Confirm answers |
| `modifyAnswer(step)` | number | Modify answer |
| `addFinancialGoal(goal)` | object | Add financial goal |
| `updateFinancialGoal(id, updates)` | string, object | Update goal |
| `addSimulation(simulation)` | object | Add simulation |
| `updateMarketData(data)` | object | Update market data |
| `updateRecommendations(products, score)` | array, number | Update recommendations |
| `addTransaction(transaction)` | object | Add transaction |
| `updateRealTimeSettings(settings)` | object | Update settings |
| `clearUserData()` | - | Clear all data |
| `getUserProfileData()` | - | Get profile object |

### useCartStore

#### State
| Property | Type | Description |
|----------|------|-------------|
| `cartItems` | array | Cart items |

#### Methods
| Method | Parameters | Description |
|--------|------------|-------------|
| `addToCart(product, amount)` | object, number | Add product to cart |
| `addMultipleToCart(products)` | array | Add multiple products |
| `removeFromCart(productId)` | string | Remove from cart |
| `updateCartItemAmount(productId, amount)` | string, number | Update amount |
| `clearCart()` | - | Clear cart |
| `getCartTotal()` | - | Get total amount |
| `getCartCount()` | - | Get item count |

## Files to Update

### Remove/Keep for Backward Compatibility
- Keep: `src/components/Context/UserContext.jsx` (temporary, for gradual migration)
- Keep: `src/components/Context/CartContext.jsx` (temporary, for gradual migration)

### Update These Files
1. `src/main.jsx` - Remove Context Providers (optional, can keep for gradual migration)
2. All components using `useContext(UserContext)` → Use `useUserStore()`
3. All components using `useCart()` → Use `useCartStore()`

## Gradual Migration Strategy

You can migrate gradually:

1. **Phase 1**: Install Zustand, create stores (✅ Done)
2. **Phase 2**: Update new components to use Zustand
3. **Phase 3**: Sync Zustand with Context (bridge layer)
4. **Phase 4**: Update existing components one by one
5. **Phase 5**: Remove Context Providers

## DevTools

Install Redux DevTools extension in your browser to inspect Zustand state:

```javascript
import { useUserStore } from '@/stores';

// State is automatically visible in Redux DevTools
```

## Persistence

Both stores automatically persist to localStorage:
- `user-storage` - User data
- `cart-storage` - Cart data

To clear storage:
```javascript
localStorage.removeItem('user-storage');
localStorage.removeItem('cart-storage');
```

## Testing

```javascript
import { useUserStore } from '@/stores';

// Reset store in tests
beforeEach(() => {
  useUserStore.setState(initialState);
});
```

## Example: Complete Component Migration

### Before:
```javascript
import React, { useContext } from 'react';
import { UserContext } from './components/Context/UserContext';
import { useCart } from './components/Context/CartContext';

function Dashboard() {
  const { 
    userProfileData, 
    userInvestments, 
    updateUserProfile 
  } = useContext(UserContext);
  
  const { cartItems, addToCart } = useCart();

  return (
    <div>
      <h1>Welcome {userProfileData?.fullName}</h1>
      <p>Investments: {userInvestments.length}</p>
      <p>Cart: {cartItems.length}</p>
    </div>
  );
}
```

### After:
```javascript
import React from 'react';
import { useUserStore, useCartStore } from '@/stores';

function Dashboard() {
  // Selective subscriptions for better performance
  const fullname = useUserStore(state => state.fullname);
  const investmentsCount = useUserStore(state => state.userInvestments.length);
  const updateUserProfile = useUserStore(state => state.updateUserProfile);
  
  const cartCount = useCartStore(state => state.cartItems.length);
  const addToCart = useCartStore(state => state.addToCart);

  return (
    <div>
      <h1>Welcome {fullname}</h1>
      <p>Investments: {investmentsCount}</p>
      <p>Cart: {cartCount}</p>
    </div>
  );
}
```

## Troubleshooting

### Issue: "Cannot read property 'fullname' of undefined"
**Solution**: The store might not be initialized. Use optional chaining:
```javascript
const fullname = useUserStore(state => state.fullname) || '';
```

### Issue: "Too many re-renders"
**Solution**: Use selective subscriptions instead of accessing the entire store:
```javascript
// ❌ Bad
const user = useUserStore();

// ✅ Good
const fullname = useUserStore(state => state.fullname);
```

### Issue: "State not persisting"
**Solution**: Check localStorage for 'user-storage' and 'cart-storage'. Clear if corrupted:
```javascript
localStorage.removeItem('user-storage');
localStorage.removeItem('cart-storage');
```

## Need Help?

Check the official Zustand documentation: https://github.com/pmndrs/zustand
