import { useState, createContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });

  // Get all users from localStorage
  const getUsers = () => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  };

  // Save users to localStorage
  const saveUsers = (users) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  // Simple password hash (not secure for production)
  const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  };

  // Signup function
  const signup = (email, password, fullName, phone) => {
    const users = getUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Un utilisateur existe déjà avec cet email' };
    }

    // Validate inputs
    if (!email || !password || !fullName) {
      return { success: false, message: 'Tous les champs sont obligatoires' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Le mot de passe doit contenir au moins 6 caractères' };
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password: simpleHash(password),
      fullName,
      phone: phone || '',
      createdAt: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };

    users.push(newUser);
    saveUsers(users);

    // Do not auto-login after signup; user must log in explicitly
    return { success: true, message: 'Inscription réussie. Veuillez vous connecter.' };
  };

  // Login function
  const login = (email, password) => {
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return { success: false, message: 'Email ou mot de passe invalide' };
    }

    // Verify password
    if (user.password !== simpleHash(password)) {
      return { success: false, message: 'Email ou mot de passe invalide' };
    }

    // Set current user
    setCurrentUser({
      id: user.id,
      email: user.email,
      // fullName: user.fullName,
      phone: user.phone,
      // avatar: user.avatar
    });
    
    localStorage.setItem('currentUser', JSON.stringify({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      avatar: user.avatar
    }));
    
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);

    return { success: true, message: 'Connexion r\u00e9ussie' };
  };

  // Logout function
  const logout = () => {
    // Explicitly mark the user as logged out and clear all persisted profile/auth data
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userProfileData');
    localStorage.removeItem('googleProfile');
    localStorage.removeItem('googleCredential');
    localStorage.removeItem('userInitialized');
    localStorage.removeItem('userContext');
    
    // Backward compatibility: older key
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userProfileData');
    
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const value = {
    isLoggedIn,
    currentUser,
    signup,
    login,
    logout,
    getUsers // For debugging - remove in production
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
