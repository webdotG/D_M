import { dbLite } from '../dbLite.js';

export const updateRecordById = async (tableName, id, associations, title, content, isAnalyzed, date) => {
  console.log(`/patch updateRecord : tableName-${tableName}, id-${id}, associations-${associations}, title-${title}, content-${content}, isAnalyzed-${isAnalyzed}, date-${date}`);

  try {
    // Сначала получаем существующую запись по id
    const sqlGet = `SELECT * FROM ${tableName} WHERE id = ?`;
    const existingRecord = await dbLite.get(sqlGet, [id]);

    if (!existingRecord) {
      throw new Error('Запись не найдена');
    }

    // Проверяем изменения и обновляем только измененные поля
    const updatedFields = {
      associations: associations !== undefined ? associations : existingRecord.associations,
      title: title !== undefined ? title : existingRecord.title,
      content: content !== undefined ? content : existingRecord.content,
      isAnalyzed: isAnalyzed !== undefined ? isAnalyzed : existingRecord.isAnalyzed,
      date: date !== undefined ? date : existingRecord.date,
    };

    // Обновляем запись в базе данных
    const sqlUpdate = `
      UPDATE ${tableName}
      SET associations = ?, title = ?, content = ?, isAnalyzed = ?, date = ?
      WHERE id = ?
    `;

    await dbLite.run(sqlUpdate, [
      updatedFields.associations,
      updatedFields.title,
      updatedFields.content,
      updatedFields.isAnalyzed,
      updatedFields.date,
      id
    ]);

    return { success: true, message: 'Запись успешно обновлена' };

  } catch (error) {
    console.error('Ошибка обновления записи:', error);
    throw new Error('Ошибка обновления записи');
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
