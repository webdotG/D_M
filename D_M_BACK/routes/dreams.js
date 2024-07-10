import express from 'express';
import { getAllRecords, createRecord} from '../models/dreams.js'; 
// import Auth from '../midlewear/auth.js'; 
import { associationSearch } from '../models/associationSearch.js'
import { getStats } from '../models/stats.js';
import { getTableName } from '../midlewear/getTableName.js';

const router = express.Router();

// getStats('dreams')

/* api/dreams/... */

router.post('/add', createRecord )

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

  

