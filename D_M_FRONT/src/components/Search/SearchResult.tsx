import { useState } from 'react';
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
  const [currentRecord, setCurrentRecord] = useState(null);
  const { selectedCategory } = useCategoryStore();
  console.log('SEARCH RESULTs PROPS ', searchResults)

  const onResultClick = async (result) => {
    setCurrentRecord(result)
  };

  const handleCloseModal = () => {
    setCurrentRecord(null);
  };

  return (
    <div className={style.searchResults__wrapper}>
      <h4>Найденные {selectedCategory} :</h4>
      <section className={style.searchResults}>
        {searchResults.map((result) => (
          <button
            key={result.id}
            className={style.searchResult} 
            onClick={() => onResultClick(result)}
          >
            <h5>{result.title}</h5>
            <p>{result.content}</p>
            <p>{result.createdAt}</p>
          </button>
        ))}
      </section>

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
