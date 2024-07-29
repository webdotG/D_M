import { dbLite } from '../dbLite.js';

// Функция для поиска ассоциаций по id
export const fetchAssociationsByRecordId = async (tableName, recordId) => {
  // console.log(`associationByID tableName - ${tableName} recordID - ${recordId}`)
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

    // console.log(`associationByID Поиск ассоциаций для записи ${recordId} в таблице ${tableName}`);
    // console.log(`associationByID Таблицу ассоциаций: ${associationTable}, колонка: ${linkColumn}`);

    // Получаем все ассоциации
    const sqlAssociations = 'SELECT id, link FROM association';
    // console.log(`associationByID Запрос для получения всех ассоциаций: ${sqlAssociations}`);
    const associationsRows = await dbLite.all(sqlAssociations);
    // console.log('associationByID Полученные ассоциации:', associationsRows);

    // Получаем ссылки для конкретного recordId
    const sqlLinks = `SELECT ${linkColumn} AS id, association_id
                      FROM ${associationTable}
                      WHERE ${linkColumn} = ?`;
    // console.log(`associationByID Запрос для получения ссылок recordId ${recordId}: ${sqlLinks}`);
    const linksRows = await dbLite.all(sqlLinks, [recordId]);
    // console.log('associationByID Полученные ссылки:', linksRows);

    // Создаем карты для ассоциаций и связей
    const associationsMap = associationsRows.reduce((acc, record) => {
      acc[record.id] = record.link;
      return acc;
    }, {});
    // console.log('associationByID Созданная карта ассоциаций:', associationsMap);

    const linksMap = linksRows.reduce((acc, record) => {
      if (!acc[record.id]) {
        acc[record.id] = [];
      }
      acc[record.id].push(record.association_id);
      return acc;
    }, {});
    // console.log('associationByID Созданная карта ссылок:', linksMap);

    const result = linksMap[recordId] ? linksMap[recordId].map(assocId => associationsMap[assocId] || '').join(' ') : '';
    // console.log('associationByID Результат:', result);

    return {
      id: recordId,
      associations: result
    };
  } catch (error) {
    console.error('Ошибка получения ассоциаций:', error);
    throw error;
  }
};
