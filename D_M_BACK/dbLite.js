import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Путь к SQLite
// const dbPath = path.resolve('D_M_LiteSQL', 'db', 'dreams_memories.db');
const dbPath = '/home/webdotg/A_webdotgProjects/D_M/D_M_LiteSQL/db/dreams_memories.db';


// открытия подключения кSQLite
export async function connectDB() {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    console.log(`dbLite.js  ...  Коннект SQLite `);
    return db;
  } catch (error) {
    console.error('dbLite.js  ... НЕ Конект SQLLIte : ', error);
    throw error;
  }
}

// для получения объекта базы данных
let db;

(async () => {
  db = await connectDB();
})();

export { db };
