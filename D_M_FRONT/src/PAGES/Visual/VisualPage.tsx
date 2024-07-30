import React, { useEffect, useState } from 'react';
import styles from './visualPage.module.scss';
import { loadDreams } from '../../API/dreams';
import { fetchAssociations } from '../../API/associationALL'; 
import { useCategoryStore } from '../../store';
import TimelineY from '../../components/Timeline/TimelineY'; 

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
  // console.log(records, associations)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получение записей
        const data: Record[] = await loadDreams(selectedCategory);
        setRecords(data);
        
        // Получение ассоциаций
        const uniqueAssociations: string[] = await fetchAssociations(selectedCategory);
        setAssociations(uniqueAssociations);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    fetchData();
  }, [selectedCategory]);

  return (
    <div className={styles['visualPage-wrapper']}>
      <h1 className={styles['title']}>Визуализация данных</h1>
      {records.length > 0 && associations.length > 0 ? (
        <TimelineY records={records} associations={associations} />
      ) : (
        <p>Загрузка данных...</p>
      )}


    </div>
  );
};

export default VisualPage;
