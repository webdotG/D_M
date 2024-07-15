import { dbLite } from '../dbLite.js';

export const updateRecord = async (tableName, id, category, associations, title, content, isAnalyzed, date) => {
  try {
    const [currentRecord] = await dbLite.all(`SELECT * FROM ${tableName} WHERE id = ?`, [id]);
    if (!currentRecord) {
      throw new Error(`Запись с id ${id} не найдена в таблице ${tableName}`);
    }
    console.log(`Текущая таблица для записи с id ${id}: ${tableName}`);

    const currentTable = tableName;
    const newTable = category === 'сны' ? 'dreams' : 'memories';

    if (currentTable !== newTable) {
      console.log(`Перенос записи с id: ${id} из таблицы: ${currentTable} в таблицу: ${newTable}`);
      
      await dbLite.run(`DELETE FROM ${currentTable} WHERE id = ?`, [id]);
      console.log(`Запись с id: ${id} успешно удалена из таблицы: ${currentTable}`);

      const insertSql = `
        INSERT INTO ${newTable} (id, category, associations, title, content, isAnalyzed, date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const insertParams = [id, category, associations, title, content, isAnalyzed, date];
      console.log(`Добавление новой записи в таблицу: ${newTable} с параметрами:`, insertParams);
      
      await dbLite.run(insertSql, insertParams);
      console.log(`Запись с id ${id} успешно добавлена в таблицу: ${newTable}`);
    } else {
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
      
      console.log(`Запись с id ${id} успешно обновлена`);
    }
  } catch (error) {
    console.error(`Ошибка обновления записи с id ${id}:`, error);
    throw error;
  }
};
