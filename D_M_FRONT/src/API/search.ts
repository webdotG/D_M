
export const searchByValue = async (value) => {
    const response = await fetch('/api/dreams/searchByValue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value }),
    });
    return response.json();
  };
  
  export const searchByDate = async (date) => {
    const response = await fetch('/api/dreams/searchByDate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date }),
    });
    return response.json();
  };
  