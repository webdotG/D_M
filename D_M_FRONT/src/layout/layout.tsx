import { ReactNode, useState } from 'react';
import style from './layout.module.scss';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import { useCategoryStore, useLanguageStore, useThemeStore } from '../store.ts';
import translations from '../translations.json';
import { TranslationMap } from '../types';
import ToggleTheme from '../SVG/toggle.svg'
import ToggleLang from '../SVG/lang.svg'
import D_M from '../SVG/d_m.svg'

type TypeProps = {
  children: ReactNode;
};

const CATEGORY = ['сны', 'воспоминания'];
const LANGUAGES = ['RU', 'EN', 'BS'];
const THEMES = ["Светлая", "Тёмная", "Мордор"];

export default function Layout({ children }: TypeProps) {
  const { selectedCategory, setSelectedCategory } = useCategoryStore();
  console.log('', selectedCategory)
  const { language, setLanguage } = useLanguageStore();
  const { theme, setTheme } = useThemeStore();
  console.log('', theme)
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


  const handleThemeSelect = (theme: string) => {
    setTheme(theme);
    setThemeModalVisible(false);
  };

  const translateToLanguage = (text: string): string => {
    const languageTranslations = translations[language as keyof typeof translations] || translations.RU;
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
          <img src={D_M} alt='D_M' />

          </button>
        </section>

        {/* Цветовая тема */}
        <section className={style['layout__color-theme']}>
          {themeModalVisible && (
            <div className={style.modal_overlay} onClick={toggleThemeModal}>
              <ul className={style.layout__modal}>
                {THEMES.map((theme, index) => (
                  <li key={index} className={style.layout__modal__item}>
                    <button className={style.modalToggle_btn} onClick={() => handleThemeSelect(theme)}>
                      {translateToLanguage(theme)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button className={style['colorThemeToggle-btn']} onClick={toggleThemeModal}>
          <img src={ToggleTheme} alt='toggleIcon' />
            {/* {translateToLanguage(theme)} */}
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
          <img src={ToggleLang} alt='toggleIcon' />
            {/* {translateToLanguage(language)} */}
          </button>
        </section>

      </div>

      <Header selectedLanguage={language}  />
      {children}
      <Footer selectedLanguage={language} translate={translateToLanguage} />
    </div>
  );
}
