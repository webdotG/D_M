import { useState } from 'react';
import axios from 'axios';
import style from './serachResult.module.scss';
import Dream from '../dreams_memories/dreams_memories'; 
import { useCategoryStore } from '../../store'; 

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
  
  const { selectedCategory } = useCategoryStore();

  const onResultClick = async (category: string, id: number) => {
    try {
      const response = await axios.post(`/api/dreams/current?category=${category}`, { id });
      setCurrentRecord(response.data); 
    } catch (error) {
      console.error('Ошибка при получении текущей записи:', error);
    }
  };

  const handleCloseModal = () => {
    setCurrentRecord(null);
  };

  return (
    <div className={style.searchResults__wrapper}>
      <h4>Найденные {selectedCategory} :</h4>
      <ul className={style.searchResults}>
        {searchResults.map((result) => (
          <li
            key={result.id}
            className={style.searchResult}
            onClick={() => onResultClick(result.category, result.id)}
          >
            <h5>{result.title}</h5>
            <p>{result.content} 

              
            </p>
            <p>{result.createdAt}</p>
          </li>
        ))}
      </ul>

      {/* Отображение информации о текущей записи */}
      {currentRecord && (
        <div className={style.modalOverlay} onClick={handleCloseModal}>
          <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
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
        </div>
      )}
    </div>
  );
}

export default SearchResult;
