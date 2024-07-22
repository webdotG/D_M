import { dbLite } from '../dbLite.js'; 

export const addRecord = async (tableName, newRecord) => {
  const db = await dbLite;

  const {
    associations = '',  // Ассоциации как строка
    title,
    content,
    isAnalyzed,
    date
  } = newRecord;

  try {
    // Определяем колонки для вставки в зависимости от таблицы
    const columns = ['category', 'title', 'content', 'isAnalyzed', 'date'];
    const values = [tableName, title, content, isAnalyzed, date];
    
    // Получаем информацию о структуре таблицы
    const tableInfo = await db.all(`PRAGMA table_info(${tableName})`);
    console.log('addRecord tableInfo:', tableInfo);

    // Проверяем наличие колонок и добавляем их в запрос
    const columnNames = tableInfo.map(column => column.name);
    console.log('addRecord columnNames:', columnNames);

    const placeholders = columns.map(() => '?').join(', ');
    const sqlInsert = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
    const result = await db.run(sqlInsert, values);
    const recordId = result.lastID;

    console.log('addRecord Новая запись добавлена:', {
      id: recordId,
      columns,
      values,
    });

    // Логируем значение категории после вставки
    const insertedRecord = await db.get(`SELECT category FROM ${tableName} WHERE id = ?`, [recordId]);
    console.log('addRecord Новая запись добавлена категория и айди:', insertedRecord);

    // Обработка ассоциаций
    if (associations) {
      const associationValues = associations.split(',').map(val => val.trim());
      console.log('addRecord Обрабатываем ассоциации:', associationValues);

      for (const associationValue of associationValues) {
        if (!associationValue) continue;
        
        const associationId = await getOrAddAssociation(associationValue, db);
        console.log('addRecord Ассоциация ID:', associationId);

        await addRecordAssociation(recordId, associationId, tableName, db);
      }
    }

    return { id: recordId };

  } catch (error) {
    console.error('Ошибка добавления записи:', error);
    throw new Error('Не удалось добавить запись');
  }
};

// Вспомогательные функции для работы с ассоциациями

const getAssociationId = async (association, db) => {
  const sql = 'SELECT id FROM association WHERE link = ?';
  const rows = await db.all(sql, [association]);
  console.log('getAssociationId:', { association, rows });
  return rows.length > 0 ? rows[0].id : null;
};

const addAssociation = async (association, db) => {
  const sql = 'INSERT INTO association (link) VALUES (?)';
  const result = await db.run(sql, [association]);
  console.log('addAssociation:', { association, result });
  return result.lastID;
};

const getOrAddAssociation = async (association, db) => {
  let associationId = await getAssociationId(association, db);
  
  if (!associationId) {
    associationId = await addAssociation(association, db);
  }

  console.log('getOrAddAssociation:', { association, associationId });
  return associationId;
};

const addRecordAssociation = async (recordId, associationId, tableName, db) => {
  const sql = tableName === 'dreams'
    ? 'INSERT INTO dream_associations (dream_id, association_id) VALUES (?, ?)'
    : 'INSERT INTO memory_associations (memory_id, association_id) VALUES (?, ?)';
  
  console.log('addRecordAssociation SQL:', { sql, recordId, associationId });
  await db.run(sql, [recordId, associationId]);

  console.log('addRecordAssociation Добавлено:', { tableName, recordId, associationId });
};
