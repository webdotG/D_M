import express from 'express';
// import Auth from '../midlewear/auth.js'; 
import { associationSearch } from '../models/associationSearch.js'
import { getStats } from '../models/stats.js';
import { getTableName } from '../midlewear/getTableName.js';
import { Search } from '../models/search.js'
import {getCurrentRecord} from '../models/dreams.js'
import { getAllRecords, updateRecordById} from '../models/dreams.js'; 

const router = express.Router();


/* api/dreams/... */

// Роут для редактирования записи по id
router.patch('/patch', getTableName, async (req, res) => {
  const { id, associations, title, content, isAnalyzed, date } = req.body;
  const tableName = req.tableName;

  console.log(`Входящие данные /patch : tableName-${tableName}, id-${id}, associations-${associations}, title-${title}, content-${content}, isAnalyzed-${isAnalyzed}, date-${date}`);
  
  try {
    // Получаем конкретную запись по id из указанной таблицы и с учетом категории
    const updateRecord = await updateRecordById(tableName, id, associations, title, content, isAnalyzed, date);
   
    res.json(updateRecord);
  } catch (error) {
    console.error('Ошибка при обновлении записи:', error);
    res.status(500).json({ error: 'Ошибка при обновлении записи' });
  }
});

// Роут для перемещения записи по id
router.patch('/move', getTableName, async (req, res) => {
  const { id, category, associations, title, content, isAnalyzed, date } = req.body;
  const tableName = req.tableName;
  console.log(`Входящие данные /move : tableName-${tableName},id-${id}, category-${category}, associations-${associations}, title-${title}, content-${content}, isAnalyzed-${isAnalyzed}, date-${date}`)
 
});



// Маршрут для получения конкретной записи по id
router.post('/current', getTableName, async (req, res) => {
  const { id } = req.body; 
  const { tableName } = req;

  try {
    // Получаем конкретную запись по id из указанной таблицы и с учетом категории
    const currentRecord = await getCurrentRecord(tableName, id);
   
    res.json(currentRecord);
  } catch (error) {
    console.error('Ошибка при получении текущей записи:', error);
    res.status(500).json({ error: 'Ошибка при получении текущей записи' });
  }
});

router.post('/search', getTableName, async (req, res) => {
  const { value, date } = req.body;
  const { tableName } = req;

  try {
    const searchResults = await Search(tableName, value, date);
    res.json(searchResults);
  } catch (error) {
    console.error('Ошибка поиска с параметрами:', error);
    res.status(500).json({ error: 'Ошибка поиска с параметрами' });
  }
});


// Маршрут для получения статистики снов или воспоминаний
router.get('/statistic', getTableName, async (req, res) => {
  try {
    const { tableName } = req;
    console.log('Перед вызовом getStats, tableName:', tableName);
    const stats = await getStats(tableName);
    res.json(stats);
  } catch (error) {
    console.error('Ошибка обработки запроса:', error);
    res.status(500).json({ error: 'Не удалось получить статистику' });
  }
});

// Маршрут для получения всех записей с учетом категории
router.get('/all', getTableName, async (req, res) => {

  try {
    const { tableName } = req;
    const records = await getAllRecords(tableName);
    res.json(records);
  } catch (error) {
    console.error('Ошибка обработки запроса:', error);
    res.status(500).json({ error: 'Не удалось выполнить запрос' });
  }
});

// Маршрут для поиска всех ассоциаций с учетом категории
router.get('/associationSearch', getTableName, async (req, res) => {
  try {
    const { tableName } = req;
    const associations = await associationSearch(tableName);
    res.json(associations);
  } catch (error) {
    console.error('Ошибка получения ассоциаций:', error);
    res.status(500).json({ error: 'Не удалось получить ассоциации' });
  }
});


export default router;

  

