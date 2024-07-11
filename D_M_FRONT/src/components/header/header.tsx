
import style from './header.module.scss';
import { useTranslate } from '../../hooks/useTranslate';
import SearchForm from '../Search/Search';

export default function Header() {
  const { translateToLanguage } = useTranslate();
  

  return (
    <header className={style.header}>
      <nav className={style.headerNav}>
        <h1>{translateToLanguage('поиск')}</h1>
        <section className={`${style.searches} searches`}>
          <SearchForm
  
          />
        </section>
      </nav>
    </header>
  );
}
