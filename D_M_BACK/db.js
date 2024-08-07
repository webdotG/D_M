import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();
import chalk from 'chalk';

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
    console.log(chalk.green('Коннект к базе данных выполнен успешно'));

    // Проверка существования таблиц и создание, если необходимо
    const tables = [
      { name: 'users', createQuery: `
       CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  date_of_birth DATE NOT NULL,
  password VARCHAR(255) NOT NULL
);
      ` },
      { name: 'photos', createQuery: `
        CREATE TABLE photos (
  photo_id SERIAL PRIMARY KEY,
  photo_url VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INT REFERENCES users(id)
);
      ` },
      { name: 'rooms', createQuery: `
        CREATE TABLE rooms (
  room_id SERIAL PRIMARY KEY,
  room_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INT REFERENCES users(id)
);
    ` },
      { name: 'messages', createQuery: `
        CREATE TABLE messages (
          message_id SERIAL PRIMARY KEY,
          room_id INT REFERENCES rooms(room_id),
          message_text TEXT NOT NULL,
          sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          sender_id INT REFERENCES users(id),
          photo_message INT REFERENCES photos(photo_id)
        );
      ` },
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
        console.log(chalk.blue(`Таблица "${table.name}" существует`));
      } else {
        console.log(chalk.yellow(`Таблица "${table.name}" не найдена, создаем таблицу`));
        await client.query(table.createQuery);
        console.log(chalk.green(`Таблица "${table.name}" создана`));
      }
    }

    // Вывод данных из таблиц
    console.log(chalk.bold('Вывод данных из таблиц:'));

    const tablesData = {
      users: 'SELECT * FROM users',
      photos: 'SELECT * FROM photos',
      rooms: 'SELECT * FROM rooms',
      messages: 'SELECT * FROM messages',
    };

    for (const [table, query] of Object.entries(tablesData)) {
      const result = await client.query(query);
      if (result.rows.length > 0) {
        console.log(chalk.bold(`Данные из таблицы "${table}":`));
        console.table(result.rows);
      } else {
        console.log(chalk.red(`Нет данных в таблице "${table}"`));
      }
    }

    return client;
  } catch (err) {
    console.error(chalk.red('Ошибка при подключении к базе данных:'), err);
    throw err;
  }
}

const client = await connectDB();

export { pool, client };
