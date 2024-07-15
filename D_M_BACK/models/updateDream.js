import { dbLite } from '../dbLite.js';


// Функция для получения следующего доступного id в новой таблице
const getNextAvailableId = async (newTable) => {
    try {
      const result = await dbLite.get(`SELECT MAX(id) as maxId FROM ${newTable}`);
      const maxId = result.maxId || 0; // Если нет записей, начинаем с id 1
      return maxId + 1;
    } catch (error) {
      console.error('Ошибка при получении следующего доступного id:', error);
      throw error;
    }
  };
  

// Обновление записи в текущей таблице
export const updateRecord = async (tableName, id, category, associations, title, content, isAnalyzed, date) => {
  try {
    const columnsToUpdate = [];
    const params = [];

    if (category !== undefined) {
      columnsToUpdate.push('category = ?');
      params.push(category);
    }
    if (associations !== undefined) {
      columnsToUpdate.push('associations = ?');
      params.push(associations);
    }
    if (title !== undefined) {
      columnsToUpdate.push('title = ?');
      params.push(title);
    }
    if (content !== undefined) {
      columnsToUpdate.push('content = ?');
      params.push(content);
    }
    if (isAnalyzed !== undefined) {
      columnsToUpdate.push('isAnalyzed = ?');
      params.push(isAnalyzed);
    }
    if (date !== undefined) {
      columnsToUpdate.push('date = ?');
      params.push(date);
    }

    if (columnsToUpdate.length === 0) {
      throw new Error('Нет данных для обновления');
    }

    const columnsToUpdateStr = columnsToUpdate.join(', ');
    const sql = `
      UPDATE ${tableName}
      SET ${columnsToUpdateStr}
      WHERE id = ?
    `;
    
    params.push(id);
    await dbLite.run(sql, params);
    
    console.log(`Запись с id ${id} успешно обновлена в таблице ${tableName}`);
    
    return { message: "Запись успешно обновлена" };
  } catch (error) {
    console.error(`Ошибка обновления записи с id ${id}:`, error);
    throw error;
  }
};

// Перенос записи из одной таблицы в другую
export const moveRecordToDifferentTable = async (id, currentTable, newTable, associations, title, content, isAnalyzed, date) => {
  try {
    // Удаление записи из текущей таблицы
    await dbLite.run(`DELETE FROM ${currentTable} WHERE id = ?`, [id]);
    console.log(`Запись с id ${id} успешно удалена из таблицы ${currentTable}`);

    // Получение следующего доступного id в новой таблице
    const newId = await getNextAvailableId(newTable);

    // Добавление новой записи в новую таблицу
    const insertSql = `
      INSERT INTO ${newTable} (id, category, associations, title, content, isAnalyzed, date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const insertParams = [newId, associations, title, content, isAnalyzed, date];
    await dbLite.run(insertSql, insertParams);
    console.log(`Запись с id ${newId} успешно добавлена в таблицу ${newTable}`);

    return { message: "Запись успешно обновлена" };
  } catch (error) {
    console.error(`Ошибка перемещения записи с id ${id}:`, error);
    throw error;
  }
};
