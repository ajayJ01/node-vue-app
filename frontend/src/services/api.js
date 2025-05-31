import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/',
    headers: {
        'Content-Type': 'application/json'
    },
    validateStatus: function (status) {
        return status >= 200 && status < 300; // accept 201, 204 etc as success
    }
})

export default api