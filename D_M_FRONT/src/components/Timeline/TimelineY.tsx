import React, { useMemo, useState } from 'react';
import Modal from './Modal'; // Импортируем компонент модального окна

interface TimelineYProps {
  // Можете добавить дополнительные пропсы, если нужно
}

const TimelineY: React.FC<TimelineYProps> = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Начальная и конечная даты
  const startDate = new Date('1989-06-25');
  const endDate = new Date();

  // Функция для генерации шкалы по месяцам
  const generateScale = () => {
    const scale = [];
    let currentDate = new Date(startDate);

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

  // Обработчик клика на месяц
  const handleMonthClick = (date: Date) => {
    const { year, month } = formatDate(date);
    setSelectedYear(year); // Храним полный год
    setSelectedMonth(month);
    setIsModalOpen(true);
  };

  // Закрытие модального окна
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedYear(null);
    setSelectedMonth(null);
  };

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
        content={`${selectedYear} ${selectedMonth}`}
      />
    </div>
  );
};

export default TimelineY;
