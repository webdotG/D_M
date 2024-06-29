import axios from 'axios';

export const registerUser = async (user_name: string, user_password: string) => {
  try {
    const response = await axios.post('/api/user/register/', {
      user_name,
      user_password,
    });
    console.log('registerUser response ', response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data) {
        throw error.response.data;
      } else {
        throw new Error('Unknown Axios Error');
      }
    } else {
      throw error;
    }
  }
};

export const loginUser = async (user_name: string, user_password: string) => {
  try {
    const response = await axios.post('/api/user/login/', {
      user_name,
      user_password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data) {
        throw error.response.data;
      } else {
        throw new Error('Unknown Axios Error');
      }
    } else {
      throw error;
    }
  }
};
