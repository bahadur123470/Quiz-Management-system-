import axios from 'axios';

const AUTH_URL = 'http://localhost:5001/api/auth';
const QUIZ_URL = 'http://localhost:5002/api/quizzes';
const ASSESSMENT_URL = 'http://localhost:5003/api/assessment';
const REPORTING_URL = 'http://localhost:5004/api/reporting';

const api = axios.create();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (data) => axios.post(`${AUTH_URL}/login`, data),
  register: (data) => axios.post(`${AUTH_URL}/register`, data),
};

export const quizService = {
  getQuizzes: () => axios.get(QUIZ_URL),
  createQuiz: (data) => axios.post(`${QUIZ_URL}/create`, data),
};

export const assessmentService = {
  submitQuiz: (data) => axios.post(`${ASSESSMENT_URL}/submit`, data),
  saveDraft: (data) => axios.post(`${ASSESSMENT_URL}/save-draft`, data),
};

export const reportingService = {
  getPdf: (submissionId) => axios.get(`${REPORTING_URL}/pdf/${submissionId}`, { responseType: 'blob' }),
};

export default api;
