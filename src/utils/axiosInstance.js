import axios from 'axios';


export const axiosInstance = axios.create({
    baseURL: 'https://devflix-awrx.onrender.com',
    withCredentials: true
  });

  //"https://devflix-awrx.onrender.com"

  //http://localhost:8080