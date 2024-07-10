import axios from 'axios';

const token = localStorage.getItem('token'); 

// запрос с параметром category
export const loadDreams = async (category: string) => {
  try {
    const response = await axios.get(`/api/dreams/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { category }
    });

    if (response.status !== 200) {
      throw new Error(`Error loading records: ${response.statusText}`);
    }

    console.log('Records loaded successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to load records:', error);
    throw error;
  }
};

export const createDream = async (title: string, description: string) => {
  try {
    const response = await axios.post('/api/dreams/add', {
      title,
      description,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('createDream response', response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Обработка ошибки AxiosError
      if (error.response?.data) {
        throw error.response.data;
      } else {
        throw new Error('Unknown Axios Error');
      }
    } else {
      // Обработка других ошибок
      throw error;
    }
  }
};

export const updateDream = async (id: string, title: string, description: string) => {
  try {
    const response = await axios.put(`/api/dreams/${id}`, {
      title,
      description,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('updateDream response', response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Обработка ошибки AxiosError
      if (error.response?.data) {
        throw error.response.data;
      } else {
        throw new Error('Unknown Axios Error');
      }
    } else {
      // Обработка других ошибок
      throw error;
    }
  }
};

export const deleteDream = async (id: string) => {
  try {
    const response = await axios.delete(`/api/dreams/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('deleteDream response', response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Обработка ошибки AxiosError
      if (error.response?.data) {
        throw error.response.data;
      } else {
        throw new Error('Unknown Axios Error');
      }
    } else {
      // Обработка других ошибок
      throw error;
    }
  }
};
