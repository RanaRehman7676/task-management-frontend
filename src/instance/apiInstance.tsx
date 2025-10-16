import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
    "ngrok-skip-browser-warning": "69420",
  },
  timeout: 100000000// 10 seconds timeout
})

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    console.error('Response Error:', error)

    if (error.response?.status === 401) {
      localStorage.removeItem('token')

      const currentPath = window.location.pathname
      const isAuthPage = currentPath.startsWith('/auth/')

      if (!isAuthPage) {
        window.location.href = '/auth/login'
      }
    }

    return Promise.reject(error)
  }
)
