import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/',
    validateStatus: function (status) {
        return status >= 200 && status < 300;
    }
});

export default api;