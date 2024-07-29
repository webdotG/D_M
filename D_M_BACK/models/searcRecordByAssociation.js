import { dbLite } from '../dbLite.js';

// Функция для поиска записей по конкретной ассоциации
export const searchByAssociation = async (tableName, association) => {
  try {
    let associationTable;
    let linkColumn;

    // Определяем таблицу ассоциаций и колонку связи в зависимости от имени таблицы
    switch (tableName) {
      case 'dreams':
        associationTable = 'dream_associations';
        linkColumn = 'dream_id';
        break;
      case 'memories':
        associationTable = 'memory_associations';
        linkColumn = 'memory_id';
        break;
      default:
        throw new Error(`Invalid table name: ${tableName}. Expected 'dreams' or 'memories'`);
    }

    // Запрос для получения всех ассоциаций
    const sqlAssociations = 'SELECT id, link FROM association';
    const associationsRows = await dbLite.all(sqlAssociations);

    // Создаем карту ассоциаций: { association_id: link }
    const associationsMap = associationsRows.reduce((acc, record) => {
      acc[record.link] = record.id;
      return acc;
    }, {});

    // Проверяем, существует ли указанная ассоциация
    const associationId = associationsMap[association];
    if (!associationId) {
      throw new Error(`Association "${association}" not found`);
    }

    // Запрос для получения всех записей, связанных с указанной ассоциацией
    const sqlSearch = `
      SELECT t.* FROM ${tableName} t
      JOIN ${associationTable} a ON t.id = a.${linkColumn}
      WHERE a.association_id = ?
    `;
    const searchResults = await dbLite.all(sqlSearch, [associationId]);

    return searchResults;
  } catch (error) {
    console.error('Ошибка поиска по ассоциации:', error);
    throw error;
  }
};
