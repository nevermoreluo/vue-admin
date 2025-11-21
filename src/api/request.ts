import axios from 'axios'

// 创建axios实例
const request = axios.create({
  // 基础URL，可以从环境变量或配置中读取
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://192.168.13.200:12101',
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 自动添加token到请求头
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers['sk-token'] = `${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // 统一错误处理
    // 如果token过期或无效，清除token并跳转到登录页
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // 如果不在登录页，则跳转到登录页
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default request
