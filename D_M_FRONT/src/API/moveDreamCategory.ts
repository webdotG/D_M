import axios from 'axios';

const token = localStorage.getItem('token'); 

export const moveDreamToDifferentCategory = async (
  id: number,
  newCategory: string,
  associations: string,
  title: string,
  content: string,
  isAnalyzed: boolean,
  date: string
) => {
  try {
    const response = await axios.patch(`/api/dreams/patch`, {
      id,
      newCategory,
      associations,
      title,
      content,
      isAnalyzed,
      date
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error moving dream to different category:', error);
    throw error;
  }
};
