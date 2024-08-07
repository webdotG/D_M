// Функция для создания нового чата
export const createChat = (ws: WebSocket, user1: string, user2: string) => {
    ws.send(JSON.stringify({
        type: 'chat_request',
        payload: { user1, user2 }
    }));
};

// Функция для отправки сообщения в чат
export const sendMessage = (ws: WebSocket, chatId: string, senderId: string, text: string) => {
    ws.send(JSON.stringify({
        type: 'new_message',
        payload: { chatId, senderId, text }
    }));
};

// Функция для получения истории сообщений
export const getChatHistory = (ws: WebSocket, chatId: string) => {
    ws.send(JSON.stringify({
        type: 'get_history',
        payload: { chatId }
    }));
};

// Функция для создания WebSocket соединения и установки обработчиков
export const createWebSocketConnection = (url: string, onMessage: (event: MessageEvent) => void) => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
        console.log('WebSocket соединение открыто');
        ws.send(JSON.stringify({ type: 'greeting', payload: 'Привет от клиента' }));
    };

    ws.onerror = (error) => {
        console.error('Ошибка WebSocket:', error);
    };

    ws.onclose = () => {
        console.log('WebSocket соединение закрыто');
    };

    ws.onmessage = onMessage;

    return ws;
};

// Функция для обработки сообщений WebSocket
export const handleWebSocketMessage = (data: any) => {
    const { type, payload, message } = data;

    if (type === undefined) {
        console.error('Получено сообщение без типа:', data);
        return;
    }

    switch (type) {
        case 'greeting_received':
            console.log('Приветствие получено:', message || 'Нет сообщения');
            break;

        case 'chat_created':
            console.log('Чат создан с ID:', payload?.chatId || 'ID чата отсутствует');
            break;

        case 'new_message':
            console.log('Новое сообщение:', payload || 'Содержимое сообщения отсутствует');
            break;

        case 'chat_history':
            console.log('История сообщений:', payload?.messages || 'История сообщений отсутствует');
            break;

        case 'error':
            console.error('Ошибка от сервера:', payload?.message || 'Сообщение об ошибке отсутствует');
            break;

        default:
            console.error('Неизвестный тип сообщения:', type);
    }
};
