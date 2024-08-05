import express from 'express';
import { Current, Login, Register } from '../models/users/user.js';
import Auth from '../midlewear/auth.js'; 

const router = express.Router();

/* api/user/... */
router.get('/current', Auth, Current);
router.post('/login', Login);
router.post('/register', Register);


export default router;
