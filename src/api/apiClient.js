import axios from 'axios';

// Instancia principal de conexion
const apiClient = axios.create({
  baseURL: 'https://api-shop-k0ei.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para peticiones
apiClient.interceptors.request.use(
  (config) => {
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

export default apiClient;