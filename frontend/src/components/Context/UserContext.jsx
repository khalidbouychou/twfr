import React, { useState, useCallback, useEffect } from 'react';
import { UserContext } from './UserContext.js';

export const UserProvider = ({ children }) => {
  const [userProfileData, setUserProfileData] = useState(null);
  const [userResults, setUserResults] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [pendingInvestment, setPendingInvestment] = useState(null);

  // localStorage on load
  useEffect(() => {
    try {
      // Get from localStorage instead of cookies
      const savedProfile = localStorage.getItem('userProfileData');
      const savedResults = localStorage.getItem('userResults');
      const savedComplete = localStorage.getItem('isProfileComplete');
      
      if (savedProfile) setUserProfileData(JSON.parse(savedProfile));
      if (savedResults) setUserResults(JSON.parse(savedResults));
      if (savedComplete !== null) setIsProfileComplete(savedComplete === 'true');
    } catch {
      console.log('Error rehydrating user data');
    }
  }, []);

  const updateUserProfile = useCallback((profileData) => {
    setUserProfileData(profileData);
    setIsProfileComplete(true);
    try {
      const profileStr = JSON.stringify(profileData);
      localStorage.setItem('userProfileData', profileStr);
      localStorage.setItem('isProfileComplete', 'true');
    } catch {
      console.log('Error updating user profile');
    }
  }, []);

  const updateUserResults = useCallback((results) => {
    setUserResults(results);
    try {
      const resultsStr = JSON.stringify(results);
      localStorage.setItem('userResults', resultsStr);
    } catch {
      console.log('Error updating user results');
    }
  }, []);

  const queuePendingInvestment = useCallback((investment) => {
    setPendingInvestment(investment);
  }, []);

  const clearPendingInvestment = useCallback(() => {
    setPendingInvestment(null);
  }, []);

  const clearUserData = useCallback(() => {
    setUserProfileData(null);
    setUserResults(null);
    setIsProfileComplete(false);
    setPendingInvestment(null);
    try {
      localStorage.removeItem('userProfileData');
      localStorage.removeItem('userResults');
      localStorage.setItem('isProfileComplete', 'false');
    } catch {
      console.log('Error clearing user data');
    }
  }, []);

  const value = {
    userProfileData,
    userResults,
    isProfileComplete,
    pendingInvestment,
    updateUserProfile,
    updateUserResults,
    queuePendingInvestment,
    clearPendingInvestment,
    clearUserData
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 