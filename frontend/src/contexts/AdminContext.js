import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

// Default admin credentials (in production, these should be configurable)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminSession, setAdminSession] = useState(null);

  // Check for existing admin session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('adminSession');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        // Check if session is still valid (24 hours)
        if (session && session.timestamp && (Date.now() - session.timestamp < 24 * 60 * 60 * 1000)) {
          setIsAdminAuthenticated(true);
          setAdminSession(session);
        } else {
          // Session expired, clear it
          localStorage.removeItem('adminSession');
        }
      } catch (error) {
        localStorage.removeItem('adminSession');
      }
    }
  }, []);

  const adminLogin = (username, password) => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const session = {
        username,
        timestamp: Date.now(),
        loginTime: new Date().toISOString()
      };
      
      setIsAdminAuthenticated(true);
      setAdminSession(session);
      localStorage.setItem('adminSession', JSON.stringify(session));
      
      return { success: true, message: 'Admin logged in successfully' };
    } else {
      return { success: false, message: 'Invalid admin credentials' };
    }
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminSession(null);
    localStorage.removeItem('adminSession');
  };

  const requireAdminAuth = (callback) => {
    if (isAdminAuthenticated) {
      callback();
      return true;
    }
    return false;
  };

  const value = {
    isAdminAuthenticated,
    adminSession,
    adminLogin,
    adminLogout,
    requireAdminAuth,
    adminCredentials: ADMIN_CREDENTIALS // For display purposes only
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};