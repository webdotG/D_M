import express from 'express';
import { getAllRecords, getCurrentRecord, changeRecord , createRecord} from '../models/dreams.js'; 
// import Auth from '../midlewear/auth.js'; 
import { associationSearch } from '../models/associationSearch.js'

const router = express.Router();

/* api/dreams/... */

router.post('/add', createRecord )
router.get('/current/:id', getCurrentRecord); 
router.put('/change/:id', changeRecord)
router.get('/associationSearch', associationSearch)


// Маршрут для получения всех записей с учетом категории
router.get('/all', async (req, res) => {
  try {
    const { category } = req.query;
    console.log('routes dreams category ... : ', category)
    // Проверка наличия категории
    if (!category) {
      return res.status(400).json({ error: 'Необходимо указать категорию' });
    }

    // Определение таблицы в зависимости от категории
    let tableName;
    if (category === 'сны') {
      tableName = 'dreams';
    } else if (category === 'воспоминание') {
      tableName = 'memories';
    } else {
      return res.status(400).json({ error: 'Некорректная категория' });
    }

    // Здесь вызывается функция, которая обрабатывает запрос и возвращает данные
    const records = await getAllRecords(tableName); 

    res.json(records);
  } catch (error) {
    console.error('Ошибка обработки запроса:', error);
    res.status(500).json({ error: 'Не удалось выполнить запрос' });
  }
});

export default router;

  

