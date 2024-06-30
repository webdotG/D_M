import { dbLite } from '../dbLite.js';
// console.log('{ dbLite } : ', dbLite );


export const associationSearch = async (category) => {
   
  try {
    const sql = `SELECT associations FROM dreams_memories WHERE associations != ''`;

    const params = [category];
    const rows = await dbLite.all(sql, params);
  
    // Маппим значения associations, предполагая, что они хранятся в виде JSON-строк
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
