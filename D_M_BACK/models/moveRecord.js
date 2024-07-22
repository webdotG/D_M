import { dbLite } from '../dbLite.js';

export const moveRecordToDifferentCategory = async (tableName, id, category, associations, title, content, isAnalyzed, date) => {
  // Определяем целевую таблицу и соответствующие таблицы для ассоциаций, видео и изображений
  const targetTable = tableName === 'dreams' ? 'memories' : 'dreams';
  const sourceAssociationTable = tableName === 'dreams' ? 'dream_associations' : 'memory_associations';
  const targetAssociationTable = tableName === 'dreams' ? 'memory_associations' : 'dream_associations';
  const sourceVideoTable = tableName === 'dreams' ? 'dream_videos' : 'memory_videos';
  const targetVideoTable = tableName === 'dreams' ? 'memory_videos' : 'dream_videos';
  const sourceImgTable = tableName === 'dreams' ? 'dream_imgs' : 'memory_imgs';
  const targetImgTable = tableName === 'dreams' ? 'memory_imgs' : 'dream_imgs';

  const db = await dbLite;

  try {
    // Используем текущее время, если date равно нулю
    const currentDate = date || new Date().toISOString().split('T')[0];

    // Получаем следующий доступный id в целевой таблице
    const sqlGetNextId = `SELECT COALESCE(MAX(id), 0) + 1 AS nextId FROM ${targetTable}`;
    const { nextId } = await db.get(sqlGetNextId);
    const newId = nextId || 1; // Если таблица пустая, начать с 1

    // Преобразуем ассоциации в массив идентификаторов
    const associationIds = associations.map(id => parseInt(id.trim(), 10));

    // Создаем новую запись в целевой таблице
    const sqlInsert = `
      INSERT INTO ${targetTable} (id, category, title, content, isAnalyzed, date, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, DATETIME('now'))
    `;
    await db.run(sqlInsert, [newId, category, title, content, isAnalyzed, currentDate]);
    console.log(`Создана новая запись в ${targetTable} с id-${newId}`);

    // Перенос ассоциаций
    for (const association_id of associationIds) {
      await db.run(`INSERT INTO ${targetAssociationTable} (${targetTable.slice(0, -1)}_id, association_id) VALUES (?, ?)`, [newId, association_id]);
    }

    // Перенос видео
    const videosList = await db.all(`SELECT video_id FROM ${sourceVideoTable} WHERE ${tableName.slice(0, -1)}_id = ?`, [id]);
    for (const row of videosList) {
      const { video_id } = row;
      await db.run(`INSERT INTO ${targetVideoTable} (${targetTable.slice(0, -1)}_id, video_id) VALUES (?, ?)`, [newId, video_id]);
    }

    // Перенос изображений
    const imgsList = await db.all(`SELECT img_id FROM ${sourceImgTable} WHERE ${tableName.slice(0, -1)}_id = ?`, [id]);
    for (const row of imgsList) {
      const { img_id } = row;
      await db.run(`INSERT INTO ${targetImgTable} (${targetTable.slice(0, -1)}_id, img_id) VALUES (?, ?)`, [newId, img_id]);
    }

    // Удаляем запись из исходной таблицы
    const sqlDelete = `DELETE FROM ${tableName} WHERE id = ?`;
    await db.run(sqlDelete, [id]);
    console.log(`Удалена запись из ${tableName} с id-${id}`);

    // Удаляем связанные данные из исходных таблиц
    await db.run(`DELETE FROM ${sourceAssociationTable} WHERE ${tableName.slice(0, -1)}_id = ?`, [id]);
    await db.run(`DELETE FROM ${sourceVideoTable} WHERE ${tableName.slice(0, -1)}_id = ?`, [id]);
    await db.run(`DELETE FROM ${sourceImgTable} WHERE ${tableName.slice(0, -1)}_id = ?`, [id]);

    return { success: true, message: 'Запись успешно перемещена' };

  } catch (error) {
    console.error('Ошибка при перемещении записи:', error);
    throw new Error('Ошибка при перемещении записи');
  }
};
