import express from 'express';
import { getAllDreams, getCurrentDream, changeDream } from '../models/dreams.js'; 
import Auth from '../midlewear/auth.js'; 

const router = express.Router();

/* api/dreams/... */

router.get('/all', getAllDreams); 
router.get('/current/:id', getCurrentDream); 
router.put('/change/:id', changeDream)


export default router;
