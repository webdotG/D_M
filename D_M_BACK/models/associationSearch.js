import { dbLite } from '../dbLite.js';

// Функция для поиска ассоциаций
export const associationSearch = async (tableName) => {
  try {
    // Определяем правильное имя таблицы ассоциаций и имя столбца
    let associationTable;
    let linkColumn;

    switch (tableName) {
      case 'dreams':
        associationTable = 'dream_associations';
        linkColumn = 'dream_id'; // Имя столбца для идентификатора мечты
        break;
      case 'memories':
        associationTable = 'memory_associations';
        linkColumn = 'memory_id'; // Имя столбца для идентификатора воспоминания
        break;
      default:
        throw new Error(`Invalid table name: ${tableName}. Expected 'dreams' or 'memories'`);
    }

    // Получаем все ассоциации из таблицы 'association'
    const sqlAssociations = 'SELECT id, link FROM association';
    const associationsRows = await dbLite.all(sqlAssociations);

    // Получаем связи между объектами и ассоциациями
    const sqlLinks = `SELECT ${linkColumn} AS id, association_id
                      FROM ${associationTable}`;
    const linksRows = await dbLite.all(sqlLinks);

    // Создание мапы для ассоциаций
    const associationsMap = associationsRows.reduce((acc, record) => {
      acc[record.id] = record.link; // Используем link, который теперь является строкой
      return acc;
    }, {});

    // Создание мапы для связей
    const linksMap = linksRows.reduce((acc, record) => {
      if (!acc[record.id]) {
        acc[record.id] = [];
      }
      acc[record.id].push(record.association_id);
      return acc;
    }, {});

    // Формируем итоговый результат
    const result = Object.entries(linksMap).map(([id, associationIds]) => {
      const associations = associationIds.map(assocId => associationsMap[assocId] || '');
      return {
        id,
        associations: associations.flat() // Поскольку `associations` теперь строки, их можно просто объединить
      };
    });

    console.log('Processed associations:', result);

    return result;
  } catch (error) {
    console.error('Ошибка получения ассоциаций:', error);
    throw error;
  }
};
