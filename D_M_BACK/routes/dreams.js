import express from 'express';
import { getAllDreams, getCurrentDream, changeDream , createDream} from '../models/dreams.js'; 
import Auth from '../midlewear/auth.js'; 

const router = express.Router();

/* api/dreams/... */

router.get('/all', getAllDreams); 
router.get('/current/:id', getCurrentDream); 
// router.put('/change/:id', changeDream)
// router.post('/add_d-m', createDream )

router.post('/add_d-m', async (req, res) => {
    try {
      const newDream = req.body;
      console.log('Received new dream:', newDream); // Логирование данных, полученных из запроса
  
      const result = await createDream(newDream); // Вызываем функцию createDream для создания сна
      console.log('Created dream in database:', result); // Логирование результата создания сна
  
      res.json(result); // Возвращаем результат клиенту
    } catch (error) {
      console.error('Failed to add dream:', error); // Логирование ошибки, если она произошла
      res.status(500).json({ error: 'Failed to add dream' }); // Возвращаем ошибку клиенту
    }
  });

  router.put('/change/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const updatedData = req.body;
      console.log('Received update for dream with ID', id); // Логирование ID сна, который будет изменен
      console.log('Updated data:', updatedData); // Логирование данных для обновления
  
      const result = await changeDream(id, updatedData); // Вызываем функцию changeDream для изменения сна
      console.log('Dream update result:', result); // Логирование результата изменения сна
  
      res.json({ success: result }); // Возвращаем результат клиенту
    } catch (error) {
      console.error('Failed to update dream:', error); // Логирование ошибки, если она произошла
      res.status(500).json({ error: 'Failed to update dream' }); // Возвращаем ошибку клиенту
    }
  });
  



  


export default router;
