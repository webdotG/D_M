import axios from '../axios';

//получение данных профиля
export const fetchUserProfile = async () => {
    const response = await axios.get('/api/user/current');
    console.log('profileServices userProfile ... >>> ... ', response.data)
    return response.data;
};

//получение статистики снов
export const fetchDreamStats = async () => {
    const response = await axios.get('/api/dreams/stats');
    return response.data;
};

//получение статистики воспоминаний
export const fetchMemoryStats = async () => {
    const response = await axios.get('/api/memories/stats');
    return response.data;
};
