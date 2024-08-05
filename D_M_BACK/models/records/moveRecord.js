import { dbLite } from '../../dbLite.js';

export const moveRecordToDifferentCategory = async (tableName, id, associations, title, content, isAnalyzed, date) => {
  // Определяем целевую таблицу и таблицы ассоциаций
  const targetTable = tableName === 'dreams' ? 'dreams' : 'memories';
  const targetAssociationTable = tableName === 'dreams' ? 'dream_associations' : 'memory_associations';
  const targetColumnId = tableName === 'dreams' ? 'dream_id' : 'memory_id';

  const db = await dbLite;

  try {
    // Используем текущее время, если date равно нулю
    const currentDate = date || new Date().toISOString().split('T')[0];

    // Получаем следующий доступный id в целевой таблице
    const sqlGetNextId = `SELECT COALESCE(MAX(id), 0) + 1 AS nextId FROM ${targetTable}`;
    const { nextId } = await db.get(sqlGetNextId);
    const newId = nextId || 1;

    // Ассоциации как строка
    const associationId = associations.trim();

    // Логирование значений перед вставкой
    console.log('Подготовка к вставке новой записи:');
    console.log(`ID: ${newId}`);
    console.log(`Category: ${targetTable}`);
    console.log(`Title: ${title}`);
    console.log(`Content: ${content}`);
    console.log(`isAnalyzed: ${isAnalyzed}`);
    console.log(`Date: ${currentDate}`);

    // Создаем новую запись в целевой таблице
    const sqlInsert = `
      INSERT INTO ${targetTable} (id, category, title, content, isAnalyzed, date)
      VALUES (?, ?, ?, ?, ?, ? )
    `;
    await db.run(sqlInsert, [newId, targetTable, title, content, isAnalyzed, currentDate]);
    console.log(`Создана новая запись в ${targetTable} с id-${newId}`);

    // Создаем новую ассоциацию, независимо от существования аналогичной
    const sqlGetNextAssociationId = `SELECT COALESCE(MAX(id), 0) + 1 AS nextId FROM association`;
    const { nextId: newAssocId } = await db.get(sqlGetNextAssociationId);
    const newAssociationId = newAssocId || 1;
    console.log(`Создание новой ассоциации с ID: ${newAssociationId}`);
    const sqlInsertAssociation = 'INSERT INTO association (id, link) VALUES (?, ?)';
    await db.run(sqlInsertAssociation, [newAssociationId, associationId]);
    console.log(`Создана новая ассоциация с ID: ${newAssociationId} и link: ${associationId}`);

    // Привязываем новую запись к новой ассоциации в целевой таблице
    await db.run(`INSERT INTO ${targetAssociationTable} (${targetColumnId}, association_id) VALUES (?, ?)`, [newId, newAssociationId]);
    console.log(`Связана запись в ${targetAssociationTable} с ${targetColumnId}=${newId} и association_id=${newAssociationId}`);

    return { success: true, message: 'Запись успешно перемещена' };

  } catch (error) {
    console.error('Ошибка при перемещении записи:', error);
    throw new Error('Ошибка при перемещении записи');
  }
};
