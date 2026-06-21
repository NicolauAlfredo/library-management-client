import { createContext, useContext, useEffect, useState } from "react";

import {
  loginRequest,
  getProfileRequest,
  registerRequest,
} from "../api/auth.api";

import type { User } from "../types/user";
import type { LoginRequest, RegisterRequest } from "../types/auth";

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  updateAuthenticatedUser: (user: User) => void;
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

  async function register(data: RegisterRequest) {
    const response = await registerRequest(data);

    localStorage.setItem("@library:token", response.token);

    setUser(response.user);
  }

  function logout() {
    localStorage.removeItem("@library:token");

    setUser(null);
  }

  function updateAuthenticatedUser(user: User) {
    setUser(user);
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
        register,
        logout,
        updateAuthenticatedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
