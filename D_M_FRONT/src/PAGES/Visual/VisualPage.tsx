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
  day?: number; // Добавлен день
  month?: number; // Добавлен месяц
  year?: number; // Добавлен год
  associations?: string; // Ассоциации как строка
}

const VisualPage: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [associationsByMonth, setAssociationsByMonth] = useState<{ [month: string]: string[] }>({});
  const [recordsByMonth, setRecordsByMonth] = useState<{ [month: string]: Record[] }>({});
  const [daysByMonth, setDaysByMonth] = useState<{ [month: string]: number[] }>({});
  const { selectedCategory } = useCategoryStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получение записей
        const data: Record[] = await loadDreams(selectedCategory);
        setRecords(data);

        // Подготовка ассоциаций по месяцам
        const associationsByMonth: { [month: string]: string[] } = {};
        const recordsByMonth: { [month: string]: Record[] } = {};
        const daysByMonth: { [month: string]: number[] } = {};

        for (const record of data) {
          const [day, month, year] = record.date.split('.').map(Number);
          const monthKey = `${month}-${year}`;

          // Добавление дня, месяца и года в запись
          record.day = day;
          record.month = month;
          record.year = year;

          // Получение ассоциаций для каждой записи
          const recordAssociations = await fetchAssociationsById(selectedCategory, record.id);
          record.associations = recordAssociations;

          // Проверка и добавление ассоциаций
          if (recordAssociations && recordAssociations.length > 0) {
            if (!associationsByMonth[monthKey]) {
              associationsByMonth[monthKey] = [];
            }
            associationsByMonth[monthKey].push(record.associations);
          }

          // Добавление записей по месяцам
          if (!recordsByMonth[monthKey]) {
            recordsByMonth[monthKey] = [];
          }
          recordsByMonth[monthKey].push(record);

          // Добавление дня в массив дней по месяцу
          if (!daysByMonth[monthKey]) {
            daysByMonth[monthKey] = [];
          }
          if (!daysByMonth[monthKey].includes(day)) {
            daysByMonth[monthKey].push(day);
          }
        }

        setAssociationsByMonth(associationsByMonth);
        setRecordsByMonth(recordsByMonth);
        setDaysByMonth(daysByMonth);

      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    fetchData();
  }, [selectedCategory]);

  return (
    <div className={styles['visualPage-wrapper']}>
      <h1 className={styles['title']}>Визуализация данных</h1>
      <div className={styles['timeline-wrapper']}>
        <div className={styles['timeline']}>
          <TimelineY 
            recordsByMonth={recordsByMonth}
            associationsByMonth={associationsByMonth}
            daysByMonth={daysByMonth} 
          />
        </div>
      </div>
    </div>
  );
};

export default VisualPage;
