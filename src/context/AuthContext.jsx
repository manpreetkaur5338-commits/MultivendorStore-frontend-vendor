import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, getAuthToken, setAuthToken, getStoredVendor, setStoredVendor, clearAuth } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [vendor, setVendor] = useState(getStoredVendor());
  const [token, setToken] = useState(getAuthToken());
  const [loading, setLoading] = useState(true);

  // Synchronize authenticated profile with backend
  const refreshProfile = useCallback(async () => {
    const currentToken = getAuthToken();
    if (!currentToken) {
      setVendor(null);
      setLoading(false);
      return null;
    }

    try {
      const res = await authService.getProfile();
      if (res.success && res.user) {
        setVendor(res.user);
        setStoredVendor(res.user);
        return res.user;
      }
    } catch (err) {
      console.warn('Profile refresh notice:', err.message);
      // If unauthorized, clear invalid session
      if (err.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success && res.token) {
      if (res.user && res.user.role !== 'vendor' && res.user.role !== 'admin') {
        throw new Error('This account does not have vendor privileges. Please register as a seller.');
      }
      setAuthToken(res.token);
      setToken(res.token);
      setVendor(res.user);
      setStoredVendor(res.user);
      
      // Fetch latest profile state (isApproved, addresses, etc.)
      try {
        const profileRes = await authService.getProfile();
        if (profileRes.success && profileRes.user) {
          setVendor(profileRes.user);
          setStoredVendor(profileRes.user);
        }
      } catch (e) {
        // Fallback to login returned user
      }
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (vendorData) => {
    const res = await authService.register(vendorData);
    return res;
  };

  const updateProfile = async (profileData) => {
    const res = await authService.updateProfile(profileData);
    if (res.success && res.user) {
      setVendor(res.user);
      setStoredVendor(res.user);
    }
    return res;
  };

  const logout = () => {
    clearAuth();
    setToken(null);
    setVendor(null);
  };

  return (
    <AuthContext.Provider
      value={{
        vendor,
        token,
        isAuthenticated: Boolean(token && vendor),
        isApproved: Boolean(vendor?.isApproved),
        loading,
        login,
        register,
        updateProfile,
        refreshProfile,
        logout,
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
