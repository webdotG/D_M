import Category from '../../components/category/category';
import DreamsList from '../../components/dreams/dreams-list';
import styles from './home.module.scss';
import { useTranslate } from '../../hooks/useTranslate';


export default function HomePage() {

  const { translateToLanguage } = useTranslate();  


  return (
    <section className={styles['home-page']}>
      <h2>{translateToLanguage('Список')}</h2>
    <Category />    
    <DreamsList />
    </section>
  )
}
