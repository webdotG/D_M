import React, { forwardRef, useImperativeHandle, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: Record[]; // Записи, которые нужно показать
  daysInMonth: number[]; // Дни, которые нужно показать
  selectedMonth?: string | null,
  selectedYear?: number | null
}

interface Record {
  id: number;
  title: string;
  date: string; // Дата в формате "dd.mm.yyyy"
  day?: number; // Добавлен день
  month?: number; // Добавлен месяц
  year?: number; // Добавлен год
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal({
  isOpen,
  onClose,
  records,
  daysInMonth,
  selectedYear,
  selectedMonth
}, ref) {

  const localRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => localRef.current!);

  if (!isOpen) return null;

  // Функция для отображения записей по дням
  const renderDays = () => {
    return daysInMonth.map(day => {
      const dayRecords = records.filter(record => record.day === day);
      console.log('DAY RECORDS >>> :', dayRecords)
      return (
        <div key={day} style={modalStyles.dayCell}>
          <span>{day}</span>
          {dayRecords.length > 0 ? (
            <div style={modalStyles.records}>
              {dayRecords.map(record => (
                <div key={record.id} style={modalStyles.record}>
                  {record.title}
                </div>
              ))}
            </div>
          ) : (
            <div style={modalStyles.noRecords}>Нет записей</div>
          )}
        </div>
      );
    });
  };

  return (
    <div style={modalStyles.overlay}>
      <div ref={localRef} style={modalStyles.modal}>
        <button onClick={onClose} style={modalStyles.closeButton}>×</button>
        <h3>{selectedYear}</h3>
        <h4>{selectedMonth}</h4>
        <div style={modalStyles.daysContainer}>
          {renderDays()}
        </div>
      </div>
    </div>
  );
});

const modalStyles = {
  overlay: {
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '80%',
    maxWidth: '600px',
    height: '500px',
    overflowY: 'auto',
    position: 'relative' as 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  closeButton: {
    position: 'absolute' as 'absolute',
    top: '10px',
    right: '10px',
    border: 'none',
    background: 'none',
    fontSize: '20px',
    cursor: 'pointer',
  },
  daysContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '10px',
  },
  dayCell: {
    width: '100px', // Увеличено для удобства
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #ddd',
    borderRadius: '4px',
    position: 'relative' as 'relative',
    textAlign: 'center',
    padding: '10px', // Добавлено для визуального улучшения
  },
  records: {
    marginTop: '5px',
    fontSize: '12px',
    color: '#00796b',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  record: {
    backgroundColor: '#e0f2f1',
    borderRadius: '4px',
    padding: '2px 4px',
    margin: '2px 0',
    fontSize: '12px',
  },
  noRecords: {
    marginTop: '5px',
    fontSize: '12px',
    color: '#666',
  },
};

export default Modal;
