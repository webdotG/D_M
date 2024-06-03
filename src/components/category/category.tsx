import { useState } from 'react';
import { Categories } from '../../TYPES/types';
import style from './category.module.scss';

const category: Categories = {
  dreams: {
    1: 'Секс',
    2: 'Плохое настроение',
    3: 'Падения',
    4: 'Бег',
  },
  memorises: {
    1: 'детство',
    2: 'отрочество',
    3: 'юность',
    4: 'взросление',
  }
};

export default function Category() {
  const [currentCategory, setCurrentCategory] = useState<'dreams' | 'memorises'>('dreams');

  const toggleCategory = () => {
    setCurrentCategory(currentCategory === 'dreams' ? 'memorises' : 'dreams');
  };

  return (
    <section className={style['category']}>
      КАТЕГОРИИ
      <button onClick={toggleCategory}>перключение тест</button>
      {
        Object.entries(category[currentCategory]).map(([key, value]) => (
          <button className={style['category-button']} key={key}>{value}</button>
        ))
      }
    </section>
  );
}
