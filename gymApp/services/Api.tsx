import Axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = 'http://192.168.1.36:8080/';
// const HEADER_AUTH = "Authorization";

// const axiosInstance = Axios.create({
//     baseURL: API_BASE_URL,
//     timeout: 2000,
//   });
  
// const getToken = async () => {
//     return await AsyncStorage.getItem('token');
// };

// const header = async () => {
//     const token = await getToken();
//     return { headers: { [HEADER_AUTH]: token} };
// };

const get = (url: string) => 
    Axios.get(url)
        .then((response) => response )
        .catch((error) => Promise.reject(error))

const getActivities = () => {
    return get(`${API_BASE_URL}activities`);
};

const getTurn = (activity_id: number) => {
    return get(`${API_BASE_URL}turns/${activity_id}`)
}

const getRegistrations = (member_id: number) => {
    return get(`${API_BASE_URL}member/registrations/${member_id}`)
}

const Api = {
    getActivities,
    getTurn,
    getRegistrations
}

export default Api;