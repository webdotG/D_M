import express from 'express';
import { getAllDreams, getCurrentDream, changeDream , createDream} from '../models/dreams.js'; 
import Auth from '../midlewear/auth.js'; 
import { associationSearch } from '../models/associationSearch.js'

const router = express.Router();

/* api/dreams/... */

router.get('/all', getAllDreams); 
router.post('/add_d-m', createDream )
router.get('/current/:id', getCurrentDream); 
router.get('/associationSearch', associationSearch)
// router.put('/change/:id', changeDream)




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
