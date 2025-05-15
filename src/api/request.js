import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 响应拦截器
instance.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default instance



// import axios from 'axios';

// const instance = axios.create({
//   baseURL: 'http://localhost:5000/api', // Flask 默认端口
//   timeout: 10000,
// });

// // 请求拦截器 - 添加JWT
// instance.interceptors.request.use(config => {
//   const token = localStorage.getItem('access_token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // 响应拦截器 - 错误处理
// instance.interceptors.response.use(
//   response => response.data,
//   error => Promise.reject(error.response?.data || error.message)
// );

// export default instance;