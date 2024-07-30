import React, { useState } from 'react';
import Modal from './Modal';

interface Record {
  id: number;
  title: string;
  date: string; // Дата в формате "dd.mm.yyyy"
  day?: number; // Добавлен день
  month?: number; // Добавлен месяц
  year?: number; // Добавлен год
}

interface TimelineYProps {
  associationsByMonth: { [month: string]: string[] }; // Ассоциации по месяцам
  recordsByMonth: { [month: string]: Record[] }; // Записи по месяцам
}

const TimelineY: React.FC<TimelineYProps> = ({ associationsByMonth, recordsByMonth }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Закрытие модального окна
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMonth(null);
  };

  // Обработчик клика по месяцу
  const handleMonthClick = (month: string) => {
    setSelectedMonth(month);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {Object.keys(associationsByMonth).map((month, index) => (
          <div key={index} style={{ margin: '10px' }}>
            <h2 onClick={() => handleMonthClick(month)} style={{ cursor: 'pointer' }}>
              {month}
            </h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {associationsByMonth[month]?.map((association, i) => (
                <li key={i} style={{ margin: '5px 0' }}>{association}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        content={
          <div>
            <h2>Записи для {selectedMonth}</h2>
            <ul>
              {selectedMonth && recordsByMonth[selectedMonth]?.map((record) => (
                <li key={record.id}>
                  {record.date}: {record.title} (день: {record.day}, месяц: {record.month}, год: {record.year})
                </li>
              )) || <li>Нет записей</li>}
            </ul>
          </div>
        }
      />
    </div>
  );
};

export default TimelineY;
