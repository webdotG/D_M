import { dbLitePromise } from '../../dbLite.js';
// console.log(' --- getStats import dbLite ... >>> ... ', dbLitePromise)
const dbLite = await dbLitePromise;
// console.log('--- getStats promise dbLite ... >>> ... ', dbLite);

export const getStats = async (tableName) => {
  // console.log('--- getStats async (tableName) ... >>> ... ', tableName);
  try {
    // Проверяем, что dbLite определено и имеет методы
    if (!dbLite) {
      throw new Error('dbLite is not defined or not initialized');
    }

    const totalQuery = `SELECT COUNT(*) AS count FROM ${tableName}`;
    const totalRow = await dbLite.get(totalQuery);
    // console.log('Ответ на запрос статистики (всего):', totalRow);

    const analyzedQuery = `SELECT COUNT(*) AS count FROM ${tableName} WHERE isAnalyzed = 1`;
    const analyzedRow = await dbLite.get(analyzedQuery);
    // console.log('Ответ на запрос статистики (анализировано):', analyzedRow);

    const total = totalRow.count;
    const analyzed = analyzedRow.count;

    // console.log('Статистика - Всего:', total, 'Анализировано:', analyzed);
    return { total, analyzed };
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    throw error;
  }
};

