import axios from 'axios';

// запрос с параметром category
export const loadDreams = async (category: string) => {
  try {
    const response = await fetch(`/api/dreams/all?category=${category}`);
    if (!response.ok) {
      throw new Error(`Error loading records: ${response.statusText}`);
    }
    const records = await response.json();
    console.log('Records loaded successfully:', records);
    return records;
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
    });
    console.log('createDream response ', response);
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
    });
    console.log('updateDream response ', response);
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
    const response = await axios.delete(`/api/dreams/${id}`);
    console.log('deleteDream response ', response);
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
