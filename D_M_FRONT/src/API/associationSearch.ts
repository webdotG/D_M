import axios from 'axios';

export async function fetchAssociations() {
  try {
    const response = await axios.get('/api/dreams/associationSearch');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch associations:', error);
    return [];
  }
}
