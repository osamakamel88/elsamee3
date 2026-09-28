import axios from 'axios';

const client = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if not already on public pages
    if (error.response?.status === 401) {
      const publicPaths = ['/login', '/register', '/search'];
      const isPublicPath = publicPaths.some((path) => window.location.pathname.startsWith(path));
      if (!isPublicPath) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default client;
