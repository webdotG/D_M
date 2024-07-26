// VisualPage.tsx
import React from 'react';
import Graph from '../../components/Graph/Graph'; 
import styles from './visualPage.module.scss'
import Footer from '../../components/footer/footer';

const VisualPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Визуализация данных</h1>
      <Graph />
      <Footer />
    </div>
  );
};

export default VisualPage;
