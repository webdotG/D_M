# Dreams & Memories    
# [Тыкни(откроется проект github-pages)](https://webdotg.github.io/D_M/)


## Описание

Это приложение предназначено для записи, хранения, анализа и визуализации ваших снов и воспоминаний.  


## Функциональность

**Запись**: Легко добавлять (сообщением, голосом, через Telegram) новые сны и воспоминания.  
**Поиск**: Всего в 4 действия найти запись.  
**Анализ**: Самоанализировать записи или прибегнуть к библиотеке работ Юнга или других специвлистов  
**История**: Визуализация истории(включая внутренюю картину человека) в виде фильма .

## Используемые технологии

Vite, HTML, Sass, JS, TS, React, Zustand, Node,  PostrgresSQL, LiteSQL, GPT
  
  
## Установка
Запуск
  ```bash
  git clone git@github.com:webdotG/D_M.git
  cd D_M
  npm install
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

## Структура проекта    
D_M/  
├──D_M_BACK/  
│   ├── midlewear/  
│   ├── api/  
│   ├── routes/  
│   ├── db.js  
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


## Если вы хотите внести свой вклад в проект

Создайте новую ветку: 
```bash  
git checkout -b МояВетка/Навание  
git commit -a -m 'То что сделано'  
git push origin МояВетка/Навание  
```


CONTACT  -  <a href="https://t.me/kirillgrant" target="_blank">  @KirillGrant <img src="https://cdn-icons-png.flaticon.com/512/2111/2111646.png" width="24" height="24" alt="telegram" /></a>
