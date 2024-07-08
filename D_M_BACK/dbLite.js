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
          createdAt TEXT NOT NULL,
          updatedAt TEXT
        );
      `);
      console.log('Таблица dreams успешно создана');

      // Вставка тестовых данных в таблицу dreams
      await dbLite.exec(`
        INSERT INTO dreams (category, associations, title, content, isAnalyzed, date, createdAt, updatedAt)
        VALUES
          ('Кошмар', 'темнота, страх, одиночество', 'Погоня за тенями', 'Меня преследовали тени в неизвестном месте.', 0, '2024-07-05', '2024-07-05', '2024-07-05'),
          ('Осознанный сон', 'контроль, полет', 'Полет над городом', 'Я летал над городом и контролировал всё.', 1, '2024-07-04', '2024-07-04', '2024-07-04'),
          ('Повторяющийся сон', 'школа, экзамены', 'Снова провалил экзамен', 'Мне приснилось, что я снова провалил экзамен.', 0, '2024-07-03', '2024-07-03', '2024-07-03'),
          ('Фантазия', 'магия, приключение', 'Магический квест', 'Я был на магическом квесте в поисках скрытого сокровища.', 1, '2024-07-02', '2024-07-02', '2024-07-02'),
          ('Эротический сон', 'секс, страсть', 'Интим с незнакомцем', 'Мне приснился страстный секс с незнакомцем.', 0, '2024-07-01', '2024-07-01', '2024-07-01');
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
        CREATE TABLE IF NOT EXISTS memories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          event TEXT NOT NULL,
          description TEXT NOT NULL,
          date TEXT NOT NULL,
          location TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          updatedAt TEXT
        );
      `);
      console.log('Таблица memories успешно создана');

      // Вставка тестовых данных в таблицу memories
      await dbLite.exec(`
        INSERT INTO memories (event, description, date, location, createdAt, updatedAt)
        VALUES
          ('Первый день в школе', 'Я пошёл в школу в первый раз и познакомился с новыми друзьями.', '2000-09-01', 'Школа №1', '2024-07-05', '2024-07-05'),
          ('Поездка на море', 'Наша семья поехала на море, и мы отлично провели время.', '2005-07-15', 'Чёрное море', '2024-07-05', '2024-07-05'),
          ('День рождения', 'Я отпраздновал свой 18-й день рождения с друзьями.', '2010-05-20', 'Дом', '2024-07-05', '2024-07-05');
      `);
      console.log('Тестовые данные в таблицу memories успешно вставлены');
    }

    // Выборка данных из таблицы dreams
    let rows = await dbLite.all('SELECT * FROM dreams');
    console.log('Данные из таблицы dreams:');
    console.log(JSON.stringify(rows, null, 2));

    // Выборка данных из таблицы memories
    rows = await dbLite.all('SELECT * FROM memories');
    console.log('Данные из таблицы memories:');
    console.log(JSON.stringify(rows, null, 2));
  } catch (error) {
    console.error('Не удалось инициализировать базу данных:', error);
    process.exit(1); // В случае ошибки при инициализации, завершаем процесс
  }
})();

export { dbLite };
