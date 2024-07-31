import React, { useMemo, useState, useRef, useEffect } from 'react';
import Modal from './Modal';

// Определяем интерфейсы для пропсов
interface Record {
  id: number;
  title: string;
  date: string;
  day?: number;
  month?: number;
  year?: number;
  associations?: string;
}

interface TimelineYProps {
  recordsByMonth: { [month: string]: Record[] }; // Записи по месяцам
  associationsByMonth: { [month: string]: string[] }; // Ассоциации по месяцам
  daysByMonth: { [month: string]: number[] }; // Дни по месяцам
}

const TimelineY: React.FC<TimelineYProps> = ({
  recordsByMonth,
  associationsByMonth,
  daysByMonth
}) => {
  console.log('recordsByMonth', recordsByMonth);
  console.log('associationsByMonth', associationsByMonth);
  console.log('daysByMonth', daysByMonth);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const modalRef = useRef<HTMLDivElement>(null);

  // Начальная и конечная даты
  const startDate = new Date('1989-06-25');
  const endDate = new Date();

  // Функция для генерации шкалы по месяцам
  const generateScale = () => {
    const scale: Date[] = [];
    const currentDate = new Date(startDate);

    // Добавляем каждую дату месяца в массив до текущего месяца
    while (currentDate <= endDate) {
      scale.push(new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return scale.reverse();
  };

  const scale = useMemo(generateScale, [endDate]);

  // Функция для форматирования даты
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.toLocaleString('ru-RU', { month: 'long' });
    return { year, month };
  };

  // Функция для вычисления дней в месяце
  const getDaysInMonth = (year: number, month: number) => {
    const days: number[] = [];
    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
      days.push(date.getDate());
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  // Обработчик клика на месяц
  const handleMonthClick = (date: Date) => {
    const { year, month } = formatDate(date);
    const monthIndex = date.getMonth();
    setSelectedYear(year);
    setSelectedMonth(month);
    setDaysInMonth(getDaysInMonth(year, monthIndex));
    setIsModalOpen(true);
  };

  // Закрытие модального окна
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedYear(null);
    setSelectedMonth(null);
    setDaysInMonth([]);
  };

  // Обработчик клика вне модального окна
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal();
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <div>
      {scale.map((date, index) => {
        const { year, month } = formatDate(date);
        // const shortYear = String(year).slice(-2);
        return (
          <div key={index} onClick={() => handleMonthClick(date)} style={{ cursor: 'pointer' }}>
            <span>
              {year}__{month}
            </span>
          </div>
        );
      })}

      <Modal
        ref={modalRef}
        isOpen={isModalOpen}
        onClose={closeModal}
        content={
          <div>
            <div>Год: {selectedYear}</div>
            <div>Месяц: {selectedMonth}</div>
            <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {daysInMonth.map(day => (
                <li key={day} style={{ flex: '1 0 14%', textAlign: 'center' }}>{day}</li>
              ))}
            </ul>
          </div>
        }
      />
    </div>
  );
};

export default TimelineY;
