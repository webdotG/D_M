import axios from 'axios';

const token = localStorage.getItem('token');

// Функция для поиска по значению и дате
export const searchByValueAndDate = async (
  value: string,
  date: string,
  category: string,
) => {
  console.log('Executing searchByValueAndDate with:', { value, date, category });

  try {
    const response = await axios.post(
      `/api/dreams/search`,
      { value, date, category },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data;
    console.log('Response from searchByValueAndDate:', data);
    return data;
  } catch (error) {
    console.error('Error in searchByValueAndDate:', error);
    throw error;
  }
};

// Функция для поиска по значению
export const searchByValue = async (
  value: string,
  category: string,
) => {
  console.log('Executing searchByValue with:', { value, category });

  try {
    const response = await axios.post(
      `/api/dreams/search`,
      { value, category },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;
    console.log('Response from searchByValue:', data);
    return data;
  } catch (error) {
    console.error('Error in searchByValue:', error);
    throw error;
  }
};

// Функция для поиска по дате
export const searchByDate = async (
  date: string,
  category: string,
) => {
  console.log('Executing searchByDate with:', { date, category });

  try {
    const response = await axios.post(
      `/api/dreams/search`,
      { date, category },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data;
    console.log('Response from searchByDate:', data);
    return data;
  } catch (error) {
    console.error('Error in searchByDate:', error);
    throw error;
  }
};
