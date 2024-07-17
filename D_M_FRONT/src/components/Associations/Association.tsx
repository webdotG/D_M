import React, { useEffect } from 'react';
import style from './Associations.module.scss';
import { useDreamStore, useCategoryStore } from '../../store';

const Associations: React.FC = () => {
  const selectedCategory = useCategoryStore((state) => state.selectedCategory);
  const loadAssociations = useDreamStore((state) => state.loadAssociations);
  const associations = useDreamStore((state) =>
    state.dreams.map((dream) => {
      if (Array.isArray(dream.associations)) {
        return dream.associations;
      } else if (typeof dream.associations === 'string') {
        try {
          return JSON.parse(dream.associations);
        } catch (error) {
          console.error(`Error parsing associations JSON for dream with id ${dream.id}:`, error);
          return [];
        }
      } else {
        return [];
      }
    })
  );

  useEffect(() => {
    if (selectedCategory) {
      loadAssociations(selectedCategory);
    }
  }, [selectedCategory, loadAssociations]);

  return (
    <div className={style['wrapper-category']}>
      <h2>Ассоциации</h2>
      <section className={style['category']}>
        {associations.map((association: string[], index: number) => (
          <button className={style['category-button']} key={index}>
            {association.join(', ')}
          </button>
        ))}
      </section>
    </div>
  );
};

export default Associations;
