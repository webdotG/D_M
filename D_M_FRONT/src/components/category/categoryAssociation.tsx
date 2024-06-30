import React, { useState, useEffect } from 'react';
import style from './category.module.scss';
import { fetchAssociations } from '../../API/associationSearch';

const colors = [
  'rgba(255, 0, 0, 0.33)',     
  'rgba(255, 165, 0, 0.33)',    
  'rgba(255, 255, 0, 0.33)',   
  'rgba(0, 128, 0, 0.33)',    
  'rgba(0, 255, 255, 0.33)', 
  'rgba(0, 0, 255, 0.33)',   
  'rgba(75, 0, 130, 0.33)',    
  'rgba(238, 130, 238, 0.33)', 
  'rgba(128, 0, 128, 0.33)'    
];

let colorIndex = 0;

function getNextColor(): string {
  const color = colors[colorIndex];
  colorIndex = (colorIndex + 1) % colors.length;
  return color;
}

const Category: React.FC = () => {
  const [associations, setAssociations] = useState<string[]>([]);

  useEffect(() => {
    async function loadAssociations() {
      try {
        const fetchedAssociations = await fetchAssociations();
        setAssociations(fetchedAssociations);
      } catch (error) {
        console.error('Failed to fetch associations:', error);
      }
    }
    loadAssociations();
  }, []);

  return (
    <section className={style['category']}>
      {
        associations.map((association, index) => (
          <button
            className={style['category-button']}
            key={index}
            style={{ backgroundColor: getNextColor() }}
          >
            {association}
          </button>
        ))
      }
    </section>
  );
};

export default Category;
