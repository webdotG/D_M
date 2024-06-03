import Category from '../../components/category/category';
import styles from './home.module.scss';


export default function HomePage() {
  return (
    <section className={styles['home-page']}>HomePage
    <Category />    
    </section>
  )
}
