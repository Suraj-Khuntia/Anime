import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginAdmin,
  getAdminMe,
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserMe,
  updateUserProfile,
  changeUserPassword,
} from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Admin State
  const [adminUser, setAdminUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('anipulse_admin_token') || null);

  // Regular User State
  const [currentUser, setCurrentUser] = useState(null);
  const [userToken, setUserToken] = useState(() => localStorage.getItem('anipulse_user_token') || null);

  const [isLoading, setIsLoading] = useState(true);

  // Auth Modal State ('signin' | 'signup' | 'forgot')
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signin');

  // Verify tokens on initial mount
  useEffect(() => {
    async function verifyExistingSessions() {
      // 1. Verify Admin Token if present
      const storedAdminToken = localStorage.getItem('anipulse_admin_token');
      if (storedAdminToken) {
        try {
          const res = await getAdminMe();
          if (res.data) {
            setAdminUser(res.data);
            setToken(storedAdminToken);
          } else {
            logout();
          }
        } catch (err) {
          console.warn('Existing admin token expired:', err.message);
          logout();
        }
      }

      // 2. Verify User Token if present
      const storedUserToken = localStorage.getItem('anipulse_user_token');
      if (storedUserToken) {
        try {
          const res = await getUserMe();
          if (res.data) {
            setCurrentUser(res.data);
            setUserToken(storedUserToken);
          } else {
            userLogout();
          }
        } catch (err) {
          console.warn('Existing user token expired:', err.message);
          userLogout();
        }
      }

      setIsLoading(false);
    }

    verifyExistingSessions();
  }, []);

  // --- Admin Auth Actions ---
  const login = async (usernameOrEmail, password) => {
    const res = await loginAdmin({ username: usernameOrEmail, password });
    if (res.token) {
      localStorage.setItem('anipulse_admin_token', res.token);
      setToken(res.token);
      setAdminUser(res.admin);
      return res;
    }
    throw new Error(res.message || 'Admin login failed');
  };

  const logout = () => {
    localStorage.removeItem('anipulse_admin_token');
    setToken(null);
    setAdminUser(null);
  };

  // --- User Auth Actions ---
  const userRegister = async (name, email, password) => {
    const res = await registerUser({ name, email, password });
    if (res.token) {
      localStorage.setItem('anipulse_user_token', res.token);
      setUserToken(res.token);
      setCurrentUser(res.user);
      setAuthModalOpen(false);
      return res;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const userLogin = async (email, password) => {
    const res = await loginUser({ email, password });
    if (res.token) {
      localStorage.setItem('anipulse_user_token', res.token);
      setUserToken(res.token);
      setCurrentUser(res.user);
      setAuthModalOpen(false);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const userLogout = () => {
    localStorage.removeItem('anipulse_user_token');
    setUserToken(null);
    setCurrentUser(null);
  };

  const requestPasswordReset = async (email) => {
    return await forgotPassword({ email });
  };

  const submitPasswordReset = async (code, newPassword) => {
    return await resetPassword({ code, newPassword });
  };

  const updateProfile = async ({ name, avatarUrl }) => {
    const res = await updateUserProfile({ name, avatarUrl });
    if (res.data) {
      setCurrentUser(res.data);
      return res.data;
    }
    throw new Error(res.message || 'Profile update failed');
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    return await changeUserPassword({ currentPassword, newPassword });
  };

  const openAuthModal = (mode = 'signin') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        // Admin
        adminUser,
        token,
        isAuthenticated: !!token && !!adminUser,
        login,
        logout,

        // User
        currentUser,
        userToken,
        isUserLoggedIn: !!userToken && !!currentUser,
        userRegister,
        userLogin,
        userLogout,
        requestPasswordReset,
        submitPasswordReset,
        updateProfile,
        changePassword,

        // Modal
        authModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,

        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
