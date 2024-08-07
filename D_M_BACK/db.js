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

    // Проверка существования таблиц и создание, если необходимо
    const tables = [
      { name: 'users', createQuery: `
        CREATE TABLE IF NOT EXISTS users (
          user_id SERIAL PRIMARY KEY,
          user_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          date_of_birth DATE NOT NULL,
          password VARCHAR(255) NOT NULL
        );
      ` },
      { name: 'photos', createQuery: `
        CREATE TABLE IF NOT EXISTS photos (
          photo_id SERIAL PRIMARY KEY,
          photo_url VARCHAR(255) NOT NULL,
          uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          user_id INT REFERENCES users(user_id)
        );
      ` },
      { name: 'chats', createQuery: `
        CREATE TABLE IF NOT EXISTS chats (
          chat_id SERIAL PRIMARY KEY,
          chat_name VARCHAR(255) NOT NULL,
          created_user INT REFERENCES users(user_id),
          invited_user INT REFERENCES users(user_id)
        );
      ` },
      { name: 'messages', createQuery: `
        CREATE TABLE IF NOT EXISTS messages (
          message_id SERIAL PRIMARY KEY,
          chat_id INT REFERENCES chats(chat_id),
          message_text TEXT NOT NULL,
          sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          sender_id INT REFERENCES users(user_id),
          photo_message INT REFERENCES photos(photo_id)
        );
      ` }
    ];

    for (const table of tables) {
      const checkTableQuery = `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = '${table.name}'
        );
      `;
      const tableResult = await client.query(checkTableQuery);
      if (tableResult.rows[0].exists) {
        console.log(`Таблица "${table.name}" существует`);
      } else {
        console.log(`Таблица "${table.name}" не найдена, создаем таблицу`);
        await client.query(table.createQuery);
        console.log(`Таблица "${table.name}" создана`);
      }
    }

    // Вывод названий столбцов из таблиц
    console.log('Вывод названий столбцов из таблиц:');

    const tablesData = {
      users: 'SELECT column_name FROM information_schema.columns WHERE table_name = \'users\'',
      photos: 'SELECT column_name FROM information_schema.columns WHERE table_name = \'photos\'',
      chats: 'SELECT column_name FROM information_schema.columns WHERE table_name = \'chats\'',
      messages: 'SELECT column_name FROM information_schema.columns WHERE table_name = \'messages\'',
    };

    for (const [table, query] of Object.entries(tablesData)) {
      const result = await client.query(query);
      if (result.rows.length > 0) {
        const columnNames = result.rows.map(row => row.column_name).join(', ');
        console.log(`Столбцы в таблице "${table}": ${columnNames}`);
      } else {
        console.log(`Нет данных о столбцах в таблице "${table}"`);
      }
    }

    // Функция для получения всех сообщений по chat_id
    async function getMessagesByChatId(chatId) {
      const query = 'SELECT * FROM messages WHERE chat_id = $1';
      const result = await client.query(query, [chatId]);
      return result.rows;
    }

    // Пример использования функции
    const chatId = 1; // Укажите нужный chat_id
    const messages = await getMessagesByChatId(chatId);
    console.log(`Сообщения для чата ${chatId}:`, messages);

    return client;
  } catch (err) {
    console.error('Ошибка при подключении к базе данных:', err);
    throw err;
  }
}

const client = await connectDB();

export { pool, client };
