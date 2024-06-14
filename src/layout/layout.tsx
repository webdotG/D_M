import { ReactNode, useState, useEffect } from 'react';
import style from './layout.module.scss';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import { useCategoryStore, useLanguageStore, useThemeStore } from '../store.ts';

type typeProps = {
  children: ReactNode;
};

const CATEGORY = ['сны', 'воспоминания'];
const LANGUAGES = ['Русский', 'English', 'Morder'];
const THEMES = ['Светлая', 'Тёмная', 'Мордер'];

export default function Layout({ children }: typeProps) {
  const { selectedCategory, setSelectedCategory } = useCategoryStore();
  const { language, setLanguage } = useLanguageStore();
  const { theme, setTheme } = useThemeStore();

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

  const handleLanguageSelect = (language: string) => {
    setLanguage(language);
    setLanguageModalVisible(false);
  };

  const handleThemeSelect = (theme: "Светлая" | "Тёмная" | "Мордер") => {
    setTheme(theme); 
    setThemeModalVisible(false);
  };
  

  useEffect(() => {
    console.log('layout useEffect selectedCategory, language , theme : ', selectedCategory, language, theme);
  }, [selectedCategory, language, theme]);

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
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button className={style['categoryToggle-btn']} onClick={toggleCategoryModal}>
            <svg viewBox="0 -6 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
              <text x="0" y="20" fill="#000000">{selectedCategory}</text>
            </svg>
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
                      {theme}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button className={style['colorThemeToggle-btn']} onClick={toggleThemeModal}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="20" fill="#000000">{theme}</text>
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
                    <button className={style.modalToggle_btn} onClick={() => handleLanguageSelect(lang)}>
                      {lang}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button className={style['languageToggle-btn']} onClick={toggleLanguageModal}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="20" fill="#000000">{language}</text>
            </svg>
          </button>
        </section>

      </div>

      <Header />
      {children}
      <Footer />
    </div>
  );
}
