import express from 'express';
import { getAllDreams, getCurrentDream, changeDream } from '../models/dreams.js'; 
import Auth from '../midlewear/auth.js'; 

const router = express.Router();

/* api/dreams/... */
router.get('/all', getAllDreams); 
router.get('/current/:id', getCurrentDream); 
router.put('/change/:id', changeDream)
// // Получение конкретного сна по ID
// router.get('/current/:id', Auth, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const dream = await getCurrentDream(id);
//     if (dream) {
//       res.json(dream);
//     } else {
//       res.status(404).json({ error: 'Сон не найден' });
//     }
//   } catch (error) {
//     console.error('Ошибка получения сна:', error);
//     res.status(500).json({ error: 'Не удалось получить сон' });
//   }
// });

// // изменение конкретного по ID
// router.put('/change/:id', Auth, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedData = req.body;
//     const success = await changeDream(id, updatedData);
//     if (success) {
//       res.json({ message: 'Сон успешно обновлен' });
//     } else {
//       res.status(404).json({ error: 'Сон не найден' });
//     }
//   } catch (error) {
//     console.error('Ошибка изменения сна:', error);
//     res.status(500).json({ error: 'Не удалось изменить сон' });
//   }
// });

export default router;
