import { dbLite } from '../dbLite.js';

// Функция для поиска ассоциаций по id
export const fetchAssociationsByRecordId = async (tableName, recordId) => {
  try {
    let associationTable;
    let linkColumn;

    if (tableName === 'dreams') {
      associationTable = 'dream_associations';
      linkColumn = 'dream_id';
    } else if (tableName === 'memories') {
      associationTable = 'memory_associations';
      linkColumn = 'memory_id';
    } else {
      throw new Error(`Invalid table name: ${tableName}`);
    }

    // Получаем все ассоциации
    const sqlAssociations = 'SELECT id, link FROM association';
    const associationsRows = await dbLite.all(sqlAssociations);

    // Получаем ссылки для конкретного recordId
    const sqlLinks = `SELECT ${linkColumn} AS id, association_id
                      FROM ${associationTable}
                      WHERE ${linkColumn} = ?`;
    const linksRows = await dbLite.all(sqlLinks, [recordId]);

    // Создаем карты для ассоциаций и связей
    const associationsMap = associationsRows.reduce((acc, record) => {
      acc[record.id] = record.link;
      return acc;
    }, {});

    const linksMap = linksRows.reduce((acc, record) => {
      if (!acc[record.id]) {
        acc[record.id] = [];
      }
      acc[record.id].push(record.association_id);
      return acc;
    }, {});

    const result = linksMap[recordId] ? linksMap[recordId].map(assocId => associationsMap[assocId] || '').join(' ') : '';

    return {
      id: recordId,
      associations: result
    };
  } catch (error) {
    console.error('Ошибка получения ассоциаций:', error);
    throw error;
  }
};
