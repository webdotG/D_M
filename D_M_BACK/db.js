import pkg from 'pg';
const { Pool } = pkg;

import dotenv from 'dotenv';

// Загрузка .env
dotenv.config();

// Данные подключения 
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT || '5432'),
});

// Экспортируем асинхронную функцию queryDB, которая принимает SQL-запрос (query) и параметры запроса (params)
export async function queryDB(query, params) {
    try {
      // Подключаемся к базе данных и получаем клиента (объект для выполнения запросов)
      const client = await pool.connect();
      
      // Выполняем SQL-запрос с указанными параметрами и сохраняем результат
      const result = await client.query(query, params);
      
      // Освобождаем клиент, чтобы вернуть его в пул соединений
      client.release();
      
      // Возвращаем результат выполнения запроса
      return result;
    } catch (err) {
      // Если произошла ошибка при выполнении запроса, выводим её в консоль
      console.error('Error executing query', err);
      
      // Пробрасываем ошибку дальше для обработки в вызывающем коде
      throw err;
    }
}

// Подключение к базе данных
export async function connectDB() {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL');
    return client;
  } catch (err) {
    console.error('Error connecting to PostgreSQL', err);
    throw err;
  }
}

// объект pool для использования в других модулях
export { pool };
