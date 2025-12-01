import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Update if needed
});

// Attach JWT to admin requests if logged in
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('cineverse_admin_token');
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cineverse_admin_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete config.headers['Authorization'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
