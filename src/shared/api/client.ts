/**
 * API Client
 * Configured axios instance for backend API communication
 */

import axios, { AxiosError } from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import type { APIError } from './types'

// Базовый URL из переменных окружения
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

/**
 * Создание axios instance с базовой конфигурацией
 * Requirements: 1.1, 1.2, 13.1, 13.2, 13.3
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false
})

/**
 * Request interceptor для логирования в development режиме
 * Requirements: 1.4
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
    }
    return config
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

/**
 * Response interceptor для логирования и обработки ошибок
 * Requirements: 1.3
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.url}`, response.data)
    }
    return response
  },
  (error: AxiosError) => {
    const apiError = handleAPIError(error)
    console.error('[API Error]', apiError)
    return Promise.reject(apiError)
  }
)

/**
 * Обработка ошибок API с понятными сообщениями
 * Requirements: 9.1, 9.2, 9.3, 9.4, 13.4
 * 
 * @param error - Ошибка axios
 * @returns Структурированная ошибка API
 */
export const handleAPIError = (error: AxiosError): APIError => {
  if (error.response) {
    // Сервер ответил с ошибкой
    const status = error.response.status
    
    switch (status) {
      case 404:
        return {
          message: 'Данные не найдены',
          status,
          code: 'NOT_FOUND'
        }
      case 500:
        return {
          message: 'Ошибка сервера',
          status,
          code: 'SERVER_ERROR'
        }
      default:
        return {
          message: (error.response.data as any)?.message || 'Произошла ошибка',
          status,
          code: 'API_ERROR'
        }
    }
  } else if (error.request) {
    // Запрос был сделан, но ответа не получено
    if (error.code === 'ECONNABORTED') {
      return {
        message: 'Превышено время ожидания',
        code: 'TIMEOUT'
      }
    }
    
    // Проверка на CORS ошибку
    if (error.message.includes('Network Error') || error.message.includes('CORS')) {
      return {
        message: 'Ошибка подключения к серверу. Проверьте настройки CORS на бэкенде.',
        code: 'CORS_ERROR'
      }
    }
    
    return {
      message: 'Ошибка подключения к серверу',
      code: 'NETWORK_ERROR'
    }
  } else {
    // Ошибка при настройке запроса
    return {
      message: error.message || 'Неизвестная ошибка',
      code: 'UNKNOWN_ERROR'
    }
  }
}
