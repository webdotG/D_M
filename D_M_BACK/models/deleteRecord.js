import { dbLite } from '../dbLite.js';

const deleteRecordById = async (tableName, id) => {
  const db = await dbLite;

  try {
    // Удаляем запись из основной таблицы
    await db.run(`DELETE FROM ${tableName} WHERE id = ?`, [id]);

    // Получаем все ассоциации, связанные с удаляемой записью
    const associationTable = tableName === 'dreams' ? 'dream_associations' : 'memory_associations';
    const associatedIds = await db.all(`SELECT association_id FROM ${associationTable} WHERE ${tableName.slice(0, -1)}_id = ?`, [id]);

    for (const row of associatedIds) {
      const { association_id } = row;

      // Проверяем, используется ли ассоциация в других записях
      const count = await db.get(`SELECT COUNT(*) as count FROM ${associationTable} WHERE association_id = ?`, [association_id]);

      if (count.count === 0) {
        // Если ассоциация не используется, удаляем её
        await db.run('DELETE FROM association WHERE id = ?', [association_id]);
      }

      // Удаляем запись из таблицы связей
      await db.run(`DELETE FROM ${associationTable} WHERE ${tableName.slice(0, -1)}_id = ? AND association_id = ?`, [id, association_id]);
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting record and associated data:', error);
    throw error;
  }
};

export { deleteRecordById };
