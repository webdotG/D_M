import axios from 'axios';

const token = localStorage.getItem('token');

export const fetchAssociationsById = async (category: string, recordId: number ) => {

  console.log(category, recordId)
  try {
    const response = await axios.post(`/api/dreams/associationId`, {
      recordId,
      category
    }, {
      headers: {
        // 'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status !== 200) {
      throw new Error(`Error loading associations: ${response.statusText}`);
    }

    console.log("Fetched Associations By Id:", response.data);
    return response.data.associations;
  } catch (error) {
    console.error('Ошибка при получении ассоциаций:', error);
    return '';
  }
};

