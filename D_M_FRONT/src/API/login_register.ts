import axios from 'axios';
import { useAuthStore } from '../store';

// Тип для пользователя
interface User {
  id: number;
  userName: string;
  email: string;
  dateOfBirth: string;
}

// Тип для токена
type Token = string;

// Функция для сохранения токена
const saveToken = (token: Token) => {
  localStorage.setItem('token', token);
  if (token) {
    console.log('Токен сохранен в LocalStorage');
  }
};

// Функция для сохранения пользователя (без токена)
const saveUser = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
  if (user) {
    console.log('Информация о пользователе сохранена в LocalStorage');
  }
};

export const getCurrentUser = async (token: string) => {
  try {
    const response = await axios.get('/api/user/current', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Информация о текущем пользователе:', response.data);

    // Обновление состояния в сторе
    useAuthStore.getState().setAuthenticated(true, token);

    // Сохранение токена и пользователя в localStorage
    saveToken(token);
    saveUser(response.data);

    return response.data;
  } catch (error) {
    console.error('Ошибка при получении информации о текущем пользователе:', error.message);

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

export const loginUser = async (userName: string, password: string) => {
  const setAuthenticated = useAuthStore.getState().setAuthenticated;

  try {
    if (!userName || !password) {
      throw new Error('Имя пользователя и пароль обязательны');
    }

    const response = await axios.post('/api/user/login/', {
      user_name: userName,
      password,
    });

    const { token } = response.data;

    if (token) {
      console.log('Токен после входа:', token);
    }

    saveToken(token);

    // Запрос информации о пользователе
    const user = await getCurrentUser(token);

    // Сохранение данных в store
    setAuthenticated(true, token);

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

export const registerUser = async (userName: string, password: string, email: string, dateOfBirth: string) => {
  const setAuthenticated = useAuthStore.getState().setAuthenticated;

  try {
    if (!userName || !password || !email || !dateOfBirth) {
      throw new Error('Имя пользователя, пароль, email и дата рождения обязательны');
    }

    const response = await axios.post('/api/user/register/', {
      user_name: userName,
      password,
      email,
      date_of_birth: dateOfBirth,
    });

    console.log('Ответ от сервера (регистрация):', response.data);

    const { token } = response.data;
    saveToken(token);

    console.log('Токен после регистрации:', token);

    // Запрос информации о пользователе
    const user = await getCurrentUser(token);

    // Сохранение данных в store
    setAuthenticated(true, token);

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
