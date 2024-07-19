import axios from 'axios';

const token = localStorage.getItem('token');

// Функция для удаления записи по ID с учетом категории
export const deleteRecordById = async (category: string, id: number) => {
  try {
    const response = await axios.post(`/api/dreams/delete`, {
      id,
      category
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении записи:', error);
    throw error;
  }
};