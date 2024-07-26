import React, { useEffect, useState } from 'react';
import style from './Search.module.scss'; 
import searchIcon from '../../SVG/search.svg'; 
import deleteIcon from '../../SVG/delete.svg'; 
// import unlikeIcon from '../../SVG/unlike.svg'; 
import { searchByValue, searchByDate, searchByValueAndDate } from '../../API/search'; 
import { useCategoryStore } from '../../store'; 
import { useTranslate } from '../../hooks/useTranslate'; 
import SearchResult from './SearchResult';

export default function SearchForm() {
  const { selectedCategory } = useCategoryStore(); 
  const { translateToLanguage: translate } = useTranslate(); 

  const [searchValue, setSearchValue] = useState(''); 
  const [searchDate, setSearchDate] = useState(''); 
  const [showSearchResults, setShowSearchResults] = useState(false); 
  const [searchResults, setSearchResults] = useState([]); 
  const [isSearchValueFocused, setIsSearchValueFocused] = useState(false);
  const [isSearchDateFocused, setIsSearchDateFocused] = useState(false);

  // Обработчик изменения в поле ввода
  const handleInputChange = (setValue: React.Dispatch<React.SetStateAction<string>>) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = event.target.value;
    // Проверяем, что ввод содержит только буквы (латиница и кириллица)
    if (/^[a-zA-Zа-яА-ЯёЁ]*$/.test(inputValue) || inputValue === '') {
      setValue(inputValue); 
    }
  };

  // Обработчик изменения даты поиска
 const handleSearchDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const cleanedValue = event.target.value.replace(/[^\d.]/g, '');
  setSearchDate(cleanedValue); 
};

  // Обработчик очистки поля ввода
  const handleClearInput = (setValue: React.Dispatch<React.SetStateAction<string>>) => () => {
    setValue(''); 
  };

 
// Новая функция для обработки логики поиска
const handleSearch = async () => {
  try {
    // Поиск по значению, если заданы значение поиска и выбранная категория
    if (searchValue && selectedCategory) {
      const valueData = await searchByValue(searchValue, selectedCategory);
      setSearchResults(valueData); 
      setShowSearchResults(true); 
      console.log('Search Results by Value:', valueData);
    }

    // Поиск по дате, если задана дата поиска и выбранная категория
    if (searchDate && selectedCategory) {
      const dateData = await searchByDate(searchDate, selectedCategory);
      setSearchResults(dateData); 
      setShowSearchResults(true); 
      console.log('Search Results by Date:', dateData);
    }

    // Поиск по значению и дате, если заданы оба параметра и выбранная категория
    if (searchValue && searchDate && selectedCategory) {
      const valueDateData = await searchByValueAndDate(searchValue, searchDate, selectedCategory);
      setSearchResults(valueDateData); 
      setShowSearchResults(true); 
      console.log('Search Results by Value and Date:', valueDateData);
    }
    
  } catch (error) {
    console.error('Error during search:', error); 
  }
};

// Обработчик формы поиска
const handleSubmit = (event: React.FormEvent) => {
  event.preventDefault();
  handleSearch(); 
};

// 
useEffect(() => {
  handleSearch(); 
}, [selectedCategory]);



  return (
    <form className={style['search-header-form']} onSubmit={handleSubmit}>
      {/* Поле поиска по значению */}
      {
        selectedCategory === 'сны'
        ? <h2>{translate('искать')} <p>{translate('сны')}</p></h2>
        : <h2>{translate('искать')} <p>{translate('воспоминания')}</p></h2>
      }
      <div className={style['search-label__wrapper']}>
      <label htmlFor="search" className={style['search-label']}>
        {translate('буквы')}
        <input
          id="search"
          className={style.searchInput}
          type="text"
          name="search"
          value={searchValue}
          onChange={handleInputChange(setSearchValue)}
          onFocus={() => setIsSearchValueFocused(true)}
          onBlur={() => setIsSearchValueFocused(false)}
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
      {isSearchValueFocused && (
        <span className={style['search-label__help']}>
          <p>{translate('только буквы')}</p></span>
      )}
      </div>
      
      <div className={style['search-label__wrapper']}>
      {/* Поле поиска по дате */}
      <label htmlFor="search-date" className={style['search-label']}>
        {translate('дата')}
        <input
          id="search-date"
          type="text"
          name="search-date"
          className={style.searchInput}
          value={searchDate}
          onChange={handleSearchDateChange}
          onFocus={() => setIsSearchDateFocused(true)}
          onBlur={() => setIsSearchDateFocused(false)}
          pattern="[0-9]*\.?[0-9]*"
        />
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
      {isSearchDateFocused && (
        <span className={style['search-label__help']}>
          <p>
            {translate('только цифры и .')}
          </p>
        </span>
      )}
      </div>
   
      <button className={style['search-submit']} type="submit">
        {translate('искать')}
      </button>

   {/* Отображение результатов поиска */}
   {showSearchResults && (searchValue || searchDate) ? (
      searchResults.length > 0 ? (
        <>
          <SearchResult
            searchResults={searchResults}/>
          <button className={style['clearSearch-btn']}
          onClick={() => (setSearchValue(''), setSearchDate(''))}> 
            <p>очистить</p>
            <img src={deleteIcon} alt='clear search icon' />
          </button> 
        </>
      ) : (
        <p className={style['notFound']}>
          Совпадений не найдено ! 
        </p>
      )
    ) : null}
    
    </form>
  );
}