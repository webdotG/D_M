import React, { useMemo, useState, useRef, useEffect } from 'react';
import Modal from './Modal';

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
  const [selectedMonthRecords, setSelectedMonthRecords] = useState<Record[]>([]);
  const [selectedMonthAssociations, setSelectedMonthAssociations] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  
  const modalRef = useRef<HTMLDivElement>(null);

  const startDate = new Date('1989-06-25');
  const endDate = new Date();

  const generateScale = () => {
    const scale: Date[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      scale.push(new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return scale.reverse();
  };

  const scale = useMemo(generateScale, [endDate]);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.toLocaleString('ru-RU', { month: 'long' });
    return { year, month };
  };

  const getDaysInMonth = (year: number, month: number) => {
    const days: number[] = [];
    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
      days.push(date.getDate());
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const handleMonthClick = (date: Date) => {
    const { year, month } = formatDate(date);
    const monthIndex = date.getMonth();
    const monthKey = `${monthIndex + 1}-${year}`;
    
    setSelectedYear(year);
    setSelectedMonth(month);
    setDaysInMonth(getDaysInMonth(year, monthIndex));
    setSelectedMonthRecords(recordsByMonth[monthKey] || []);
    setSelectedMonthAssociations(associationsByMonth[monthKey] || []);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedYear(null);
    setSelectedMonth(null);
    setDaysInMonth([]);
    setSelectedMonthRecords([]);
    setSelectedMonthAssociations([]);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal();
    }
  };

  useEffect(() => {
    if (modalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalOpen]);

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '10px 0' }}>
        {scale.map((date, index) => {
          const { year, month } = formatDate(date);
          const monthKey = `${date.getMonth() + 1}-${year}`;
          const monthAssociations = associationsByMonth[monthKey] || [];
          
          return (
            <div
              key={index}
              onClick={() => handleMonthClick(date)}
              style={{
                cursor: 'pointer',
                padding: '10px',
                margin: '5px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: monthAssociations.length ? '#e0f7fa' : '#fff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                position: 'relative',
                minWidth: '120px',
                overflow: 'hidden'
              }}
            >
              <span>{year}__{month}</span>
              {monthAssociations.length > 0 && (
                <div
                  style={{
                    marginTop: '5px',
                    fontSize: '12px',
                    color: '#00796b',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={monthAssociations.join(', ')}
                >
                  {monthAssociations.join(', ')}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal
        ref={modalRef}
        isOpen={modalOpen}
        onClose={closeModal}
        content={
          <div>
            <div>Год: {selectedYear}</div>
            <div>Месяц: {selectedMonth}</div>
            <div>
              <h4>Ассоциации:</h4>
              <ul>
                {selectedMonthAssociations.length > 0 ? (
                  selectedMonthAssociations.map((assoc, index) => (
                    <li key={index}>{assoc}</li>
                  ))
                ) : (
                  <li>Нет ассоциаций для этого месяца.</li>
                )}
              </ul>
            </div>
            <div>
              <h4>Записи:</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {daysInMonth.map(day => {
                  const dayRecords = selectedMonthRecords.filter(record => record.day === day);
                  return (
                    <div key={day} style={{ flex: '1 0 14%', textAlign: 'center' }}>
                      <div>{day}</div>
                      {dayRecords.map(record => (
                        <div key={record.id} style={{ fontSize: '12px' }}>
                          {record.title}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        }
        daysInMonth={daysInMonth}
        records={selectedMonthRecords}
      />
    </div>
  );
};

export default TimelineY;
