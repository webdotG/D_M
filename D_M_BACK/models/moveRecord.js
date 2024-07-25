import { dbLite } from '../dbLite.js';

export const moveRecordToDifferentCategory = async (tableName, id, category, associations, title, content, isAnalyzed, date) => {
  // Определяем целевую таблицу и соответствующие таблицы для ассоциаций
  const targetTable = tableName === 'dreams' ? 'memories' : 'dreams';
  const sourceAssociationTable = tableName === 'dreams' ? 'dream_associations' : 'memory_associations';
  const targetAssociationTable = tableName === 'dreams' ? 'memory_associations' : 'dream_associations';

  const db = await dbLite;

  try {
    // Используем текущее время, если date равно нулю
    const currentDate = date || new Date().toISOString().split('T')[0];

    // Получаем следующий доступный id в целевой таблице
    const sqlGetNextId = `SELECT COALESCE(MAX(id), 0) + 1 AS nextId FROM ${targetTable}`;
    const { nextId } = await db.get(sqlGetNextId);
    const newId = nextId || 1; // Если таблица пустая, начать с 1

    // Преобразуем ассоциации в массив идентификаторов
    const associationIds = associations.split(','); // Считаем, что ассоциации переданы в виде строки, разделенной запятыми

    // Создаем новую запись в целевой таблице
    const sqlInsert = `
      INSERT INTO ${targetTable} (id, category, title, content, isAnalyzed, date, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, DATETIME('now'))
    `;
    await db.run(sqlInsert, [newId, category, title, content, isAnalyzed, currentDate]);
    console.log(`Создана новая запись в ${targetTable} с id-${newId}`);

    // Перенос ассоциаций
    for (const association_id of associationIds) {
      // Проверяем, существует ли ассоциация в целевой таблице
      const sqlCheckAssociation = `SELECT id FROM association WHERE link = (SELECT link FROM association WHERE id = ?)`;
      const existingAssociation = await db.get(sqlCheckAssociation, [association_id]);

      let newAssociationId;
      if (existingAssociation) {
        // Используем существующую ассоциацию
        newAssociationId = existingAssociation.id;
      } else {
        // Создаем новую ассоциацию
        const sqlGetNextAssociationId = `SELECT COALESCE(MAX(id), 0) + 1 AS nextId FROM association`;
        const { nextId: newAssocId } = await db.get(sqlGetNextAssociationId);
        newAssociationId = newAssocId || 1;
        const sqlInsertAssociation = `INSERT INTO association (id, link) VALUES (?, (SELECT link FROM association WHERE id = ?))`;
        await db.run(sqlInsertAssociation, [newAssociationId, association_id]);
      }

      // Привязываем новую запись к ассоциации
      await db.run(`INSERT INTO ${targetAssociationTable} (${targetTable.slice(0, -1)}_id, association_id) VALUES (?, ?)`, [newId, newAssociationId]);
    }

    // Удаляем запись из исходной таблицы
    const sqlDelete = `DELETE FROM ${tableName} WHERE id = ?`;
    await db.run(sqlDelete, [id]);
    console.log(`Удалена запись из ${tableName} с id-${id}`);

    // Удаляем связанные данные из исходных таблиц
    const sourceColumn = tableName === 'dreams' ? 'dream_id' : 'memory_id';
    await db.run(`DELETE FROM ${sourceAssociationTable} WHERE ${sourceColumn} = ?`, [id]);

    // Проверяем и удаляем неиспользуемые ассоциации
    for (const association_id of associationIds) {
      const sqlCheckUsage = `SELECT COUNT(*) as count FROM ${sourceAssociationTable} WHERE association_id = ?`;
      const { count } = await db.get(sqlCheckUsage, [association_id]);
      if (count === 0) {
        await db.run(`DELETE FROM association WHERE id = ?`, [association_id]);
      }
    }

    return { success: true, message: 'Запись успешно перемещена' };

  } catch (error) {
    console.error('Ошибка при перемещении записи:', error);
    throw new Error('Ошибка при перемещении записи');
  }
};
