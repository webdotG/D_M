import axios from 'axios';

const token = localStorage.getItem('token');

export const fetchAssociationsById = async (category: string, recordId: number) => {
  try {
    // Логируем начальные параметры
    console.log(`Запрос ассоциаций для категории: ${category}, recordId: ${recordId}`);
    
    // Выполняем запрос
    const response = await axios.post('/api/dreams/associationId', {
      recordId,
      category
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Логируем статус ответа
    console.log(`Получен статус ответа: ${response.status}`);
    
    // Проверяем статус ответа и логируем данные
    if (response.status !== 200) {
      console.error(`Ошибка при загрузке ассоциаций: ${response.statusText}`);
      throw new Error(`Error loading associations: ${response.statusText}`);
    }
    
    console.log("Полученные ассоциации:", response.data);

    // Возвращаем ассоциации
    return response.data.associations;
  } catch (error) {
    // Логируем ошибку, если она произошла
    console.error('Ошибка при получении ассоциаций:', error);
    return [];
  }
};
