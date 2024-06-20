import React from 'react';
import { Link } from 'react-router-dom';
import styles from './footer.module.scss';
import { TranslationMap } from '../../types';

import HomeIcon from '../../SVG/homeIcon.svg';
import CalendarIcon from '../../SVG/calendarIcon.svg';
import ChatIcon from '../../SVG/chatIcon.svg';
import ProfileIcon from '../../SVG/my.svg';

export const BUTTONS = [
  {
    id: 1,
    name: 'home',
    url: '/',
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
        <svg width="52px" height="52px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <g id="layer1">
            <path d="M 7 1 L 7 7 L 1 7 L 1 13 L 7 13 L 7 19 L 13 19 L 13 13 L 19 13 L 19 7 L 13 7 L 13 1 L 7 1 z M 8 2 L 12 2 L 12 8 L 18 8 L 18 12 L 12 12 L 12 18 L 8 18 L 8 12 L 2 12 L 2 8 L 8 8 L 8 2 z " fill="#222222" />
          </g>
        </svg>
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
