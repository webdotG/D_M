import React, { useMemo, useState, useRef, useEffect } from 'react';
import Modal from './Modal'; 

const TimelineY: React.FC = () => {
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
    const scale = [];
    const currentDate = new Date(startDate); // Используйте const здесь

    // Добавляем каждую дату месяца в массив до текущего месяца
    while (currentDate <= endDate) {
      scale.push(new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1); // Переход к следующему месяцу
    }

    return scale.reverse(); // Перевернуть массив для правильного отображения
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
    const days = [];
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
    const monthIndex = date.getMonth(); // Месяцы в JavaScript начинаются с 0
    setSelectedYear(year); // Храним полный год
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
    // Добавляем обработчик кликов на весь документ
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Убираем обработчик кликов при закрытии модального окна
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <div>
      {scale.map((date, index) => {
        const { year, month } = formatDate(date);
        const shortYear = String(year).slice(-2); // Формат для отображения
        return (
          <div key={index} onClick={() => handleMonthClick(date)} style={{ cursor: 'pointer' }}>
            <span>
              {shortYear} - {month}
            </span>
          </div>
        );
      })}

      <Modal
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
        ref={modalRef} // Передача рефа в модальное окно
      />
    </div>
  );
};

export default TimelineY;
