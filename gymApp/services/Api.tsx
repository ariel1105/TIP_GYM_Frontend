import { Suscriptions, Voucher } from '@/types/types';
import Axios, { AxiosRequestConfig } from 'axios';
export const API_BASE_URL = "http://192.168.1.45:8080/";

const axiosInstance = Axios.create({
    baseURL: API_BASE_URL,
    timeout: 2000,
  });

const get = (url: string, header?: AxiosRequestConfig<any> | undefined) => 
    axiosInstance.get(url, header)

const post = (url: string, body?: any, header?: AxiosRequestConfig<any> | undefined) => 
    axiosInstance.post(url, body, header)
        
const del = (url: string, header?: AxiosRequestConfig<any> | undefined) => 
    axiosInstance.delete(url, header)

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

const getBodyBuildingEntries = async (monthNumber: number, token: string) => {
  return get(`${API_BASE_URL}member/bodyBuilding/entries?monthNumber=${monthNumber}`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
};

const getMember = async (token: string) => {
    return get(`${API_BASE_URL}member`,  {
        headers: { "Authorization": `Bearer ${token}`} 
   });
}

const getVouchers = async(token: string) => {
    return get(`${API_BASE_URL}member/vouchers`, {
        headers: { "Authorization": `Bearer ${token}`}
    });
}

const subscribe = async (body : Suscriptions, token: string) => {
    return post(`${API_BASE_URL}member/subscribe`, body, {
        headers: { "Authorization": `Bearer ${token}`} 
   });
}

const unsubscribe = async (turnId: number, token: string) => {
    return del(`${API_BASE_URL}member/unsubscribe/${turnId}`, {
        headers: { "Authorization": `Bearer ${token}`} 
   });
}

const acquire = async (body: Voucher[], token: string) => {
    return post(`${API_BASE_URL}member/acquire`, body, {
        headers: { "Authorization": `Bearer ${token}`} 
   });
}

const subscribeToNotifications = async (activityId: number, token: string) => {
  const url = `${API_BASE_URL}member/notificactionSubscribe/${activityId}`;
  console.log(url);
  console.log(token);
  return post(url, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const subscribeToBodyBuilding = async (daysPerWeek: number, token: string) => {
  return post(`member/bodyBuilding/subscribe?daysPerWeek=${daysPerWeek}`, null, {
    headers: { "Authorization": `Bearer ${token}` },
  });
};


const Api = {
    login,
    register,
    getActivities,
    getTurn,
    getWeekTurns,
    getRegistrations,
    getBodyBuildingEntries,
    getMember,
    getVouchers,
    subscribe,
    unsubscribe,
    acquire,
    subscribeToNotifications,
    subscribeToBodyBuilding
}

export default Api;
