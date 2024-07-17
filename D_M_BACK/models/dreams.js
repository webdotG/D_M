import { dbLite } from '../dbLite.js';

export const getAllRecords = async (tableName) => {
  try {
    const sql = `SELECT * FROM ${tableName}`;
    const rows = await dbLite.all(sql);
    return rows;
  } catch (error) {
    console.error('Ошибка получения записей:', error);
    throw error;
  }
};

export async function getCurrentRecord(tableName, id) {
  try {
    const sql = `SELECT * FROM ${tableName} WHERE id = ?`;
    const record = await dbLite.get(sql, [id]);

    if (!record) {
      return { error: 'Запись не найдена' };
    }

    console.log(`Запрос выполнен: Получение записи с ID ${id} из таблицы ${tableName}`);
    return record;
  } catch (error) {
    console.error('Ошибка получения записи:', error);
    throw new Error('Не удалось получить запись');
  }
}
