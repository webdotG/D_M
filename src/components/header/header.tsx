import React, { useState } from 'react';
import translations from '../../translations.json';
import { TranslationMap } from '../../types';
import style from './header.module.scss';

type Props = {
  selectedLanguage: keyof TranslationMap;
};

export default function Header({ selectedLanguage }: Props) {
  const [searchDate, setSearchDate] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  const translateToLanguage = (text: string): string => {
    if (!(selectedLanguage in translations)) {
      throw new Error(`Язык '${selectedLanguage}' не поддерживается.`);
    }

    //переводы для выбранного языка
    const languageTranslations = translations[selectedLanguage as keyof typeof translations];

    //текст существует в переводах для выбранного языка
    if (!(text in languageTranslations)) {
      throw new Error(`Перевод для текста '${text}' не найден в языке '${selectedLanguage}'.`);
    }

    return languageTranslations[text as keyof typeof languageTranslations];
  };

  const handleSearchDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Очистка от нецифровых символов, но сохранение точек
    const cleanedValue = event.target.value.replace(/[^\d.]/g, '');
    setSearchDate(cleanedValue);
  };

  return (
    <header className={style.header}>
      <nav className={style.headerNav}>
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
                  можно только цифры и/или точку
                </span>
              )}
            </label>
            <label htmlFor="search-category" className={style['search-label']}>
              {translateToLanguage('категории')}
              <input id="search-category" type="text" name="search-category" />
            </label>
            <button className={style["search-submit"]} type="submit">
              {translateToLanguage('искать')}
            </button>
          </form>
        </section>
      </nav>
    </header>

  );
}
