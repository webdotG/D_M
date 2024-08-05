import { dbLite } from '../../dbLite.js';

// Функция для выполнения поиска в базе данных
export const Search = async (tableName, value, date) => {
  try {
    if (tableName !== 'dreams' && tableName !== 'memories') {
      throw new Error('Invalid category');
    }

    let sql = `SELECT * FROM ${tableName} WHERE 1=1`;
    let params = [];

    // Поиск по значению
    if (value) {
      sql += ` AND (title LIKE ? OR content LIKE ?)`;
      params.push(`%${value}%`, `%${value}%`);
    }

    // Поиск по дате
    if (date) {
      sql += ` AND date LIKE ?`;
      params.push(`%${date}%`);
    }

    console.log('Executing SQL:', sql);
    console.log('With parameters:', params);

    // Выполнение запроса
    const rows = await dbLite.all(sql, params);
    return rows;
  } catch (error) {
    console.error('Ошибка поиска с параметрами:', error);
    throw error;
  }
};
