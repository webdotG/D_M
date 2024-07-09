import { useEffect, useState } from 'react';
import { fetchUserProfile, fetchDreamStats, fetchMemoryStats } from '../../API/profileServices';
import style from './myPage.module.scss';  
import Footer from '../../components/footer/footer';

const MyPage = () => {
    const [user, setUser] = useState({ name: '' });
    const [dreamStats, setDreamStats] = useState({ total: 0, analyzed: 0 });
    const [memoryStats, setMemoryStats] = useState({ total: 0, analyzed: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await fetchUserProfile();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }

            try {
                const dreamStatsData = await fetchDreamStats();
                setDreamStats(dreamStatsData);
            } catch (error) {
                console.error('Error fetching dream stats:', error);
            }

            try {
                const memoryStatsData = await fetchMemoryStats();
                setMemoryStats(memoryStatsData);
            } catch (error) {
                console.error('Error fetching memory stats:', error);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };

    return (
        <>
        <div className={style['my-page-container']}>
            <div className={style['profile-section']}>
                <h1>Профиль</h1>
                <p>Имя: {user.name}</p>
            </div>
            <div className={style['stats-section']}>
                <div className={style['stats-box']}>
                    <h2>Сны</h2>
                    <p>Всего: {dreamStats.total}</p>
                    <p>Анализировано: {dreamStats.analyzed}</p>
                </div>
                <div className={style['stats-box']}>
                    <h2>Воспоминания</h2>
                    <p>Всего: {memoryStats.total}</p>
                    <p>Анализировано: {memoryStats.analyzed}</p>
                </div>
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
