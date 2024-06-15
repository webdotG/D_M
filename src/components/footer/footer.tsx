import React from 'react';
import { Link } from 'react-router-dom';
import styles from './footer.module.scss';
import { TranslationMap } from '../../types';

export const BUTTONS = [
  {
    id: 1,
    name: 'home',
    url: '/',
  },
  {
    id: 2,
    name: 'calendar',
    url: '/',
  },
  {
    id: 4,
    name: 'chat',
    url: '/',
  },
  {
    id: 5,
    name: 'profile',
    url: '/',
  },
];

type FooterProps = {
  selectedLanguage: keyof TranslationMap;
  translate: (text: string) => string;
};

const Footer: React.FC<FooterProps> = ({ selectedLanguage, translate }) => {
  return (
    <footer className={styles.footer}>
      <button className={styles['footer-add']}>+</button>
      <ul className={styles['footer-list']}>
        {BUTTONS.map(item => (
          <li className={styles['footer-item']} key={item.id}>
            <Link to={item.url}>
              {translate(item.name)}
            </Link>
          </li>
        ))}
      </ul>
    </footer>
  );
};

export default Footer;
