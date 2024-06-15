import Category from '../../components/category/category';
import DreamsList from '../../components/dreams/dreams-list';
import styles from './home.module.scss';
import { useLanguageStore } from '../../store';
import translations from '../../translations.json';


export default function HomePage() {
  const { language } = useLanguageStore();

  
  const translateToLanguage = (text: string) => {
    const languageTranslations = translations[language] || translations.RU;
    return languageTranslations[text] || text;
  };

  return (
    <section className={styles['home-page']}>
      <h2>{translateToLanguage('Список')}</h2>
    <Category />    
    <DreamsList />
    </section>
  )
}
