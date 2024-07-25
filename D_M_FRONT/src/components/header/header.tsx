
import style from './header.module.scss';
import { useTranslate } from '../../hooks/useTranslate';
import SearchForm from '../Search/Search';
import { useCategoryStore } from '../../store'; 

export default function Header() {
  const { translateToLanguage } = useTranslate();
  
  const selectedCategory = useCategoryStore((state) => state.selectedCategory); 

  return (
    <header className={style.header}>
      <nav className={style.headerNav}>
        <h1>{translateToLanguage('поиск')} ... {selectedCategory}</h1>
        <section className={`${style.searches} searches`}>
          <SearchForm
  
          />
        </section>
      </nav>
    </header>
  );
}
