import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

export async function openDb(dbPath: string): Promise<Database> {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}

async function setup() {
  try {
    const dbPath = path.resolve(__dirname, 'dreams_memories.db');
    const db = await openDb(dbPath);
    
    // Создание таблицы dreams
    await db.exec(`
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

    // Создание таблицы memories
    await db.exec(`
      CREATE TABLE IF NOT EXISTS memories (
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
    
    // Вставка тестовых данных в dreams
    await db.exec(`
      INSERT INTO dreams (category, associations, title, content, isAnalyzed, date, createdAt, updatedAt)
      VALUES
        ('сон', 'контроль, полет', 'Полет над городом', 'Я летал над городом и контролировал всё.', 1, '2024-07-04', '2024-07-04', '2024-07-04'),
        ('сон', 'магия, приключение', 'Магический квест', 'Я был на магическом квесте в поисках скрытого сокровища.', 1, '2024-07-02', '2024-07-02', '2024-07-02'),
        ('сон', 'секс, страсть', 'Интим с незнакомцем', 'Мне приснился страстный секс с незнакомцем.', 0, '2024-07-01', '2024-07-01', '2024-07-01');
    `);
    
    // Вставка тестовых данных в memories
    await db.exec(`
      INSERT INTO memories (category, associations, title, content, isAnalyzed, date, createdAt, updatedAt)
      VALUES
        ('воспоминание', 'школа, друзья', 'Первый день в школе', 'Я пошёл в школу в первый раз и познакомился с новыми друзьями.', 0, '2000-09-01', '2024-07-05', '2024-07-05'),
        ('воспоминание', 'семья, отпуск', 'Путешествие на море', 'Наша семья поехала на море, и мы отлично провели время.', 0, '2005-07-15', '2024-07-05', '2024-07-05'),
        ('воспоминание', 'друзья, праздник', '18-й день рождения', 'Я отпраздновал свой 18-й день рождения с друзьями.', 0, '2010-05-20', '2024-07-05', '2024-07-05');
    `);
    
    console.log('Database and tables created successfully with test data');
    
    // Выборка и вывод данных из dreams
    const dreamRows = await db.all('SELECT * FROM dreams');
    console.log('Current data in the dreams table:');
    console.log(dreamRows);
    
    // Выборка и вывод данных из memories
    const memoryRows = await db.all('SELECT * FROM memories');
    console.log('Current data in the memories table:');
    console.log(memoryRows);
  } catch (error) {
    console.error('Error setting up the database:', error);
  }
}

setup();
