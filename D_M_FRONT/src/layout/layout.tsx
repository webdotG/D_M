import { ReactNode, useState } from 'react';
import style from './layout.module.scss';
import Footer from '../components/footer/footer';
import { useCategoryStore, useLanguageStore } from '../store';
import translations from '../translations.json';
import { TranslationMap } from '../types';
import { useTheme, THEME_LIGHT, THEME_DARK, THEME_MORDOR } from './themeProvider';

type TypeProps = {
  children: ReactNode;
};

const CATEGORY = ['сны', 'воспоминания'];
const LANGUAGES = ['РУ', 'EN', 'BS'];

const THEME_MAP: Record<string, string> = {
  Светлая: THEME_LIGHT,
  Тёмная: THEME_DARK,
  Мордор: THEME_MORDOR,
};

const THEMES = Object.keys(THEME_MAP);

export default function Layout({ children }: TypeProps) {
  const { setSelectedCategory } = useCategoryStore();
  const { language, setLanguage } = useLanguageStore();
  const { change: setTheme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [themeModalVisible, setThemeModalVisible] = useState(false);

  const toggleCategoryModal = () => {
    setModalVisible(!modalVisible);
  };

  const toggleLanguageModal = () => {
    setLanguageModalVisible(!languageModalVisible);
  };

  const toggleThemeModal = () => {
    setThemeModalVisible(!themeModalVisible);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setModalVisible(false);
  };

  const handleLanguageSelect = (lang: string | number) => {
    if (typeof lang === 'string') {
      setLanguage(lang);
      setLanguageModalVisible(false);
    } else {
      console.error('Expected a string for language, but received:', lang);
    }
  };

  const handleThemeSelect = (themeName: string) => {
    const themeValue = THEME_MAP[themeName];
    setTheme(themeValue);
    setThemeModalVisible(false);
  };

  const translateToLanguage = (text: string): string => {
    const languageTranslations = translations[language as keyof typeof translations] || translations.Р;
    return languageTranslations[text as keyof typeof languageTranslations] || text;
  };

  return (
    <div className={style['layout']}>
      <div className={style['layout__content']}>

        {/* Категория */}
        <section className={style['layout__categories']}>
          {modalVisible && (
            <div className={style.modal_overlay} onClick={toggleCategoryModal}>
              <ul className={style.layout__modal}>
                {CATEGORY.map((category, index) => (
                  <li key={index} className={style.layout__modal__item}>
                    <button
                      className={style.modalToggle_btn}
                      onClick={() => handleCategorySelect(category)}
                    >
                      {translateToLanguage(category)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button className={style['categoryToggle-btn']} onClick={toggleCategoryModal}>
            <svg   xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
	viewBox="0 0 72 72" enableBackground="new 0 0 72 72" xmlSpace="preserve">
<g>
	<path d="M48.055,14.837c0.322,0,0.637-0.155,0.832-0.443c0.852-1.27,2.273-2.029,3.801-2.029c0.551,0,1-0.447,1-1
		c0-0.553-0.449-1-1-1c-2.195,0-4.237,1.09-5.463,2.914c-0.308,0.459-0.185,1.08,0.273,1.388
		C47.669,14.782,47.863,14.837,48.055,14.837z"/>
	<path d="M12.548,32.147c-0.544-0.102-1.066,0.252-1.17,0.794c-0.071,0.369-0.07,0.53-0.062,0.76l0.005,0.237c0,0.553,0.447,1,1,1
		c0.552,0,1-0.447,1.001-1c0-0.132-0.003-0.227-0.006-0.305c-0.005-0.14-0.005-0.148,0.026-0.315
		C13.446,32.775,13.091,32.251,12.548,32.147z"/>
	<path d="M18.686,26.571c-2.46,0-4.748,1.222-6.12,3.268c-0.308,0.458-0.185,1.08,0.273,1.388c0.172,0.114,0.366,0.169,0.557,0.169
		c0.323,0,0.639-0.155,0.831-0.444c1-1.49,2.667-2.381,4.459-2.381c0.552,0,1-0.447,1-1C19.686,27.018,19.238,26.571,18.686,26.571z
		"/>
	<path d="M51.688,36.271c-5.841,0-10.935,3.217-13.629,7.967l-7.105-3.484c1.127-2.021,1.776-4.343,1.776-6.816
		c0-1.568-0.27-3.072-0.746-4.481l10.917-4.696c2.3,2.872,5.829,4.718,9.786,4.718c6.916,0,12.541-5.625,12.543-12.541
		c0-6.916-5.627-12.542-12.543-12.542s-12.541,5.626-12.541,12.542c0,1.519,0.285,2.97,0.782,4.318l-10.757,4.626
		c-2.543-3.614-6.739-5.987-11.485-5.987c-7.742,0-14.041,6.299-14.041,14.042c0,7.742,6.299,14.041,14.041,14.041
		c3.802,0,7.251-1.524,9.782-3.987l8.084,3.964c-0.336,1.274-0.533,2.604-0.533,3.982c0,8.64,7.027,15.666,15.667,15.666
		c8.638,0,15.668-7.026,15.668-15.666C67.355,43.299,60.326,36.271,51.688,36.271z M52.688,8.396c4.709,0,8.543,3.832,8.543,8.542
		s-3.834,8.541-8.543,8.541c-4.711,0-8.541-3.831-8.541-8.541S47.977,8.396,52.688,8.396z M18.687,43.979
		c-5.537,0-10.041-4.504-10.041-10.041c0-5.537,4.504-10.042,10.041-10.042s10.042,4.505,10.043,10.042
		C28.73,39.475,24.224,43.979,18.687,43.979z M51.688,63.604c-6.434,0-11.666-5.231-11.666-11.666
		c0-6.434,5.232-11.666,11.666-11.666c6.433,0,11.668,5.232,11.668,11.666C63.355,58.372,58.121,63.604,51.688,63.604z"/>
	<path d="M50.688,42.713c-2.75,0-5.304,1.365-6.834,3.648c-0.308,0.459-0.185,1.08,0.274,1.389c0.171,0.113,0.365,0.168,0.556,0.168
		c0.322,0,0.639-0.154,0.832-0.443c1.157-1.729,3.092-2.762,5.172-2.762c0.551,0,1-0.447,1-1S51.238,42.713,50.688,42.713z"/>
</g>
</svg>
          </button>
        </section>

        {/* Цветовая тема */}
        <section className={style['layout__color-theme']}>
          {themeModalVisible && (
            <div className={style.modal_overlay} onClick={toggleThemeModal}>
              <ul className={style.layout__modal}>
                {THEMES.map((themeName, index) => (
                  <li key={index} className={style.layout__modal__item}>
                    <button className={style.modalToggle_btn} onClick={() => handleThemeSelect(themeName)}>
                      {translateToLanguage(themeName)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button className={style['colorThemeToggle-btn']} onClick={toggleThemeModal}>
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
	viewBox="0 0 72 72" enableBackground="new 0 0 72 72" xmlSpace="preserve">
<g>
	<path d="M53.262,3.5H18.738C10.599,3.5,4,10.099,4,18.24v0.521C4,26.901,10.599,33.5,18.738,33.5h34.524
		C61.4,33.5,68,26.901,68,18.761v-0.522C68,10.099,61.4,3.5,53.262,3.5z M64,18.761c0,5.93-4.809,10.739-10.738,10.739H18.738
		C12.808,29.5,8,24.691,8,18.76v-0.521C8,12.309,12.808,7.5,18.738,7.5h34.524C59.191,7.5,64,12.309,64,18.239V18.761z"/>
	<path d="M50.891,10.5H46.63c-0.553,0-1,0.447-1,1s0.447,1,1,1h4.261c4.412,0,8.109,3.215,8.109,7.48v0.52c0,0.553,0.447,1,1,1
		s1-0.447,1-1v-0.52C61,14.664,56.352,10.5,50.891,10.5z"/>
	<path d="M42.63,10.5h-2c-0.553,0-1,0.447-1,1s0.447,1,1,1h2c0.554,0,1-0.447,1-1S43.184,10.5,42.63,10.5z"/>
	<path d="M19.656,9.464c-4.796,0-8.697,3.901-8.697,8.697c0,4.796,3.901,8.697,8.697,8.697c4.796,0,8.697-3.901,8.697-8.697
		C28.353,13.365,24.452,9.464,19.656,9.464z M19.656,22.858c-2.59,0-4.697-2.107-4.697-4.697c0-2.59,2.107-4.697,4.697-4.697
		c2.59,0,4.697,2.107,4.697,4.697C24.353,20.751,22.246,22.858,19.656,22.858z"/>
	<path d="M53.262,38.5H18.738C10.599,38.5,4,45.098,4,53.238v0.521C4,61.9,10.599,68.5,18.738,68.5h34.524
		C61.4,68.5,68,61.9,68,53.76v-0.521C68,45.098,61.4,38.5,53.262,38.5z M64,53.76c0,5.932-4.809,10.74-10.738,10.74H18.738
		C12.808,64.5,8,59.691,8,53.76v-0.521c0-5.93,4.808-10.738,10.738-10.737h34.524c5.93,0,10.738,4.808,10.738,10.737V53.76z"/>
	<path d="M11.937,53.033c-0.56-0.063-0.967,0.338-1.026,0.889C10.874,54.27,11,54.624,11,54.98v0.181c0,0.553,0.447,1,1,1
		s1-0.448,1-1V54.98c0-0.287-0.094-0.569-0.065-0.848C12.994,53.582,12.486,53.09,11.937,53.033z"/>
	<path d="M20.528,45.161c-3.499,0-6.761,1.887-8.511,4.92c-0.277,0.478-0.112,1.092,0.366,1.366
		c0.158,0.091,0.329,0.134,0.499,0.134c0.346,0,0.681-0.181,0.868-0.5c1.394-2.418,3.991-3.92,6.778-3.92c0.553,0,1-0.447,1-1
		C21.528,45.607,21.081,45.161,20.528,45.161z"/>
	<path d="M51.762,44.464c-4.796,0-8.697,3.902-8.697,8.697c0,4.797,3.901,8.696,8.697,8.696c4.797,0,8.697-3.899,8.697-8.696
		C60.459,48.366,56.559,44.464,51.762,44.464z M51.762,57.857c-2.59,0-4.697-2.107-4.697-4.697s2.107-4.697,4.697-4.697
		s4.697,2.107,4.697,4.697S54.352,57.857,51.762,57.857z"/>
</g>
</svg>
          </button>
        </section>

        {/* Язык */}
        <section className={style['layout__language']}>
          {languageModalVisible && (
            <div className={style.modal_overlay} onClick={toggleLanguageModal}>
              <ul className={style.layout__modal}>
                {LANGUAGES.map((lang, index) => (
                  <li key={index} className={style.layout__modal__item}>
                    <button className={style.modalToggle_btn} onClick={() => handleLanguageSelect(lang as keyof TranslationMap)}>
                      {translateToLanguage(lang)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button className={style['languageToggle-btn']} onClick={toggleLanguageModal}>
<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
	viewBox="0 0 72 72" enableBackground="new 0 0 72 72" xmlSpace="preserve">
<g>
	<path d="M35.12,37.725c0.098-0.543-0.262-1.063-0.806-1.162c-3.486-0.632-5.784-2.267-7.025-4.996
		c-0.228-0.503-0.822-0.727-1.324-0.496c-0.503,0.228-0.725,0.821-0.496,1.324c1.51,3.324,4.367,5.388,8.489,6.136
		c0.061,0.011,0.12,0.016,0.18,0.016C34.611,38.547,35.033,38.208,35.12,37.725z"/>
	<path d="M57,24.922V5.293C57,4.188,56.225,3.5,55.119,3.5h-38C16.015,3.5,15,4.188,15,5.293v19.629c0,10.448,8.19,19.886,18,21.369
		V64.5H21.119c-1.104,0-2,0.896-2,2s0.896,2,2,2h29c1.105,0,2-0.896,2-2s-0.896-2-2-2H37V46.488C47.76,46.249,57,36.171,57,24.922z
		 M53,7.5v13.2c-0.003,0.003-0.006,0.006-0.009,0.009c-2.123,2.297-5.675,6.147-15.386,0.732c-4.063-2.267-7.997-2.861-11.693-1.765
		c-3,0.888-5.302,2.731-6.912,4.443V7.5H53z M19.16,27.042c1.342-1.778,3.825-4.417,7.335-5.452
		c3.159-0.927,6.569-0.392,10.137,1.598c9.063,5.055,13.76,2.681,16.368,0.35v1.384C53,34.014,45.25,42.5,36.609,42.5h-0.74
		c-0.264-0.129-0.557-0.207-0.87-0.207c-0.238,0-0.464,0.049-0.676,0.125C26.869,41.666,20.213,34.822,19.16,27.042z"/>
</g>
</svg>
          </button>
        </section>
      </div>

      {children}

      <Footer />
    </div>
  );
}
