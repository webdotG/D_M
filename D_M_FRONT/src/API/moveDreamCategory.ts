import axios from 'axios';

const token = localStorage.getItem('token'); 

export const moveDreamToDifferentCategory = async (
  id: number,
  category: string,
  associations: string,
  title: string,
  content: string,
  isAnalyzed: boolean,
  date: string
) => {
  try {
    const response = await axios.patch(`/api/dreams/patch`, {
      id,
      associations,
      title,
      content,
      isAnalyzed,
      date
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { category }
    });
    return response.data;
  } catch (error) {
    console.error('Error moving dream to different category:', error);
    throw error;
  }
};
