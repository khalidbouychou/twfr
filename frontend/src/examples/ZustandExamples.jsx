/**
 * Example: Migrating a Component from Context to Zustand
 * 
 * This file shows side-by-side comparison of Context API vs Zustand
 */

import React from 'react';

// ========================================
// BEFORE: Using Context API
// ========================================
/*
import { useContext } from 'react';
import { UserContext } from './components/Context/UserContext';
import { useCart } from './components/Context/CartContext';

function UserDashboardOld() {
  const { 
    userProfileData, 
    userInvestments,
    dashboard,
    updateUserProfile,
    addUserInvestment,
    logout
  } = useContext(UserContext);
  
  const { cartItems, addToCart, clearCart } = useCart();

  return (
    <div>
      <h1>Welcome {userProfileData?.fullName}</h1>
      <p>Email: {userProfileData?.email}</p>
      <img src={userProfileData?.avatar} alt="Avatar" />
      
      <div>
        <h2>Portfolio Overview</h2>
        <p>Total Invested: ${dashboard?.totalInvested}</p>
        <p>Current Value: ${dashboard?.totalCurrent}</p>
        <p>Profit: ${dashboard?.totalProfit}</p>
        <p>ROI: {dashboard?.globalROI}%</p>
      </div>

      <div>
        <h2>Investments ({userInvestments?.length})</h2>
        {userInvestments?.map(inv => (
          <div key={inv.id}>
            <p>{inv.nameProduct}: ${inv.currentValue}</p>
          </div>
        ))}
      </div>

      <div>
        <h2>Cart ({cartItems?.length})</h2>
        {cartItems?.map(item => (
          <div key={item.id}>
            <p>{item.name}: ${item.amount}</p>
          </div>
        ))}
      </div>

      <button onClick={() => updateUserProfile({ fullName: 'New Name' })}>
        Update Profile
      </button>
      
      <button onClick={() => addToCart(someProduct, 1000)}>
        Add to Cart
      </button>
      
      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}
*/

// ========================================
// AFTER: Using Zustand (Recommended)
// ========================================

import { useUserStore, useCartStore } from '@/stores';

function UserDashboardNew() {
  // Option 1: Selective subscriptions (BEST PERFORMANCE)
  // Only re-renders when these specific values change
  const fullname = useUserStore(state => state.fullname);
  const email = useUserStore(state => state.email);
  const avatar = useUserStore(state => state.avatar);
  const dashboard = useUserStore(state => state.dashboard);
  const userInvestments = useUserStore(state => state.userInvestments);
  
  // Actions don't cause re-renders
  const updateUserProfile = useUserStore(state => state.updateUserProfile);
  const addUserInvestment = useUserStore(state => state.addUserInvestment);
  const logout = useUserStore(state => state.logout);
  
  // Cart store
  const cartItems = useCartStore(state => state.cartItems);
  const addToCart = useCartStore(state => state.addToCart);
  const clearCart = useCartStore(state => state.clearCart);

  return (
    <div>
      <h1>Welcome {fullname}</h1>
      <p>Email: {email}</p>
      <img src={avatar} alt="Avatar" />
      
      <div>
        <h2>Portfolio Overview</h2>
        <p>Total Invested: ${dashboard.totalInvested}</p>
        <p>Current Value: ${dashboard.totalCurrent}</p>
        <p>Profit: ${dashboard.totalProfit}</p>
        <p>ROI: {dashboard.globalROI}%</p>
      </div>

      <div>
        <h2>Investments ({userInvestments.length})</h2>
        {userInvestments.map(inv => (
          <div key={inv.id}>
            <p>{inv.nameProduct}: ${inv.currentValue}</p>
          </div>
        ))}
      </div>

      <div>
        <h2>Cart ({cartItems.length})</h2>
        {cartItems.map(item => (
          <div key={item.id}>
            <p>{item.name}: ${item.amount}</p>
          </div>
        ))}
      </div>

      <button onClick={() => updateUserProfile({ fullName: 'New Name' })}>
        Update Profile
      </button>
      
      <button onClick={() => addToCart({ id: 1, name: 'Product' }, 1000)}>
        Add to Cart
      </button>
      
      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}

// ========================================
// ALTERNATIVE: Get entire store (simpler but less optimized)
// ========================================

function UserDashboardAlternative() {
  // Gets the entire store - re-renders on ANY change
  // Simpler but less performant
  const userStore = useUserStore();
  const cartStore = useCartStore();

  return (
    <div>
      <h1>Welcome {userStore.fullname}</h1>
      <p>Email: {userStore.email}</p>
      
      <p>Total Invested: ${userStore.dashboard.totalInvested}</p>
      <p>Investments: {userStore.userInvestments.length}</p>
      <p>Cart Items: {cartStore.cartItems.length}</p>
      
      <button onClick={() => userStore.updateUserProfile({ fullName: 'New Name' })}>
        Update Profile
      </button>
      
      <button onClick={userStore.logout}>
        Logout
      </button>
    </div>
  );
}

// ========================================
// PERFORMANCE TIPS
// ========================================

// ✅ GOOD: Selective subscription
function GoodExample() {
  const fullname = useUserStore(state => state.fullname);
  // Only re-renders when fullname changes
  return <div>{fullname}</div>;
}

// ❌ BAD: Entire store subscription
function BadExample() {
  const userStore = useUserStore();
  // Re-renders on ANY store change (email, investments, etc.)
  return <div>{userStore.fullname}</div>;
}

// ✅ GREAT: Multiple selective subscriptions
function GreatExample() {
  const { fullname, email } = useUserStore(state => ({
    fullname: state.fullname,
    email: state.email
  }));
  // Only re-renders when fullname or email changes
  return <div>{fullname} - {email}</div>;
}

// ✅ PERFECT: Actions never cause re-renders
function PerfectExample() {
  const fullname = useUserStore(state => state.fullname);
  const updateProfile = useUserStore(state => state.updateUserProfile);
  
  // Component ONLY re-renders when fullname changes
  // Calling updateProfile never causes re-render
  return (
    <div>
      {fullname}
      <button onClick={() => updateProfile({ fullName: 'New' })}>
        Update
      </button>
    </div>
  );
}

export default UserDashboardNew;
export { 
  UserDashboardAlternative,
  GoodExample,
  BadExample,
  GreatExample,
  PerfectExample
};
