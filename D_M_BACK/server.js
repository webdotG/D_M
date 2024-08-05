import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.js';
import dreamRoutes from './routes/dreams.js';
import OpenAI from 'openai';

dotenv.config();

const port = process.env.PORT || 5173;
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Маршруты (PostgreSQL)
app.use('/api/user', userRoutes);

// Маршруты (SQLite)
app.use('/api/dreams', dreamRoutes);

// Подключение к OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/chatAI', async (req, res) => {
  const prompt = req.body.prompt;
  console.log('OPEN AI PROMPT >>> : ', prompt)
  try {
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo",
      prompt: prompt,
      max_tokens: 350,
    });

    res.json({ response: response.choices[0].text.trim() });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

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
