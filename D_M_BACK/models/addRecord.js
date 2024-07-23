import { dbLite } from '../dbLite.js';  // Импортируем объект базы данных

// Функция для добавления новой записи в указанную таблицу
export const addRecord = async (tableName, newRecord) => {
  const db = await dbLite;  // Получаем объект базы данных

  const {
    associations = '',  // Ассоциации передаются как строка, по умолчанию пустая строка
    title,  // Заголовок записи
    content,  // Содержание записи
    isAnalyzed,  // Флаг, проанализирована ли запись (булев тип)
    date  // Дата записи
  } = newRecord;  // Деструктурируем свойства новой записи

  try {
    // Определяем колонки для вставки в таблицу
    const columns = ['category', 'title', 'content', 'isAnalyzed', 'date'];
    // Определяем значения для вставки
    const values = [tableName, title, content, isAnalyzed, date];

    // Получаем информацию о структуре таблицы
    const tableInfo = await db.all(`PRAGMA table_info(${tableName})`);
    console.log('addRecord tableInfo:', tableInfo);  // Логируем информацию о структуре таблицы

    // Извлекаем имена колонок из информации о таблице
    const columnNames = tableInfo.map(column => column.name);
    console.log('addRecord columnNames:', columnNames);  // Логируем имена колонок

    // Создаем строку с плейсхолдерами для SQL запроса
    const placeholders = columns.map(() => '?').join(', ');
    // Формируем SQL запрос для вставки новой записи
    const sqlInsert = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
    // Выполняем SQL запрос для вставки записи
    const result = await db.run(sqlInsert, values);
    // Получаем ID только что вставленной записи
    const recordId = result.lastID;

    console.log('addRecord Новая запись добавлена:', {
      id: recordId,
      columns,
      values,
    });  // Логируем информацию о добавленной записи

    // Логируем значение категории после вставки
    const insertedRecord = await db.get(`SELECT category FROM ${tableName} WHERE id = ?`, [recordId]);
    console.log('addRecord Новая запись добавлена категория и айди:', insertedRecord);

    // Обработка ассоциаций
    if (associations) {  // Если есть ассоциации
      console.log('addRecord Обрабатываем ассоциации:', associations);

      // Разделяем строку ассоциаций на массив значений
      const associationValues = associations.split(',').map(val => val.trim());
      console.log('addRecord Обработанные ассоциации:', associationValues);

      // Находим уникальные ассоциации, чтобы избежать дублирования
      const uniqueAssociations = [...new Set(associationValues)];
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

    // Возвращаем ID добавленной записи
    return { id: recordId };

  } catch (error) {
    // Ловим ошибку, если что-то пошло не так
    console.error('Ошибка добавления записи:', error);
    throw new Error('Не удалось добавить запись');  // Генерируем исключение
  }
};

// Вспомогательная функция для получения ID ассоциации по значению
const getAssociationId = async (association, db) => {
  // Запрос на получение ID ассоциации по значению
  const sql = 'SELECT id FROM association WHERE link = ?';
  // Выполняем запрос и получаем результат
  const rows = await db.all(sql, [association]);
  console.log('getAssociationId:', { association, rows });  // Логируем результат запроса
  // Возвращаем ID ассоциации, если она найдена, иначе null
  return rows.length > 0 ? rows[0].id : null;
};

// Вспомогательная функция для добавления новой ассоциации в таблицу
const addAssociation = async (association, db) => {
  // Запрос на вставку новой ассоциации в таблицу
  const sql = 'INSERT INTO association (link) VALUES (?)';
  // Выполняем запрос и получаем результат
  const result = await db.run(sql, [association]);
  console.log('addAssociation:', { association, result });  // Логируем результат запроса
  // Возвращаем ID новой ассоциации
  return result.lastID;
};

// Вспомогательная функция для получения существующей ассоциации или создания новой
const getOrAddAssociation = async (association, db) => {
  // Пытаемся получить ID ассоциации по значению
  let associationId = await getAssociationId(association, db);
  
  // Если ассоциация не найдена, создаем её
  if (!associationId) {
    associationId = await addAssociation(association, db);
  }

  console.log('getOrAddAssociation:', { association, associationId });  // Логируем ID ассоциации
  // Возвращаем ID ассоциации
  return associationId;
};

// Вспомогательная функция для добавления связи между записью и ассоциацией
const addRecordAssociation = async (recordId, associationId, tableName, db) => {
  // Формируем SQL запрос в зависимости от типа таблицы
  const sql = tableName === 'dreams'
    ? 'INSERT INTO dream_associations (dream_id, association_id) VALUES (?, ?)'  // Для таблицы 'dreams'
    : 'INSERT INTO memory_associations (memory_id, association_id) VALUES (?, ?)';  // Для таблицы 'memories'
  
  console.log('addRecordAssociation SQL:', { sql, recordId, associationId });  // Логируем SQL запрос
  // Выполняем SQL запрос для добавления связи
  await db.run(sql, [recordId, associationId]);

  console.log('addRecordAssociation Добавлено:', { tableName, recordId, associationId });  // Логируем результат добавления
};
