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

    // Вставка тестовых данных в таблицу 'dreams'
    await db.exec(`
      INSERT INTO dreams (category, title, content, isAnalyzed, date)
      VALUES
        ('сны', 'Полет над городом', 'Я летал над городом и контролировал всё.', 1, '2024-07-04'),
        ('сны', 'Магический квест', 'Я был на магическом квесте в поисках скрытого сокровища.', 1, '2024-07-02');
    `);

    // Вставка тестовых данных в таблицу 'memories'
    await db.exec(`
      INSERT INTO memories (category, title, content, isAnalyzed, date)
      VALUES
        ('воспоминания', 'Первый день в школе', 'Я пошёл в школу в первый раз и познакомился с новыми друзьями.', 0, '2000-09-01'),
        ('воспоминания', 'Путешествие на море', 'Наша семья поехала на море, и мы отлично провели время.', 0, '2005-07-15');
    `);

    // Вставка тестовых данных в таблицу 'association'
    await db.exec(`
      INSERT INTO association (link)
      VALUES
        ('полет'), 
        ('магия');
    `);

    // Вставка тестовых данных в таблицу 'video'
    await db.exec(`
      INSERT INTO video (link)
      VALUES
        ('video_link_1'), 
        ('video_link_2');
    `);

    // Вставка тестовых данных в таблицу 'img'
    await db.exec(`
      INSERT INTO img (link)
      VALUES
        ('img_link_1'), 
        ('img_link_2');
    `);

    // Вставка тестовых данных в таблицу 'dream_associations'
    await db.exec(`
      INSERT INTO dream_associations (dream_id, association_id)
      VALUES
        (1, 1),
        (2, 2);
    `);

    // Вставка тестовых данных в таблицу 'dream_videos'
    await db.exec(`
      INSERT INTO dream_videos (dream_id, video_id)
      VALUES
        (1, 1),
        (2, 2);
    `);

    // Вставка тестовых данных в таблицу 'dream_imgs'
    await db.exec(`
      INSERT INTO dream_imgs (dream_id, img_id)
      VALUES
        (1, 1),
        (2, 2);
    `);

    // Вставка тестовых данных в таблицу 'memory_associations'
    await db.exec(`
      INSERT INTO memory_associations (memory_id, association_id)
      VALUES
        (1, 1),
        (2, 2);
    `);

    // Вставка тестовых данных в таблицу 'memory_videos'
    await db.exec(`
      INSERT INTO memory_videos (memory_id, video_id)
      VALUES
        (1, 1),
        (2, 2);
    `);

    // Вставка тестовых данных в таблицу 'memory_imgs'
    await db.exec(`
      INSERT INTO memory_imgs (memory_id, img_id)
      VALUES
        (1, 1),
        (2, 2);
    `);

    // Вывод данных из таблиц для проверки
    const dreamRows = await db.all('SELECT * FROM dreams');
    console.log('Текущие данные в таблице dreams:');
    console.log(dreamRows);

    const memoryRows = await db.all('SELECT * FROM memories');
    console.log('Текущие данные в таблице memories:');
    console.log(memoryRows);

    const associationRows = await db.all('SELECT * FROM association');
    console.log('Текущие данные в таблице association:');
    console.log(associationRows);

    const videoRows = await db.all('SELECT * FROM video');
    console.log('Текущие данные в таблице video:');
    console.log(videoRows);

    const imgRows = await db.all('SELECT * FROM img');
    console.log('Текущие данные в таблице img:');
    console.log(imgRows);

    const dreamAssociationRows = await db.all('SELECT * FROM dream_associations');
    console.log('Текущие данные в таблице dream_associations:');
    console.log(dreamAssociationRows);

    const dreamVideoRows = await db.all('SELECT * FROM dream_videos');
    console.log('Текущие данные в таблице dream_videos:');
    console.log(dreamVideoRows);

    const dreamImgRows = await db.all('SELECT * FROM dream_imgs');
    console.log('Текущие данные в таблице dream_imgs:');
    console.log(dreamImgRows);

    const memoryAssociationRows = await db.all('SELECT * FROM memory_associations');
    console.log('Текущие данные в таблице memory_associations:');
    console.log(memoryAssociationRows);

    const memoryVideoRows = await db.all('SELECT * FROM memory_videos');
    console.log('Текущие данные в таблице memory_videos:');
    console.log(memoryVideoRows);

    const memoryImgRows = await db.all('SELECT * FROM memory_imgs');
    console.log('Текущие данные в таблице memory_imgs:');
    console.log(memoryImgRows);

    console.log('База данных и таблицы успешно созданы и заполнены тестовыми данными');
  } catch (error) {
    console.error('Ошибка настройки базы данных:', error);
  }
}

setup();
