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
    
    // Создание таблицы
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
    
    // Вставка тестовых данных
    await db.exec(`
      INSERT INTO dreams (category, associations, title, content, isAnalyzed, date, createdAt, updatedAt)
      VALUES
        ('Кошмар', 'темнота, страх, одиночество', 'Погоня за тенями', 'Меня преследовали тени в неизвестном месте.', 0, '2024-07-05', '2024-07-05', '2024-07-05'),
        ('Осознанный сон', 'контроль, полет', 'Полет над городом', 'Я летал над городом и контролировал всё.', 1, '2024-07-04', '2024-07-04', '2024-07-04'),
        ('Повторяющийся сон', 'школа, экзамены', 'Снова провалил экзамен', 'Мне приснилось, что я снова провалил экзамен.', 0, '2024-07-03', '2024-07-03', '2024-07-03'),
        ('Фантазия', 'магия, приключение', 'Магический квест', 'Я был на магическом квесте в поисках скрытого сокровища.', 1, '2024-07-02', '2024-07-02', '2024-07-02'),
        ('Эротический сон', 'секс, страсть', 'Интим с незнакомцем', 'Мне приснился страстный секс с незнакомцем.', 0, '2024-07-01', '2024-07-01', '2024-07-01');
    `);
    
    console.log('Database and tables created successfully with test data');
    
    // Выборка и вывод данных
    const rows = await db.all('SELECT * FROM dreams');
    console.log('Current data in the database:');
    console.log(rows);
  } catch (error) {
    console.error('Error setting up the database:', error);
  }
}

setup();
