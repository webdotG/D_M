import axios from 'axios';

const token = localStorage.getItem('token');

const normalizeCategory = (category: string): string => {
  // Функция для нормализации категории
  if (category === 'сны') {
    return 'сны';
  } else if (category === 'dreams') {
    return 'сны'; 
  } else {
    return 'воспоминания'; // Значение по умолчанию
  }
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

    // Проверяем успешность ответа
    if (response.status !== 200) {
      console.error(`Ошибка при загрузке ассоциаций: ${response.statusText}`);
      throw new Error(`Error loading associations: ${response.statusText}`);
    }

    const associationsData = response.data.associations;
    // Предположим, что ассоциации находятся в поле 'associations'
    const associations = associationsData.associations;
    // Возвращаем ассоциации
    return associations;

  } catch (error) {
    console.error('Ошибка при получении ассоциаций:', error);
    return [];
  }
};
