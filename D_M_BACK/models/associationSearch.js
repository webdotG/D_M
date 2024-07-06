import { dbLite } from '../dbLite.js';

export const associationSearch = async () => {
  try {
    const sql = `SELECT associations FROM dreams WHERE associations != ''`;
    console.log('SQL запрос:', sql);

    const rows = await dbLite.all(sql);
    console.log('Результаты запроса rows from dreams:', rows);

    // Обработка данных без JSON.parse
    const associationsList = rows.map(row => row.associations.split(',').map(item => item.trim()));
    console.log('Обработанный список ассоциаций:');
    console.log(associationsList);

    return associationsList;
  } catch (error) {
    console.error('Ошибка получения ассоциаций:', error);
    throw error;
  }
};
