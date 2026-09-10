import React, { createContext, useState, useEffect, useContext } from "react";
import { getStoredUser, loginApi, clearAuthData, getCurrentUserApi, getAuthToken } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const userData = await getCurrentUserApi();
          setUser(userData);
        } catch (err) {
          clearAuthData();
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (usernameOrEmail, password) => {
    const { user: loggedInUser } = await loginApi(usernameOrEmail, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "ADMIN";
  const isUser = user?.role === "USER";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        isUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
