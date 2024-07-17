import { dbLite } from '../dbLite.js';

export const deleteRecordById = async (tableName, id) => {
  try {
    // Удаляем запись из указанной таблицы по id
    const sqlDelete = `DELETE FROM ${tableName} WHERE id = ?`;
    await dbLite.run(sqlDelete, [id]);

    return { success: true, message: `Запись с id-${id} успешно удалена из ${tableName}` };
  } catch (error) {
    console.error('Ошибка при удалении записи:', error);
    throw new Error('Ошибка при удалении записи');
  }
};
