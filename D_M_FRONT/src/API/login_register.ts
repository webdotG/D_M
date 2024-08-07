import axios from 'axios';
import { useAuthStore } from '../store';

const saveToken = (token: string) => {
  localStorage.setItem('token', token);
  if (token){
    console.log('Токен в LocalStorage ...');
  }
  
};

export const getCurrentUser = async (token: string) => {
  try {
    const response = await axios.get('/api/user/current', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log('Информация о текущем пользователе:', response.data);
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

export const loginUser = async (user_name: string, password: string) => {
  const setAuthenticated = useAuthStore.getState().setAuthenticated;

  try {
    if (!user_name || !password) {
      throw new Error('Имя пользователя и пароль обязательны');
    }

    console.log('Запрос с именем :', user_name);

    const response = await axios.post('/api/user/login/', {
      user_name,
      password,
    });

  

    const { token } = response.data;

    if (token){
      console.log('Token ...');
    }

    saveToken(token);

    // const savedToken = localStorage.getItem('token');
    // console.log('Токен после сохранения в LocalStorage:', savedToken);

    // Запрос информации о пользователе
    const user = await getCurrentUser(token);

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

    const { token } = response.data;
    saveToken(token);

    console.log('Токен после регистрации:', token);

    // Запрос информации о пользователе
    const user = await getCurrentUser(token);

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
