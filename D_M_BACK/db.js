import pkg from 'pg';
const { Pool } = pkg;

import dotenv from 'dotenv';
dotenv.config();

// Данные подключения 
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT || '5432'),
});


// Проверка подключения к базе данных
export async function connectDB() {
  try {
    const client = await pool.connect();
    if (client) console.log('db.js ... Конект PostgresSQL ');
    const checkUserQuery = `
        SELECT id, user_name 
        FROM public.users 
        WHERE user_name = $1
    `;
    console.log(`request: ${checkUserQuery}`);
    const userResult = await client.query(checkUserQuery, ['username']);
    console.log(`Req db`)
    return client;
  } catch (err) {
    console.error('db.js ... НЕ Конект  PostgresSQL ', err);
    throw err;
  }
}

const client = await connectDB()

// объект pool для использования в других модулях
export { pool, client };
