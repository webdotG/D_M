import { dbLite } from '../dbLite.js'; 

// запись нового сна
export async function createDream(newDream) {
  const { date, content, category, isAnalyzed } = newDream;
  try {
    const sql = `
      INSERT INTO dreams (date, content, category, isAnalyzed)
      VALUES (?, ?, ?, ?)
    `;
    const params = [date, content, category, isAnalyzed];
    const result = await dbLite.run(sql, params);
    console.log(`Запрос выполнен: Создание нового сна`);
    return result.lastID; // возвращаем ID только что созданного сна
  } catch (error) {
    console.error('Ошибка создания сна:', error);
    throw error;
  }
}


// получение всех снов
export async function getAllDreams(req, res) {
  try {
    const category = req.query.category; // Получаем категорию из запроса
    const sql = `SELECT * FROM dreams WHERE category = ?`;
    const params = [category];
    const rows = await dbLite.all(sql, params);
    console.log('Запрос выполнен: Получение всех снов');
    res.json(rows);
  } catch (error) {
    console.error('Ошибка получения всех снов:', error);
    res.status(500).json({ error: 'Не удалось получить сны' });
  }
}

// получение конкретного сна по ID
export async function getCurrentDream(id) {
  try {
    const sql = `SELECT * FROM dreams WHERE id = ?`;
    const params = [id];
    const dream = await dbLite.get(sql, params);
    console.log(`Запрос выполнен: Получение сна с ID ${id}`);
    return dream;
  } catch (error) {
    console.error('Ошибка получения сна:', error);
    throw error;
  }
}

// изменение конкретного сна по ID
export async function changeDream(id, updatedData) {
  try {
    const { date, content, category, isAnalyzed } = updatedData;
    const sql = `
      UPDATE dreams
      SET date = ?,
          content = ?,
          category = ?,
          isAnalyzed = ?
      WHERE id = ?
    `;
    const params = [date, content, category, isAnalyzed, id];
    const result = await dbLite.run(sql, params);
    console.log(`Запрос выполнен: Изменение сна с ID ${id}`);
    return result.changes > 0;
  } catch (error) {
    console.error('Ошибка изменения сна:', error);
    throw error;
  }
}
