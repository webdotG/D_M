import { dbLite } from '../dbLite.js';

export const associationSearch = async (category) => {
  try {
    let tableName;
    if (category === 'сны') {
      tableName = 'dreams';
    } else if (category === 'воспоминания') {
      tableName = 'memories';
    } else {
      throw new Error('Некорректная категория');
    }

    const sql = `SELECT associations FROM ${tableName} WHERE associations != ''`;

    const rows = await dbLite.all(sql);
    console.log('associationSearch ... :', rows);

    // Маппим associations, предполагая, что они хранятся в виде JSON-строк
    const associations = rows.map(row => {
      try {
        return JSON.parse(row.associations);
      } catch (error) {
        console.error('Ошибка при парсинге JSON:', error);
        return null; 
      }
    });

    return associations;
  } catch (error) {
    console.error('Ошибка получения ассоциаций:', error);
    throw error;
  }
};
