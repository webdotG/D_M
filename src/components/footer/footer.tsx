import React from 'react';
import { Link } from 'react-router-dom';
import styles from './footer.module.scss';
import { TranslationMap } from '../../types';

import HomeIcon from '../../SVG/color-mode-svgrepo-com.svg';
import CalendarIcon from '../../SVG/color-mode-svgrepo-com.svg';
import ChatIcon from '../../SVG/color-mode-svgrepo-com.svg';
import ProfileIcon from '../../SVG/color-mode-svgrepo-com.svg';

export const BUTTONS = [
  {
    id: 1,
    name: 'home',
    url: '/',
    icon: HomeIcon
  },
  {
    id: 2,
    name: 'calendar',
    url: '/',
    icon: CalendarIcon
  },
  {
    id: 4,
    name: 'chat',
    url: '/',
    icon: ChatIcon
  },
  {
    id: 5,
    name: 'profile',
    url: '/',
    icon: ProfileIcon
  },
];

type FooterProps = {
  selectedLanguage: keyof TranslationMap;
  translate: (text: string) => string;
};

const Footer: React.FC<FooterProps> = ({ translate }) => {
  return (
 <footer className={styles.footer}>
      <button className={styles['footer-add']}>
        <img src={HomeIcon} />
      </button>
      <ul className={styles['footer-list']}>
        {BUTTONS.map(item => (
          <li className={styles['footer-item']} key={item.id}>
            <Link to={item.url}>
              <img src={item.icon} alt={translate(item.name)} className={styles['footer-icon']} />
              {/* <span className={styles['footer-text']}>{translate(item.name)}</span> */}
            </Link>
          </li>
        ))}
      </ul>
    </footer>
  );
};

export default Footer;
