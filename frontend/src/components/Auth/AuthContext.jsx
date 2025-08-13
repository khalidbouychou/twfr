import React, { createContext, useState, useCallback, useEffect } from 'react';

// localStorage helpers
const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const getLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

const AuthContext = createContext(null);

export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on app load
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const storedUser = getLocalStorage('tawfir_user');
      const authToken = getLocalStorage('tawfir_token');
      
      if (storedUser && authToken) {
        // Verify token hasn't expired
        const tokenData = JSON.parse(atob(authToken.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (tokenData.exp > currentTime) {
          setUserData(storedUser);
          setIsAuthenticated(true);
        } else {
          // Token expired, clear everything
          clearAuthData();
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const generateToken = (userData) => {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      sub: userData.id,
      email: userData.email,
      iat: Date.now() / 1000,
      exp: (Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
    };
    
    // Simple token generation (in production, use proper JWT library)
    return btoa(JSON.stringify(header)) + '.' + 
           btoa(JSON.stringify(payload)) + '.' + 
           btoa('tawfir_secret_key');
  };

  const generateRandomAvatar = () => {
    const avatars = [
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
  };

  const signup = useCallback(async (userInfo) => {
    try {
      const newUser = {
        id: Date.now().toString(),
        email: userInfo.email,
        name: userInfo.name || userInfo.email.split('@')[0],
        avatar: generateRandomAvatar(),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: {
          riskTolerance: 'equilibre',
          investmentDuration: 'moyen',
          productFamily: null,
          expectedReturn: null
        },
        ...userInfo
      };
      
      const token = generateToken(newUser);
      
      // Save to localStorage
      setLocalStorage('tawfir_user', newUser);
      setLocalStorage('tawfir_token', token);
      setLocalStorage('tawfir_auth_status', true);
      
      // Update state
      setUserData(newUser);
      setIsAuthenticated(true);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Erreur lors de l\'inscription' };
    }
  }, []);

  const login = useCallback(async (email, password = null) => {
    try {
      // Check if user exists in localStorage
      const storedUser = getLocalStorage('tawfir_user');
      
      if (storedUser && storedUser.email === email) {
        // Update last login
        const updatedUser = {
          ...storedUser,
          lastLogin: new Date().toISOString()
        };
        
        const token = generateToken(updatedUser);
        
        // Update localStorage
        setLocalStorage('tawfir_user', updatedUser);
        setLocalStorage('tawfir_token', token);
        setLocalStorage('tawfir_auth_status', true);
        
        // Update state
        setUserData(updatedUser);
        setIsAuthenticated(true);
        
        return { success: true, user: updatedUser };
      }
      
      return { success: false, error: 'Utilisateur non trouvé' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Erreur lors de la connexion' };
    }
  }, []);

  const logout = useCallback(() => {
    try {
      console.log('Logout called - clearing authentication state');
      
      // Clear state
      setIsAuthenticated(false);
      setUserData(null);
      
      // Clear localStorage
      removeLocalStorage('tawfir_user');
      removeLocalStorage('tawfir_token');
      removeLocalStorage('tawfir_auth_status');
      
      console.log('Logout completed - authentication state cleared');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const clearAuthData = () => {
    setIsAuthenticated(false);
    setUserData(null);
    removeLocalStorage('tawfir_user');
    removeLocalStorage('tawfir_token');
    removeLocalStorage('tawfir_auth_status');
  };

  const updateUserData = useCallback((newData) => {
    try {
      const updatedUser = { ...userData, ...newData };
      
      // Update localStorage
      setLocalStorage('tawfir_user', updatedUser);
      
      // Update state
      setUserData(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Update user data error:', error);
      return { success: false, error: 'Erreur lors de la mise à jour' };
    }
  }, [userData]);

  const updateUserPreferences = useCallback((preferences) => {
    try {
      const updatedUser = {
        ...userData,
        preferences: { ...userData.preferences, ...preferences }
      };
      
      // Update localStorage
      setLocalStorage('tawfir_user', updatedUser);
      
      // Update state
      setUserData(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Update preferences error:', error);
      return { success: false, error: 'Erreur lors de la mise à jour des préférences' };
    }
  }, [userData]);

  const isTokenValid = useCallback(() => {
    try {
      const token = getLocalStorage('tawfir_token');
      if (!token) return false;
      
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return tokenData.exp > currentTime;
    } catch (error) {
      return false;
    }
  }, []);

  // Auto-refresh token if needed
  useEffect(() => {
    if (isAuthenticated && userData) {
      const interval = setInterval(() => {
        if (!isTokenValid()) {
          console.log('Token expired, logging out user');
          logout();
        }
      }, 60000); // Check every minute
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, userData, isTokenValid, logout]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#3CD4AB]"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userData, 
      login, 
      signup, 
      logout, 
      updateUserData,
      updateUserPreferences,
      isTokenValid,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 