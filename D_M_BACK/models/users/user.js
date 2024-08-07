import dotenv from 'dotenv';
import { pool } from '../../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

export const Current = async (req, res) => {
    try {
      const token = req.headers.authorization.replace(/Bearer\s?/, '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Получение информации о пользователе из базы данных
      const getUserQuery = `
        SELECT user_id, user_name, email, date_of_birth
        FROM users
        WHERE user_id = $1
      `;
      const userResult = await pool.query(getUserQuery, [decoded.id]);
  
      if (userResult.rows.length === 0) {
        console.log('Пользователь не найден');
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
  
      const user = userResult.rows[0];
  
      console.log('Возвращаемые данные для текущего пользователя:', {
        id: user.user_id,
        userName: user.user_name,
        email: user.email,
        dateOfBirth: user.date_of_birth,
        token: token
      });
  
      res.status(200).json({
        id: user.user_id,
        userName: user.user_name,
        email: user.email,
        dateOfBirth: user.date_of_birth,
        token: token,
      });
    } catch (err) {
      console.error('Ошибка при получении текущего пользователя:', err.message);
      res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
  };

  export const Login = async (req, res) => {
    const { user_name, password } = req.body;
  
    try {
      console.log('Login request:', req.body);
      const getUserQuery = `
          SELECT user_id, password 
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
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Результат сравнения паролей:', isPasswordValid);
  
      if (!isPasswordValid) {
        console.log('Неверные учетные данные');
        return res.status(401).json({ message: 'Неверные учетные данные' });
      }
  
      const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '48h' });
      console.log('Токен сгенерирован:', token);
  
      res.status(200).json({ token });
    } catch (err) {
      console.error('Ошибка при входе в систему:', err.message);
      res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
  };
  
  export const Register = async (req, res) => {
    const { user_name, password, email, date_of_birth } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const createUserQuery = `
          INSERT INTO users (user_name, password, email, date_of_birth) 
          VALUES ($1, $2, $3, $4) 
          RETURNING user_id
      `;
      const newUser = await pool.query(createUserQuery, [user_name, hashedPassword, email, date_of_birth]);
      const user = newUser.rows[0];
  
      const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '48h' });
      console.log('Новый пользователь зарегистрирован:', user);
  
      res.status(201).json({ token });
    } catch (err) {
      console.error('Ошибка при регистрации пользователя:', err.message);
      res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
  };