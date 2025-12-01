import React, { createContext, useContext, useCallback, useState, useEffect } from "react";

const LOCAL_KEY = "cineverse_admin_token";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(LOCAL_KEY));
  const [loading, setLoading] = useState(false);

  // Save token to localStorage and state
  const login = useCallback((jwt) => {
    localStorage.setItem(LOCAL_KEY, jwt);
    setToken(jwt);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(LOCAL_KEY);
    setToken(null);
  }, []);

  // For auto-logout: check for invalid/expired tokens in useEffect (advanced)

  return (
    <AdminAuthContext.Provider value={{ token, login, logout, isAdmin: !!token, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
