import express, { Request, Response } from 'express';
import { Pool } from 'pg';

const app = express();
const port = process.env.PORT || 5000;

//PostgreSQL
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'D_M_DB',
  password: 'your_password',
  port: 5432, // Порт PostgreSQL 
});

pool.connect()
  .then(client => {
    console.log('Connected to PostgreSQL');
    client.release();
  })
  .catch(err => {
    console.error('Error acquiring client', err.stack);
  });

//проверка сервера
app.get('/', (req: Request, res: Response) => {
  res.send('Server is running');
});

//порт
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
