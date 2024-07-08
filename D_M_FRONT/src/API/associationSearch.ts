import axios from 'axios';

export async function fetchAssociations(category: string) {
  try {
    const response = await axios.get(`/api/dreams/associationSearch?category=${category}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch associations:', error);
    return [];
  }
}
