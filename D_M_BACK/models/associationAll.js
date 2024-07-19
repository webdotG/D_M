import { dbLite } from '../dbLite.js';

// Функция для поиска ассоциаций
export const associationSearch = async (tableName) => {
  try {
    let associationTable;
    let linkColumn;

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

    const sqlAssociations = 'SELECT id, link FROM association';
    const associationsRows = await dbLite.all(sqlAssociations);

    const sqlLinks = `SELECT ${linkColumn} AS id, association_id
                      FROM ${associationTable}`;
    const linksRows = await dbLite.all(sqlLinks);

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

    const result = Object.entries(linksMap).map(([id, associationIds]) => {
      const associations = associationIds.map(assocId => associationsMap[assocId] || '').join(' ');
      return {
        id,
        associations
      };
    });

    console.log('Processed associations:', result);

    return result;
  } catch (error) {
    console.error('Ошибка получения ассоциаций:', error);
    throw error;
  }
};
