import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ,
  withCredentials: true, // Include cookies in requests to send to server on each request
 
});
export default axiosInstance;