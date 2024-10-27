import axios from 'axios';
import 'dotenv/config'

export const axiosInstance = axios.create({
    baseURL: import.meta.env.API_URL,
    withCredentials: true
  });