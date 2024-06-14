import translations from '../../translations.json';
import './header.module.scss'; // Общие стили

type TranslationMap = {
  ru: {
    [key: string]: string;
  };
  english: {
    [key: string]: string;
  };
  blackSpeech: {
    [key: string]: string;
  };
};

type Props = {
  selectedLanguage: string; 
};

export default function Header({ selectedLanguage }: Props) {
  const translateToLanguage = (text: keyof TranslationMap['ru']): string => {
    const languageTranslations = translations[selectedLanguage as keyof typeof translations] || translations['ru'];
    return languageTranslations[text] || text;
  };

  return (
    <header>
      <nav className="header-nav">
        <section className="searches">
          <form className="search-header-form">
            <label htmlFor="search" className="search-label">
              {translateToLanguage('по буквам')}
              <input id="search" type="text" name="search" />
            </label>
            <label htmlFor="search-date" className="search-label">
              {translateToLanguage('по дате')}
              <input id="search-date" type="text" name="search-date" />
            </label>
            <label htmlFor="search-category" className="search-label">
              {translateToLanguage('по категории')}
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
