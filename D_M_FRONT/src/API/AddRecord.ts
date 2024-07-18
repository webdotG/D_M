import axios from 'axios';

const token = localStorage.getItem('token');
// Функция для добавления записи
export const AddRecord = async (newDream) => {
    console.log('NEW DREAM :', newDream)
    try {
      const response = await axios.post(`/api/dreams/add`, {
        title: newDream.title,
        content: newDream.content,
        isAnalyzed: newDream.isAnalyzed,
        date: newDream.date,
        associations: JSON.stringify(newDream.associations),
        video: '',
        img: '',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { category: newDream.category }
      });
  
      if (!response.ok) {
        throw new Error(`Error adding record: ${response.statusText}`);
      }
  
      console.log('Record added successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to add record:', error);
      throw error;
    }
  };
  