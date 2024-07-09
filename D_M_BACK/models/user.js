import dotenv from 'dotenv';
import { pool } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

export const Current = (req, res) => {
    try {
        const currentUser = req.user;
        const token = req.headers.authorization.replace(/Bearer\s?/, '');
    
        res.status(200).json({
          id: currentUser.id,
          userName: currentUser.userName,
          token: token
        });
      } catch (err) {
        console.error('Ошибка при получении текущего пользователя:', err.message);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
      }
};


export const Login = async (req, res) => {
    const { user_name, user_password } = req.body;
  
    try {
      console.log('Login request:', req.body);
      const getUserQuery = `
        SELECT id, user_name, user_password 
        FROM users 
        WHERE user_name = $1
      `;
      const userResult = await pool.query(getUserQuery, [user_name]);
  
      if (userResult.rows.length === 0) {
        console.log('Пользователь не найден');
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
  
      const user = userResult.rows[0];
      console.log('Найденный пользователь:', user);
  
      const isPasswordValid = await bcrypt.compare(user_password, user.user_password);
      console.log('Результат сравнения паролей:', isPasswordValid);
  
      if (!isPasswordValid) {
        console.log('Неверные учетные данные');
        return res.status(401).json({ message: 'Неверные учетные данные' });
      }
  
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '48h' });
      console.log('Токен сгенерирован:', token);
  
      res.status(200).json({ token });
    } catch (err) {
      console.error('Ошибка при входе в систему:', err.message);
      res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
  };
  
  // Register endpoint
  export const Register = async (req, res) => {
    const { user_name, user_password } = req.body;
  
    console.log('Register request:', req.body);
  
    try {
      const checkUserQuery = `
        SELECT id, user_name 
        FROM users 
        WHERE user_name = $1
      `;
      const userResult = await pool.query(checkUserQuery, [user_name]);
  
      if (userResult.rows.length > 0) {
        console.log('Пользователь с таким именем уже существует');
        return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
      }
  
      if (!user_password) {
        throw new Error('Пароль не может быть пустым');
      }
  
      const hashedPassword = await bcrypt.hash(user_password, 10);
      console.log('Хэшированный пароль:', hashedPassword);
  
      const createUserQuery = `
        INSERT INTO users (user_name, user_password) VALUES ($1, $2) RETURNING id
      `;
      const newUser = await pool.query(createUserQuery, [user_name, hashedPassword]);
  
      const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Пользователь зарегистрирован и токен сгенерирован:', token);
  
      res.status(201).json({ token });
    } catch (err) {
      console.error('Ошибка при регистрации пользователя:', err.message);
      res.status(500).json({ message: 'Внутренняя ошибка сервера', error: err.message });
    }
  };
  
