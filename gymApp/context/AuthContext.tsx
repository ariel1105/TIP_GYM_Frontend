import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import Api from "@/services/Api";
import { Member, UserLogin, UserRegister, Voucher } from "@/types/types";
import { Routes } from "@/app/constants/routes";
import { Alert } from "react-native";
import { registerForPushNotificationsAsync } from "@/services/notifications/registerForPushNotificationsAsync";
import * as Notifications from 'expo-notifications';

type AuthContextType = {
  setMember: any
  member: Member | null
  token: string | null;
  login: (user: UserLogin) => Promise<void>;
  register: (user: UserRegister) => Promise<void>;
  logout: () => void;
  vouchersArray: Voucher[];
  setVouchersArray: (v: Voucher[]) => void;
  acquirementSuccessModalVisible: boolean;
  setAcquirementSuccessModalVisible: (visible: boolean) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [member, setMember] = useState<Member | null>(null)
  const [vouchersArray, setVouchersArray] = useState<Voucher[]>([]);
  const [acquirementSuccessModalVisible, setAcquirementSuccessModalVisible] = useState(false);

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
      await registerForPushNotificationsAsync();
      const { status } = await Notifications.getPermissionsAsync();
      console.log("Permiso notificaciones:", status);
      router.push(Routes.Home);
    } catch (error: any) {
      if (!error.response) {
        Alert.alert("Ocurrio un error al loguearse", JSON.stringify(error.message));
      } 
      else {
        const errorMessage = error.response?.data;
        throw new Error(errorMessage);
      }
    }
  };

  
  const register = async (userData: UserRegister) => {
    try {
      const response = await Api.register(userData);
      const token = response.data;
      setToken(token);
      await SecureStore.setItemAsync("token", token);
      const memberResponse = await Api.getMember(token);
      setMember(memberResponse.data);
      router.push(Routes.Home);
    } catch (error: any) {
      if (!error.response) {
        Alert.alert("Ocurrio un error al registrarse", JSON.stringify(error.message));
      } 
      else {
        throw new Error(error);
      }
    }
  };

  const logout = async () => {
    setToken(null);
    setMember(null);
    await SecureStore.deleteItemAsync("token");
    router.replace("/(auth)/login");
  };

  return (
    <AuthContext.Provider
      value={{
        member,
        setMember,
        token,
        login,
        register,
        logout,
        vouchersArray,
        setVouchersArray,
        acquirementSuccessModalVisible,
        setAcquirementSuccessModalVisible,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
