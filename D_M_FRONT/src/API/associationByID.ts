import axios from 'axios';

const token = localStorage.getItem('token');

const normalizeCategory = (category: string) => {
  // Функция для нормализации категории
  return category === 'dreams' ? 'сны' : 'воспоминания';
};

export const fetchAssociationsById = async (category: string, recordId: number) => {
  try {
    // Нормализуем категорию перед отправкой запроса
    const normalizedCategory = normalizeCategory(category);

    console.log(`Запрос ассоциаций для категории: ${normalizedCategory}, recordId: ${recordId}`);
    
    const response = await axios.post('/api/dreams/associationId', {
      recordId,
      category: normalizedCategory, 
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log("Полученные данные:", response.data);
    if (response.status !== 200) {
      console.error(`Ошибка при загрузке ассоциаций: ${response.statusText}`);
      throw new Error(`Error loading associations: ${response.statusText}`);
    }

    const associationsData = response.data.associations;
    // Если это объект с полем associations как строка
    const associations = associationsData.associations;
    console.log("Ассоциации :", associations);
    return associations;

  } catch (error) {
    console.error('Ошибка при получении ассоциаций:', error);
    return [];
  }
};
