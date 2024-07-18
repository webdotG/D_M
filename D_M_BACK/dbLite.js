import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Путь к SQLite
const dbPath = '/home/webdotg/A_webdotgProjects/D_M/D_M_LiteSQL/db/dreams_memories.db';

// для подключения к SQLite
export async function connectDB() {
  try {
    const dbLite = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    console.log('Успешно подключились к SQLite');
    // console.log('connectDB return dbLite ... >>> ... ', dbLite)
    return dbLite;
  } catch (error) {
    console.error('Ошибка при подключении к  SQLite:', error);
    throw error;
  }
}



//переменная для хранения экземпляра базы данных
export let dbLite;
//экспорт промиса подключения
export const dbLitePromise = connectDB();

// для инициализации базы данных
(async () => {
  try {
    dbLite = await connectDB();
    console.log('Подключение к SQLite установлено');

    // Проверка существования таблицы dreams
    let result = await dbLite.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='dreams';`);
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
        createdAt TEXT DEFAULT (DATETIME('now')),
        updatedAt TEXT DEFAULT (DATETIME('now')),
        video TEXT DEFAULT '',
        img TEXT DEFAULT ''
        );
      `);
      console.log('Таблица dreams успешно создана');

      // Вставка тестовых данных в таблицу dreams
      await dbLite.exec(`
        INSERT INTO dreams (category, associations, title, content, isAnalyzed, date, createdAt, updatedAt)
         VALUES
        ('сны', '["контроль", "полет"]', 'Полет над городом', 'Я летал над городом и контролировал всё.', 1, '2024-07-04'),
        ('сны', '["магия", "приключение"]', 'Магический квест', 'Я был на магическом квесте в поисках скрытого сокровища.', 1, '2024-07-02'),
        ('сны', '["секс", "страсть"]', 'Интим с незнакомцем', 'Мне приснился страстный секс с незнакомцем.', 0, '2024-07-01');
      `);
      console.log('Тестовые данные в таблицу dreams успешно вставлены');
    }

    // Проверка существования таблицы memories
    result = await dbLite.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='memories';`);
    if (result) {
      console.log('Таблица memories существует', result);
    } else {
      console.log('Таблица memories не найдена, создаем таблицу');
      await dbLite.exec(`
        CREATE TABLE IF NOT EXISTS dreams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        associations TEXT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        isAnalyzed BOOLEAN NOT NULL,
        date TEXT NOT NULL,
        createdAt TEXT DEFAULT (DATETIME('now')),
        updatedAt TEXT DEFAULT (DATETIME('now')),
        video TEXT DEFAULT '',
        img TEXT DEFAULT ''
        );
      `);
      console.log('Таблица memories успешно создана');

      // Вставка тестовых данных в таблицу memories
      await dbLite.exec(`
        INSERT INTO memories (event, description, date, location, createdAt, updatedAt)
         VALUES
        ('воспоминания', '["школа", "друзья"]', 'Первый день в школе', 'Я пошёл в школу в первый раз и познакомился с новыми друзьями.', 0, '2000-09-01'),
        ('воспоминания', '["семья", "отпуск"]', 'Путешествие на море', 'Наша семья поехала на море, и мы отлично провели время.', 0, '2005-07-15'),
        ('воспоминания', '["друзья", "праздник"]', '18-й день рождения', 'Я отпраздновал свой 18-й день рождения с друзьями.', 0, '2010-05-20');
      `);
      console.log('Тестовые данные в таблицу memories успешно вставлены');
    }
  } catch (error) {
    console.error('Не удалось инициализировать базу данных:', error);
    process.exit(1); 
  }
})();
