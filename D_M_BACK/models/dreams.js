import { dbLite } from '../dbLite.js';

export const getAllRecords = async (tableName) => {
  try {
    const sql = `SELECT * FROM ${tableName}`;
    const rows = await dbLite.all(sql);
    return rows;
  } catch (error) {
    console.error('Ошибка получения записей:', error);
    throw error;
  }
};


export const createRecord = async (newRecord) => {
  try {
    console.log('Попытка добавления записи в базу данных:', newRecord);

    if (
      !newRecord.title ||
      !newRecord.date ||
      !newRecord.content ||
      !newRecord.category ||
      newRecord.isAnalyzed === undefined ||
      !newRecord.createdAt ||
      newRecord.associations === undefined
    ) {
      throw new Error('Некоторые поля отсутствуют в newRecord');
    }

    let tableName;
    if (newRecord.category === 'сон') {
      tableName = 'dreams';
    } else if (newRecord.category === 'воспоминание') {
      tableName = 'memories';
    } else {
      throw new Error('Некорректная категория');
    }

    const result = await dbLite.run(
      `INSERT INTO ${tableName} (category, associations, title, content, isAnalyzed, date, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newRecord.category,
        newRecord.associations,
        newRecord.title,
        newRecord.content,
        newRecord.isAnalyzed,
        newRecord.date,
        newRecord.createdAt,
        newRecord.updatedAt
      ]
    );

    console.log(`Запись успешно добавлена в таблицу ${tableName}`);
    return result.lastID;
  } catch (error) {
    console.error('Ошибка при добавлении записи:', error);
    throw error;
  }
};


export async function getCurrentRecord(req, res) {
  try {
    const id = req.params.id;
    const category = req.query.category;

    if (!category) {
      return res.status(400).json({ error: 'Необходимо указать категорию' });
    }

    let tableName;
    if (category === 'сон') {
      tableName = 'dreams';
    } else if (category === 'воспоминание') {
      tableName = 'memories';
    } else {
      return res.status(400).json({ error: 'Некорректная категория' });
    }

    const sql = `SELECT * FROM ${tableName} WHERE id = ?`;
    const record = await dbLite.get(sql, [id]);

    if (!record) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }

    console.log(`Запрос выполнен: Получение записи с ID ${id} из таблицы ${tableName}`);
    res.json(record);
  } catch (error) {
    console.error('Ошибка получения записи:', error);
    res.status(500).json({ error: 'Не удалось получить запись' });
  }
}

export async function changeRecord(req, res) {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const category = req.query.category;

    if (!category) {
      return res.status(400).json({ error: 'Необходимо указать категорию' });
    }

    let tableName;
    if (category === 'сон') {
      tableName = 'dreams';
    } else if (category === 'воспоминание') {
      tableName = 'memories';
    } else {
      return res.status(400).json({ error: 'Некорректная категория' });
    }

    const { title, content, isAnalyzed, associations, date, updatedAt } = updatedData;
    const sql = `
      UPDATE ${tableName}
      SET title = ?, content = ?, isAnalyzed = ?, associations = ?, date = ?, updatedAt = ?
      WHERE id = ?
    `;
    const result = await dbLite.run(sql, [title, content, isAnalyzed, associations, date, updatedAt, id]);

    if (result.changes > 0) {
      console.log(`Запись с ID ${id} успешно обновлена в таблице ${tableName}`);
      res.json({ message: 'Запись успешно обновлена' });
    } else {
      console.log(`Запись с ID ${id} не найдена в таблице ${tableName}`);
      res.status(404).json({ error: 'Запись не найдена' });
    }
  } catch (error) {
    console.error('Ошибка обновления записи:', error);
    res.status(500).json({ error: 'Не удалось обновить запись' });
  }
}
