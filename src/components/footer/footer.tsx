import styles from './footer.module.scss';
import { Link } from 'react-router-dom';

export const BUTTONS = [
  {
    id: 1,
    name: 'home',
    url: '/',
    icon: 'fa fa-home'
  },
  {
    id: 2,
    name: 'calendar',
    url: '/',
    icon: 'fa fa-calendar'
  },
  {
    id: 4,
    name: 'chat',
    url: '/',
    icon: 'fa fa-comment'
  },
  {
    id: 5,
    name: 'profile',
    url: '/',
    icon: 'fa fa-user'
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
  
    <button className={styles['footer-add']}>+</button>
    
    <ul className={styles['footer-list']}>
      {BUTTONS.map(item => (
        <li className={styles['footer-item']} key={item.id}>
        <Link to={item.url}>
          <i className={item.icon}></i>
          {item.name}
        </Link>
        </li>
      ))}
      </ul>
    </footer>
  );
}
