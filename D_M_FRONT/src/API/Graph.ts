
export const fetchDreams = async () => {
    
    const response = await fetch('/api/dreams');
    if (!response.ok) {
      throw new Error('Failed to fetch dreams');
    }
    return response.json();
  };
  
  export const fetchMemories = async () => {
    // Пример запроса для получения данных "воспоминания"
    const response = await fetch('/api/memories');
    if (!response.ok) {
      throw new Error('Failed to fetch memories');
    }
    return response.json();
  };
  