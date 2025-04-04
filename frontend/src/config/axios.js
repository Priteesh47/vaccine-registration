import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8009/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add CORS headers to every request
    config.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
    config.headers['Access-Control-Allow-Credentials'] = true;

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 