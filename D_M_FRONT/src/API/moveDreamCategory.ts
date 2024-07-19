import axios from 'axios';

const token = localStorage.getItem('token'); 

export const moveDreamToDifferentCategory = async (
  id: number,
  category: string,
  associations: string[], 
  title: string,
  content: string,
  isAnalyzed: boolean,
  date: string
) => {

  const currentDate = date || new Date().toISOString().split('T')[0]; // Используем текущее время, если date равно нулю
  console.log('Входящие данные на /move ... : ', id, category, associations, title, content, isAnalyzed, date)

  try {
    const response = await axios.patch(`/api/dreams/move`, {
      id,
      category,
      associations,
      title,
      content,
      isAnalyzed,
      date: currentDate
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
