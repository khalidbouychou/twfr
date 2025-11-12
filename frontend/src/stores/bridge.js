/**
 * Zustand-Context Bridge
 * 
 * This file provides a compatibility layer between Zustand stores and the existing Context API.
 * It allows gradual migration by keeping both systems in sync.
 * 
 * Usage:
 * 1. Import this in your main App component
 * 2. Components can use either Context or Zustand
 * 3. Data stays synchronized between both
 */

import { useEffect } from 'react';
import { useUserStore } from './stores/useUserStore';
import { useCartStore } from './stores/useCartStore';

/**
 * Sync Zustand stores with localStorage for legacy Context compatibility
 */
export const useZustandContextBridge = () => {
  const userStore = useUserStore();
  const cartStore = useCartStore();

  // Sync user store to legacy localStorage keys
  useEffect(() => {
    // Sync to userProfileData format for Context
    const userProfileData = {
      fullName: userStore.fullname,
      name: userStore.fullname,
      avatar: userStore.avatar,
      picture: userStore.avatar,
      email: userStore.email,
      phone: userStore.phone
    };

    if (userStore.fullname) {
      localStorage.setItem('userProfileData', JSON.stringify(userProfileData));
    }

    // Sync login status
    if (userStore.isLogin) {
      localStorage.setItem('isLogin', 'true');
    } else {
      localStorage.removeItem('isLogin');
    }

    // Sync legacy userContext
    const legacyContext = {
      fullname: userStore.fullname,
      avatar: userStore.avatar,
      email: userStore.email,
      phone: userStore.phone,
      isLogin: userStore.isLogin,
      isProfileComplete: userStore.isProfileComplete,
      accountBalance: userStore.accountBalance,
      userAnswers: userStore.userAnswers,
      userInvestments: userStore.userInvestments,
      matchedProducts: userStore.matchedProducts,
      dashboard: userStore.dashboard,
      behaviorProfile: userStore.behaviorProfile,
      marketData: userStore.marketData,
      simulations: userStore.simulations,
      financialGoals: userStore.financialGoals,
      transactionHistory: userStore.transactionHistory
    };

    localStorage.setItem('userContext', JSON.stringify(legacyContext));
    
  }, [
    userStore.fullname,
    userStore.avatar,
    userStore.email,
    userStore.isLogin,
    userStore.userInvestments,
    userStore.accountBalance
  ]);

  // Sync cart store to legacy localStorage
  useEffect(() => {
    localStorage.setItem('investmentCart', JSON.stringify(cartStore.cartItems));
  }, [cartStore.cartItems]);

  // Listen for changes from Context API and sync back to Zustand
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'userProfileData' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          userStore.updateUserProfile({
            fullName: data.fullName || data.name,
            avatar: data.avatar || data.picture,
            email: data.email
          });
        } catch (err) {
          console.error('Error syncing userProfileData to Zustand:', err);
        }
      }

      if (e.key === 'investmentCart' && e.newValue) {
        try {
          const items = JSON.parse(e.newValue);
          // Only sync if different from current state
          if (JSON.stringify(items) !== JSON.stringify(cartStore.cartItems)) {
            cartStore.clearCart();
            items.forEach(item => {
              cartStore.addToCart(item, item.amount);
            });
          }
        } catch (err) {
          console.error('Error syncing cart to Zustand:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [userStore, cartStore]);

  return null;
};

/**
 * Initialize Zustand from existing localStorage data
 * Call this once when the app starts
 */
export const initializeZustandFromLocalStorage = () => {
  const userStore = useUserStore.getState();
  const cartStore = useCartStore.getState();

  // Load from googleProfile if exists
  try {
    const googleProfile = localStorage.getItem('googleProfile');
    const userProfileData = localStorage.getItem('userProfileData');
    const isLogin = localStorage.getItem('isLogin') === 'true';

    if (googleProfile) {
      const profile = JSON.parse(googleProfile);
      userStore.updateUserProfile({
        fullName: profile.name,
        avatar: profile.picture,
        email: profile.email
      });
    } else if (userProfileData) {
      const profile = JSON.parse(userProfileData);
      userStore.updateUserProfile({
        fullName: profile.fullName || profile.name,
        avatar: profile.avatar || profile.picture,
        email: profile.email
      });
    }

    if (isLogin && !userStore.isLogin) {
      userStore.setIsLoggedIn(true);
    }
  } catch (err) {
    console.error('Error initializing Zustand from localStorage:', err);
  }

  // Load cart from legacy storage
  try {
    const cartData = localStorage.getItem('investmentCart');
    if (cartData && cartStore.cartItems.length === 0) {
      const items = JSON.parse(cartData);
      items.forEach(item => {
        cartStore.addToCart(item, item.amount);
      });
    }
  } catch (err) {
    console.error('Error loading cart:', err);
  }

  // Load userContext
  try {
    const userContext = localStorage.getItem('userContext');
    if (userContext) {
      const data = JSON.parse(userContext);
      if (data.userInvestments && data.userInvestments.length > 0) {
        userStore.setUserInvestments(data.userInvestments);
      }
    }
  } catch (err) {
    console.error('Error loading userContext:', err);
  }
};
