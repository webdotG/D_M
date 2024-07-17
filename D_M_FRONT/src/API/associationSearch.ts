import axios from 'axios';

export async function fetchAssociations(category: string) {
  try {
    const response = await axios.get(`/api/dreams/associationSearch?category=${category}`);
    console.log('associationSearch response.data', response.data);

    // Преобразуем массив массивов в строку через запятую
    const formattedAssociations = response.data.map((assoc: string[]) => assoc.join(', '));
    
    return formattedAssociations;
  } catch (error) {
    console.error('Failed to fetch associations:', error);
    return [];
  }
}
