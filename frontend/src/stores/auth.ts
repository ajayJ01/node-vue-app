import { defineStore } from 'pinia';
import api from '../services/api';
import router from '../router';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as any,
        token: '' as string,
    }),
    actions: {
        async login(email: string, password: string) {
            try {
                const res = await api.post('/login', { email, password });
                this.user = res.data.user;
                this.token = res.data.token;
                router.push('/dashboard');
            } catch (err: any) {
                alert(err.response?.data?.message || 'Login failed');
            }
        },

        async register(name: string, email: string, password: string) {
            try {
                const res = await api.post('/register', { name, email, password });
                this.user = res.data.user;
                this.token = res.data.token;
                router.push('/dashboard');
            } catch (err: any) {
                alert(err.response?.data?.message || 'Registration failed');
            }
        },
    },
});
