import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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

export const authAPI = {
  register: (data: { nom: string; prenom: string; email: string; motDePasse: string; role?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; motDePasse: string }) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const patientAPI = {
  getAll: () => api.get('/patients'),
  getById: (id: string) => api.get(`/patients/${id}`),
  create: (data: object) => api.post('/patients', data),
  update: (id: string, data: object) => api.put(`/patients/${id}`, data),
  delete: (id: string) => api.delete(`/patients/${id}`),
};

export const dossierAPI = {
  getAll: () => api.get('/dossiers'),
  getById: (id: string) => api.get(`/dossiers/${id}`),
  create: (data: object) => api.post('/dossiers', data),
  update: (id: string, data: object) => api.put(`/dossiers/${id}`, data),
  delete: (id: string) => api.delete(`/dossiers/${id}`),
  getByPatient: (patientId: string) => api.get(`/dossiers/patient/${patientId}`),
  archive: (id: string) => api.put(`/dossiers/${id}/archive`),
};

export default api;
