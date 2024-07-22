import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

// Функция для открытия базы данных
export async function openDb(dbPath: string): Promise<Database> {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}

// Основная функция для настройки базы данных
async function setup() {
  try {
    // Определение пути к базе данных
    const dbPath = path.resolve(__dirname, 'dreams_memories.db');
    // Открытие базы данных
    const db = await openDb(dbPath);

    // Создание таблицы 'dreams' если она не существует
    await db.exec(`
      CREATE TABLE IF NOT EXISTS dreams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        isAnalyzed BOOLEAN NOT NULL,
        date TEXT NOT NULL,
        createdAt TEXT DEFAULT (DATETIME('now')),
        updatedAt TEXT DEFAULT (DATETIME('now'))
      );
    `);

    // Создание таблицы 'memories' если она не существует
    await db.exec(`
      CREATE TABLE IF NOT EXISTS memories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        isAnalyzed BOOLEAN NOT NULL,
        date TEXT NOT NULL,
        createdAt TEXT DEFAULT (DATETIME('now')),
        updatedAt TEXT DEFAULT (DATETIME('now'))
      );
    `);

    // Создание таблицы 'association' для хранения ассоциаций
    await db.exec(`
      CREATE TABLE IF NOT EXISTS association (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        link TEXT DEFAULT '', -- Список ассоциаций в виде обычной строки
        createdAt TEXT DEFAULT (DATETIME('now'))
      );
    `);

    // Создание таблицы 'video' для хранения ссылок на видео
    await db.exec(`
      CREATE TABLE IF NOT EXISTS video (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        link TEXT DEFAULT '',
        createdAt TEXT DEFAULT (DATETIME('now'))
      );
    `);

    // Создание таблицы 'img' для хранения ссылок на изображения
    await db.exec(`
      CREATE TABLE IF NOT EXISTS img (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        link TEXT DEFAULT '',
        createdAt TEXT DEFAULT (DATETIME('now'))
      );
    `);

    // Создание таблицы для связи 'dreams' с 'associations'
    await db.exec(`
      CREATE TABLE IF NOT EXISTS dream_associations (
        dream_id INTEGER,
        association_id INTEGER,
        FOREIGN KEY (dream_id) REFERENCES dreams(id),
        FOREIGN KEY (association_id) REFERENCES association(id)
      );
    `);

    // Создание таблицы для связи 'dreams' с 'videos'
    await db.exec(`
      CREATE TABLE IF NOT EXISTS dream_videos (
        dream_id INTEGER,
        video_id INTEGER,
        FOREIGN KEY (dream_id) REFERENCES dreams(id),
        FOREIGN KEY (video_id) REFERENCES video(id)
      );
    `);

    // Создание таблицы для связи 'dreams' с 'images'
    await db.exec(`
      CREATE TABLE IF NOT EXISTS dream_imgs (
        dream_id INTEGER,
        img_id INTEGER,
        FOREIGN KEY (dream_id) REFERENCES dreams(id),
        FOREIGN KEY (img_id) REFERENCES img(id)
      );
    `);

    // Создание таблицы для связи 'memories' с 'associations'
    await db.exec(`
      CREATE TABLE IF NOT EXISTS memory_associations (
        memory_id INTEGER,
        association_id INTEGER,
        FOREIGN KEY (memory_id) REFERENCES memories(id),
        FOREIGN KEY (association_id) REFERENCES association(id)
      );
    `);

    // Создание таблицы для связи 'memories' с 'videos'
    await db.exec(`
      CREATE TABLE IF NOT EXISTS memory_videos (
        memory_id INTEGER,
        video_id INTEGER,
        FOREIGN KEY (memory_id) REFERENCES memories(id),
        FOREIGN KEY (video_id) REFERENCES video(id)
      );
    `);

    // Создание таблицы для связи 'memories' с 'images'
    await db.exec(`
      CREATE TABLE IF NOT EXISTS memory_imgs (
        memory_id INTEGER,
        img_id INTEGER,
        FOREIGN KEY (memory_id) REFERENCES memories(id),
        FOREIGN KEY (img_id) REFERENCES img(id)
      );
    `);

    // Вывод данных из таблиц для проверки
    const dreamRows = await db.all('SELECT * FROM dreams');
    console.log('Данные в таблице dreams:', dreamRows);
   
    const memoryRows = await db.all('SELECT * FROM memories');
    console.log('Данные в таблице memories:', memoryRows);
 
    const associationRows = await db.all('SELECT * FROM association');
    console.log('Данные в таблице association:', associationRows);

    const videoRows = await db.all('SELECT * FROM video');
    console.log('Данные в таблице video:', videoRows);

    const imgRows = await db.all('SELECT * FROM img');
    console.log('Данные в таблице img:',imgRows);
    
    const dreamAssociationRows = await db.all('SELECT * FROM dream_associations');
    console.log('Данные в таблице dream_associations:', dreamAssociationRows);
 
    const dreamVideoRows = await db.all('SELECT * FROM dream_videos');
    console.log('Данные в таблице dream_videos:', dreamVideoRows);
  
    const dreamImgRows = await db.all('SELECT * FROM dream_imgs');
    console.log('Данные в таблице dream_imgs:', dreamImgRows);

    const memoryAssociationRows = await db.all('SELECT * FROM memory_associations');
    console.log('Данные в таблице memory_associations:', memoryAssociationRows);

    const memoryVideoRows = await db.all('SELECT * FROM memory_videos');
    console.log('Данные в таблице memory_videos:', memoryVideoRows);

    const memoryImgRows = await db.all('SELECT * FROM memory_imgs');
    console.log('Данные в таблице memory_imgs:', memoryImgRows);

    console.log('База данных и таблицы успешно созданы');
  } catch (error) {
    console.error('Ошибка настройки базы данных:', error);
  }
}

setup();
