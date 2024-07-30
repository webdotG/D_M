import React, { useEffect, useState } from 'react';
import styles from './visualPage.module.scss';
import { loadDreams } from '../../API/dreams';
import { fetchAssociationsById } from '../../API/associationByID'; 
import { useCategoryStore } from '../../store';
import TimelineY from '../../components/Timeline/TimelineY'; 

interface Record {
  id: number;
  title: string;
  date: string; // Дата в формате "dd.mm.yyyy"
  associations?: string; // Ассоциации как строка
}

const VisualPage: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [associationsByMonth, setAssociationsByMonth] = useState<{ [month: string]: string[] }>({});
  const [recordsByMonth, setRecordsByMonth] = useState<{ [month: string]: Record[] }>({});
  const { selectedCategory } = useCategoryStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data for category:', selectedCategory);
        
        // Получение записей
        const data: Record[] = await loadDreams(selectedCategory);
        console.log('Loaded records:', data);
        setRecords(data);

        // Подготовка ассоциаций по месяцам
        const associationsByMonth: { [month: string]: string[] } = {};
        const recordsByMonth: { [month: string]: Record[] } = {};

        for (const record of data) {
          console.log('Processing record:', record);
          const [day, month, year] = record.date.split('.').map(Number);
          const monthKey = `${month}-${year}`;
          
          console.log('Month key:', monthKey);

          // Получение ассоциаций для каждой записи
          const recordAssociations = await fetchAssociationsById(selectedCategory, record.id);
          record.associations = recordAssociations;

          // Проверка и добавление ассоциаций
          if (recordAssociations && recordAssociations.length > 0) {
            if (!associationsByMonth[monthKey]) {
              associationsByMonth[monthKey] = [];
            }
            associationsByMonth[monthKey].push(recordAssociations); // Сохраняем как строку
            console.log(`Updated associations for ${monthKey}:`, associationsByMonth[monthKey]);
          } else {
            console.log('No associations for record:', record);
          }

          // Добавление записей по месяцам
          if (!recordsByMonth[monthKey]) {
            recordsByMonth[monthKey] = [];
          }
          recordsByMonth[monthKey].push(record);
          console.log(`Updated records for ${monthKey}:`, recordsByMonth[monthKey]);
        }

        setAssociationsByMonth(associationsByMonth);
        setRecordsByMonth(recordsByMonth);

        console.log('Final associationsByMonth:', associationsByMonth);
        console.log('Final recordsByMonth:', recordsByMonth);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    fetchData();
  }, [selectedCategory]);

  return (
    <div className={styles['visualPage-wrapper']}>
      <h1 className={styles['title']}>Визуализация данных</h1>
      {Object.keys(associationsByMonth).length > 0 && Object.keys(recordsByMonth).length > 0 ? (
        <TimelineY
          associationsByMonth={associationsByMonth}
          recordsByMonth={recordsByMonth}
        />
      ) : (
        <p>Загрузка данных...</p>
      )}
    </div>
  );
};

export default VisualPage;
