import { Suscriptions } from '@/types/types';
import Axios from 'axios';
import * as SecureStore from "expo-secure-store";
import AsyncStorage from '@react-native-async-storage/async-storage';
export const API_BASE_URL = "http://192.168.1.44:8080/";

const axiosInstance = Axios.create({
    baseURL: API_BASE_URL,
    timeout: 2000,
  });

const get = (url: any, header?: any) => 
    axiosInstance.get(url, header)
        .then((response) => response )
        .catch((error) => Promise.reject(error))

const post = (url: any, body: any, header?:any) => 
    axiosInstance.post(url, body, header)
        .then((response) => response)
        .catch((error) => Promise.reject(error))
        
const del = (url: any, header?: any) => 
    axiosInstance.delete(url, header)
        .then((response) => response)
        .catch((error) => Promise.reject(error))


const getActivities = () => {
    return get(`${API_BASE_URL}activities`);
};

const getTurn = (activity_id: number) => {
    return get(`${API_BASE_URL}turns/${activity_id}`)
}

const getWeekTurns = async (startDate: string) => {
    return get(`/turns/week?startDate=${startDate}`);
};


const getRegistrations = (token: string) => {
    return get(`${API_BASE_URL}member/registrations`,  {
        headers: { "Authorization": `Bearer ${token}`} 
   });
}

const getMember = async (token: string) => {
    return get(`${API_BASE_URL}member`,  {
        headers: { "Authorization": `Bearer ${token}`} 
   });
}

const suscribe = async (body : Suscriptions, token: string) => {
    return post(`${API_BASE_URL}member/subscribe`, body, {
        headers: { "Authorization": `Bearer ${token}`} 
   });
}

const unsubscribe = async (turnId: number, token: string) => {
    return del(`${API_BASE_URL}member/unsubscribe/${turnId}`, {
        headers: { "Authorization": `Bearer ${token}`} 
   });
}

const login = async (body: { username: string; password: string }) => {
    return post(`${API_BASE_URL}login`, body); 
};

const register = async (body: {
    name: string
    username: string;
    password: string;
}) => {
    return post(`${API_BASE_URL}register`, body);
};

const Api = {
    getActivities,
    getTurn,
    getWeekTurns,
    getRegistrations,
    getMember,
    suscribe,
    unsubscribe,
    login,
    register
}

export default Api;