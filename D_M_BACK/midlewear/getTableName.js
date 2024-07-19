// Middleware для определения имени таблицы на основе категории
export const getTableName = (req, res, next) => {
  const { category } = req.body || {};
  // console.log('getTableName middleware:', category);

  let tableName;
  if (category === 'сны') {
    tableName = 'dreams';
    // console.log('СНЫ tablename = ',tableName)
  } else if (category === 'воспоминания') {
    tableName = 'memories';
    // console.log('ВОСПОМИНАНИЯ tablename = ',tableName)
  } else {
    return res
  }
  
  req.tableName = tableName;
  next();
};
