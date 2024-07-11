
import style from './header.module.scss';
import { useTranslate } from '../../hooks/useTranslate';
import SearchForm from '../Search/Search';
import { searchByValue, searchByDate } from '../../API/search';

interface HeaderProps {
  selectedLanguage: string;
}

export default function Header({ selectedLanguage }: HeaderProps) {
  const { translateToLanguage } = useTranslate();

  const handleSearch = async (searchParams: { value: string; date: string }) => {
    console.log('Search Params:', searchParams);

    if (searchParams.value) {
      try {
        const valueData = await searchByValue(searchParams.value);
        console.log('Search Results by Value:', valueData);
      } catch (error) {
        console.error('Error searching by value:', error);
      }
    }

    if (searchParams.date) {
      try {
        const dateData = await searchByDate(searchParams.date);
        console.log('Search Results by Date:', dateData);
      } catch (error) {
        console.error('Error searching by date:', error);
      }
    }
  };

  console.log(`selectedLang ... >>> ... : ${selectedLanguage}`);

  return (
    <header className={style.header}>
      <nav className={style.headerNav}>
        <h1>{translateToLanguage('поиск')}</h1>
        <section className={`${style.searches} searches`}>
          <SearchForm translateToLanguage={translateToLanguage} onSearch={handleSearch} />
        </section>
      </nav>
    </header>
  );
}



