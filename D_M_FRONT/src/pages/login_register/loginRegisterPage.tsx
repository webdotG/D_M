import React, { useState, ChangeEvent, FormEvent } from 'react';
import style from './login.module.scss';
import Login from '../../PNG/feeling-free-concept-illustration_114360-13580.png'
import Register from '../../PNG/contemplating-concept-illustration_114360-3216.png'

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isRegistering) {
      if (password !== confirmPassword) {
        console.log('Пароли не совпадают');
        return;
      }
      console.log('Регистрация:', { username, password });
    } else {
      console.log('Вход:', { username, password });
    }
  };

  const toggleRegister = () => {
    setIsRegistering(!isRegistering);
  };

  return (
    <div className={style['login-page']}>
      <img className={style['img']} src={isRegistering ? Register : Login} />
      <h1>{isRegistering ? 'Регистрация' : 'Вход'}</h1>
      <form onSubmit={handleSubmit} className={style['login-form']}>
        <div className={style['form-group']}>
          <label htmlFor="username" className={style['label']}><p>Имя</p></label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            required
            className={style['input']}
          />
        </div>
        <div className={style['form-group']}>
          <label htmlFor="password" className={style['label']}><p>Пароль</p></label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
            className={style['input']}
          />
        </div>
        {isRegistering && (
          <div className={style['form-group']}>
            <label htmlFor="confirm-password" className={style['label']}><p>Подтвердить пароль</p></label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              className={style['input']}
            />
          </div>
        )}
        <button type="submit" className={style['submit-button']}>
          {isRegistering ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </form>
      <button onClick={toggleRegister} className={style['toggle-button']}>
        {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
      </button>
    </div>
  );
}

export default LoginPage;
