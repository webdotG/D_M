export async function searchDreamsByAssociation(category: string, association: string) {
  try {
    const response = await fetch('/api/dreams/searchByAssociation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ category, association })
    });

    if (!response.ok) {
      throw new Error('Failed to search dreams');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching dreams by association:', error);
    throw error;
  }
}
