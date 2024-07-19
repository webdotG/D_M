import axios from 'axios';

export async function fetchAssociations(category: string) {
  try {
    
    const response = await axios.post('/api/dreams/associationSearch', { category });
    console.log('associationSearch response.data', response.data);

    const data = response.data; 
    console.log('fetchAssociations response data:', data);

    return data;
  } catch (error) {
    console.error('Failed to fetch associations:', error);
    return [];
  }
}
