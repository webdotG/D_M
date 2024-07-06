import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import assert from 'assert';

// Путь к SQLite
const dbPath = '/home/webdotg/A_webdotgProjects/D_M/D_M_LiteSQL/db/dreams_memories.db';

// Открытие подключения к SQLite
export async function connectDB() {
  try {
    const dbLite = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    console.log('Успешно подключились к базе данных SQLite', dbLite.db);
    return dbLite;
  } catch (error) {
    console.error('Ошибка при подключении к базе данных SQLite:', error);
    throw error;
  }
}

// Для получения объекта базы данных
let dbLite;

(async () => {
  try {
    dbLite = await connectDB();
    console.log('Подключение к SQLite установлено');

    // Проверка существования таблицы dreams
    const result = await dbLite.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='dreams';`);
    if (result) {
      console.log('Таблица dreams существует', result);
    } else {
      console.log('Таблица dreams не найдена, создаем таблицу');
      await dbLite.exec(`
        CREATE TABLE IF NOT EXISTS dreams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        associations TEXT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        isAnalyzed BOOLEAN NOT NULL,
        date TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT
      );
      `);
      console.log('Таблица dreams успешно создана');
    }

    // Выборка данных из таблицы dreams
    const rows = await dbLite.all('SELECT * FROM dreams');
    console.log('Данные из таблицы dreams:');
    console.log(JSON.stringify(rows, null, 2));
  } catch (error) {
    console.error('Не удалось инициализировать базу данных:', error);
    process.exit(1); // В случае ошибки при инициализации, завершаем процесс
  }
})();

export { dbLite };
