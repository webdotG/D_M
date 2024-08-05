import axios from 'axios';

export const sendInvitation = async (senderId: string, recipientId: string, message: string) => {
    return axios.post('/api/chat/send-invitation', { senderId, recipientId, message });
};

export const confirmConnection = async (senderId: string, recipientId: string) => {
    return axios.post('/api/chat/confirm-connection', { senderId, recipientId });
};
