import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import dreamRoutes from './routes/records.js';
import chatUsersRoutes from './routes/chat_users.js';
import chatAiRoutes from './routes/gpt.js';
import createWsServer from './ws-server.js'; 

dotenv.config();

const port = process.env.PORT || 5173;
const app = express();
app.use(cors());
app.use(express.json());

// Создание HTTP сервера
const httpServer = http.createServer(app);

// Создание и запуск WebSocket сервера
const wsServer = createWsServer(httpServer);

// Определение маршрутов 
app.use('/api/user', userRoutes);
app.use('/api/dreams', dreamRoutes);
app.use('/api/chat_users', chatUsersRoutes);
app.use('/api/chat_ai', chatAiRoutes);

// Запуск HTTP сервера
httpServer.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});

// Обработка сигнала SIGINT для корректного завершения работы сервера
process.on('SIGINT', () => {
  console.log('Получен SIGINT. Выполняется корректное завершение работы.');

  // Закрытие WebSocket сервера
  wsServer.close(() => {
    console.log('WebSocket сервер закрыт.');
    // Закрытие HTTP сервера
    httpServer.close(() => {
      console.log('HTTP сервер закрыт.');
      process.exit(0);
    });
  });

  // Принудительное завершение работы через 5 секунд, если серверы не закроются
  setTimeout(() => {
    console.error('Принудительное завершение работы.');
    process.exit(1);
  }, 60000);
});
