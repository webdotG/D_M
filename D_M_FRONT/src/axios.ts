import axios from 'axios';

// Создаем экземпляр axios с настройками по умолчанию
const instance = axios.create({
  baseURL: '/', 
  timeout: 10000, 
 
});


export default instance;
