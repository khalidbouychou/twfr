import React, { createContext, useState, useCallback, useEffect } from 'react';

// Cookie helpers
const setCookie = (name, value, days = 30) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      try {
        return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
      } catch {
        return null;
      }
    }
  }
  return null;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

const AuthContext = createContext(null);

export { AuthContext };
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check if user is authenticated from cookies
    const storedUser = getCookie('userData');
    if (storedUser) {
      setUserData(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

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
    const newUser = {
      id: Date.now().toString(),
      email: userInfo.email,
      name: userInfo.name || userInfo.email.split('@')[0],
      avatar: generateRandomAvatar(),
      createdAt: new Date().toISOString(),
      ...userInfo
    };
    
    setUserData(newUser);
    setIsAuthenticated(true);
    setCookie('userData', newUser);
  }, []);

  const login = useCallback(async (email) => {
    // Simple login - check if user exists in cookies
    const storedUser = getCookie('userData');
    if (storedUser && storedUser.email === email) {
      setUserData(storedUser);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    console.log('Logout called - clearing authentication state');
    setIsAuthenticated(false);
    setUserData(null);
    deleteCookie('userData');
    
    // Force clear any remaining cookies with different paths
    document.cookie = 'userData=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
    document.cookie = 'userData=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/dashboard;';
    document.cookie = 'userData=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/investment;';
    document.cookie = 'userData=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/simulation;';
    
    console.log('Logout completed - authentication state cleared');
  }, []);

  const updateUserData = useCallback((newData) => {
    const updatedUser = { ...userData, ...newData };
    setUserData(updatedUser);
    setCookie('userData', updatedUser);
  }, [userData]);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userData, 
      login, 
      signup, 
      logout, 
      updateUserData 
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 