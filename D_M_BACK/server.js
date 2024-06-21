import express from 'express';
import pkg from 'express';
const { Request, Response } = pkg;
import { connectDB } from './db.js';


const app = express();
const port = process.env.PORT;

console.log('server.js Подключение к БД ...');

connectDB()
  .then(() => {
    console.log('server.js  Коннект !');
    // Далее
  })
  .catch((err) => {
    console.error('server.js НЕТ Коннекта : ', err);
    process.exit(1);
  });


app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});
