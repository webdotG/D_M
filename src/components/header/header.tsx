import React, { useState } from 'react';
import style from './header.module.scss';
import { useTranslate } from '../../hooks/useTranslate';

export default function Header() {
  const [searchDate, setSearchDate] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  const { translateToLanguage } = useTranslate();

  const handleSearchDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Очистка от нецифровых символов, но сохранение точек
    const cleanedValue = event.target.value.replace(/[^\d.]/g, '');
    setSearchDate(cleanedValue);
  };

  return (
    <header className={style.header}>
      <nav className={style.headerNav}>
        <h1>{translateToLanguage('поиск')}</h1>
        <section className={`${style.searches} searches`}>
          <form className={style['search-header-form']}>
            <label htmlFor="search" className={style['search-label']}>
              {translateToLanguage('буквы')}
              <input id="search" type="text" name="search" />
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
            </label>
            <label htmlFor="search-category" className={style['search-label']}>
              {translateToLanguage('категории')}
              <input id="search-category" type="text" name="search-category" />
            </label>
            <button className={style["search-submit"]} type="submit">
              {translateToLanguage("искать")}
            </button>
          </form>
        </section>
      </nav>
    </header>

  );
}
