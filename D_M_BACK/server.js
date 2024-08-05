import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import dreamRoutes from './routes/records.js';
import chatAiRoutes from './routes/gpt.js'

dotenv.config();

const port = process.env.PORT || 5173;
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Маршруты (User)
app.use('/api/user', userRoutes);

// Маршруты (Records)
app.use('/api/dreams', dreamRoutes);

// Маршруты (chatUsers)
app.use('/api/chat_users', chatAiRoutes);

// Маршруты (AI)
app.use('/api/chat_ai', chatAiRoutes);


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
  }, 5000);
});
