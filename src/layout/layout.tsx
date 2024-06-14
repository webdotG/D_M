import { ReactNode, useState } from 'react';
import style from './layout.module.scss';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import { useCategoryStore, useLanguageStore, useThemeStore } from '../store.ts';

type TypeProps = {
  children: ReactNode;
};

const CATEGORY = ['сны', 'воспоминания'];
const LANGUAGES = ['RU', 'EN', 'BS'];
const THEMES = ["Светлая", "Тёмная", "Мордер"];

export default function Layout({ children }: TypeProps) {
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

  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang);
    setLanguageModalVisible(false);
  };

  const handleThemeSelect = (theme: string) => {
    setTheme(theme);
    setThemeModalVisible(false);
  };

  // Переводы для разных языков
  const translations = {
    "RU": {
    "по буквам": "RU",
    "по дате": "дата",
    "по категории": "категории",
    "искать": "искать",
    "сны": "сны",
    "воспоминания": "воспоминаия"
  },
  "EN": {
    "по буквам": "EN",
    "по дате": "date",
    "по категории": "category",
    "искать": "search",
    "сны": "dreams",
    "воспоминания": "memorys"
  },
  "BS": {
    "по буквам": "BS",
    "по дате": "thrakât",
    "по категории": "ghâsh",
    "сны": "ûr",
    "воспоминания": "krith"
  }
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
                      {translations[lang]['по буквам']}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button className={style['languageToggle-btn']} onClick={toggleLanguageModal}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="20" fill="#000000">{translations[language]['по буквам']}</text>
            </svg>
          </button>
        </section>

      </div>

      <Header selectedLanguage={language} /> 
      {children }
      <Footer />
    </div>
  );
}
