import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const Auth = async (req, res, next) => {
  console.log('MIDLEWEAR AUTH');

  try {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (decodeErr) {
      if (decodeErr.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Срок действия токена истек' });
      } else {
        return res.status(401).json({ message: 'Ошибка декодирования токена' });
      }
    }

    const userId = decoded.id;

    const getUserQuery = `
      SELECT id, user_name, user_password 
      FROM users 
      WHERE id = $1
    `;
    const userResult = await pool.query(getUserQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    req.userId = userId;
    req.user = {
      id: userResult.rows[0].id,
      userName: userResult.rows[0].user_name,
    };

    next();
  } catch (err) {
    console.error('MIDLEWEAR AUTH ERROR: ', err.message);
    res.status(401).json({ message: 'Не авторизован' });
  }
};

export default Auth;
