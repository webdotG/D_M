import React, { useState } from 'react';
import style from './header.module.scss';
import { useTranslate } from '../../hooks/useTranslate';
import searchIcon from '../../SVG/search.svg'
import deleteIcon from '../../SVG/delete.svg'

interface HeaderProps {
  selectedLanguage: string;
}

export default function Header({ selectedLanguage }: HeaderProps) {
  const { translateToLanguage } = useTranslate();


  const [searchValue, setSearchValue] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  
  const handleInputChange = (setValue: React.Dispatch<React.SetStateAction<string>>) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleClearInput = (setValue: React.Dispatch<React.SetStateAction<string>>) => () => {
    setValue('');
  };


  const handleSearchDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = event.target.value.replace(/[^\d.]/g, '');
    setSearchDate(cleanedValue);
  };

  // selectedLanguage
  console.log(`Selected language is: ${selectedLanguage}`);

  return (
    <header className={style.header}>
      <nav className={style.headerNav}>
        <h1>{translateToLanguage('поиск')}</h1>
        <section className={`${style.searches} searches`}>
          <form className={style['search-header-form']}>
            <label htmlFor="search" className={style['search-label']}>
              {translateToLanguage('буквы')}
              <input
                id="search"
                className={style.searchInput}
                type="text"
                name="search"
                value={searchValue}
                onChange={handleInputChange(setSearchValue)}
              />
              {searchValue ? (
                <img
                  src={deleteIcon}
                  alt="delete icon"
                  onClick={handleClearInput(setSearchValue)}
                  className={style.icon}
                />
              ) : (
                <img src={searchIcon} alt="search icon" className={style.icon} />
              )}
            </label>
            <label htmlFor="search-date" className={style['search-label']}>
              {translateToLanguage('дата')}
              <input
                id="search-date"
                type="text"
                name="search-date"
                className={style.searchInput}
                value={searchDate}
                onChange={handleSearchDateChange}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                pattern="[0-9]*\.?[0-9]*"
              />
              {inputFocused && (
                <span className={style.inputHint}>
                  {translateToLanguage('digitsAndDotOnly')}
                </span>
              )}
              {searchDate ? (
                <img
                  src={deleteIcon}
                  alt="delete icon"
                  onClick={handleClearInput(setSearchDate)}
                  className={style.icon}
                />
              ) : (
                <img src={searchIcon} alt="search icon" className={style.icon} />
              )}
              </label>
            <label htmlFor="search-category" className={style['search-label']}>
              {translateToLanguage('категории')}
              <input
                id="search-category"
                className={style.searchInput}
                type="text"
                name="search-category"
                value={searchCategory}
                onChange={handleInputChange(setSearchCategory)}
              />
              {searchCategory ? (
                <img
                  src={deleteIcon}
                  alt="delete icon"
                  onClick={handleClearInput(setSearchCategory)}
                  className={style.icon}
                />
              ) : (
                <img src={searchIcon} alt="search icon" className={style.icon} />
              )}
            </label>
            <button className={style['search-submit']} type="submit">
              {translateToLanguage('искать')}
            </button>
          </form>
        </section>
      </nav>
    </header>
  );
}
