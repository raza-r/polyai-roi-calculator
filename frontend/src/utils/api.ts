import axios from 'axios';
import { useAuthStore } from '../store/auth';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: async (data: { email: string; password: string; organization_name: string; full_name?: string }) => {
    const response = await api.post('/api/auth/signup', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  },

  me: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

// Calculator API
export const calculatorAPI = {
  list: async (page = 1, pageSize = 20) => {
    const response = await api.get(`/api/calculators?page=${page}&page_size=${pageSize}`);
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get(`/api/calculators/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/api/calculators', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.patch(`/api/calculators/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/api/calculators/${id}`);
  },

  publish: async (id: string) => {
    const response = await api.post(`/api/calculators/${id}/publish`);
    return response.data;
  },

  analytics: async (id: string) => {
    const response = await api.get(`/api/calculators/${id}/analytics`);
    return response.data;
  },
};

// Template API
export const templateAPI = {
  list: async () => {
    const response = await api.get('/api/templates');
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get(`/api/templates/${id}`);
    return response.data;
  },
};

export default api;
