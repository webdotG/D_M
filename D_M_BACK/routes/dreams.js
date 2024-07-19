import express from 'express';
import { getTableName } from '../utils/getTableName.js'; // Импортируем утилитную функцию
import { associationSearch } from '../models/associationSearch.js';
import { getStats } from '../models/stats.js';
import { Search } from '../models/search.js';
import { getCurrentRecord, getAllRecords, addRecord } from '../models/dreams.js';
import { moveRecordToDifferentCategory } from '../models/moveRecord.js';
import { updateRecordById } from '../models/updateRecord.js';
import { deleteRecordById } from '../models/deleteRecord.js';

const router = express.Router();

// Маршрут для добавления записи с учетом категории
router.post('/add', async (req, res) => {
  const { category, associations, title, content, isAnalyzed, date, img, video } = req.body;

  try {
    const tableName = getTableName(category); 

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

// Маршрут для удаления записи по ID
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  const { category } = req.body; 

  console.log(`Incoming data /delete : category-${category}, id-${id}`);

  try {
    const tableName = getTableName(category); 
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

    // Перемещаем запись в другую категорию
    const moveRecord = await moveRecordToDifferentCategory(tableName, id, associations, title, content, isAnalyzed, date);

    res.json(moveRecord);
  } catch (error) {
    console.error('Ошибка при перемещении записи:', error);
    res.status(500).json({ error: 'Ошибка при перемещении записи' });
  }
});

// Роут для редактирования записи по id
router.patch('/patch', async (req, res) => {
  const { category, id, associations, title, content, isAnalyzed, date } = req.body;

  console.log(`Входящие данные /patch : category-${category}, id-${id}, associations-${associations}, title-${title}, content-${content}, isAnalyzed-${isAnalyzed}, date-${date}`);

  try {
    const tableName = getTableName(category); 

    // Обновляем запись по ID в указанной таблице
    const updateRecord = await updateRecordById(tableName, id, associations, title, content, isAnalyzed, date);
    res.json(updateRecord);
  } catch (error) {
    console.error('Ошибка при обновлении записи:', error);
    res.status(500).json({ error: 'Ошибка при обновлении записи' });
  }
});

// Маршрут для получения конкретной записи по id
router.post('/current', async (req, res) => {
  const { category, id } = req.body; // Получаем категорию и ID из тела запроса

  try {
    const tableName = getTableName(category); 

    // Получаем конкретную запись по id из указанной таблицы и с учетом категории
    const currentRecord = await getCurrentRecord(tableName, id);

    res.json(currentRecord);
  } catch (error) {
    console.error('Ошибка при получении текущей записи:', error);
    res.status(500).json({ error: 'Ошибка при получении текущей записи' });
  }
});

// Роут для поиска по записям
router.post('/search', async (req, res) => {
  const { category, value, date } = req.body; // Получаем категорию и параметры поиска из тела запроса

  try {
    const tableName = getTableName(category); 
    const searchResults = await Search(tableName, value, date);
    res.json(searchResults);
  } catch (error) {
    console.error('Ошибка поиска с параметрами:', error);
    res.status(500).json({ error: 'Ошибка поиска с параметрами' });
  }
});

// Маршрут для получения статистики снов или воспоминаний
router.post('/statistic', async (req, res) => {
  const { category } = req.body; 

  try {
    const tableName = getTableName(category); 
    console.log('Перед вызовом getStats, tableName:', tableName);
    const stats = await getStats(tableName);
    res.json(stats);
  } catch (error) {
    console.error('Ошибка обработки запроса:', error);
    res.status(500).json({ error: 'Не удалось получить статистику' });
  }
});

// Маршрут для получения всех записей с учетом категории
router.post('/all', async (req, res) => {
  const { category } = req.body; 

  try {
    const tableName = getTableName(category); 
    const records = await getAllRecords(tableName);
    res.json(records);
  } catch (error) {
    console.error('Ошибка обработки запроса:', error);
    res.status(500).json({ error: 'Не удалось выполнить запрос' });
  }
});

// Маршрут для поиска всех ассоциаций с учетом категории
router.post('/associationSearch', async (req, res) => {
  const { category } = req.body; 

  try {
    const tableName = getTableName(category); 
    const associations = await associationSearch(tableName);
    res.json(associations);
  } catch (error) {
    console.error('Ошибка получения ассоциаций:', error);
    res.status(500).json({ error: 'Не удалось получить ассоциации' });
  }
});

export default router;
