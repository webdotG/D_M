import React, { useEffect, useState } from 'react';
import style from './Associations.module.scss';
import { useCategoryStore } from '../../store';
import { fetchAssociations } from '../../API/associationALL';
import { useTranslate } from '../../hooks/useTranslate';

type AssociationType = string[];

interface AssociationsProps {
  onAssociationClick: (association: string) => void;
}

const Associations: React.FC<AssociationsProps> = ({ onAssociationClick }) => {
  const selectedCategory = useCategoryStore((state) => state.selectedCategory);
  const { translateToLanguage } = useTranslate();

  const [associations, setAssociations] = useState<AssociationType>([]);
  const [displayedAssociations, setDisplayedAssociations] = useState<AssociationType>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const itemsPerPage = 4;

  useEffect(() => {
    const loadAssociations = async () => {
      if (selectedCategory) {
        setLoading(true);
        try {
          const data = await fetchAssociations(selectedCategory);

          console.log('Loaded associations:', data);
          setAssociations(data);
          setDisplayedAssociations(data.slice(0, itemsPerPage));
          setHasMore(data.length > itemsPerPage);
        } catch (error) {
          console.error('Ошибка при загрузке ассоциаций:', error);
          setError('Не удалось загрузить ассоциации.');
        } finally {
          setLoading(false);
        }
      }
    };

    loadAssociations();
  }, [selectedCategory]);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = Math.max(prevIndex - itemsPerPage, 0);
      setDisplayedAssociations(associations.slice(newIndex, newIndex + itemsPerPage));
      return newIndex;
    });
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + itemsPerPage;
      if (newIndex >= associations.length) return prevIndex;
      setDisplayedAssociations(associations.slice(newIndex, newIndex + itemsPerPage));
      return newIndex;
    });
  };

  const handleAssociationClick = (association: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onAssociationClick(association);
  };

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={style['wrapper-associations']}>
      <h2 className={style['wrapper-associations__title']}>
      {translateToLanguage('Ассоциации')} 
      { selectedCategory === "сны" 
      ? (
         <p>{translateToLanguage('для снов')}</p>
      ) : (
        <p>{translateToLanguage('для воспоминаний')}</p>
      )
      }
      </h2>
      <div className={style['slider']}>
        <button className={style['slider-button--prev']} 
          onClick={handlePrevClick} 
          disabled={currentIndex === 0}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
            <path d="M48.252,69.253c-2.271,0-4.405-0.884-6.011-2.489L17.736,42.258c-1.646-1.645-2.546-3.921-2.479-6.255
            c-0.068-2.337,0.833-4.614,2.479-6.261L42.242,5.236c1.605-1.605,3.739-2.489,6.01-2.489c2.271,0,4.405,0.884,6.01,2.489
            c3.314,3.314,3.314,8.707,0,12.021L35.519,36l18.743,18.742c3.314,3.314,3.314,8.707,0,12.021
            C52.656,68.369,50.522,69.253,48.252,69.253z M48.252,6.747c-1.202,0-2.332,0.468-3.182,1.317L21.038,32.57
            c-0.891,0.893-0.833,2.084-0.833,3.355c0,0.051,0,0.101,0,0.151c0,1.271-0.058,2.461,0.833,3.353l24.269,24.506
            c0.85,0.85,1.862,1.317,3.063,1.317c1.203,0,2.273-0.468,3.123-1.317c1.755-1.755,1.725-4.61-0.03-6.365L31.292,37.414
            c-0.781-0.781-0.788-2.047-0.007-2.828L51.438,14.43c1.754-1.755,1.753-4.61-0.001-6.365C50.587,7.215,49.454,6.747,48.252,6.747z"/>
          </svg>
        </button>
        <ul className={style['associations']}>
          {displayedAssociations.length > 0 ? (
            displayedAssociations.map((association, index) => (
              <li className={style['associations__item']} key={index}>
                <button 
                  className={style['association-button']} 
                  onClick={handleAssociationClick(association)}>
                  {association}
                </button>
              </li>
            ))
          ) : (
            <p>Нет ассоциаций.</p>
          )}
        </ul>
        <button className={style['slider-button--next']}
          onClick={handleNextClick} 
          disabled={!hasMore || currentIndex + itemsPerPage >= associations.length}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
            <path d="M48.252,69.253c-2.271,0-4.405-0.884-6.011-2.489L17.736,42.258c-1.646-1.645-2.546-3.921-2.479-6.255
            c-0.068-2.337,0.833-4.614,2.479-6.261L42.242,5.236c1.605-1.605,3.739-2.489,6.01-2.489c2.271,0,4.405,0.884,6.01,2.489
            c3.314,3.314,3.314,8.707,0,12.021L35.519,36l18.743,18.742c3.314,3.314,3.314,8.707,0,12.021
            C52.656,68.369,50.522,69.253,48.252,69.253z M48.252,6.747c-1.202,0-2.332,0.468-3.182,1.317L21.038,32.57
            c-0.891,0.893-0.833,2.084-0.833,3.355c0,0.051,0,0.101,0,0.151c0,1.271-0.058,2.461,0.833,3.353l24.269,24.506
            c0.85,0.85,1.862,1.317,3.063,1.317c1.203,0,2.273-0.468,3.123-1.317c1.755-1.755,1.725-4.61-0.03-6.365L31.292,37.414
            c-0.781-0.781-0.788-2.047-0.007-2.828L51.438,14.43c1.754-1.755,1.753-4.61-0.001-6.365C50.587,7.215,49.454,6.747,48.252,6.747z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Associations;
