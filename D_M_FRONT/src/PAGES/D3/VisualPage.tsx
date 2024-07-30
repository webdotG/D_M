import React, { useEffect, useState } from 'react';
import styles from './visualPage.module.scss';
import Footer from '../../components/footer/footer';
import TimelineChart from '../../components/Timeline/TimelineY';
import { loadDreams } from '../../API/dreams';
import { fetchAssociations } from '../../API/associationALL'; 
import { useCategoryStore } from '../../store';

interface Record {
  id: number;
  title: string;
  date: string; // Дата в формате "dd.mm.yyyy"
  associations: string;
}

const VisualPage: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [associations, setAssociations] = useState<string[]>([]);
  const { selectedCategory } = useCategoryStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получение записей
        const data: Record[] = await loadDreams(selectedCategory);
        setRecords(data);
        console.log(data)
        // Получение ассоциаций
        const uniqueAssociations: string[] = await fetchAssociations(selectedCategory);
        console.log(uniqueAssociations)
        setAssociations(uniqueAssociations);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    fetchData();
  }, [selectedCategory]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Визуализация данных</h1>
      <TimelineChart records={records} associations={associations} />
      {/* <Footer /> */}
    </div>
  );
};

export default VisualPage;
