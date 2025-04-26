import { Suscriptions } from '@/types/types';
import Axios from 'axios';
import * as SecureStore from "expo-secure-store";
import AsyncStorage from '@react-native-async-storage/async-storage';
export const API_BASE_URL = "http://192.168.1.44:8080/";

// const axiosInstance = Axios.create({
//   baseURL: API_BASE_URL,
// });

// axiosInstance.interceptors.request.use(async (config) => {
//   const token = await SecureStore.getItemAsync("token");
//   if (token) {
//     config.headers.Authorization = token;
//   }
//   return config;
// });

const HEADER_AUTH = "Authorization";

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
        .catch((error) => Promise.reject(error.response.data))
        
  
const getActivities = () => {
    return get(`${API_BASE_URL}activities`);
};

const getTurn = (activity_id: number) => {
    return get(`${API_BASE_URL}turns/${activity_id}`)
}

const getRegistrations = (member_id: number) => {
    return get(`${API_BASE_URL}member/registrations/${member_id}`)
}

const getMember = async (member_id: number) => {
    return get(`${API_BASE_URL}member/${member_id}`)
}

const getMemberByUsername = (username: string, token: string) => {
    return get(`/member/username/${username}`, {
         headers: { "Authorization": `Bearer ${token}`} 
    });
}

const suscribe = async (memberId: number, body : Suscriptions, token: string) => {
    return post(`${API_BASE_URL}member/subscribe/${memberId}`, body, {
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
    getRegistrations,
    getMember,
    getMemberByUsername,
    suscribe,
    login,
    register
}

export default Api;