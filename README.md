# Dreams & Memories    
# [Тыкни(откроется проект github-pages)](https://webdotg.github.io/D_M/)


## Описание

Это приложение предназначено для записи, хранения, анализа и визуализации ваших снов и воспоминаний.  


## Функциональность

**Запись**: Легко добавлять (сообщением, голосом, через Telegram) новые сны и воспоминания.  
**Поиск**: Всего в 4 действия найти запись.  
**Анализ**: Самоанализировать записи или прибегнуть к библиотеке работ Юнга и других специвлистов  
**История**: Визуализация истории(включая внутренюю картину человека) в виде фильма .

## Используемые технологии

Vite, HTML, Sass, JS, TS, React, Zustand, Node,  PostrgresSQL, LiteSQL, Docker, GPT



## Структура проекта    
D_M/  
├──D_M_BACK/  
│   ├── midlewear/  
│   ├── api/  
│   ├── routes/  
│   ├── db.js  
│   ├── dbLite.js
│   ├── server.js  
│   ├── package.json  
│   └── ...  
├──D_M_FRONT/  
│   ├── public/  
│   │   ├── 404.html  
│   │   └── ...  
│   ├── src/  
│   │   ├── components/  
│   │   ├── styles/  
│   │   ├── App.tsx  
│   │   ├── main.tsx  
│   │   └── ...  
│   ├── index.html  
│   ├── package.json  
│   ├── tsconfig.json  
│   └── vite.config.ts  
├──D_M_LiteSQL/  
│   ├── db/  
│     ├── database.ts  
│     ├── setup.ts  
│     ├── dreams_memories.db  
│   ├── package.json  
│   ├── tsconfig.json  
├──README.MD  
└──.gitignore  


  
## Установка
Запуск
  ```bash
  git clone git@github.com:webdotG/D_M.git
  cd D_M
  cd D_M_LiteSQL
  npm install
  npm run db 
  cd D_M_BACK
  npm install
  npm run server  
  cd ..
  cd D_MFRONT 
  npm install
    //В режиме разработки 
   npm run dev
   //Для сборки
   npm run build
 ```

## Если вы хотите внести свой вклад в проект

Создайте новую ветку: 
```bash  
git checkout -b  
git add . 
git commit -a -m   
git push origin  
```


CONTACT  -  <a href="https://t.me/kirillgrant" target="_blank">  @KirillGrant <img src="https://cdn-icons-png.flaticon.com/512/2111/2111646.png" width="24" height="24" alt="telegram" /></a>

  
    

      Структура базы данных
Таблица dreams

    id (INTEGER, PRIMARY KEY, AUTOINCREMENT): Уникальный идентификатор для каждого сна.
    title (TEXT): Заголовок сна.
    content (TEXT): Содержание сна.
    isAnalyzed (BOOLEAN): Флаг, указывающий, был ли сон проанализирован.
    date (TEXT): Дата сна.

Таблица memories

    id (INTEGER, PRIMARY KEY, AUTOINCREMENT): Уникальный идентификатор для каждого воспоминания.
    title (TEXT): Заголовок воспоминания.
    content (TEXT): Содержание воспоминания.
    isAnalyzed (BOOLEAN): Флаг, указывающий, было ли воспоминание проанализировано.
    date (TEXT): Дата воспоминания.

Таблица association

    id (INTEGER, PRIMARY KEY, AUTOINCREMENT): Уникальный идентификатор для каждой ассоциации.
    link (TEXT): Текст ассоциации.

Таблица dream_associations

    dream_id (INTEGER): Идентификатор сна.
    association_id (INTEGER): Идентификатор ассоциации.

Таблица memory_associations

    memory_id (INTEGER): Идентификатор воспоминания.
    association_id (INTEGER): Идентификатор ассоциации.

Формат хранения данных и привязки

    Ассоциации: Ассоциации хранятся в виде строк в таблице association. Каждая строка имеет уникальный идентификатор (id) и текстовое значение (link).

    Привязка ассоциаций: Ассоциации привязываются к снам или воспоминаниям через таблицы dream_associations и memory_associations. Эти таблицы содержат пары значений (dream_id/memory_id и association_id), которые связывают конкретный сон или воспоминание с одной или несколькими ассоциациями.

Пример данных
Таблица dreams
id	title	content	isAnalyzed	date
1	Сон 1	Текст сна 1	0	2024-07-24
2	Сон 2	Текст сна 2	1	2024-07-23
Таблица memories
id	title	content	isAnalyzed	date
1	Воспоминание 1	Текст воспоминания 1	0	2024-07-24
2	Воспоминание 2	Текст воспоминания 2	1	2024-07-23
Таблица association
id	link
1	Ассоциация 1
2	Ассоциация 2
Таблица dream_associations
dream_id	association_id
1	1
1	2
2	1
Таблица memory_associations
memory_id	association_id
1	1
2	2
Входящие данные для обновления

    category: Например, сны или воспоминания.
    id: Идентификатор записи (например, 9).
    associations: Строка идентификаторов ассоциаций, разделенных запятыми (например, 1,2).
    title: Заголовок записи.
    content: Содержание записи.
    isAnalyzed: Флаг анализа (например, 0 или 1).
    date: Дата записи.