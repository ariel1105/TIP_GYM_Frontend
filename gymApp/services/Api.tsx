import { Suscriptions } from '@/types/types';
import Axios from 'axios';
import * as SecureStore from "expo-secure-store";

export const API_BASE_URL = "http://192.168.1.33:8080/";

const axiosInstance = Axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

const get = (url: string) => 
    axiosInstance.get(url)
        .then((response) => response )
        .catch((error) => Promise.reject(error))

const post = (url: string, body: any) => 
    axiosInstance.post(url, body)
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

const suscribe = async (body : Suscriptions) => {
    return post(`${API_BASE_URL}member/subscribe/1`, body);
}

const login = async (body: { username: string; password: string }) => {
    return post(`${API_BASE_URL}auth/login`, body); 
};

const register = async (body: {
    username: string;
    password: string;
    email: string;
}) => {
    return post(`${API_BASE_URL}auth/register`, body);
};


const Api = {
    getActivities,
    getTurn,
    getRegistrations,
    getMember,
    suscribe,
    login,
    register
}

export default Api;