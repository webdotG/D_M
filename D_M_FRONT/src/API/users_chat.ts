import { useAuthStore } from '../store';

const API_URL = '/api/chat_users';

interface Chat {
  id: string;
  name: string;
}

interface Message {
  senderId: string;
  text: string;
  sent_at: string; 
}

interface CreateChatResponse {
  chatId: string;
}

interface SendMessageResponse {
  messageId: string;
}

interface ErrorResponse {
  message: string;
}

/**
 * Создать новый чат.
 */
export const createChat = async (chat_name: string, invited_user: string): Promise<CreateChatResponse | ErrorResponse> => {
  const token = useAuthStore.getState().token;

  const response = await fetch(`${API_URL}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ chat_name, invited_user })
  });

  if (!response.ok) {
    const errorData = await response.json();
    return { message: errorData.message };
  }

  return response.json();
};

/**
 * Получить все чаты пользователя.
 */
export const getChats = async (): Promise<Chat[] | ErrorResponse> => {
  const token = useAuthStore.getState().token;

  const response = await fetch(`${API_URL}/list`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    return { message: errorData.message };
  }

  return response.json();
};

/**
 * Получить сообщения для конкретного чата.
 */
export const getMessages = async (chatId: string): Promise<Message[] | ErrorResponse> => {
  const token = useAuthStore.getState().token;
  console.log('Токен для запроса сообщений:', token);

  if (!token) {
    console.error('Токен не найден');
    return { message: 'Токен не найден' };
  }

  try {
    const response = await fetch(`${API_URL}/${chatId}/messages`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Ошибка при получении сообщений:', errorData);
      return { message: errorData.message };
    }
    
    const messages = await response.json();
    console.log('Сообщения получены:', messages);
    return messages;
  } catch (error) {
    console.error('Ошибка при выполнении запроса сообщений:', error);
    return { message: 'Ошибка при выполнении запроса сообщений' };
  }
};

/**
 * Отправить сообщение в чат.
 */
export const sendMessage = async (chatId: string, message_text: string, photo_message?: string): Promise<SendMessageResponse | ErrorResponse> => {
  const token = useAuthStore.getState().token;
  const body = { message_text, photo_message };

  const response = await fetch(`${API_URL}/${chatId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json();
    return { message: errorData.message };
  }

  return response.json();
};

/**
 * Удалить чат и все связанные сообщения.
 */
export const deleteChat = async (chatId: string): Promise<{ message: string } | ErrorResponse> => {
  const token = useAuthStore.getState().token;

  const response = await fetch(`${API_URL}/${chatId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    return { message: errorData.message };
  }

  return response.json();
};
