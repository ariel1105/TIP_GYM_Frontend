import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { router, useRouter } from "expo-router";
import Api from "@/services/Api";
import { Member, UserLogin, UserRegister } from "@/types/types";
import { Routes } from "@/app/constants/routes";
import { Alert } from "react-native";

type AuthContextType = {
  member: Member | null
  token: string | null;
  login: (user: UserLogin) => Promise<void>;
  register: (user: UserRegister) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [member, setMember] = useState<Member | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await SecureStore.getItemAsync("token");
      if (storedToken) {
        setToken(storedToken);
      }
    };
    loadToken();
  }, []);

 

const login = async ({ username, password }: UserLogin) => {
  try {
    const response = await Api.login({ username, password });
    const token = response.data;
    setToken(token);
    await SecureStore.setItemAsync("token", token);

    const memberResponse = await Api.getMember(token);
    setMember(memberResponse.data);

    Alert.alert("Redirigiendo a Home...");
    router.push("/home");
  } catch (error) {
    console.error(error)
  }
};

  const register = async (userData: UserRegister) => {
    try {const response = await Api.register(userData);
      const token = response.data;
      setToken(token);
      await SecureStore.setItemAsync("token", token);

      const memberResponse = await Api.getMember(token);
      setMember(memberResponse.data);

      router.push(Routes.Home)} 
    catch(error) {
      console.error(error)
    }
  };

  const logout = async () => {
    setToken(null);
    setMember(null);
    await SecureStore.deleteItemAsync("token");
    router.replace("/(auth)/login");
  };

  return (
    <AuthContext.Provider value={{ member, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
