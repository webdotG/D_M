import axios from 'axios';
import { useAuthStore } from '../store'; 

// Функция для сохранения токена в localStorage
const saveToken = (token: string) => {
  localStorage.setItem('token', token);
  console.log('Токен сохранен в LocalStorage:', localStorage.getItem('token'));
};

export const loginUser = async (user_name: string, password: string) => {
  const setAuthenticated = useAuthStore.getState().setAuthenticated;

  try {
    if (!user_name || !password) {
      throw new Error('Имя пользователя и пароль обязательны');
    }

    console.log('Отправка запроса на вход с именем пользователя:', user_name);

    const response = await axios.post('/api/user/login/', {
      user_name,
      password,
    });

    console.log('Ответ от сервера (логин):', response.data);

    const { token, user } = response.data;
    saveToken(token);

    const savedToken = localStorage.getItem('token');
    console.log('Токен после сохранения в LocalStorage:', savedToken);

    console.log('Информация о пользователе:', user);

    // Сохранение данных в store
    setAuthenticated(true, token, user);

    return { token, user };
  } catch (error) {
    console.error('Ошибка при попытке входа:', error.message);

    if (axios.isAxiosError(error)) {
      if (error.response?.data) {
        console.error('Ошибка от сервера:', error.response.data);
        throw error.response.data;
      } else {
        throw new Error('Неизвестная ошибка Axios');
      }
    } else {
      throw error;
    }
  }
};

export const registerUser = async (user_name: string, password: string, email: string, date_of_birth: string) => {
  const setAuthenticated = useAuthStore.getState().setAuthenticated;

  try {
    if (!user_name || !password || !email || !date_of_birth) {
      throw new Error('Имя пользователя, пароль, email и дата рождения обязательны');
    }

    console.log('Отправка запроса на регистрацию с именем пользователя:', user_name);

    const response = await axios.post('/api/user/register/', {
      user_name,
      password,
      email,
      date_of_birth,
    });

    console.log('Ответ от сервера (регистрация):', response.data);

    const { token, user } = response.data;
    saveToken(token);

    console.log('Токен после регистрации:', token);
    console.log('Информация о пользователе:', user);

    // Сохранение данных в store
    setAuthenticated(true, token, user);

    return { token, user };
  } catch (error) {
    console.error('Ошибка при попытке регистрации:', error.message);

    if (axios.isAxiosError(error)) {
      if (error.response?.data) {
        console.error('Ошибка от сервера:', error.response.data);
        throw error.response.data;
      } else {
        throw new Error('Неизвестная ошибка Axios');
      }
    } else {
      throw error;
    }
  }
};
