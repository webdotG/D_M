import axios from 'axios';

const token = localStorage.getItem('token'); 

export const deleteRecordById = async (category: string, id: number) => {
  try {
    const response = await axios.delete(`/api/dreams/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { category },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении записи:', error);
    throw error;
  }
};

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



