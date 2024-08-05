import { dbLite } from '../../dbLite.js';

// Функция для поиска ассоциаций
export const associationAll = async (tableName) => {
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
    // console.log('Associations rows:', associationsRows);

    // Запрос для получения всех связей ассоциаций с записями
    const sqlLinks = `SELECT ${linkColumn} AS id, association_id FROM ${associationTable}`;
    const linksRows = await dbLite.all(sqlLinks);
    // console.log('Links rows:', linksRows);

    // Создаем карту ассоциаций: { association_id: link }
    const associationsMap = associationsRows.reduce((acc, record) => {
      acc[record.id] = record.link;
      return acc;
    }, {});
    // console.log('Associations map:', associationsMap);

    // Создаем карту связей: { id записи: Set(association_id1, association_id2, ...) }
    const linksMap = linksRows.reduce((acc, record) => {
      if (!acc[record.id]) {
        acc[record.id] = new Set();
      }
      acc[record.id].add(record.association_id);
      return acc;
    }, {});
    // console.log('Links map:', linksMap);

    // Создаем уникальный список id ассоциаций для текущей таблицы
    const uniqueAssociationIds = new Set();
    Object.values(linksMap).forEach(associationIds => {
      associationIds.forEach(assocId => uniqueAssociationIds.add(assocId));
    });
    // console.log('Unique association IDs:', uniqueAssociationIds);

    // Получаем тексты уникальных ассоциаций
    const uniqueAssociationsArray = Array.from(uniqueAssociationIds).map(assocId => associationsMap[assocId]);
    // console.log('Unique associations:', uniqueAssociationsArray);

    const result = {
      uniqueAssociations: uniqueAssociationsArray
    };

    // console.log('Final result:', result);

    return result;
  } catch (error) {
    console.error('Ошибка получения ассоциаций:', error);
    throw error;
  }
};
