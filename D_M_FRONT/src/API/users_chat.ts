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
export const createChat = async (created_user: string, token: string, chat_name: string, invited_user: string): Promise<CreateChatResponse | ErrorResponse> => {
  console.log('Токен для создания чата:', token);
  console.log('Создатель чата:', created_user);
  
  if (!token) {
    console.error('Токен не найден');
    return { message: 'Токен не найден' };
  }

  const response = await fetch(`/api/chat_users/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ chat_name, invited_user, created_user }) // Убедитесь, что поле name совпадает
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
export const getChats = async (token: string, userId: string): Promise<Chat[] | ErrorResponse> => {
  console.log('getChats USER ID:', userId);
  // console.log('getChats TOKEN:', token);

  if (!token || !userId) {
    console.error('Токен или идентификатор пользователя не найден');
    return { message: 'Токен или идентификатор пользователя не найден' };
  }

  const response = await fetch(`/api/chat_users/list/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
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
export const getMessages = async (token: string, chatId: string): Promise<Message[] | ErrorResponse> => {
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
export const sendMessage = async (token: string, chatId: string, message_text: string, photo_message?: string): Promise<SendMessageResponse | ErrorResponse> => {
  console.log('Токен для отправки сообщения:', token);

  if (!token) {
    console.error('Токен не найден');
    return { message: 'Токен не найден' };
  }

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
export const deleteChat = async (token: string, chatId: string): Promise<{ message: string } | ErrorResponse> => {
  console.log('Токен для удаления чата:', token);

  if (!token) {
    console.error('Токен не найден');
    return { message: 'Токен не найден' };
  }

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
