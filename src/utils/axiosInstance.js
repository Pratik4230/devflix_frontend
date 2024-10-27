import axios from 'axios';


export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true
  });

  //"https://devflix-awrx.onrender.com"

  //http://localhost:8080