import express from 'express';
import {
  CreateChat,
  GetChats,
  GetMessages,
  SendMessage,
  DeleteChat 
} from '../models/chats_users/chats_users.js';
import { Auth } from '../midlewear/auth.js'; 

const router = express.Router();

/* api/chat_users/... */

router.post('/create', Auth, CreateChat);
router.get('/list/:userId', Auth, GetChats);
router.get('/:chatId/messages', Auth, GetMessages);
router.post('/:chatId/messages', Auth, SendMessage);
router.delete('/:chatId', Auth, DeleteChat); 

export default router;
