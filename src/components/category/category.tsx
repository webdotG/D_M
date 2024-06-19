import { useCategoryStore } from '../../store';
import style from './category.module.scss';

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

const category = {
  dreams: {
    1: 'Бег',
    2: 'Крутой секс, но не возможно кончить',
    3: 'Разные разборки',
    4: 'Ничего'
  },
  memorises: {
    1: 'Детство',
    2: 'Отрочество',
    3: 'Юность',
    4: 'Взросление'
  }
};




export default function Category() {
  const { selectedCategory } = useCategoryStore();

  const currentCategory = selectedCategory === 'сны' ? 'dreams' : 'memorises';

  return (
    <section className={style['category']}>
    {
      Object.entries(category[currentCategory]).map(([key, value]) => (
        <button
          className={style['category-button']}
          key={key}
          style={{ backgroundColor: getNextColor() }}
        >
          {value}
        </button>
      ))
    }
  </section>
  );
}
