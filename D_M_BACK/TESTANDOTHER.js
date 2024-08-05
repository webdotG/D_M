import { connectDB as connectPostgresDB } from './db.js'; 
import { connectDB as connectSQLiteDB } from './dbLite.js'; 
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