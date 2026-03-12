// index.ts
import axios from 'axios';
import { getFromLocalStorage } from "../lib/utils";
import { API_URL } from '../lib/globals';

// Створюємо окрему функцію для логауту, яку можна використовувати поза React компонентами
let logoutFunction: (() => void) | null = null;

// Функція для встановлення логауту з хука
export const setLogoutFunction = (logout: () => void) => {
  logoutFunction = logout;
};

export const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getFromLocalStorage<string>("token")}`;
  return config;
});

$api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (logoutFunction) {
        logoutFunction();
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);