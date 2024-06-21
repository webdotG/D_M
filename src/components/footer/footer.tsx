import React from 'react';
import { Link } from 'react-router-dom';
import styles from './footer.module.scss';
import { TranslationMap } from '../../types';

import AddNew from '../../SVG/plus.svg'
import HomeIcon from '../../SVG/home.svg';
import CalendarIcon from '../../SVG/calendar.svg';
import ChatIcon from '../../SVG/messages.svg';
import ProfileIcon from '../../SVG/user.svg';

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
    url: '/',
    icon: CalendarIcon,
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
    url: '/',
    icon: ProfileIcon,
  },
];

type FooterProps = {
  selectedLanguage: keyof TranslationMap;
  translate: (text: string) => string;
};

const Footer: React.FC<FooterProps> = ({ translate }) => {
  return (
    <footer className={styles.footer}>
    <div className={styles['footer__wrapper']}>
      <button className={styles['footer-add']}>
      <img src={AddNew} alt='toggleIcon'/>
      </button>
      <ul className={styles['footer-list']}>
        {BUTTONS.map(item => (
          <li className={styles['footer-item']} key={item.id}>
            <Link to={item.url}>
              <img 
              src={item.icon} 
              alt={translate(item.name)} 
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
