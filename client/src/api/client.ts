import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const healthCheck = () => api.get('/health');
export const register = (data: { email: string; password: string; name: string }) =>
  api.post('/auth/register', data);
export const login = (data: { email: string; password: string }) =>
  api.post('/auth/login', data);
export const getPrimarySymptoms = () => api.get('/symptoms/primary');
export const getFollowUpQuestions = (symptomId: string) =>
  api.get(`/symptoms/questions/${symptomId}`);
export const assessSymptoms = (data: { primarySymptom: string; answers: Record<string, unknown> }) =>
  api.post('/symptoms/assess', data);
export const assessSymptomsGuest = (data: { primarySymptom: string; answers: Record<string, unknown> }) =>
  api.post('/symptoms/assess/guest', data);
export const getHospitals = (params: Record<string, string | number | boolean>) =>
  api.get('/hospitals', { params });
export const getHospitalRecommendations = (params: { specialty: string; lat: number; lng: number }) =>
  api.get('/hospitals/recommend', { params });
export const dispatchAmbulance = (data: { lat: number; lng: number; symptomSeverity?: string }) =>
  api.post('/emergency/dispatch', data);
export const dispatchAmbulanceGuest = (data: { lat: number; lng: number; symptomSeverity?: string; name?: string }) =>
  api.post('/emergency/dispatch/guest', data);
export const getAdvisories = (params?: { month?: number; region?: string }) =>
  api.get('/advisories', { params });
export const getProfile = () => api.get('/profile');
export const updateProfile = (data: Record<string, unknown>) => api.put('/profile', data);
export const getHistory = () => api.get('/profile/history');
