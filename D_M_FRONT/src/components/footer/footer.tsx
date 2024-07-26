
import { Link } from 'react-router-dom';
import styles from './footer.module.scss';

import AddNew from '../../SVG/plus.svg'
import HomeIcon from '../../SVG/home.svg';
import ChatIcon from '../../SVG/messages.svg';
import ProfileIcon from '../../SVG/user.svg';
import VisualPage from '../../SVG/Visual.svg'

export const BUTTONS = [
  {
    id: 1,
    name: 'home',
    url: '/D_M/',
    icon: HomeIcon, 
  },
  {
    id: 2,
    name: 'calendar',
    url: '/D_M/visualPage',
    icon: VisualPage,
  },
  {
    id: 4,
    name: 'chat',
    url: '/',
    icon: ChatIcon,
  },
  {
    id: 5,
    name: 'profile',
    url: '/D_M/myPage/',
    icon: ProfileIcon,
  },
];


const Footer= () => {
  return (
    <footer className={styles.footer}>
    <div className={styles['footer__wrapper']}>

    <Link to="/D_M/add" className={styles['footer-add']}>
          <img src={AddNew} alt="toggleIcon" />
    </Link>

      <ul className={styles['footer-list']}>
        {BUTTONS.map(item => (
          <li className={styles['footer-item']} key={item.id}>
            <Link to={item.url}>
              <img 
              src={item.icon} 
              className={styles['footer-icon']}
               />
            </Link>
          </li>
        ))}
      </ul>
      </div>
    </footer>
  );
};

export default Footer;
