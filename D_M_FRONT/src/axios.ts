import axios from 'axios';

// Создаем экземпляр axios с настройками по умолчанию
const instance = axios.create({
  baseURL: '/D_M',  
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Добавляем интерсептор запросов
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    token ? console.log('AXIOS LocalStorage TOKEN:') : ''
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('AXIOS Interceptor Error:', error);
    return Promise.reject(error);
  }
);
export default instance;
