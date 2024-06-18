import { useCategoryStore } from '../../store';
import style from './category.module.scss';

const category = {
  dreams: {
    1: 'D-1',
    2: 'D-2',
    3: 'D-3',
    4: 'D-4',
  },
  memorises: {
    1: 'M-1',
    2: 'M-2',
    3: 'M-3',
    4: 'M-4',
  }
};

export default function Category() {
  const { selectedCategory, setSelectedCategory } = useCategoryStore();

  const toggleCategory = () => {
    setSelectedCategory(selectedCategory === 'сны' ? 'воспоминания' : 'сны');
  };

  const currentCategory = selectedCategory === 'сны' ? 'dreams' : 'memorises';

  return (
    <section className={style['category']}>
      КАТЕГОРИИ
      <button onClick={toggleCategory}>переключение тест</button>
      {
        Object.entries(category[currentCategory]).map(([key, value]) => (
          <button className={style['category-button']} key={key}>{value}</button>
        ))
      }
    </section>
  );
}
