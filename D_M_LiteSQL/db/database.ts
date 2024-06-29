import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export async function openDb(): Promise<Database> {
  return open({
    filename: './D_M_LiteSQL/db/dreams_memories.db',
    driver: sqlite3.Database
  });
}
