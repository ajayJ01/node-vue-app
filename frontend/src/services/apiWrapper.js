import api from './api'

export const request = async (method, url, data = {}, config = {}) => {
    try {

        const token = localStorage.getItem('token')
        const headers = {
            Authorization: token ? `Bearer ${token}` : undefined,
            ...config.headers,
        }

        const res = await api({
            method,
            url,
            data,
            ...config,
            headers,
        })

        return [res.data, null]

    } catch (err) {
        const defaultError = {
            success: false,
            message: 'Something went wrong',
            errors: {}
        }

        const errorResponse = err.response?.data || defaultError

        const normalizedError = {
            success: errorResponse.success === false,
            message: errorResponse.message || defaultError.message,
            errors: errorResponse.errors || {}
        }

        return [null, normalizedError]
    }
}