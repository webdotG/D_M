import axios from 'axios';

const token = localStorage.getItem('token');

export const updateDreamMemories = async (
    id: number,
    category: string,
    associations: string[],
    title: string,
    content: string,
    isAnalyzed: boolean,
    date: string
) => {
    // console.log(`Входящие данные /update : category-${category}, id-${id}, associations-${associations}, title-${title}, content-${content}, isAnalyzed-${isAnalyzed}, date-${date}`);
    console.log(id,category,associations,title,content,isAnalyzed,date)
    try {
        console.log('Запрос /update ... ');

        const response = await axios.patch(`/api/dreams/update`, {
            id,
            category,
            associations, 
            title,
            content,
            isAnalyzed,
            date
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('Ответ запроса /update ... :', response.data.message);

        return response.data;

    } catch (error) {
        console.error('Error updating dream:', error);
        throw error;
    }
};
