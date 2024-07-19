import axios from 'axios';

const token = localStorage.getItem('token');

// Функция для загрузки записей с учетом категории
export const loadDreams = async (category: string) => {
  try {
    const response = await axios.post(`/api/dreams/all`, {
      category
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
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
