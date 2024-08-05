import axios from 'axios';

const retryRequest = async (retryCount = 3) => {
  let attempt = 0;
  while (attempt < retryCount) {
    try {
      const response = await axios.post(`/api/chatAI`, {
        prompt: 'Напиши приветственное сообщение'
      });

      if (response.status !== 200) {
        throw new Error(`Error loading records: ${response.statusText}`);
      }

      console.log('ТЕСТОВЫ ЗАПРОС АИ : ', response.data);
      return response.data;
    } catch (error) {
      attempt++;
      if (error.response && error.response.status === 429) {
        console.error('ТЕСТОВЫ ЗАПРОС АИ ОШИБКА : Превышена квота, повторная попытка через 30 секунд.');
        await new Promise(resolve => setTimeout(resolve, 30000)); // Ожидание 30 секунд перед повторной попыткой
      } else {
        console.error('ТЕСТОВЫ ЗАПРОС АИ ОШИБКА : ', error);
        throw error;
      }
    }
  }
  throw new Error('ТЕСТОВЫ ЗАПРОС АИ ОШИБКА : Превышено количество попыток.');
};

export const OpenAi = async () => {
  return retryRequest();
};
