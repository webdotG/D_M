import { dbLite } from '../dbLite.js';

const deleteRecordById = async (tableName, id) => {
  const db = await dbLite;

  try {
    // Удаляем запись из основной таблицы
    await db.run(`DELETE FROM ${tableName} WHERE id = ?`, [id]);

    // Определяем таблицу и столбец для ассоциаций
    let associationTable;
    let columnId;

    // Устанавливаем соответствие между таблицами и колонками
    if (tableName === 'dreams') {
      associationTable = 'dream_associations';
      columnId = 'dream_id';
    } else if (tableName === 'memories') {
      associationTable = 'memory_associations';
      columnId = 'memory_id';
    } else {
      throw new Error('Unknown table name');
    }

    // Получаем все ассоциации, связанные с удаляемой записью
    const associatedIds = await db.all(`SELECT association_id FROM ${associationTable} WHERE ${columnId} = ?`, [id]);

    for (const row of associatedIds) {
      const { association_id } = row;

      // Проверяем, используется ли ассоциация в других записях
      const count = await db.get(`SELECT COUNT(*) as count FROM ${associationTable} WHERE association_id = ? AND ${columnId} != ?`, [association_id, id]);

      if (count.count === 0) {
        // Если ассоциация не используется, удаляем её
        await db.run('DELETE FROM association WHERE id = ?', [association_id]);
      }

      // Удаляем запись из таблицы связей
      await db.run(`DELETE FROM ${associationTable} WHERE ${columnId} = ? AND association_id = ?`, [id, association_id]);
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting record and associated data:', error);
    throw error;
  }
};

export { deleteRecordById };
