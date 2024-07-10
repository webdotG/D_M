// Middleware для определения имени таблицы на основе категории
export const getTableName = (req, res, next) => {
  const { category } = req.query; 
  console.log('getTableName middleware:', category);
  
  let tableName;
  if (category === 'сны') {
    tableName = 'dreams';
    console.log('СНЫ tableName = ',tableName)
  } else if (category === 'воспоминания') {
    tableName = 'memories';
    console.log('ВОСПОМИНАНИЯ tableName = ',tableName)
  } else {
    return res.status(400).json({ error: 'Некорректная категория' });
  }
  
  req.tableName = tableName;
  next();
};
