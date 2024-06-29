
import axios from 'axios';

export const registerUser = async (use_rname: string, user_password: string) => {
  try {
    const response = await axios.post('/api/user/register/', {
      use_rname,
      user_password,
    });
    console.log('registerUser response ', response)
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const loginUser = async (use_rname: string, user_password: string) => {
  try {
    const response = await axios.post('/api/user/login/', {
      use_rname,
      user_password,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
