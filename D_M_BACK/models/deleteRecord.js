import { dbLite } from '../dbLite.js';

export const deleteRecordById = async (tableName, id) => {
  try {
    // Удаление записи из основной таблицы
    await dbLite.run(`DELETE FROM ${tableName} WHERE id = ?`, [id]);

    // Если нужно удалить связанные записи из других таблиц, добавьте код здесь

    return { success: true };
  } catch (error) {
    console.error('Error in deleteRecordById:', error);
    throw error;
  }
};

