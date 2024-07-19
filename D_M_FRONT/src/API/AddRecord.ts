import axios from 'axios';

const token = localStorage.getItem('token');

interface NewDream {
  title: string;
  content: string;
  isAnalyzed: boolean;
  date: string;
  associations: string[]; 
  category: string;
  video?: string; 
  img?: string; 
}

// Функция для добавления записи
export const AddRecord = async (newDream:  NewDream) => {
  console.log('NEW DREAM :', newDream);
  
  try {
    const response = await axios.post(`/api/dreams/add`, {
      title: newDream.title,
      content: newDream.content,
      isAnalyzed: newDream.isAnalyzed,
      date: newDream.date,
      associations: newDream.associations,
      category: newDream.category,
      video: '',
      img: '',
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    if (response.status !== 200) { 
      throw new Error(`Error adding record: ${response.statusText}`);
    }

    console.log('Record added successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to add record:', error);
    throw error;
  }
};
