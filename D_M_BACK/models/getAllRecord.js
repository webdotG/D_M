import { dbLite } from '../dbLite.js';

// Функция для получения всех записей из указанной таблицы
export const getAllRecords = async (tableName) => {
  try {
    // Определение допустимых имен таблиц
    const validTables = ['dreams', 'memories', 'association', 'video', 'img', 'dream_associations', 'memory_associations', 'dream_videos', 'memory_videos', 'dream_imgs', 'memory_imgs'];

    // Проверяем, что tableName соответствует ожидаемым таблицам
    if (!validTables.includes(tableName)) {
      throw new Error(`Invalid table name: ${tableName}. Expected one of ${validTables.join(', ')}`);
    }

    // Выполняем запрос для получения всех записей из указанной таблицы
    const sql = `SELECT * FROM ${tableName}`;
    const rows = await dbLite.all(sql);

    return rows;
  } catch (error) {
    // Логируем ошибку с дополнительной информацией о запросе
    console.error(`Ошибка получения записей из таблицы ${tableName}:`, error);
    throw error;
  }
};
