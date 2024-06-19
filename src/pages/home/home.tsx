import Category from '../../components/category/category';
import DreamsList from '../../components/dreams_memories/dreams_memories_list';
import styles from './home.module.scss';
import { useCategoryStore } from '../../store'


export default function HomePage() {

  const { selectedCategory } = useCategoryStore();

  return (
    <section className={styles['home-page']}>
      <h2>{(selectedCategory)}</h2>
      <Category />
      <DreamsList />
    </section>
  )
}
