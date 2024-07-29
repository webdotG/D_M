import { ReactNode, useState } from 'react';
import style from './layout.module.scss';
import Footer from '../components/footer/footer';
import { useCategoryStore, useLanguageStore } from '../store';
import translations from '../translations.json';
import { TranslationMap } from '../types';
import ToggleTheme from '../SVG/toggle.svg';
import ToggleLang from '../SVG/lang.svg';
import D_M from '../SVG/d_m.svg';
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
            <img src={D_M} alt='D_M' />
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
            <img src={ToggleTheme} alt='toggleIcon' />
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
          </button>
        </section>
      </div>

      {children}

      <Footer />
    </div>
  );
}
