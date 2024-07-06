import { dbLite } from '../dbLite.js';

// Добавление нового сна
export const createDream = async (newDream) => {
  try {
    console.log('Попытка добавления сна в базу данных:', newDream);

    if (
      !newDream.title ||
      !newDream.date ||
      !newDream.content ||
      !newDream.category ||
      newDream.isAnalyzed === undefined ||
      !newDream.createdAt ||
      newDream.associations === undefined
    ) {
      throw new Error('Некоторые поля отсутствуют в newDream');
    }

    const result = await dbLite.run(
      `INSERT INTO dreams_memories (title, date, content, category, isAnalyzed, createdAt, associations)
       VALUES (?, ?, ?, ?, ?, ?, ?)`, 
      [
        newDream.title,
        newDream.date,
        newDream.content,
        newDream.category,
        newDream.isAnalyzed,
        newDream.createdAt,
        newDream.associations 
      ]
    );

    console.log('Сон успешно добавлен в базу данных');
    return result.lastID; // Возвращаем ID только что созданного сна
  } catch (error) {
    console.error('Ошибка при добавлении сна:', error);
    throw error;
  }
};



// Получение всех снов
export async function getAllDreams(req, res) {
  try {
    const categories = req.query.categories;
    console.log('Полученные категории:', categories);

    // Проверка, что категории были переданы
    if (!categories) {
      return res.status(400).json({ error: 'Необходимо указать категории' });
    }

    // Преобразование строки категорий в массив
    const categoryArray = categories.split(',');

    // Формирование SQL-запроса с использованием оператора IN
    const placeholders = categoryArray.map(() => '?').join(',');
    const sql = `SELECT * FROM dreams_memories WHERE category IN (${placeholders})`;
    const rows = await dbLite.all(sql, categoryArray);

    console.log('Запрос выполнен: Получение всех снов');
    console.log('Полученные строки:', rows);

    res.json(rows);
  } catch (error) {
    console.error('Ошибка получения всех снов:', error);
    res.status(500).json({ error: 'Не удалось получить сны' });
  }
}



// // Получение всех снов
// export async function getAllDreams(req, res) {
//   try {
//     const category = req.query.category;
//     console.log('Полученная категория:', category);

//     const sql = `SELECT * FROM dreams_memories WHERE category = ?`;
//     const params = [category];
//     const rows = await dbLite.all(sql, params);

//     console.log('Запрос выполнен: Получение всех снов');
//     console.log('Полученные строки:', rows);

//     res.json(rows);
//   } catch (error) {
//     console.error('Ошибка получения всех снов:', error);
//     res.status(500).json({ error: 'Не удалось получить сны' });
//   }
// }


// Получение конкретного сна по ID
export async function getCurrentDream(id) {
  try {
    const sql = `SELECT * FROM dreams_memories WHERE id = ?`;
    const params = [id];
    const dream = await dbLite.get(sql, params);
    console.log(`Запрос выполнен: Получение сна с ID ${id}`);
    return dream;
  } catch (error) {
    console.error('Ошибка получения сна:', error);
    throw error;
  }
}

// Изменение конкретного сна по ID
export async function changeDream(id, updatedData) {
  try {
    const { title, content, isAnalyzed, category, date, updatedAt, associations } = updatedData;
    const sql = `
      UPDATE dreams_memories
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
