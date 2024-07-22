import { dbLite } from '../dbLite.js';

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

    // Запрос для получения всех связей ассоциаций с записями
    const sqlLinks = `SELECT ${linkColumn} AS id, association_id FROM ${associationTable}`;
    const linksRows = await dbLite.all(sqlLinks);

    // Создаем карту ассоциаций: { association_id: link }
    const associationsMap = associationsRows.reduce((acc, record) => {
      acc[record.id] = record.link;
      return acc;
    }, {});

    // Создаем карту связей: { id записи: Set(association_id1, association_id2, ...) }
    const linksMap = linksRows.reduce((acc, record) => {
      if (!acc[record.id]) {
        acc[record.id] = new Set();
      }
      acc[record.id].add(record.association_id);
      return acc;
    }, {});

    // Создаем уникальный список ассоциаций
    const uniqueAssociationsSet = new Set();
    Object.values(linksMap).forEach(associationIds => {
      associationIds.forEach(assocId => uniqueAssociationsSet.add(associationsMap[assocId]));
    });

    const uniqueAssociationsArray = Array.from(uniqueAssociationsSet);

    // Преобразуем карту связей в массив объектов с уникальными ассоциациями
    const result = Object.entries(linksMap).map(([id, associationIds]) => {
      const associationArray = Array.from(associationIds); // Преобразуем Set в массив
      console.log('associationArray:', associationArray);
      const uniqueAssociations = associationArray.map(assocId => associationsMap[assocId] || '').join(' ');
      return {
        id,
        associations: uniqueAssociations
      };
    });

    console.log('Processed associations:', result);
    console.log('Unique associations:', uniqueAssociationsArray);

    return {
      uniqueAssociations: uniqueAssociationsArray,
      result
    };
  } catch (error) {
    console.error('Ошибка получения ассоциаций:', error);
    throw error;
  }
};
