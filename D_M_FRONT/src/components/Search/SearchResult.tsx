import { useState } from 'react';
import style from './serachResult.module.scss'; 
import Dream from '../dreams_memories/dreams_memories';
import { useTranslate } from '../../hooks/useTranslate'; 

interface SearchResultProps {
  searchResults: {
    id: number;
    category: string;
    associations: string;
    title: string;
    content: string;
    date: string;
    isAnalyzed?: boolean;
  }[];
}

interface Record {
  id: number;
  category: string;
  associations: string;
  title: string;
  content: string;
  createdAt: string; 
  isAnalyzed?: boolean;
}

function SearchResult({ searchResults }: SearchResultProps) {
  const [currentRecord, setCurrentRecord] = useState<Record | null>(null);

  const { translateToLanguage: translate } = useTranslate();

  const onResultClick = async (result: Omit<Record, 'createdAt'> & { date: string }) => {
    const updatedResult: Record = {
      ...result,
      createdAt: result.date
    };
    setCurrentRecord(updatedResult);
  };

  const handleCloseModal = () => {
    setCurrentRecord(null);
  };

  return (
    <div className={style.searchResults__wrapper}>
      <h4>{translate('Найденные')} :</h4>
      <section className={style.searchResults}>
        {searchResults.map((result) => (
          <button
            key={result.id}
            className={style.searchResult} 
            onClick={() => onResultClick(result)}
          >
            <h5>{result.title}</h5>
            <p>{result.content}</p>
            <p>{result.date}</p>
          </button>
        ))}
      </section>

      {currentRecord && (
        <div className={style.modalOverlay} onClick={handleCloseModal}>
          <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
            <Dream
              id={currentRecord.id}
              category={currentRecord.category}
              associations={currentRecord.associations}
              title={currentRecord.title}
              content={currentRecord.content}
              isAnalyzed={currentRecord.isAnalyzed ?? false}
              date={currentRecord.createdAt}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchResult;
