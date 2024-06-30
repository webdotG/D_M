import { dbLite } from '../dbLite.js';

// Создание нового сна
export const createDream = async (newDream) => {
  try {
    console.log('Попытка добавления сна в базу данных:', newDream);

    const result = await dbLite.run(`
      INSERT INTO dreams (title,
        date,
        content,
        category,
        isAnalyzed,
        createdAt
          )
      VALUES (?, ?, ?, ?, ?, ?)
    `, [newDream.title,
       newDream.date, 
       newDream.content, 
       newDream.category, 
       newDream.isAnalyzed,
       newDream.createdAt
      ]);
    
    console.log('Сон успешно добавлен в базу данных');
    return result.lastID; // Возвращаем ID только что созданного сна
  } catch (error) {
    console.error('Ошибка при добавлении сна:', error);
    throw error;
  }
};


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
    const { title, content, isAnalyzed, category, date, updatedAt, associations } = updatedData;
    const sql = `
      UPDATE dreams
      SET title = ?,
          content = ?,
          isAnalyzed = ?,
          category = ?,
          date = ?,
          updatedAt = ?,
          associations = ?
      WHERE id = ?
    `;
    const params = [title, content, isAnalyzed, category, date, updatedAt, associations, id];
    const result = await dbLite.run(sql, params);
    console.log(`Запрос выполнен: Изменение сна с ID ${id}`);
    console.log('Результат изменения:', result);

    if (result.changes > 0) {
      return true;
    } else {
      console.log(`Сон с ID ${id} не был найден или не было сделано изменений.`);
      return false;
    }
  } catch (error) {
    console.error('Ошибка изменения сна:', error);
    throw error;
  }
}
