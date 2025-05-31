import api from './api'

export const request = async (method, url, data = {}, config = {}) => {
    try {
        const res = await api({
            method,
            url,
            data,
            ...config
        })
        return [res.data, null]

    } catch (err) {
        const defaultError = {
            success: false,
            message: 'Something went wrong',
            errors: {}
        }

        // Extract backend error response or use default
        const errorResponse = err.response?.data || defaultError

        // Prepare a normalized error object
        const normalizedError = {
            success: errorResponse.success === false,
            message: errorResponse.message || defaultError.message,
            errors: errorResponse.errors || {}
        }

        return [null, normalizedError]
    }
}
