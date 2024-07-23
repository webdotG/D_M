import { dbLite } from '../dbLite.js';  

export const addRecord = async (tableName, newRecord) => {
  const db = await dbLite;  

  const {
    associations = '',  
    title,  
    content,  
    isAnalyzed, 
    date  
  } = newRecord;  

  try {
    const columns = ['category', 'title', 'content', 'isAnalyzed', 'date'];
    const values = [tableName, title, content, isAnalyzed, date];

    // Получаем информацию о структуре таблицы
    const tableInfo = await db.all(`PRAGMA table_info(${tableName})`);
    // console.log('addRecord tableInfo:', tableInfo);  

    // Извлекаем имена колонок из информации о таблице
    const columnNames = tableInfo.map(column => column.name);
    // console.log('addRecord columnNames:', columnNames);  


    const placeholders = columns.map(() => '?').join(', ');
    const sqlInsert = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
    const result = await db.run(sqlInsert, values);
    const recordId = result.lastID;

    // console.log('addRecord Новая запись добавлена:', {
    //   id: recordId,
    //   columns,
    //   values,
    // });  

    const insertedRecord = await db.get(`SELECT category FROM ${tableName} WHERE id = ?`, [recordId]);
    console.log('addRecord Новая запись добавлена категория и айди:', insertedRecord);

    // Обработка ассоциаций
    if (associations) {  
      // console.log('addRecord Обрабатываем ассоциации:', associations);

      // Находим уникальные ассоциации, чтобы избежать дублирования
      const uniqueAssociations = [...new Set(associations)];
      console.log('addRecord Уникальные ассоциации:', uniqueAssociations);

      // Проходим по уникальным ассоциациям
      for (const association of uniqueAssociations) {
        // Получаем или создаем ассоциацию и получаем её ID
        const associationId = await getOrAddAssociation(association, db);
        console.log('addRecord Ассоциация ID:', associationId);

        // Добавляем связь между записью и ассоциацией
        await addRecordAssociation(recordId, associationId, tableName, db);
      }
    }

    return { id: recordId };

  } catch (error) {
 
    console.error('Ошибка добавления записи:', error);
    throw new Error('Не удалось добавить запись');  
  }
};

// Вспомогательная функция для получения ID ассоциации по значению
const getAssociationId = async (association, db) => {
  const sql = 'SELECT id FROM association WHERE link = ?';
  const rows = await db.all(sql, [association]);
  // console.log('getAssociationId:', { association, rows });  
  return rows.length > 0 ? rows[0].id : null;
};

// Вспомогательная функция для добавления новой ассоциации в таблицу
const addAssociation = async (association, db) => {
  const sql = 'INSERT INTO association (link) VALUES (?)';
  const result = await db.run(sql, [association]);
  // console.log('addAssociation:', { association, result });  
  return result.lastID;
};

// Вспомогательная функция для получения существующей ассоциации или создания новой
const getOrAddAssociation = async (association, db) => {
  let associationId = await getAssociationId(association, db);
  
  if (!associationId) {
    associationId = await addAssociation(association, db);
  }
  // console.log('getOrAddAssociation:', { association, associationId });  
  return associationId;
};

// Вспомогательная функция для добавления связи между записью и ассоциацией
const addRecordAssociation = async (recordId, associationId, tableName, db) => {

  const sql = tableName === 'dreams'
    ? 'INSERT INTO dream_associations (dream_id, association_id) VALUES (?, ?)'  
    : 'INSERT INTO memory_associations (memory_id, association_id) VALUES (?, ?)';  
    // console.log('addRecordAssociation SQL:', { sql, recordId, associationId });  
  await db.run(sql, [recordId, associationId]);

  console.log('addRecordAssociation Добавлено:', { tableName, recordId, associationId }); 
};
