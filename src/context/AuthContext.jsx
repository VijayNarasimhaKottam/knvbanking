import { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp, getUsers, STORAGE_KEYS } from '../utils/data';
import { getSession, isLoggedIn } from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initialize seed data if not present
    initializeApp();

    // 2. Load active session
    if (isLoggedIn()) {
      const session = getSession();
      const users = getUsers();
      const user = users.find((u) => u.id === session.userId || u.username === session.username);
      if (user) {
        setCurrentUser(user);
      } else {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
      }
    }
    setLoading(false);
  }, []);

  const login = (sessionData, rememberMe) => {
    const users = getUsers();
    const user = users.find((u) => u.id === sessionData.userId || u.username === sessionData.username);
    const fullUser = user || sessionData;

    setCurrentUser(fullUser);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));

    if (rememberMe) {
      localStorage.setItem('KVN_REMEMBERED_USER', sessionData.username);
    } else {
      localStorage.removeItem('KVN_REMEMBERED_USER');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
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
