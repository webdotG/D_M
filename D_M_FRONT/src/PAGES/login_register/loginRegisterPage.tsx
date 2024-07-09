import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import style from './login.module.scss';
import LoginImage from '../../PNG/feeling-free-concept-illustration_114360-13580.png';
import RegisterImage from '../../PNG/contemplating-concept-illustration_114360-3216.png';
import { registerUser, loginUser } from '../../API/login_register';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const [ui_username, setUIUsername] = useState<string>('');
  const [ui_password, setUIPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated); 
  const setAuthenticated = useAuthStore(state => state.setAuthenticated); 

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUIUsername(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUIPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      let userData;

      if (isRegistering) {
        // Регистрация нового пользователя
        userData = await registerUser(ui_username, ui_password);
        console.log('Регистрация успешна:', userData);
      } else {
        // Вход существующего пользователя
        userData = await loginUser(ui_username, ui_password);
        console.log('Вход успешен:', userData);
      }

      setAuthenticated(true, userData.token);

      // Проверка после установки
      // const token = useAuthStore.getState().token;
      // const isAuthenticated = useAuthStore.getState().isAuthenticated;
      // console.log('After setAuthenticated - isAuthenticated:', isAuthenticated);
      // console.log('After setAuthenticated - Token:', token);

      navigate('/D_M/');

    } catch (err: unknown) {  
      if (axios.isAxiosError(err)) {
        console.error('Ошибка входа или регистрации:', err.response?.data || err.message);
      } else if (err instanceof Error) {
        console.error('Ошибка входа или регистрации:', err.message);
      } else {
        console.error('Неизвестная ошибка входа или регистрации');
      }
    }
  };

  // Для переключения между регистрацией и входом
  const toggleRegister = () => {
    setIsRegistering(!isRegistering);
  };
  useEffect(() => {
    const token = localStorage.getItem('token') || undefined;  
    if (token) {
      setAuthenticated(true, token);
      localStorage.setItem('isAuthenticated', JSON.stringify(true));
    } else {
      setAuthenticated(false);
      localStorage.setItem('isAuthenticated', JSON.stringify(false));
    }
  }, [setAuthenticated]);
  
  return (
    <div key={isAuthenticated.toString()} className={style['login-page']}>
      <img className={style['img']} src={isRegistering ? RegisterImage : LoginImage} alt="Login or Register" />
      <h1>{isRegistering ? 'Регистрация' : 'Вход'}</h1>
      <form onSubmit={handleSubmit} className={style['login-form']}>
        <div className={style['form-group']}>
          <label htmlFor="username" className={style['label']}><p>Имя</p></label>
          <input
            type="text"
            id="username"
            value={ui_username}
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
            value={ui_password}
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
