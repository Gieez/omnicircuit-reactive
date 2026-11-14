"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface UserSession {
  address: string;
  role: "lp_manager" | "auditor" | "judge" | "guest";
  authMethod: "wallet" | "persona" | "private_key" | "otp";
}

interface AuthContextType {
  user: UserSession | null;
  login: (session: UserSession) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("omni-auth-session");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("omni-auth-session");
      }
    }
  }, []);

  const login = (session: UserSession) => {
    setUser(session);
    localStorage.setItem("omni-auth-session", JSON.stringify(session));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("omni-auth-session");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
