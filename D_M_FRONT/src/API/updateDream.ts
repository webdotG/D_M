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
      console.log(`Входящие данные /patch : category-${category}, id-${id}, associations-${associations}, title-${title}, content-${content}, isAnalyzed-${isAnalyzed}, date-${date}`);

      try {
      console.log('Запрос /patch ... ')
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
    console.log('Ответ запроса /patch ... :', response.data.message)
    return response.data;

  } catch (error) {
    console.error('Error updating dream:', error);
    throw error;
  }
};
