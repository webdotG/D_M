import React, { useEffect, useState } from 'react';
import style from './Search.module.scss'; 
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
    <form className={style['search-header-form']} 
      onSubmit={handleSubmit}>
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
          <button className={style.icon}
          onClick={handleClearInput(setSearchValue)}>
<svg  xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
	viewBox="0 0 72 72" enableBackground="new 0 0 72 72" xmlSpace="preserve">
<g>
	<path d="M53.678,61.824c-2.27,0-4.404-0.885-6.01-2.49L36,47.667L24.332,59.334c-1.604,1.605-3.739,2.49-6.01,2.49
		s-4.404-0.885-6.01-2.49c-1.605-1.604-2.49-3.739-2.49-6.01c0-2.271,0.885-4.405,2.491-6.011l11.666-11.667l-10.96-10.961
		c-1.605-1.604-2.49-3.739-2.49-6.01s0.885-4.405,2.49-6.01c1.605-1.605,3.739-2.49,6.011-2.49c2.271,0,4.405,0.885,6.01,2.49
		L36,23.626l10.96-10.96c1.605-1.605,3.738-2.49,6.01-2.49s4.406,0.885,6.01,2.49c1.605,1.604,2.49,3.739,2.49,6.01
		s-0.885,4.405-2.49,6.01L48.021,35.646l11.666,11.668c1.605,1.604,2.49,3.738,2.49,6.01c0,2.271-0.885,4.405-2.49,6.01
		C58.084,60.939,55.949,61.824,53.678,61.824z M36,42.839c0.511,0,1.023,0.195,1.414,0.586l13.082,13.081
		c0.852,0.851,1.98,1.318,3.182,1.318c1.203,0,2.332-0.468,3.182-1.318c0.852-0.851,1.318-1.98,1.318-3.182
		c0-1.202-0.467-2.332-1.318-3.181l-13.08-13.083c-0.781-0.781-0.781-2.047,0-2.828l12.373-12.375
		c0.852-0.851,1.318-1.979,1.318-3.182s-0.467-2.331-1.318-3.182c-0.85-0.851-1.98-1.318-3.182-1.318s-2.332,0.468-3.18,1.318
		L37.414,27.868c-0.781,0.781-2.046,0.781-2.828,0L22.21,15.494c-0.85-0.851-1.979-1.318-3.181-1.318
		c-1.202,0-2.332,0.468-3.182,1.318c-0.851,0.851-1.319,1.979-1.319,3.182s0.469,2.331,1.318,3.182l12.374,12.375
		c0.781,0.781,0.781,2.047,0,2.828L15.14,50.143c-0.85,0.85-1.318,1.979-1.318,3.182c0,1.201,0.469,2.331,1.318,3.182
		c0.851,0.851,1.98,1.318,3.182,1.318c1.202,0,2.332-0.468,3.182-1.318l13.083-13.081C34.977,43.034,35.489,42.839,36,42.839z"/>
</g>
</svg>
          </button > 
        ) : (
          <button className={style.icon}>
<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
	viewBox="0 0 72 72" enableBackground="new 0 0 72 72" xmlSpace="preserve">
<g>
	<path d="M28.131,10.632c-6.262,0-12.141,3.348-15.342,8.738c-0.282,0.474-0.126,1.089,0.349,1.37
		c0.16,0.096,0.336,0.141,0.51,0.141c0.342,0,0.674-0.174,0.861-0.489c2.843-4.786,8.062-7.76,13.622-7.76c0.553,0,1-0.447,1-1
		C29.131,11.079,28.684,10.632,28.131,10.632z"/>
	<path d="M11.967,23.646c-0.537-0.124-1.075,0.208-1.201,0.746c-0.299,1.276-0.468,2.067-0.468,3.487c0,0.553,0.448,1,1,1
		c0.553,0,1-0.447,1-1c0-1.205,0.135-1.834,0.415-3.032C12.839,24.309,12.505,23.772,11.967,23.646z"/>
	<path d="M66.613,57.793L50.471,41.652c-0.393-0.393-0.788-0.672-1.17-0.877c2.113-3.62,3.33-7.825,3.33-12.311
		c0-13.51-10.99-24.5-24.5-24.5c-13.509,0-24.5,10.99-24.5,24.5s10.991,24.499,24.5,24.499c4.81,0,9.296-1.398,13.084-3.801
		c0.205,0.339,0.462,0.666,0.77,0.974l16.142,16.143c1.136,1.133,2.64,1.756,4.244,1.756c1.603,0,3.108-0.623,4.243-1.756
		c1.133-1.133,1.756-2.641,1.756-4.242C68.369,60.434,67.746,58.928,66.613,57.793z M7.631,28.465c0-11.304,9.196-20.5,20.5-20.5
		c11.305,0,20.5,9.196,20.5,20.5c0,11.305-9.197,20.499-20.5,20.499C16.827,48.964,7.631,39.77,7.631,28.465z M63.784,63.451
		c-0.757,0.754-2.074,0.754-2.83,0L44.813,47.309c-0.14-0.139-0.192-0.232-0.199-0.232c0.003-0.043,0.058-0.455,1.201-1.596
		c1.14-1.143,1.552-1.195,1.565-1.203c0.026,0.008,0.119,0.06,0.263,0.203l16.14,16.141c0.379,0.379,0.586,0.881,0.586,1.416
		C64.368,62.57,64.161,63.072,63.784,63.451z"/>
</g>
</svg>
          </button>
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
          <button className={style.icon}
          onClick={handleClearInput(setSearchValue)}>
<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
	viewBox="0 0 72 72" enableBackground="new 0 0 72 72" xmlSpace="preserve">
<g>
	<path d="M53.678,61.824c-2.27,0-4.404-0.885-6.01-2.49L36,47.667L24.332,59.334c-1.604,1.605-3.739,2.49-6.01,2.49
		s-4.404-0.885-6.01-2.49c-1.605-1.604-2.49-3.739-2.49-6.01c0-2.271,0.885-4.405,2.491-6.011l11.666-11.667l-10.96-10.961
		c-1.605-1.604-2.49-3.739-2.49-6.01s0.885-4.405,2.49-6.01c1.605-1.605,3.739-2.49,6.011-2.49c2.271,0,4.405,0.885,6.01,2.49
		L36,23.626l10.96-10.96c1.605-1.605,3.738-2.49,6.01-2.49s4.406,0.885,6.01,2.49c1.605,1.604,2.49,3.739,2.49,6.01
		s-0.885,4.405-2.49,6.01L48.021,35.646l11.666,11.668c1.605,1.604,2.49,3.738,2.49,6.01c0,2.271-0.885,4.405-2.49,6.01
		C58.084,60.939,55.949,61.824,53.678,61.824z M36,42.839c0.511,0,1.023,0.195,1.414,0.586l13.082,13.081
		c0.852,0.851,1.98,1.318,3.182,1.318c1.203,0,2.332-0.468,3.182-1.318c0.852-0.851,1.318-1.98,1.318-3.182
		c0-1.202-0.467-2.332-1.318-3.181l-13.08-13.083c-0.781-0.781-0.781-2.047,0-2.828l12.373-12.375
		c0.852-0.851,1.318-1.979,1.318-3.182s-0.467-2.331-1.318-3.182c-0.85-0.851-1.98-1.318-3.182-1.318s-2.332,0.468-3.18,1.318
		L37.414,27.868c-0.781,0.781-2.046,0.781-2.828,0L22.21,15.494c-0.85-0.851-1.979-1.318-3.181-1.318
		c-1.202,0-2.332,0.468-3.182,1.318c-0.851,0.851-1.319,1.979-1.319,3.182s0.469,2.331,1.318,3.182l12.374,12.375
		c0.781,0.781,0.781,2.047,0,2.828L15.14,50.143c-0.85,0.85-1.318,1.979-1.318,3.182c0,1.201,0.469,2.331,1.318,3.182
		c0.851,0.851,1.98,1.318,3.182,1.318c1.202,0,2.332-0.468,3.182-1.318l13.083-13.081C34.977,43.034,35.489,42.839,36,42.839z"/>
</g>
</svg>
          </button > 
        ) : (
          <button className={style.icon}>
<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
	viewBox="0 0 72 72" enableBackground="new 0 0 72 72" xmlSpace="preserve">
<g>
	<path d="M28.131,10.632c-6.262,0-12.141,3.348-15.342,8.738c-0.282,0.474-0.126,1.089,0.349,1.37
		c0.16,0.096,0.336,0.141,0.51,0.141c0.342,0,0.674-0.174,0.861-0.489c2.843-4.786,8.062-7.76,13.622-7.76c0.553,0,1-0.447,1-1
		C29.131,11.079,28.684,10.632,28.131,10.632z"/>
	<path d="M11.967,23.646c-0.537-0.124-1.075,0.208-1.201,0.746c-0.299,1.276-0.468,2.067-0.468,3.487c0,0.553,0.448,1,1,1
		c0.553,0,1-0.447,1-1c0-1.205,0.135-1.834,0.415-3.032C12.839,24.309,12.505,23.772,11.967,23.646z"/>
	<path d="M66.613,57.793L50.471,41.652c-0.393-0.393-0.788-0.672-1.17-0.877c2.113-3.62,3.33-7.825,3.33-12.311
		c0-13.51-10.99-24.5-24.5-24.5c-13.509,0-24.5,10.99-24.5,24.5s10.991,24.499,24.5,24.499c4.81,0,9.296-1.398,13.084-3.801
		c0.205,0.339,0.462,0.666,0.77,0.974l16.142,16.143c1.136,1.133,2.64,1.756,4.244,1.756c1.603,0,3.108-0.623,4.243-1.756
		c1.133-1.133,1.756-2.641,1.756-4.242C68.369,60.434,67.746,58.928,66.613,57.793z M7.631,28.465c0-11.304,9.196-20.5,20.5-20.5
		c11.305,0,20.5,9.196,20.5,20.5c0,11.305-9.197,20.499-20.5,20.499C16.827,48.964,7.631,39.77,7.631,28.465z M63.784,63.451
		c-0.757,0.754-2.074,0.754-2.83,0L44.813,47.309c-0.14-0.139-0.192-0.232-0.199-0.232c0.003-0.043,0.058-0.455,1.201-1.596
		c1.14-1.143,1.552-1.195,1.565-1.203c0.026,0.008,0.119,0.06,0.263,0.203l16.14,16.141c0.379,0.379,0.586,0.881,0.586,1.416
		C64.368,62.57,64.161,63.072,63.784,63.451z"/>
</g>
</svg>
          </button>
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
            <p>{translate('Очистить')}</p>
            <svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
	viewBox="0 0 72 72" enableBackground="new 0 0 72 72" xmlSpace="preserve">
<g>
	<path d="M53.678,61.824c-2.27,0-4.404-0.885-6.01-2.49L36,47.667L24.332,59.334c-1.604,1.605-3.739,2.49-6.01,2.49
		s-4.404-0.885-6.01-2.49c-1.605-1.604-2.49-3.739-2.49-6.01c0-2.271,0.885-4.405,2.491-6.011l11.666-11.667l-10.96-10.961
		c-1.605-1.604-2.49-3.739-2.49-6.01s0.885-4.405,2.49-6.01c1.605-1.605,3.739-2.49,6.011-2.49c2.271,0,4.405,0.885,6.01,2.49
		L36,23.626l10.96-10.96c1.605-1.605,3.738-2.49,6.01-2.49s4.406,0.885,6.01,2.49c1.605,1.604,2.49,3.739,2.49,6.01
		s-0.885,4.405-2.49,6.01L48.021,35.646l11.666,11.668c1.605,1.604,2.49,3.738,2.49,6.01c0,2.271-0.885,4.405-2.49,6.01
		C58.084,60.939,55.949,61.824,53.678,61.824z M36,42.839c0.511,0,1.023,0.195,1.414,0.586l13.082,13.081
		c0.852,0.851,1.98,1.318,3.182,1.318c1.203,0,2.332-0.468,3.182-1.318c0.852-0.851,1.318-1.98,1.318-3.182
		c0-1.202-0.467-2.332-1.318-3.181l-13.08-13.083c-0.781-0.781-0.781-2.047,0-2.828l12.373-12.375
		c0.852-0.851,1.318-1.979,1.318-3.182s-0.467-2.331-1.318-3.182c-0.85-0.851-1.98-1.318-3.182-1.318s-2.332,0.468-3.18,1.318
		L37.414,27.868c-0.781,0.781-2.046,0.781-2.828,0L22.21,15.494c-0.85-0.851-1.979-1.318-3.181-1.318
		c-1.202,0-2.332,0.468-3.182,1.318c-0.851,0.851-1.319,1.979-1.319,3.182s0.469,2.331,1.318,3.182l12.374,12.375
		c0.781,0.781,0.781,2.047,0,2.828L15.14,50.143c-0.85,0.85-1.318,1.979-1.318,3.182c0,1.201,0.469,2.331,1.318,3.182
		c0.851,0.851,1.98,1.318,3.182,1.318c1.202,0,2.332-0.468,3.182-1.318l13.083-13.081C34.977,43.034,35.489,42.839,36,42.839z"/>
</g>
</svg>
          </button> 
        </>
      ) : (
        <p className={style['notFound']}>
          {translate('Совпадений не найдено !')}
        </p>
      )
    ) : null}
    
    </form>
  );
}