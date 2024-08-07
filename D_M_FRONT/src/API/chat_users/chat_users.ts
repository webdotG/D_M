import axios from 'axios';

/**
 * Отправка приглашения на участие в чате.
 * 
 * @param {string} senderId - ID отправителя
 * @param {string} recipientId - ID получателя
 * @param {string} message - Сообщение приглашения
 * @returns {Promise} - Результат запроса
 */
export const sendInvitation = async (senderId: string, recipientId: string, message: string) => {
    try {
        const response = await axios.post('/api/chat/send-invitation', { senderId, recipientId, message });
        return response.data;
    } catch (error) {
        console.error('Ошибка при отправке приглашения:', error);
        throw error;
    }
};

/**
 * Подтверждение подключения к чату.
 * 
 * @param {string} senderId - ID отправителя
 * @param {string} recipientId - ID получателя
 * @returns {Promise} - Результат запроса
 */
export const confirmConnection = async (senderId: string, recipientId: string) => {
    try {
        const response = await axios.post('/api/chat/confirm-connection', { senderId, recipientId });
        return response.data;
    } catch (error) {
        console.error('Ошибка при подтверждении подключения:', error);
        throw error;
    }
};
