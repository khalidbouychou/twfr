import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const UserContext = createContext();

// Simple cookie helpers
const setCookie = (name, value, days = 30) => {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  } catch {}
};

const getCookie = (name) => {
  try {
    const match = document.cookie.split('; ').find((row) => row.startsWith(name + '='));
    return match ? match.split('=')[1] : null;
  } catch {
    return null;
  }
};

const deleteCookie = (name) => {
  try {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  } catch {}
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userProfileData, setUserProfileData] = useState(null);
  const [userResults, setUserResults] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [pendingInvestment, setPendingInvestment] = useState(null);

  // Rehydrate from cookies (preferred) or localStorage on load
  useEffect(() => {
    try {
      const cProfile = getCookie('userProfileData');
      const cResults = getCookie('userResults');
      const cComplete = getCookie('isProfileComplete');
      if (cProfile) setUserProfileData(JSON.parse(decodeURIComponent(cProfile)));
      if (cResults) setUserResults(JSON.parse(decodeURIComponent(cResults)));
      if (cComplete !== null) setIsProfileComplete(decodeURIComponent(cComplete) === 'true');

      // fallback to localStorage if cookies missing
      if (!cProfile) {
        const savedProfile = localStorage.getItem('userProfileData');
        if (savedProfile) setUserProfileData(JSON.parse(savedProfile));
      }
      if (!cResults) {
        const savedResults = localStorage.getItem('userResults');
        if (savedResults) setUserResults(JSON.parse(savedResults));
      }
      if (cComplete === null) {
        const savedComplete = localStorage.getItem('isProfileComplete');
        if (savedComplete !== null) setIsProfileComplete(savedComplete === 'true');
      }
    } catch {}
  }, []);

  const updateUserProfile = useCallback((profileData) => {
    setUserProfileData(profileData);
    setIsProfileComplete(true);
    try {
      const profileStr = JSON.stringify(profileData);
      setCookie('userProfileData', profileStr);
      setCookie('isProfileComplete', 'true');
      localStorage.setItem('userProfileData', profileStr);
      localStorage.setItem('isProfileComplete', 'true');
    } catch {}
  }, []);

  const updateUserResults = useCallback((results) => {
    setUserResults(results);
    try {
      const resultsStr = JSON.stringify(results);
      setCookie('userResults', resultsStr);
      localStorage.setItem('userResults', resultsStr);
    } catch {}
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
      deleteCookie('userProfileData');
      deleteCookie('userResults');
      deleteCookie('isProfileComplete');
      localStorage.removeItem('userProfileData');
      localStorage.removeItem('userResults');
      localStorage.setItem('isProfileComplete', 'false');
    } catch {}
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