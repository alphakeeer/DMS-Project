// import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
//   timeout: 10000,
// });

// // 请求拦截器（处理JWT）
// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('access_token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // 响应拦截器（统一错误处理）
// api.interceptors.response.use(
//   response => response.data,
//   error => {
//     const message = error.response?.data?.message || error.message;
//     return Promise.reject(new Error(message));
//   }
// );

// export default {
//   // 认证相关
//   auth: {
//     login: (data) => api.post('/auth/login', data),
//     register: (data) => api.post('/auth/register', data),
//     update: (data) => api.patch('/auth/update', data),
//     verifyPassword: (password) => api.post('/auth/verify-password', { password })
//   },

//   // 活动相关
//   events: {
//     create: (data) => api.post('/events', data),
//     update: (id, data) => api.patch(`/events/${id}`, data),
//     delete: (id) => api.delete(`/events/${id}`),
//     register: (eventId, data) => api.post(`/events/${eventId}/register`, data),
//     checkIn: (eventId, data) => api.post(`/events/${eventId}/checkin`, data),
//     submitFeedback: (eventId, data) => api.post(`/events/${eventId}/feedback`, data)
//   },

//   // 用户相关
//   user: {
//     getActivities: () => api.get('/user/activities'),
//     getEventStatus: (eventId) => api.get(`/events/${eventId}/status`)
//   }
// };