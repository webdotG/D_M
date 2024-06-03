import styles from './header.module.scss';

export default function Header() {
  return (
    <header>

      <nav className={styles['header-nav']}>

      </nav>


      <section className={styles['searches']}>
        <form className={styles['search-header-form']}>
          <label htmlFor="search" className={styles['search-label']}>
            <input id="search" type="text" name="search"></input>
          </label>
          <button type="submit"></button>
        </form>


      </section>


    </header>
  )
}
