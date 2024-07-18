import { dbLite } from '../dbLite.js';


export const addRecord = async (tableName, newRecord) => {
  try {
    const columns = Object.keys(newRecord).join(', ');
    const placeholders = Object.keys(newRecord).map(() => '?').join(', ');

    const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
    const values = Object.values(newRecord);

    await dbLite.run(sql, values);

    console.log(`Новая запись добавлена в таблицу ${tableName}`);

    // Возвращаем новую запись, если это необходимо
    return newRecord;
  } catch (error) {
    console.error('Ошибка при добавлении записи:', error);
    throw new Error('Не удалось добавить запись');
  }
};


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
