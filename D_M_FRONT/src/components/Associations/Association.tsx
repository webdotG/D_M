import React, { useEffect } from 'react';
import style from './Associations.module.scss';
import { useDreamStore, useCategoryStore } from '../../store'; 


const Associations: React.FC = () => {
  const selectedCategory = useCategoryStore((state) => state.selectedCategory); 
  const loadAssociations = useDreamStore((state) => state.loadAssociations); 
  const associations = useDreamStore((state) => state.dreams.map((dream) => dream.associations)); 

  useEffect(() => {
    if (selectedCategory) {
      loadAssociations(selectedCategory); 
    }
  }, [selectedCategory, loadAssociations]);

  return (
  <div className={style['wrapper-category']}>
    <h2>Ассоциации </h2>
    <section className={style['category']}>
     
      {
        associations.map((association: string, index: number) => (
          <button
            className={style['category-button']}
            key={index}
          >
            {association}
          </button>
        ))
      }
    </section>
  </div>
  );
};

export default Associations;
