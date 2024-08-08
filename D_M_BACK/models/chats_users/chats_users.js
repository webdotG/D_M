import { pool } from '../../db.js';

/**
 * Создать новый чат.
 */
export const CreateChat = async (req, res) => {
  const { chat_name, invited_user, created_user } = req.body; // Убедитесь, что поля совпадают

  console.log('Создание чата с данными:', { chat_name, invited_user }, 'Создатель:', created_user);

  try {
    const createChatQuery = `
      INSERT INTO chats (chat_name, created_user, invited_user)
      VALUES ($1, $2, $3) RETURNING chat_id
    `;
    const result = await pool.query(createChatQuery, [chat_name, created_user, invited_user]);
    const chatId = result.rows[0].chat_id;
    res.status(201).json({ chatId });
    console.log(`Чат создан успешно: chat_id = ${chatId}`);
  } catch (err) {
    console.error('Ошибка при создании чата:', err.message);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};


  /**
   * Получить все чаты пользователя.
   */
  export const GetChats = async (req, res) => {
    const userId = req.params.userId; // Получение userId из параметров пути

    console.log('Получение чатов для пользователя с ID:', userId);
    try {
      const getChatsQuery = `
        SELECT * FROM chats
        WHERE created_user = $1 OR invited_user = $1
      `;
      const result = await pool.query(getChatsQuery, [userId]);

      console.log(`Чаты пользователя ${userId}:`, result.rows);

      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Ошибка при получении чатов:', err.message);
      res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
  };

/**
 * Получить сообщения для конкретного чата.
 */
export const GetMessages = async (req, res) => {
  const chatId = req.params.chatId;
  console.log('Получение сообщений для чата с ID:', chatId);
  try {
    const getMessagesQuery = `
      SELECT * FROM messages
      WHERE chat_id = $1
      ORDER BY sent_at
    `;
    const result = await pool.query(getMessagesQuery, [chatId]);
    res.status(200).json(result.rows);
    console.log(`Сообщения для чата ${chatId} успешно получены`);
  } catch (err) {
    console.error('Ошибка при получении сообщений:', err.message);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

/**
 * Отправить сообщение в чат.
 */
export const SendMessage = async (req, res) => {
  const chatId = req.params.chatId;
  const { message_text, photo_message } = req.body;
  const senderId = req.user.user_id; // Получаем текущего пользователя

  console.log('Отправка сообщения в чат с данными:', { chatId, message_text, photo_message }, 'Отправитель:', senderId);
  try {
    const sendMessageQuery = `
      INSERT INTO messages (chat_id, message_text, sender_id, photo_message)
      VALUES ($1, $2, $3, $4) RETURNING message_id
    `;
    const result = await pool.query(sendMessageQuery, [chatId, message_text, senderId, photo_message]);
    const messageId = result.rows[0].message_id;
    res.status(201).json({ messageId });
    console.log(`Сообщение отправлено успешно: message_id = ${messageId}`);
  } catch (err) {
    console.error('Ошибка при отправке сообщения:', err.message);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

/**
 * Удалить сообщения и чат.
 */
export const DeleteChat = async (req, res) => {
  const { chatId } = req.params;

  console.log('Удаление чата с ID:', chatId);
  try {
    // Удаление сообщений, связанных с чатом
    await pool.query('DELETE FROM messages WHERE chat_id = $1', [chatId]);

    // Удаление самого чата
    await pool.query('DELETE FROM chats WHERE chat_id = $1', [chatId]);

    res.status(200).json({ message: 'Чат и связанные сообщения успешно удалены' });
    console.log(`Чат и сообщения для chat_id ${chatId} успешно удалены`);
  } catch (err) {
    console.error('Ошибка при удалении чата:', err.message);
    res.status(500).json({ message: 'Внутренняя ошибка сервера', error: err.message });
  }
};
