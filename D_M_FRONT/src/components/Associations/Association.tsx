import React, { useEffect, useState } from 'react';
import style from './Associations.module.scss';
import { useCategoryStore } from '../../store';
import { fetchAssociations } from '../../API/associationSearch'; 

type AssociationType = string[]; 

const Associations: React.FC = () => {
  const selectedCategory = useCategoryStore((state) => state.selectedCategory);
  
  // Локальное состояние для хранения ассоциаций
  const [associations, setAssociations] = useState<AssociationType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAssociations = async () => {
      if (selectedCategory) {
        setLoading(true);
        try {
          const data = await fetchAssociations(selectedCategory);
          setAssociations(data.flat()); 
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
      <h2>Ассоциации</h2>
      <section className={style['category']}>
        {associations.length > 0 ? (
          associations.map((association, index) => (
            <button className={style['category-button']} key={index}>
              {association.join(', ')}
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
