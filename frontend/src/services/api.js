import axios from 'axios';
import router from '@/router'
import { toast } from 'vue3-toastify'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/',
  validateStatus: function (status) {
    return status >= 200 && status < 300;
  }
});

api.interceptors.response.use(
  response => response,
  error => {
    const code = error.response?.data?.code

    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      if (code === 'TOKEN_EXPIRED') {
        router.push('/login?reason=expired')
      } else if (code === 'INVALID_TOKEN') {
        router.push('/login?reason=invalid')
      } else if (code === 'NO_TOKEN') {
        router.push('/login?reason=no_token')
      }
    }

    return Promise.reject(error)
  }
)

export default api;