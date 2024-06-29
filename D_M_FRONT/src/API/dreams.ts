import axios from 'axios';

export const loadDreams = async () => {
  try {
    const response = await axios.get('/api/dreams');
    console.log('loadDreams response ', response);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createDream = async (title: string, description: string) => {
  try {
    const response = await axios.post('/api/dreams', {
      title,
      description,
    });
    console.log('createDream response ', response);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateDream = async (id: string, title: string, description: string) => {
  try {
    const response = await axios.put(`/api/dreams/${id}`, {
      title,
      description,
    });
    console.log('updateDream response ', response);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteDream = async (id: string) => {
  try {
    const response = await axios.delete(`/api/dreams/${id}`);
    console.log('deleteDream response ', response);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
