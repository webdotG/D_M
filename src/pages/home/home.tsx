import Category from '../../components/category/category';
import DreamsList from '../../components/dreams/dreams-list';
import styles from './home.module.scss';
import { useLanguageStore } from '../../store';
import translations from '../../translations.json';


export default function HomePage() {
  const { language } = useLanguageStore();

  
  const translateToLanguage = (text: string): string => {
    if (!(language in translations)) {
      throw new Error(`Язык '${language}' не поддерживается.`);
    }
  
    const languageTranslations = translations[language as keyof typeof translations];
  
    if (!(text in languageTranslations)) {
      throw new Error(`Перевод для текста '${text}' не найден в языке '${language}'.`);
    }
  
    return languageTranslations[text as keyof typeof languageTranslations];
  };

  return (
    <section className={styles['home-page']}>
      <h2>{translateToLanguage('Список')}</h2>
    <Category />    
    <DreamsList />
    </section>
  )
}
