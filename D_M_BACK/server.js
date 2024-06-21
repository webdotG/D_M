import express from 'express';
import pkg from 'express';
const { Request, Response } = pkg;
import { connectDB, queryDB } from './db.js';


const app = express();
const port = process.env.PORT || 5000;

// Пример маршрута для проверки работы сервера
app.get('/', async (req, res) => {

  const test = await queryDB()
  console.log ('TEST QUERY DB test : ', test)
  try {
    // Подключаемся к базе данных
    const client = await connectDB();
    // Здесь можно выполнять запросы к базе данных или другие операции
    
    res.send('Server is running');
  } catch (err) {
    console.error('Error in server request', err);
    res.status(500).send('Internal Server Error');
  }
});

// Слушаем указанный порт
app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});
