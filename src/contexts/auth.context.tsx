import { createContext, useContext, useEffect, useState } from "react";

import { loginRequest, getProfileRequest } from "../api/auth.api";

import type { User } from "../types/user";
import type { LoginRequest } from "../types/auth";

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function login(data: LoginRequest) {
    const response = await loginRequest(data);

    localStorage.setItem("@library:token", response.token);

    setUser(response.user);
  }

  function logout() {
    localStorage.removeItem("@library:token");

    setUser(null);
  }

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("@library:token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await getProfileRequest();

        setUser(profile);
      } catch {
        localStorage.removeItem("@library:token");
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
