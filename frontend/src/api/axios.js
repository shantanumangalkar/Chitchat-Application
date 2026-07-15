import axios from 'axios';
import { getToken, removeToken } from '../utils/token';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach JWT Bearer token
API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the server returns 401 Unauthorized, automatically log out
    if (error.response && error.response.status === 401) {
      removeToken();
      // Dispatch custom event to notify AuthContext to clear its states
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default API;
