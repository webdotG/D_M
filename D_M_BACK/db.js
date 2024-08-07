import pkg from 'pg';
const { Pool } = pkg;

import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT || '5432'),
});

export async function connectDB() {
  try {
    const client = await pool.connect();
    console.log('Коннект к базе данных выполнен успешно');

    // Проверка существования таблицы пользователей
    const checkUsersTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `;
    const usersTableResult = await client.query(checkUsersTableQuery);
    if (usersTableResult.rows[0].exists) {
      console.log('Таблица "users" существует');
    } else {
      console.log('Таблица "users" не найдена, создаем таблицу');
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          user_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL
        );
      `);
      console.log('Таблица "users" создана');
    }

    // Проверка существования таблицы чатов
    const checkChatsTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'chats'
      );
    `;
    const chatsTableResult = await client.query(checkChatsTableQuery);
    if (chatsTableResult.rows[0].exists) {
      console.log('Таблица "chats" существует');
    } else {
      console.log('Таблица "chats" не найдена, создаем таблицу');
      await client.query(`
        CREATE TABLE chats (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Таблица "chats" создана');
    }

    // Проверка существования таблицы участников чатов
    const checkChatParticipantsTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'chat_participants'
      );
    `;
    const chatParticipantsTableResult = await client.query(checkChatParticipantsTableQuery);
    if (chatParticipantsTableResult.rows[0].exists) {
      console.log('Таблица "chat_participants" существует');
    } else {
      console.log('Таблица "chat_participants" не найдена, создаем таблицу');
      await client.query(`
        CREATE TABLE chat_participants (
          chat_id INT REFERENCES chats(id),
          user_id INT REFERENCES users(id),
          PRIMARY KEY (chat_id, user_id)
        );
      `);
      console.log('Таблица "chat_participants" создана');
    }

    // Проверка существования таблицы сообщений
    const checkMessagesTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'messages'
      );
    `;
    const messagesTableResult = await client.query(checkMessagesTableQuery);
    if (messagesTableResult.rows[0].exists) {
      console.log('Таблица "messages" существует');
    } else {
      console.log('Таблица "messages" не найдена, создаем таблицу');
      await client.query(`
        CREATE TABLE messages (
          id SERIAL PRIMARY KEY,
          chat_id INT REFERENCES chats(id),
          sender_id INT REFERENCES users(id),
          message_text TEXT NOT NULL,
          sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Таблица "messages" создана');
    }


   
   // Проверка взаимодействия таблиц
   console.log('Проверка взаимодействия таблиц:');
    
   const usersResult = await client.query('SELECT * FROM users');
   if (usersResult.rows.length > 0) {
     console.log('Пользователи:');
     console.table(usersResult.rows);
   } else {
     console.log('Нет данных в таблице "users"');
   }

   const chatsResult = await client.query('SELECT * FROM chats');
   if (chatsResult.rows.length > 0) {
     console.log('Чаты:');
     console.table(chatsResult.rows);
   } else {
     console.log('Нет данных в таблице "chats"');
   }

   // Группировка участников по чатам
   const chatParticipantsQuery = `
     SELECT chat_id, json_agg(json_build_object('user_id', user_id)) AS participants
     FROM chat_participants
     GROUP BY chat_id
     ORDER BY chat_id;
   `;
   
   const chatParticipantsResult = await client.query(chatParticipantsQuery);
   if (chatParticipantsResult.rows.length > 0) {
     console.log('Участники чатов:');
     chatParticipantsResult.rows.forEach(row => {
       console.log(`Чат ${row.chat_id}:`);
       console.table(row.participants);
     });
   } else {
     console.log('Нет данных в таблице "chat_participants"');
   }

   // Группировка сообщений по чатам
   const messagesQuery = `
     SELECT chat_id, json_agg(json_build_object('id', id, 'sender_id', sender_id, 'message_text', message_text, 'sent_at', sent_at)) AS messages
     FROM messages
     GROUP BY chat_id
     ORDER BY chat_id;
   `;
   
   const messagesResult = await client.query(messagesQuery);
   if (messagesResult.rows.length > 0) {
     console.log('Сообщения:');
     messagesResult.rows.forEach(row => {
       console.log(`Чат ${row.chat_id}:`);
       console.table(row.messages);
     });
   } else {
     console.log('Нет данных в таблице "messages"');
   }

    return client;
  } catch (err) {
    console.error('Ошибка при подключении к базе данных:', err);
    throw err;
  }
}

const client = await connectDB();

export { pool, client };
