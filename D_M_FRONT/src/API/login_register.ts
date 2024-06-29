
import axios from 'axios';

export const registerUser = async (username: string, password: string) => {
  try {
    const response = await axios.post('/api/user/register', {
      username,
      password,
    });
    console.log('registerUser response ', response)
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await axios.post('/api/user/login', {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
