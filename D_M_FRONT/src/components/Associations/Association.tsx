import React, { useEffect, useState } from 'react';
import style from './Associations.module.scss';
import { useCategoryStore } from '../../store';
import { fetchAssociations } from '../../API/associationALL';


type AssociationType = string[];

const Associations: React.FC = () => {
  const selectedCategory = useCategoryStore((state) => state.selectedCategory);

  const [associations, setAssociations] = useState<AssociationType>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAssociations = async () => {
      if (selectedCategory) {
        setLoading(true);
        try {
          const data = await fetchAssociations(selectedCategory);

          console.log('Loaded associations:', data);

          // Проверяем, что данные соответствуют ожидаемому типу
          if (Array.isArray(data) && data.every(item => typeof item === 'string')) {
            console.log('Valid associations data:', data);
            setAssociations(data); 
          } else {
            throw new Error('Некорректный формат данных ассоциаций');
          }
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

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={style['wrapper-category']}>
      <h2>Ассоциации {selectedCategory}</h2>
      <section className={style['category']}>
        {associations.length > 0 ? (
          associations.map((association, index) => (
            <button className={style['category-button']} key={index}>
              {association} 
            </button>
          ))
        ) : (
          <p>Нет ассоциаций.</p>
        )}
      </section>
    </div>
  );
};

export default Associations;