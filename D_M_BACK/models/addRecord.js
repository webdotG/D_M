import { dbLite } from '../dbLite.js'; // Используем подключение к базе данных

// Функция для добавления записи и связанных данных
export const addRecord = async (tableName, newRecord) => {
  const db = await dbLite; // Открываем соединение с базой данных

  const {
    associations = [],
    title,
    content,
    isAnalyzed,
    date,
    img = "",
    video = "",
  } = newRecord;

  try {
    // Определяем колонки для вставки в зависимости от таблицы
    const columns = ['category', 'title', 'content', 'isAnalyzed', 'date'];
    const values = [tableName, title, content, isAnalyzed, date];
    
    // Получаем информацию о структуре таблицы
    const tableInfo = await db.all(`PRAGMA table_info(${tableName})`);

    // Проверяем наличие колонок и добавляем их в запрос
    const columnNames = tableInfo.map(column => column.name);

    if (columnNames.includes('img')) {
      columns.push('img');
      values.push(img);
    }
    if (columnNames.includes('video')) {
      columns.push('video');
      values.push(video);
    }

    const placeholders = columns.map(() => '?').join(', ');
    const sqlInsert = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
    const result = await db.run(sqlInsert, values);
    const recordId = result.lastID;

    // 2. Обработка ассоциаций
    for (const association of associations) {
      let associationId = await getAssociationId(association, db);
      if (!associationId) {
        associationId = await addAssociation(association, db);
      }
      await addRecordAssociation(recordId, associationId, tableName, db);
    }

    // 3. Обработка видео
    if (video) {
      let videoId = await getVideoId(video, db);
      if (!videoId) {
        videoId = await addVideo(video, db);
      }
      await addRecordVideo(recordId, videoId, tableName, db);
    }

    // 4. Обработка изображений
    if (img) {
      let imageId = await getImageId(img, db);
      if (!imageId) {
        imageId = await addImage(img, db);
      }
      await addRecordImage(recordId, imageId, tableName, db);
    }

    return { id: recordId };

  } catch (error) {
    console.error('Ошибка добавления записи:', error);
    throw new Error('Не удалось добавить запись');
  }
};

// Вспомогательные функции для работы с ассоциациями
const getAssociationId = async (link, db) => {
  const sql = 'SELECT id FROM association WHERE link = ?';
  const rows = await db.all(sql, [link]);
  return rows.length > 0 ? rows[0].id : null;
};

const addAssociation = async (link, db) => {
  const sql = 'INSERT INTO association (link) VALUES (?)';
  const result = await db.run(sql, [link]);
  return result.lastID;
};

const addRecordAssociation = async (recordId, associationId, tableName, db) => {
  const sql = tableName === 'dreams'
    ? 'INSERT INTO dream_associations (dream_id, association_id) VALUES (?, ?)'
    : 'INSERT INTO memory_associations (memory_id, association_id) VALUES (?, ?)';
  await db.run(sql, [recordId, associationId]);
};

// Вспомогательные функции для работы с видео
const getVideoId = async (link, db) => {
  const sql = 'SELECT id FROM video WHERE link = ?';
  const rows = await db.all(sql, [link]);
  return rows.length > 0 ? rows[0].id : null;
};

const addVideo = async (link, db) => {
  const sql = 'INSERT INTO video (link) VALUES (?)';
  const result = await db.run(sql, [link]);
  return result.lastID;
};

const addRecordVideo = async (recordId, videoId, tableName, db) => {
  const sql = tableName === 'dreams'
    ? 'INSERT INTO dream_videos (dream_id, video_id) VALUES (?, ?)'
    : 'INSERT INTO memory_videos (memory_id, video_id) VALUES (?, ?)';
  await db.run(sql, [recordId, videoId]);
};

// Вспомогательные функции для работы с изображениями
const getImageId = async (link, db) => {
  const sql = 'SELECT id FROM img WHERE link = ?';
  const rows = await db.all(sql, [link]);
  return rows.length > 0 ? rows[0].id : null;
};

const addImage = async (link, db) => {
  const sql = 'INSERT INTO img (link) VALUES (?)';
  const result = await db.run(sql, [link]);
  return result.lastID;
};

const addRecordImage = async (recordId, imgId, tableName, db) => {
  const sql = tableName === 'dreams'
    ? 'INSERT INTO dream_imgs (dream_id, img_id) VALUES (?, ?)'
    : 'INSERT INTO memory_imgs (memory_id, img_id) VALUES (?, ?)';
  await db.run(sql, [recordId, imgId]);
};
