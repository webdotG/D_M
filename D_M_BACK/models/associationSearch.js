import { dbLite } from '../dbLite.js';

export const associationSearch = async (tableName) => {
  try {
    const sql = `SELECT id, associations FROM ${tableName}`;
    const rows = await dbLite.all(sql);

    rows.forEach(record => {
      if (typeof record.associations === 'string') {
        try {
          record.associations = JSON.parse(record.associations);
        } catch (error) {
          console.error(`Error parsing associations JSON for record with id ${record.id}:`, error);
          // Обработка некорректного JSON
          record.associations = [];
        }
      } else if (typeof record.associations === 'object' && !Array.isArray(record.associations)) {
        // Если ассоциация уже объект, логируем предупреждение
        console.warn(`Associations for record with id ${record.id} is already an object.`);
      }
    });

    console.log('rows -', rows);

    return rows;
  } catch (error) {
    console.error('Ошибка получения ассоциаций:', error);
    throw error;
  }
};
