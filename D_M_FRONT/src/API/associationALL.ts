import axios from 'axios';

export async function fetchAssociations(category: string) {
  try {
    const response = await axios.post('/api/dreams/associationAll', { category });
    console.log('associationALL response:', response);

    const data = response.data; 
    console.log('fetchAssociations response data:', data);

    return data.uniqueAssociations; 
  } catch (error) {
    console.error('Failed to fetch associations:', error);
    return [];
  }
}