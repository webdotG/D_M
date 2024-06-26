# Dreams & Memories    
# [Тыкни ... (откроется github-pages)](https://webdotg.github.io/D_M/)


## Описание

Это приложение для записи, хранения, анализа и визуализации снов и воспоминаний.  


## Функциональность

**- Запись**: Легко добавлять (сообщением, голосом, через Telegram) новые сны и воспоминания.  
**- Поиск**: Всего в 4 действия найти запись.  
**- Анализ**: Самоанализировать записи или прибегнуть к библиотеке работ Юнга и других специалистов  
**- История**: Визуализация (включая внутренюю картину человека) в виде фильма .

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
├──.gitignore  
└── ...


  
## Установка
Запуск
  ```bash
  git clone git@github.com:webdotG/D_M.git
  cd D_M
  cd D_M_LiteSQL
  npm i
  npm run db
  cd ..
  cd D_M_BACK
  npm i
  npm run server
  cd ..
  cd D_M_FRONT 
  npm i 
  npm run dev
 ```

## Если вы хотите внести свой вклад в проект

Создайте новую ветку: 
```bash  
git checkout -b  
git add . 
git commit -a -m   
git push origin  
```


  ОТВЕЧУ НА ВОПРОСЫ и вышлю .env <a href="https://t.me/kirillgrant" target="_blank">  @KirillGrant <img src="https://cdn-icons-png.flaticon.com/512/2111/2111646.png" width="24" height="24" alt="telegram" /></a>
