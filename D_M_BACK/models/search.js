import { dbLite } from '../dbLite.js';

export const Search = async (tableName, value, date) => {
  try {
    let sql = `SELECT * FROM ${tableName} WHERE 1=1`;
    let params = [];

    if (value) {
      sql += ` AND (category LIKE ? OR associations LIKE ? OR title LIKE ? OR content LIKE ?)`;
      const likeValue = `%${value}%`;
      params.push(likeValue, likeValue, likeValue, likeValue);
    }

    if (date) {
      sql += ` AND (date LIKE ? OR createdAt LIKE ? OR updatedAt LIKE ?)`;
      const likeDate = `%${date}%`;
      params.push(likeDate, likeDate, likeDate);
    }

    // Третий блок для поиска по комбинации букв и цифр
    if (value && date) {
      sql += ` AND (category LIKE ? OR associations LIKE ? OR title LIKE ? OR content LIKE ? OR date LIKE ? OR createdAt LIKE ? OR updatedAt LIKE ?)`;
      const likeValueDigits = `%${value}%`;
      const likeDate = `%${date}%`;
      params.push(likeValueDigits, likeValueDigits, likeValueDigits, likeValueDigits, likeDate, likeDate, likeDate);
    }
    

    console.log('Executing SQL:', sql);
    console.log('With parameters:', params);

    const rows = await dbLite.all(sql, params);
    return rows;
  } catch (error) {
    console.error('Ошибка поиска с параметрами:', error);
    throw error;
  }
};
