// import axios from 'axios'

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   timeout: 10000
// })

// // 请求拦截器
// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('token')
//   if (token) config.headers.Authorization = `Bearer ${token}`
//   return config
// })

// // 响应拦截器
// api.interceptors.response.use(
//   response => response.data,
//   error => {
//     if (error.response?.status === 401) {
//       window.location.href = '/login'
//     }
//     return Promise.reject(error)
//   }
// )







// // export default api
// import axios from 'axios'
// import { filterEmptyValues } from '@/utils/helpers'

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   timeout: 20000,
// })

// // 请求拦截器
// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('token')
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
  
//   // 自动过滤空值参数
//   if (config.params) {
//     config.params = filterEmptyValues(config.params)
//   }
  
//   return config
// })

// // 响应拦截器
// api.interceptors.response.use(
//   response => {
//     return {
//       data: response.data,
//       meta: response.headers['x-pagination']
//     }
//   },
//   error => {
//     const errorMessage = error.response?.data?.message || 
//       error.message || 
//       '请求失败，请检查网络连接'
    
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token')
//       window.location.href = '/login'
//     }

//     return Promise.reject(new Error(errorMessage))
//   }
// )

// export default {
//   // 基础CRUD操作
//   getEvents: (params) => api.get('/events', { params }),
//   getEvent: (id) => api.get(`/events/${id}`),
//   createEvent: (data) => api.post('/events', data),
//   updateEvent: (id, data) => api.patch(`/events/${id}`, data),
//   deleteEvent: (id) => api.delete(`/events/${id}`),

//   // 报名相关
//   registerEvent: (eventId) => api.post(`/events/${eventId}/register`),
//   getRegistrations: (eventId) => api.get(`/events/${eventId}/registrations`),
//   updateRegistrationStatus: (registrationId, status) => 
//     api.patch(`/registrations/${registrationId}`, { status })
// }

// src/api/events.js
import axios from 'axios'

export default axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000
})