import axios from 'axios';


export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
  });

  //http://localhost:8080