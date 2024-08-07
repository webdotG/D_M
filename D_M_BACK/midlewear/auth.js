import jwt from 'jsonwebtoken';

export const Auth = (req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded; // Установка данных пользователя в req.user

    console.log('AUTH req user ... : ',req.user)
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Недействительный токен' });
  }
};
