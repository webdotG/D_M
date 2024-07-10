import { dbLite } from '../dbLite.js';

export const associationSearch = async (tableName) => {
  try {
    const sql = `SELECT associations FROM ${tableName}`;
    const rows = await dbLite.all(sql);

    // Маппим associations, предполагая, что они хранятся в виде JSON-строк
    const associations = rows.map(row => {
      try {
        return JSON.parse(row.associations);
      } catch (error) {
        console.error('Ошибка при парсинге JSON:', error);
        return null; 
      }
    }).filter(association => association !== null); 

    return associations;
  } catch (error) {
    console.error('Ошибка получения ассоциаций:', error);
    throw error;
  }
};
