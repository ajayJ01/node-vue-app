import api from './api'

export const request = async (method, url, data = {}, config = {}) => {
  try {
    const token = localStorage.getItem('token')
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData

    const headers = {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
      ...config.headers,
    }

    if (isFormData && headers['Content-Type']) {
      delete headers['Content-Type']
    }
    console.log(data)
    const response = await api({
      method,
      url,
      data,
      headers,
      ...config,
    })

    return [response.data, null]
  } catch (err) {
    const defaultError = {
      success: false,
      message: 'Something went wrong',
      errors: {},
    }

    const errorResponse = err.response?.data || defaultError

    const normalizedError = {
      success: errorResponse.success === false,
      message: errorResponse.message || defaultError.message,
      errors: errorResponse.errors || {},
    }

    return [null, normalizedError]
  }
}
