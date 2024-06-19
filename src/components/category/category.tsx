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

const getRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
};

const drawCircle = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="6" r="6" fill={getRandomColor()} />
  </svg>
);

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
           {drawCircle()}
          {value}
        </button>
      ))
    }
  </section>
  );
}
