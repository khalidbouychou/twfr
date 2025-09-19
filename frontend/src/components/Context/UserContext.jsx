import React, { useState, useCallback, useEffect } from 'react';
import { createContext } from 'react';

export const UserContext = createContext({
  userProfileData: null,
  userResults: null,
  isProfileComplete: false,
  pendingInvestment: null,
  updateUserProfile: () => {},
  updateUserResults: () => {},
  queuePendingInvestment: () => {},
  clearPendingInvestment: () => {},
  clearUserData: () => {},
  logout: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  userAnswers: [],
  setUserAnswers: () => {},
  updateStepAnswers: () => {},
  showConfirmationPopup: false,
  setShowConfirmationPopup: () => {},
  confirmAnswers: () => {},
  modifyAnswer: () => {},
  currentEditingStep: null,
  setCurrentEditingStep: () => {},
});

export const UserProvider = ({ children }) => {
  const [userProfileData, setUserProfileData] = useState(null);
  const [userResults, setUserResults] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [pendingInvestment, setPendingInvestment] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const loginStatus = localStorage.getItem('isLogin');
    return loginStatus === 'true';
  });

  // Store answers by step to prevent duplicates
  const [stepAnswers, setStepAnswers] = useState({
    0: [], // CC answers
    1: [], // PE answers  
    2: [], // PF answers
    3: [], // PI answers
    4: []  // ESG answers
  });
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false)
  const [currentEditingStep, setCurrentEditingStep] = useState(null)

  // Compute final userAnswers from all steps
  const userAnswers = Object.values(stepAnswers).flat().filter(answer => answer.q && answer.answer);

  // localStorage on load
  useEffect(() => {
    try {
      // Get from localStorage instead of cookies
      const savedProfile = localStorage.getItem('userProfileData');
      const savedResults = localStorage.getItem('userResults');
      const savedComplete = localStorage.getItem('isProfileComplete');
      // Try google profile if userProfileData is missing
      if (!savedProfile) {
        const googleProfile = localStorage.getItem('googleProfile');
        if (googleProfile) {
          const gp = JSON.parse(googleProfile);
          setUserProfileData({ fullName: gp.name, email: gp.email, avatar: gp.picture });
        }
      }
      if (savedProfile) setUserProfileData(JSON.parse(savedProfile));
      if (savedResults) setUserResults(JSON.parse(savedResults));
      if (savedComplete !== null) setIsProfileComplete(savedComplete === 'true');
    } catch {
      console.log('Error rehydrating user data');
    }
  }, []);

  // Sync isLoggedIn with localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const loginStatus = localStorage.getItem('isLogin');
      setIsLoggedIn(loginStatus === 'true');
      // Also refresh profile on storage changes
      try {
        const savedProfile = localStorage.getItem('userProfileData');
        if (savedProfile) setUserProfileData(JSON.parse(savedProfile));
      } catch {}
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
    setStepAnswers({
      0: [],
      1: [],
      2: [],
      3: [],
      4: []
    });
    try {
      localStorage.removeItem('userProfileData');
      localStorage.removeItem('userResults');
      localStorage.setItem('isProfileComplete', 'false');
      localStorage.removeItem('isLogin');
      localStorage.removeItem('googleProfile');
      localStorage.removeItem('googleCredential');
    } catch {
      console.log('Error clearing user data');
    }
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserProfileData(null);
    setUserResults(null);
    setIsProfileComplete(false);
    setPendingInvestment(null);
    setStepAnswers({
      0: [],
      1: [],
      2: [],
      3: [],
      4: []
    });
    try {
      localStorage.removeItem('userProfileData');
      localStorage.removeItem('userResults');
      localStorage.setItem('isProfileComplete', 'false');
      localStorage.removeItem('isLogin');
      localStorage.removeItem('googleProfile');
      localStorage.removeItem('googleCredential');
    } catch {
      console.log('Error during logout');
    }
  }, []);

  // New function to update answers for a specific step
  const updateStepAnswers = useCallback((stepIndex, answers) => {
    setStepAnswers(prev => ({
      ...prev,
      [stepIndex]: answers
    }));
  }, []);

  // Function to modify a specific answer
  const modifyAnswer = useCallback((stepIndex, questionIndex, newAnswer) => {
    setStepAnswers(prev => {
      const newStepAnswers = { ...prev };
      if (newStepAnswers[stepIndex] && newStepAnswers[stepIndex][questionIndex]) {
        newStepAnswers[stepIndex][questionIndex].answer = newAnswer;
      }
      return newStepAnswers;
    });
  }, [ ]);

  const confirmAnswers = useCallback(() => {
    console.log("All User Answers:", userAnswers);
    setShowConfirmationPopup(true);
  }, [userAnswers]);

  const value = {
    userProfileData,
    userResults,
    isProfileComplete,
    pendingInvestment,
    updateUserProfile,
    updateUserResults,
    queuePendingInvestment,
    clearPendingInvestment,
    clearUserData,
    logout,
    isLoggedIn,
    setIsLoggedIn,
    userAnswers,
    setUserAnswers: () => {}, // Keep for backward compatibility but not used
    updateStepAnswers,
    showConfirmationPopup,
    setShowConfirmationPopup,
    confirmAnswers,
    modifyAnswer,
    currentEditingStep,
    setCurrentEditingStep,
    stepAnswers,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 