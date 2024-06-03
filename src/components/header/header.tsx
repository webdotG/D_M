import styles from './header.module.scss';

export default function Header() {
  return (
    <header>

      <nav className={styles['header-nav']}>

      </nav>


      <section className={styles['searches']}>
        <form className={styles['search-header-form']}>
          <label htmlFor="search" className={styles['search-label']}>
            по буквам
            <input id="search" type="text" name="search"></input>
          </label>
          <label htmlFor="search-date" className={styles['search-label']}>
            по дате
            <input id="search-date" type="text" name="search-date"></input>
          </label>
          <label htmlFor="search-category" className={styles['search-label']}>
            по категории
            <input id="search-category" type="text" name="search-category"></input>
          </label>
          <button className={styles['search-submit']} type="submit">искать</button>
        </form>


      </section>


    </header>
  )
}
