import React, { useEffect, useState } from 'react';
import styles from './visualPage.module.scss';
import { loadDreams } from '../../API/dreams';
import { fetchAssociationsById } from '../../API/associationByID';
import { useCategoryStore } from '../../store';
import TimelineY from '../../components/Timeline/TimelineY';

interface Record {
  id: number;
  title: string;
  date: string; // Дата в формате "dd.mm.yyyy" или "yyyy-mm-dd"
  day?: number; 
  month?: number; 
  year?: number; 
  associations?: string; 
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
        console.log('FETCH DATA SELECTED CATEGORY >>> : ', selectedCategory);

        // Получение записей
        const data: Record[] = await loadDreams(selectedCategory);
        console.log('LOAD DREAMS DATA (data) >>> : ', data);
        setRecords(data);

        // Подготовка ассоциаций по месяцам
        const associationsByMonth: { [month: string]: string[] } = {};
        const recordsByMonth: { [month: string]: Record[] } = {};
        const daysByMonth: { [month: string]: number[] } = {};

        for (const record of data) {
          let day: number | undefined;
          let month: number | undefined;
          let year: number | undefined;

          // Разбираем строку даты
          // Поддержка форматов "dd.mm.yyyy" и "yyyy-mm-dd"
          const dateParts = record.date.split(/[.\-]/); 

          if (dateParts.length === 3) {
            if (dateParts[0].length === 4) {
              // Формат "yyyy-mm-dd"
              [year, month, day] = dateParts.map(Number);
            } else {
              // Формат "dd.mm.yyyy"
              [day, month, year] = dateParts.map(Number);
            }
          } else {
            console.error(`Некорректная дата для записи ${record.id}: ${record.date}`);
            continue;
          }

          console.log(`Обрабатываем запись: ${record.id}, дата: ${day}.${month}.${year}`);
          
          const monthKey = `${month}-${year}`;

          // Добавление дня, месяца и года 
          record.day = day;
          record.month = month;
          record.year = year;

          console.log(`День: ${record.day}, Месяц: ${record.month}, Год: ${record.year}`);

          console.log('FETCH DATA SELECTED CATEGORY AND RECORD.ID>>> : ', selectedCategory, record.id);
          // Получение ассоциаций для каждой записи
          const recordAssociations = await fetchAssociationsById(selectedCategory, record.id);
          console.log(`RECORD ASSOCIATIONS FOR ${selectedCategory} >>> : `, recordAssociations);
          console.log(`Полученные ассоциации для записи ${record.id} >>> : `, recordAssociations);
          record.associations = recordAssociations;

          // Проверка и добавление ассоциаций
          if (recordAssociations && recordAssociations.length > 0) {
            if (!associationsByMonth[monthKey]) {
              associationsByMonth[monthKey] = [];
              console.log('Ассоциации по месяцам (associationsByMonth) >>> : ', associationsByMonth[monthKey]);
            }
            associationsByMonth[monthKey].push(record.associations);
          }

          // Добавление записей по месяцам
          if (!recordsByMonth[monthKey]) {
            recordsByMonth[monthKey] = [];
            console.log('Записи по месяцам (recordsByMonth) >>> : ', recordsByMonth[monthKey]);
          }
          recordsByMonth[monthKey].push(record);

          // Добавление дня в массив дней по месяцу
          if (!daysByMonth[monthKey]) {
            daysByMonth[monthKey] = [];
            console.log('Дни по месяцам (daysByMonth) >>> : ', daysByMonth[monthKey]);
          }
          if (!daysByMonth[monthKey].includes(day)) {
            daysByMonth[monthKey].push(day);
            console.log(`Добавлен день ${day} в массив дней по месяцу ${monthKey}`);
          }
        }

        console.log('Итоговые ассоциации по месяцам (associationsByMonth) >>> : ', associationsByMonth);
        console.log('Итоговые записи по месяцам (recordsByMonth) >>> : ', recordsByMonth);
        console.log('Итоговые дни по месяцам (daysByMonth) >>> : ', daysByMonth);

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
      <h1 className={styles['title']}>Визуализация...{selectedCategory}</h1>
      <div className={styles['timeline-wrapper']}>
        <div className={styles['timeline']}>
          <TimelineY 
            recordsByMonth={recordsByMonth}
            associationsByMonth={associationsByMonth}
            daysByMonth={daysByMonth}
            records={records} 
          />
        </div>
      </div>
    </div>
  );
};

export default VisualPage;
