import React, { useState } from 'react';
import style from './Search.module.scss'; // импорт стилей компонента
import searchIcon from '../../SVG/search.svg'; // импорт иконки поиска
import deleteIcon from '../../SVG/delete.svg'; // импорт иконки удаления
import { searchByValue, searchByDate, searchByValueAndDate } from '../../API/search'; // импорт функций поиска из API
import { useCategoryStore } from '../../store'; // импорт хука для работы с категориями
import { useTranslate } from '../../hooks/useTranslate'; // импорт хука для перевода текста

export default function SearchForm() {
  const { selectedCategory } = useCategoryStore(); // получение выбранной категории из хранилища
  const { translateToLanguage: translate } = useTranslate(); // получение функции перевода из хука

  const [searchValue, setSearchValue] = useState(''); // состояние для значения поиска
  const [searchDate, setSearchDate] = useState(''); // состояние для даты поиска
  const [inputFocused, setInputFocused] = useState(false); // состояние для фокуса на поле ввода
  const [showSearchResults, setShowSearchResults] = useState(false); // состояние для отображения результатов поиска
  const [searchResults, setSearchResults] = useState([]); // состояние для хранения результатов поиска

  // Обработчик изменения в поле ввода
  const handleInputChange = (setValue: React.Dispatch<React.SetStateAction<string>>) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = event.target.value;
    // Проверяем, что ввод содержит только буквы (латиница и кириллица)
    if (/^[a-zA-Zа-яА-ЯёЁ]*$/.test(inputValue) || inputValue === '') {
      setValue(inputValue); // устанавливаем новое значение в состояние
    }
  };

  // Обработчик очистки поля ввода
  const handleClearInput = (setValue: React.Dispatch<React.SetStateAction<string>>) => () => {
    setValue(''); // очищаем значение в состоянии
  };

  // Обработчик изменения даты поиска
  const handleSearchDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = event.target.value.replace(/[^\d.]/g, '');
    setSearchDate(cleanedValue); // устанавливаем новую дату в состояние
  };

  // Обработчик отправки формы поиска
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // предотвращаем стандартное поведение отправки формы
    try {
      // Поиск по значению, если заданы значение поиска и выбранная категория
      if (searchValue && selectedCategory) {
        const valueData = await searchByValue(searchValue, selectedCategory);
        setSearchResults(valueData); // устанавливаем результаты поиска в состояние
        setShowSearchResults(true); // отображаем блок с результатами поиска
        console.log('Search Results by Value:', valueData);
      }

      // Поиск по дате, если задана дата поиска и выбранная категория
      if (searchDate && selectedCategory) {
        const dateData = await searchByDate(searchDate, selectedCategory);
        setSearchResults(dateData); // устанавливаем результаты поиска в состояние
        setShowSearchResults(true); // отображаем блок с результатами поиска
        console.log('Search Results by Date:', dateData);
      }

      // Поиск по значению и дате, если заданы оба параметра и выбранная категория
      if (searchValue && searchDate && selectedCategory) {
        const valueDateData = await searchByValueAndDate(searchValue, searchDate, selectedCategory);
        setSearchResults(valueDateData); // устанавливаем результаты поиска в состояние
        setShowSearchResults(true); // отображаем блок с результатами поиска
        console.log('Search Results by Value and Date:', valueDateData);
      }
      
    } catch (error) {
      console.error('Error during search:', error); // обработка ошибок поиска
    }
  };

  return (
    <form className={style['search-header-form']} onSubmit={handleSubmit}>
      {/* Поле поиска по значению */}
      <label htmlFor="search" className={style['search-label']}>
        {translate('буквы')}
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
      {/* Подсказка для ввода только букв */}
      {searchValue && !/^[a-zA-Zа-яА-ЯёЁ]*$/.test(searchValue) && (
        <div className={style.inputHint}>{translate('только буквы')}</div>
      )}

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
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          pattern="[0-9]*\.?[0-9]*"
        />
        {/* Подсказка для ввода цифр и точек */}
        {inputFocused && (
          <span className={style.inputHint}>{translate('цифры и точка')}</span>
        )}
        {/* Иконка очистки поля ввода даты */}
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

      {/* Кнопка отправки формы поиска */}
      <button className={style['search-submit']} type="submit">
        {translate('искать')}
      </button>

      {/* Отображение результатов поиска или сообщения об отсутствии результатов */}
      {showSearchResults && (
        <>
          {searchResults && searchResults.length > 0 ? (
            <div className={style.searchResults}>
              {searchResults.map((result, index) => (
                <div key={index} className={style.searchResult}>
                  {/* Отображаем данные результатов поиска */}
                  <p>{result.title}</p>
                  <p>{result.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>{translate('ничего не найдено')}</p>
          )}
        </>
      )}
    </form>
  );
}
