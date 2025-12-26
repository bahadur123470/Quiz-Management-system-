import axios from 'axios';

const AUTH_URL = 'http://localhost:5001/api/auth';
const QUIZ_URL = 'http://localhost:5002/api/quizzes';
const ASSESSMENT_URL = 'http://localhost:5003/api/assessment';
const REPORTING_URL = 'http://localhost:5004/api/reporting';

const api = axios.create({
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      // window.location.href = '/login'; // Optional: auto-redirect
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (data) => api.post(`${AUTH_URL}/login`, data),
  register: (data) => api.post(`${AUTH_URL}/register`, data),
};

export const quizService = {
  getQuizzes: () => api.get(QUIZ_URL),
  createQuiz: (data) => api.post(`${QUIZ_URL}/create`, data),
  deleteQuiz: (id) => api.delete(`${QUIZ_URL}/${id}`),
};

export const assessmentService = {
  submitQuiz: (data) => api.post(`${ASSESSMENT_URL}/submit`, data),
  saveDraft: (data) => api.post(`${ASSESSMENT_URL}/save-draft`, data),
};

export const reportingService = {
  getInstructorStats: () => api.get(`${REPORTING_URL}/instructor-stats`),
  getStudentStats: () => api.get(`${REPORTING_URL}/student-stats`),
  getPdf: (submissionId) => api.get(`${REPORTING_URL}/pdf/${submissionId}`, { responseType: 'blob' }),
};

export default api;
