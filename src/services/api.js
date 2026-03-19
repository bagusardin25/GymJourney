import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
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

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  getMembers: () => api.get('/auth/members'),
};

// Classes APIs
export const classesAPI = {
  getAll: (category) => api.get('/classes', { params: { category } }),
  getById: (id) => api.get(`/classes/${id}`),
  create: (classData) => api.post('/classes', classData),
  update: (id, classData) => api.put(`/classes/${id}`, classData),
  delete: (id) => api.delete(`/classes/${id}`),
};

// Bookings APIs
export const bookingsAPI = {
  getMyBookings: () => api.get('/bookings/my-bookings'),
  bookClass: (classId) => api.post('/bookings/book', { classId }),
  cancelBooking: (classId) => api.delete(`/bookings/cancel/${classId}`),
  getAllBookings: () => api.get('/bookings'),
};

// Payments APIs
export const paymentsAPI = {
  getMyPayments: () => api.get('/payments/my-payments'),
  getAll: () => api.get('/payments'),
  create: (paymentData) => api.post('/payments', paymentData),
  update: (id, data) => api.put(`/payments/${id}`, data),
};

// Testimonials APIs
export const testimonialsAPI = {
  getAll: () => api.get('/testimonials'),
};

export default api;
