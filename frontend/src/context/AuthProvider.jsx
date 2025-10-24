import React, { createContext, useState, useContext } from "react";
import api from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    const res = await api.post("/auth/login", { username, password });
    sessionStorage.setItem("accessToken", res.data.access_token);
    setUser({ username });
  };

  const logout = () => {
    sessionStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
