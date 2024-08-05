import axios from 'axios';

export const OpenAi = async () => {
  const response = await axios.post(`/api/chat_ai/gpt`, {
    prompt: 'Напиши приветственное сообщение'
  });

  console.log('ТЕСТОВЫ ЗАПРОС АИ : ', response.data);
  return response.data;
};
