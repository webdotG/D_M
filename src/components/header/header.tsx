import translations from '../../translations.json';
import { TranslationMap } from '../../types'; 
import './header.module.scss';

type Props = {
  selectedLanguage: keyof TranslationMap;
};

export default function Header({ selectedLanguage }: Props) {
  const translateToLanguage = (text: string): string => {
    const languageTranslations = translations[selectedLanguage] || translations.RU;
    return languageTranslations[text] || text;
  };

  return (
    <header>
      <nav className="header-nav">
        <section className="searches">
          <form className="search-header-form">
            <label htmlFor="search" className="search-label">
              {translateToLanguage('буквы')}
              <input id="search" type="text" name="search" />
            </label>
            <label htmlFor="search-date" className="search-label">
              {translateToLanguage('дата')}
              <input id="search-date" type="text" name="search-date" />
            </label>
            <label htmlFor="search-category" className="search-label">
              {translateToLanguage('категории')}
              <input id="search-category" type="text" name="search-category" />
            </label>
            <button className="search-submit" type="submit">
              {translateToLanguage('искать')}
            </button>
          </form>
        </section>
      </nav>
    </header>
  );
}
