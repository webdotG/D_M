import axios from 'axios';

export async function fetchAssociations(category: string) {
  try {
    const response = await axios.get(`/api/dreams/associationSearch?category=${category}`);
    console.log('associationSearch response.data', response.data);

    const data = response.data.map((item: any) => item.associations); // Извлекаем массивы ассоциаций
    console.log('fetchAssociations response data:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch associations:', error);
    return [];
  }
}
