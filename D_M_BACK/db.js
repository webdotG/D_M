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
    console.log('Конект к базе данных выполнен успешно');

    // Проверка существования таблицы пользователей
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `;
    const tableResult = await client.query(checkTableQuery);
    if (tableResult.rows[0].exists) {
      console.log('Таблица "users" существует');
    } else {
      console.log('Таблица "users" не найдена');
    }

    // Проверка текущего пользователя
    const currentUserQuery = `
      SELECT id, user_name 
      FROM public.users 
      LIMIT 1;
    `;
    const userResult = await client.query(currentUserQuery);
    if (userResult.rows.length > 0) {
      console.log('Текущий пользователь:', userResult.rows[0].user_name);
    } else {
      console.log('Пользователи не найдены');
    }

    return client;
  } catch (err) {
    console.error('Ошибка при подключении к базе данных:', err);
    throw err;
  }
}

const client = await connectDB();

export { pool, client };





// import pkg from 'pg';
// const { Pool } = pkg;

// import dotenv from 'dotenv';
// dotenv.config();

// // Данные подключения 
// const pool = new Pool({
//   user: process.env.PG_USER,
//   host: process.env.PG_HOST,
//   database: process.env.PG_DATABASE,
//   password: process.env.PG_PASSWORD,
//   port: parseInt(process.env.PG_PORT || '5432'),
// });


// // Проверка подключения к базе данных
// export async function connectDB() {
//   try {
//     const client = await pool.connect();
//     if (client) console.log('db.js ... Конект PostgresSQL ');
//     const checkUserQuery = `
//         SELECT id, user_name 
//         FROM public.users 
//         WHERE user_name = $1
//     `;
//     console.log(`request: ${checkUserQuery}`);
//     const userResult = await client.query(checkUserQuery, ['username']);
//     console.log(`Req db`)
//     return client;
//   } catch (err) {
//     console.error('db.js ... НЕ Конект  PostgresSQL ', err);
//     throw err;
//   }
// }

// const client = await connectDB()

// // объект pool для использования в других модулях
// export { pool, client };
