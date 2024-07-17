import { dbLite } from '../dbLite.js';

export const moveRecordToDifferentCategory = async (tableName, id, category, associations, title, content, isAnalyzed, date) => {
  // Определяем целевую таблицу
  const targetTable = tableName === 'dreams' ? 'memories' : 'dreams';
  console.log(`Перемещение записи: id-${id} из ${targetTable} в ${tableName}`);
  
  try {
    // Используем текущее время, если date равно нулю
    const currentDate = date || new Date().toISOString().split('T')[0]; 

    // Получаем следующий доступный id в целевой таблице
    const sqlGetNextId = `SELECT MAX(id) + 1 as nextId FROM ${tableName}`;
    const { nextId } = await dbLite.get(sqlGetNextId);
    const newId = nextId || 1; // Если таблица пустая, начать с 1

    // Преобразуем ассоциации в JSON-строку
    const associationsJson = JSON.stringify(associations.split(','));

    // Создаем новую запись в целевой таблице
    const sqlInsert = `
      INSERT INTO ${tableName} (id, category, associations, title, content, isAnalyzed, date, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, DATETIME('now'))
    `;
    await dbLite.run(sqlInsert, [newId, category, associationsJson, title, content, isAnalyzed, currentDate]);
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
