// context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import Api from "@/services/Api";

type AuthContextType = {
  user: any;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (user: any) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await SecureStore.getItemAsync("token");
      if (storedToken) {
        setToken(storedToken);
        // podés hacer un getMember() acá si querés cargar el user
      }
    };
    loadToken();
  }, []);

  const login = async (username: string, password: string) => {
    const response = await Api.login({ username, password });
    const token = response.data;

    setToken(token);
    await SecureStore.setItemAsync("token", token);
    setUser({ username }); // o Api.getMember()
    router.replace("/(tabs)/home");
  };

  const register = async (userData: any) => {
    const response = await Api.register(userData);
    const token = response.data;

    setToken(token);
    await SecureStore.setItemAsync("token", token);
    setUser({ username: userData.username });
    router.replace("/(tabs)/home");
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync("token");
    router.replace("/(auth)/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
