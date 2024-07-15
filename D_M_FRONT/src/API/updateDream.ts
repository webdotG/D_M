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
    
      console.log('incoming data updateDream ... : ', id, category, associations, title, content, isAnalyzed, date)
  
      try {
      console.log('work')
    const response = await axios.patch(`/api/dreams/patch`, {
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
      params: { category }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating dream:', error);
    throw error;
  }
};
