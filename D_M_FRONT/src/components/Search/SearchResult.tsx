import { useState } from 'react';
import axios from 'axios';
import style from './Search.module.scss';
import Dream from '../dreams_memories/dreams_memories'; 

interface SearchResultProps {
  searchResults: {
    id: number;
    category: string;
    associations: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

function SearchResult({ searchResults }: SearchResultProps) {
  const [currentRecord, setCurrentRecord] = useState<any>(null);

  const onResultClick = async (category: string, id: number) => {
    try {
      const response = await axios.post(`/api/dreams/current?category=${category}`, { id });
      setCurrentRecord(response.data); 
    } catch (error) {
      console.error('Ошибка при получении текущей записи:', error);
    }
  };

  return (
    <div>
      <ul className={style.searchResults}>
        {searchResults.map((result) => (
          <li
            key={result.id}
            className={style.searchResult}
            onClick={() => onResultClick(result.category, result.id)}
          >
            <p>{result.title}</p>
            <p>{result.content}</p>
            <p>Category: {result.category}</p>
            <p>Created At: {result.createdAt}</p>
          </li>
        ))}
      </ul>

      {/* Отображение информации о текущей записи */}
      {currentRecord && (
        <div className={style.currentRecord}>
          <Dream
            id={currentRecord.id}
            category={currentRecord.category}
            associations={currentRecord.associations}
            title={currentRecord.title}
            content={currentRecord.content}
            isAnalyzed={currentRecord.isAnalyzed} 
            date={currentRecord.createdAt} 
          />
        </div>
      )}
    </div>
  );
}

export default SearchResult;
