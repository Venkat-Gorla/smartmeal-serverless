import { createContext, useContext, useState } from "react";

// - This file defines the AuthContext for managing authentication state
//   in the application.
// - It provides a context for authentication status and functions to
//   log in and log out users.
// - This context can be used throughout the application to check if a
//   user is authenticated and to manage login/logout actions.

// vegorla: understand this code and how it compares with Max code references
// - If using Redux Toolkit for auth state management, this context can be 
//   replaced with a Redux slice.

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
