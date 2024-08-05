import axios from 'axios';

const token = localStorage.getItem('token');

// Функция для получения статистики снов-воспоминаний
export const fetchDreamStats = async (category: string): Promise<{ total: number; analyzed: number }> => {
    if (!token) {
        throw new Error('Отсутствует токен доступа');
    }

    try {
        // console.log('GET /api/dreams/statistic category = ', category);

        const response = await axios.post(`/api/dreams/statistic`, {category }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (response.status !== 200) {
            throw new Error(`Error loading records for category ${category}: Status ${response.status}`);
        }

        // console.log('RESPONSE данные загружены = ', response);
        return response.data;
    } catch (error) {
        console.error('Failed to load records:', error);
        throw error;
    }
};
