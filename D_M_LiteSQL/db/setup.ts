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
    await db.exec(`
      CREATE TABLE IF NOT EXISTS dreams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT NOT NULL,
        isAnalyzed BOOLEAN NOT NULL
      );
    `);
    console.log('Database and tables created successfully');
  } catch (error) {
    console.error('Error setting up the database:', error);
  }
}

setup();
