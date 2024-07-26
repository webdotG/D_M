import express from 'express';
import { getTableName } from '../midlewear/getTableName.js'; 
import { associationAll } from '../models/associationAll.js';
import { getStats } from '../models/stats.js';
import { Search } from '../models/search.js';
import { getCurrentRecord} from '../models/currentRecord.js';
import { moveRecordToDifferentCategory } from '../models/moveRecord.js';
import { updateRecordById } from '../models/updateRecordById.js';
import { deleteRecordById } from '../models/deleteRecord.js';
import { getAllRecords } from '../models/getAllRecord.js'
import {fetchAssociationsByRecordId} from '../models/associationByID.js'
import { addRecord } from '../models/addRecord.js'

const router = express.Router();

// Для получения конкретной записи по ID
router.post('/current', getTableName, async (req, res) => {
  const { id } = req.body;
  const { tableName } = req; 
  console.log(`Входящие данные /current : category-${tableName}, id-${id}`);
  try {
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

  console.log(`Входящие данные /search : category-${tableName}, value-${value}, date-${date}`);

  try {
    const searchResults = await Search(tableName, value, date);
    res.json(searchResults);
  } catch (error) {
    console.error('Ошибка поиска с параметрами:', error);
    res.status(500).json({ error: 'Ошибка поиска с параметрами' });
  }
});

// для перемещения записи по id
router.patch('/move', getTableName, async (req, res) => {
  const { id, associations, title, content, isAnalyzed, date } = req.body;
  const { tableName } = req; 
  console.log(`Входящие данные /move : 
    tableName-${tableName}, 
    id-${id}, 
    associations-${associations}, 
    title-${title}, 
    content-${content}, 
    isAnalyzed-${isAnalyzed}, 
    date-${date}`
  );
  try {
    const moveRecord = await moveRecordToDifferentCategory(tableName, id, associations, title, content, isAnalyzed, date);
    res.json(moveRecord);
    console.log(`${moveRecord}`)
  } catch (error) {
    console.error('Ошибка при перемещении записи:', error);
    res.status(500).json({ error: 'Ошибка при перемещении записи' });
  }
});


// для редактирования записи по id
router.patch('/update', getTableName, async (req, res) => {
  const { id, associations, title, content, isAnalyzed, date } = req.body;
  const { tableName } = req; 
  console.log(`Входящие данные /update : category-${req.body.category}, id-${id}, associations-${associations}, title-${title}, content-${content}, isAnalyzed-${isAnalyzed}, date-${date}`);
  try {
    const moveRecord = await updateRecordById(tableName, id, associations, title, content, isAnalyzed, date);
    res.json(moveRecord);
  } catch (error) {
    console.error('Ошибка при перемещении записи:', error);
    res.status(500).json({ error: 'Ошибка при перемещении записи' });
  }
});

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
    console.log('ROUT REQ NEW RECORD', newRecord);
    const records = await addRecord(tableName, newRecord);
    console.log('ROUT RES NEW RECORD', newRecord);
    res.json(records);
  } catch (error) {
    console.error('Ошибка обработки запроса:', error);
    res.status(500).json({ error: 'Не удалось выполнить запрос' });
  }
});


// для получения ассоциаций по id
router.post('/associationId', getTableName, async (req, res) => {
  const { recordId } = req.body;
  const { tableName } = req;
  if (!recordId || !tableName) {
    return res.status(400).json({ error: 'recordId и tableName обязательны' });
  }
  try {
    const associations = await fetchAssociationsByRecordId(tableName, recordId);
    res.json({ associations });
  } catch (error) {
    console.error('Ошибка получения ассоциаций:', error);
    res.status(500).json({ error: 'Не удалось получить ассоциации' });
  }
});


// Для поиска всех ассоциаций
router.post('/associationAll', getTableName, async (req, res) => {
  const { tableName } = req; 
  try {
    const { uniqueAssociations } = await associationAll(tableName); 
    // Устанавливаем ассоциации как массив объектов
    res.json({ uniqueAssociations });
  } catch (error) {
    console.error('Ошибка получения ассоциаций:', error);
    res.status(500).json({ error: 'Не удалось получить ассоциации' });
  }
});


// для удаления записи по ID с учетом категории
router.post('/delete', getTableName, async (req, res) => {
  const { id } = req.body;
  const { tableName } = req;
  // console.log(`Incoming data /delete : category-${category}, id-${id}`);
  try {
    const result = await deleteRecordById(tableName, id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Error deleting record' });
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


export default router;
