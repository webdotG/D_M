import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store';
import style from './myPage.module.scss';  
import Footer from '../../components/footer/footer';
import DreamStatsComponent from '../../components/Stats/dreamsStats';
import Graph from '../../components/Graph/Graph';
import Layout from '../../layout/layout';

const MyPage: React.FC = () => {
    const setAuthenticated = useAuthStore(state => state.setAuthenticated);
    const [key, setKey] = useState<number>(0);

    const handleLogout = () => {
        const confirmed = window.confirm('Уверены, что хотите выйти?');
        if (confirmed) {
            setAuthenticated(false);
            localStorage.removeItem('token');
            localStorage.setItem('isAuthenticated', JSON.stringify(false));
            window.location.href = '/D_M/login'; 
        }
    };

    useEffect(() => {
        setKey(prevKey => prevKey + 1);
    }, []);

    return (
        <>
        
            <div className={style['my-page-container']}>
                
                <div className={style['profile-section']}>
                    <h1>Профиль</h1>
                    <p>Имя</p>
                </div>
                <div className={style['stats-section']}>
                    <DreamStatsComponent key={key} />
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
