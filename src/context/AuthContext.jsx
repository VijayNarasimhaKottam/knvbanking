import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/data';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedUserId = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (storedUserId) {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      const user = users.find((u) => u.id === storedUserId);
      if (user) {
        setCurrentUser(user);
      } else {
        sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    }
    setLoading(false);
  }, []);

  const login = (user, rememberMe) => {
    setCurrentUser(user);
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, user.id);
    if (rememberMe) {
      localStorage.setItem('KVN_REMEMBERED_USER', user.username);
    } else {
      localStorage.removeItem('KVN_REMEMBERED_USER');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  };

  const value = {
    currentUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
