import React from 'react';
import { useAuthStore } from '../../store';
import style from './myPage.module.scss';  
import Footer from '../../components/footer/footer';
import DreamStatsComponent from '../../components/Stats/dreamsStats';

const MyPage: React.FC = () => {
    const setAuthenticated = useAuthStore(state => state.setAuthenticated);

    const handleLogout = () => {
        const confirmed = window.confirm('Уверены, что хотите выйти?');
        if (confirmed) {
            setAuthenticated(false);
            localStorage.removeItem('token');
            localStorage.setItem('isAuthenticated', JSON.stringify(false));
            window.location.href = '/D_M/login'; 
        }
    };

    return (
        <>
            <div className={style['my-page-container']}>
                <div className={style['profile-section']}>
                    <h1>Профиль</h1>
                    <p>Имя</p>
                </div>
                <div className={style['stats-section']}>
                    <DreamStatsComponent />
                </div>
                <button className={style['logout-button']} onClick={handleLogout}>
                    Выйти
                </button>
            </div>
            <Footer />
        </>
    );
};

export default MyPage;
