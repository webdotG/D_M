import axios from 'axios';

// Функция для сохранения токена в localStorage
const saveToken = (token: string) => {
  localStorage.setItem('token', token);
  console.log('Login_Register LocalStorage GetItem ... >>> ... ', localStorage.getItem('token'))
};


export const registerUser = async (user_name: string, user_password: string) => {
  try {
    if (!user_name || !user_password) {
      throw new Error('Имя пользователя и пароль обязательны');
    }

    const response = await axios.post('/api/user/register/', {
      user_name,
      user_password,
    });

    saveToken(response.data.token);

    console.log('registerUser response', response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data) {
        throw error.response.data;
      } else {
        throw new Error('Неизвестная ошибка Axios');
      }
    } else {
      throw error;
    }
  }
};

export const loginUser = async (user_name: string, user_password: string) => {
  try {
    if (!user_name || !user_password) {
      throw new Error('Имя пользователя и пароль обязательны');
    }

    const response = await axios.post('/api/user/login/', {
      user_name,
      user_password,
    });
    console.log('API/USER/LOGIN response.data.token ... : ', response.data.token)
    saveToken(response.data.token);
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data) {
        throw error.response.data;
      } else {
        throw new Error('Неизвестная ошибка Axios');
      }
    } else {
      throw error;
    }
  }
};
