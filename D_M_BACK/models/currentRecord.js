import { dbLite } from '../dbLite.js';

// Функция для получения конкретной записи по ID и категории
export const getCurrentRecord = async (tableName, id) => {
  try {
    if (tableName !== 'dreams' && tableName !== 'memories') {
      throw new Error('Invalid category');
    }

    // Запрос для получения записи по ID
    const sql = `SELECT * FROM ${tableName} WHERE id = ?`;
    const params = [id];

    console.log('Executing SQL:', sql);
    console.log('With parameters:', params);

    const rows = await dbLite.all(sql, params);

    // Проверяем, найдена ли запись
    if (rows.length === 0) {
      throw new Error('Record not found');
    }

    return rows[0]; // Возвращаем первую запись
  } catch (error) {
    console.error('Ошибка при получении записи:', error);
    throw error;
  }
};
