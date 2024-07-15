import axios from 'axios';

const token = localStorage.getItem('token'); 

export const updateDreamMemories = async (
    id: number,
    category: string,
    associations: string,
    title: string,
    content: string,
    isAnalyzed: boolean,
    date: string) => {
  try {
    console.log('work')
    const response = await axios.patch(`/api/dreams/patch?category=${category}`, {
      id,
      category,
      associations,
      title,
      content,
      isAnalyzed,
      date
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating dream:', error);
    throw error;
  }
};
