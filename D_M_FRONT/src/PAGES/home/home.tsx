
import DreamsList from '../../components/dreams_memories/dreams_memories_list';
import styles from './home.module.scss';

export default function HomePage() {

  // 
  return (
    <section className={styles['home-page']}>
      <DreamsList />
    </section>
  )
}
