import dotenv from 'dotenv';
import { pool } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


dotenv.config();

export const Current = (req, res) => {
    try {
        const currentUser = req.user;
        res.status(200).json(currentUser);
    } catch (err) {
        console.error('Ошибка при получении текущего пользователя:', err.message);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

export const Login = async (req, res) => {
    const { user_name, password } = req.body;

    try {
        const getUserQuery = `
            SELECT id, user_name, user_password 
            FROM users 
            WHERE user_name = $1
        `;
        const userResult = await pool.query(getUserQuery, [user_name]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const user = userResult.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.user_password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Неверные учетные данные' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '48h' });

        res.status(200).json({ token });
    } catch (err) {
        console.error('Ошибка при входе в систему:', err.message);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

export const Register = async (req, res) => {
    const { username, password } = req.body;

    // const apiUserName = username;

    console.log('Register request: ');
    console.dir(req.body);
    try {
        const checkUserQuery = `
            SELECT id, user_name 
            FROM users 
            WHERE user_name = $1
        `;
        const userResult = await pool.query(checkUserQuery, [username]);

        if (userResult.rows.length > 0) {
            return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const createUserQuery = `
            INSERT INTO users (user_name, user_password) VALUES ($1, $2) RETURNING id
        `;
        const newUser = await pool.query(createUserQuery, [username, hashedPassword]);

        const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token });
    } catch (err) {
        console.error('Ошибка при регистрации пользователя:', err.message);
        res.status(500).json({ message: 'Внутренняя ошибка сервера', error: err.message });
    }
};
