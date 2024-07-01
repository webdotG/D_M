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
    const dbPath = path.resolve(__dirname, './dreams_memories.db');  // Путь к базе данных
    const db = await openDb(dbPath);
    await db.exec(`
      CREATE TABLE IF NOT EXISTS dreams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        associated TEXT NOT NULL,
        date TEXT NOT NULL,
        content TEXT NOT NULL,
        isAnalyzed BOOLEAN NOT NULL,
        createdAt TEXT DEFAULT (datetime('now')),
        updatedAt TEXT DEFAULT (datetime('now'))
      );
    `);
    console.log('setupTs db DMSqlLit : ', db.get.name)
    await db.exec(`
      CREATE TRIGGER IF NOT EXISTS update_dreams_updatedAt
      AFTER UPDATE ON dreams
      FOR EACH ROW
      BEGIN
        UPDATE dreams SET updatedAt = datetime('now') WHERE id = old.id;
      END;
    `);
    console.log('Database and tables created successfully with triggers');
  } catch (error) {
    console.error('Error setting up the database:', error);
  }
}

setup();
