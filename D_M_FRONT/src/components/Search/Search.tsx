import React, { useState } from 'react';
import style from './Search.module.scss';
import searchIcon from '../../SVG/search.svg';
import deleteIcon from '../../SVG/delete.svg';

interface SearchFormProps {
  translateToLanguage: (key: string) => string;
  onSearch: (searchParams: { value: string; date: string; }) => void;
}

export default function SearchForm({ translateToLanguage, onSearch }: SearchFormProps) {
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

  const isInputDisabled = (inputType: 'value' | 'date' | 'category'): boolean => {
    if (inputType === 'value') return (searchDate !== '' || searchCategory !== '');
    if (inputType === 'date') return (searchValue !== '' || searchCategory !== '');
    if (inputType === 'category') return (searchValue !== '' || searchDate !== '');
    return false;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch({ value: searchValue, date: searchDate });
  };

  return (
    <form className={style['search-header-form']} onSubmit={handleSubmit}>
      {(searchValue || searchDate || searchCategory) && (
        <div className={style.inputHint}>
          {translateToLanguage('onlyOneParameterAtATime')}
        </div>
      )}
      <label htmlFor="search" className={style['search-label']}>
        {translateToLanguage('буквы')}
        <input
          id="search"
          className={style.searchInput}
          type="text"
          name="search"
          value={searchValue}
          onChange={handleInputChange(setSearchValue)}
          disabled={isInputDisabled('value')}
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
          disabled={isInputDisabled('date')}
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
          disabled={isInputDisabled('category')}
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
  );
}
