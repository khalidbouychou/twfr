import React, { createContext, useContext, useState, useCallback } from 'react';

const UserContext = createContext();

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

  const updateUserProfile = useCallback((profileData) => {
    setUserProfileData(profileData);
    setIsProfileComplete(true);
  }, []);

  const updateUserResults = useCallback((results) => {
    setUserResults(results);
  }, []);

  const clearUserData = useCallback(() => {
    setUserProfileData(null);
    setUserResults(null);
    setIsProfileComplete(false);
  }, []);

  const value = {
    userProfileData,
    userResults,
    isProfileComplete,
    updateUserProfile,
    updateUserResults,
    clearUserData
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 