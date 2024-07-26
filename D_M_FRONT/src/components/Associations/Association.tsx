import React, { useEffect, useState } from 'react';
import style from './Associations.module.scss';
import { useCategoryStore } from '../../store';
import { fetchAssociations } from '../../API/associationALL';
import BackSVG from '../../SVG/back.svg'

type AssociationType = string[];

const Associations: React.FC = () => {
  const selectedCategory = useCategoryStore((state) => state.selectedCategory);

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

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={style['wrapper-associations']}>
      <h2>Ассоциации 
      { selectedCategory === "сны" 
      ? (
         <p> для снов</p>
      ) : (
        <p> для воспоминаний</p>
      )
      }
      </h2>
      <div className={style['slider']}>
        <button className={style['slider-button--prev']} 
          onClick={handlePrevClick} 
          disabled={currentIndex === 0}>
           <img src={BackSVG} alt='prev' />
        </button>
        <ul className={style['associations']}>
          {displayedAssociations.length > 0 ? (
            displayedAssociations.map((association, index) => (
              <li className={style['associations__item']} key={index}>
                <button className={style['association-button']}>{association}</button>
              </li>
            ))
          ) : (
            <p>Нет ассоциаций.</p>
          )}
        </ul>
        <button className={style['slider-button--next']}
          onClick={handleNextClick} 
          disabled={!hasMore || currentIndex + itemsPerPage >= associations.length}>
         <img src={BackSVG} alt='next' />
        </button>
      </div>
    </div>
  );
};

export default Associations;
