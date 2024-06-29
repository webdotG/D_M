import express from 'express';
import http from 'node:http';
import cors from 'cors';
import userRoutes from './routes/user.js';
import dreamRoutes from './routes/dreams.js';
import { connectDB as connectPostgresDB } from './db.js'; 
import { connectDB as connectSQLiteDB } from './dbLite.js'; 

const port = process.env.PORT || 5173;
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Подключение к PostgreSQL 
connectPostgresDB().then(pgClient => {
  app.locals.pgClient = pgClient; // Хранение подключения PostgreSQL в локальных переменных приложения
  console.log('Подключение к PostgreSQL установлено');
}).catch(error => {
  console.error('Ошибка подключения к PostgreSQL:', error);
});

// Подключение к SQLite 
connectSQLiteDB().then(sqliteDB => {
  app.locals.sqliteDB = sqliteDB; // Хранение подключения SQLite в локальных переменных приложения
  console.log('Подключение к SQLite установлено');
}).catch(error => {
  console.error('Ошибка подключения к SQLite:', error);
});

// Маршруты (PostgreSQL)
app.use('/api/user', userRoutes);

// Маршруты (SQLite)
app.use('/api/dreams', dreamRoutes);

// Запуск сервера
server.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});



// Обработчик сигнала SIGINT для корректного завершения работы сервера
process.on('SIGINT', () => {
  console.log('Получен SIGINT. Выполняется корректное завершение работы.');
  server.close(() => {
    console.log('HTTP сервер закрыт.');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('Принудительное завершение работы.');
    process.exit(1);
  }, 5000); // Настройте таймаут по необходимости
});
