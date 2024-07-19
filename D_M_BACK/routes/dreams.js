import express from 'express';
import { getTableName } from '../midlewear/getTableName.js'; 
import { associationSearch } from '../models/associationSearch.js';
import { getStats } from '../models/stats.js';
import { Search } from '../models/search.js';
import { getCurrentRecord, getAllRecords, addRecord } from '../models/dreams.js';
import { moveRecordToDifferentCategory } from '../models/moveRecord.js';
import { updateRecordById } from '../models/updateRecord.js';
import { deleteRecordById } from '../models/deleteRecord.js';

const router = express.Router();

// для добавления записи с учетом категории
router.post('/add', getTableName, async (req, res) => {
  const { associations, title, content, isAnalyzed, date, img, video } = req.body;
  const { tableName } = req; 

  try {
    const newRecord = {
      category: tableName,
      associations,
      title,
      content,
      isAnalyzed,
      date,
      img,
      video,
    };

    console.log('NEW RECORD', newRecord);

    const records = await addRecord(tableName, newRecord);
    res.json(records);
  } catch (error) {
    console.error('Ошибка обработки запроса:', error);
    res.status(500).json({ error: 'Не удалось выполнить запрос' });
  }
});

// для удаления записи по ID
router.delete('/delete/:id', getTableName, async (req, res) => {
  const { id } = req.params;
  const { tableName } = req; 

  console.log(`Incoming data /delete : category-${req.body.category}, id-${id}`);

  try {
    const result = await deleteRecordById(tableName, id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Error deleting record' });
  }
});


// Роут для перемещения записи по id
router.patch('/move', async (req, res) => {
  const { category, id, associations, title, content, isAnalyzed, date } = req.body;

  console.log(`Входящие данные /move : category-${category}, id-${id}, associations-${associations}, title-${title}, content-${content}, isAnalyzed-${isAnalyzed}, date-${date}`);

  try {
    const tableName = getTableName(category); 

    const moveRecord = await moveRecordToDifferentCategory(tableName, id, associations, title, content, isAnalyzed, date);

    res.json(moveRecord);
  } catch (error) {
    console.error('Ошибка при перемещении записи:', error);
    res.status(500).json({ error: 'Ошибка при перемещении записи' });
  }
});

// для перемещения записи по id
router.patch('/move', getTableName, async (req, res) => {
  const { id, associations, title, content, isAnalyzed, date } = req.body;
  const { tableName } = req; 

  console.log(`Входящие данные /move : category-${req.body.category}, id-${id}, associations-${associations}, title-${title}, content-${content}, isAnalyzed-${isAnalyzed}, date-${date}`);

  try {
    const moveRecord = await moveRecordToDifferentCategory(tableName, id, associations, title, content, isAnalyzed, date);

    res.json(moveRecord);
  } catch (error) {
    console.error('Ошибка при перемещении записи:', error);
    res.status(500).json({ error: 'Ошибка при перемещении записи' });
  }
});

// для получения конкретной записи по ID
router.post('/current', getTableName, async (req, res) => {
  const { id } = req.body;
  const { tableName } = req; 

  console.log(`Входящие данные /current : category-${req.body.category}, id-${id}`);

  try {
    
    const currentRecord = await getCurrentRecord(tableName, id);

    res.json(currentRecord);
  } catch (error) {
    console.error('Ошибка при получении текущей записи:', error);
    res.status(500).json({ error: 'Ошибка при получении текущей записи' });
  }
});

// для поиска по записям
router.post('/search', getTableName, async (req, res) => {
  const { value, date } = req.body;
  const { tableName } = req; 

  console.log(`Входящие данные /search : category-${req.body.category}, value-${value}, date-${date}`);

  try {
    const searchResults = await Search(tableName, value, date);
    res.json(searchResults);
  } catch (error) {
    console.error('Ошибка поиска с параметрами:', error);
    res.status(500).json({ error: 'Ошибка поиска с параметрами' });
  }
});

// для получения статистики снов или воспоминаний
router.post('/statistic', getTableName, async (req, res) => {
  const { tableName } = req; 

  console.log('Перед вызовом getStats, tableName:', tableName);

  try {
    const stats = await getStats(tableName);
    res.json(stats);
  } catch (error) {
    console.error('Ошибка обработки запроса:', error);
    res.status(500).json({ error: 'Не удалось получить статистику' });
  }
});

// для получения всех записей с учетом категории
router.post('/all', getTableName, async (req, res) => {
  const { tableName } = req; 

  try {
    const records = await getAllRecords(tableName);
    res.json(records);
  } catch (error) {
    console.error('Ошибка обработки запроса:', error);
    res.status(500).json({ error: 'Не удалось выполнить запрос' });
  }
});

// для поиска всех ассоциаций с учетом категории
router.post('/associationSearch', getTableName, async (req, res) => {
  const { tableName } = req; 

  try {
    const associations = await associationSearch(tableName);
    res.json(associations);
  } catch (error) {
    console.error('Ошибка получения ассоциаций:', error);
    res.status(500).json({ error: 'Не удалось получить ассоциации' });
  }
});

export default router;
