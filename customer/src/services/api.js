import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/public',
  withCredentials: true, // Though we don't strictly need it for public routes, good to have
});

export default api;
