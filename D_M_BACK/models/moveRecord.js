import { dbLite } from '../dbLite.js';

export const moveRecordToDifferentCategory = async (tableName, id, category, associations, title, content, isAnalyzed, date) => {
  // Определяем целевую таблицу
  const targetTable = tableName === 'dreams' ? 'memories' : 'dreams';
  console.log(`Перемещение записи: id-${id} из ${targetTable} в ${tableName}`);
  
  try {
    
    // Получаем следующий доступный id в целевой таблице
    const sqlGetNextId = `SELECT MAX(id) + 1 as nextId FROM ${tableName}`;
    const { nextId } = await dbLite.get(sqlGetNextId);
    const newId = nextId || 1; // Если таблица пустая, начать с 1

    // Создаем новую запись в целевой таблице
    const sqlInsert = `
      INSERT INTO ${tableName} (id, category, associations, title, content, isAnalyzed, date, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, DATETIME('now'))
    `;
    await dbLite.run(sqlInsert, [newId, category, associations, title, content, isAnalyzed, date]);
    console.log(`Создана новая запись в ${tableName} с id-${newId}`);

    // Удаляем запись из исходной таблицы
    const sqlDelete = `DELETE FROM ${targetTable} WHERE id = ?`;
    await dbLite.run(sqlDelete, [id]);
    console.log(`Удалена запись из ${targetTable} с id-${id}`);

    return { success: true, message: 'Запись успешно перемещена' };

  } catch (error) {
    console.error('Ошибка при перемещении записи:', error);
    throw new Error('Ошибка при перемещении записи');
  }
};
