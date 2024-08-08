import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store';
import style from './myPage.module.scss';  
import Footer from '../../components/footer/footer';
import DreamStatsComponent from '../../components/Stats/dreamsStats';
import { OpenAi } from '../../API/chat_gpt';

const MyPage: React.FC = () => {
    const setAuthenticated = useAuthStore(state => state.setAuthenticated);
    const [key, setKey] = useState<number>(0);

    const handleLogout = () => {
        const confirmed = window.confirm('Уверены, что хотите выйти?');
        if (confirmed) {
            setAuthenticated(false);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.setItem('isAuthenticated', JSON.stringify(false));
            window.location.href = '/D_M/login'; 
        }
    };

    useEffect(() => {
        setKey(prevKey => prevKey + 1);
    }, []);

    const testAi = async () => {
        console.log('testAi click A ... : ');
        const result = await OpenAi();
        console.log('AI Response: ', result);
    }

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
                
                <a href='https://dotgs-personal-organization.gitbook.io/d-and-m' >
                    Документация
                </a>
                <button className={style['ai-button']} onClick={testAi}>
                    test ai
                </button>
            </div>
            <Footer />
        </>
    );
};

export default MyPage;
