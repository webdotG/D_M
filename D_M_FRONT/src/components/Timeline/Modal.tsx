import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import Dream from '../dreams_memories/dreams_memories'; 
import styles from './Modal.module.scss'; // Импорт стилей

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: Record[]; // Записи, которые нужно показать
  daysInMonth: number[]; // Дни, которые нужно показать
  selectedMonth?: string | null;
  selectedYear?: number | null;
}

interface Record {
  id: number;
  title: string;
  date: string; // Дата в формате "dd.mm.yyyy"
  day?: number; // Добавлен день
  month?: number; // Добавлен месяц
  year?: number; // Добавлен год
  content?: string; // Содержимое записи
  isAnalyzed?: boolean; // Индикатор анализа записи
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal({
  isOpen,
  onClose,
  records,
  daysInMonth,
  selectedYear,
  selectedMonth
}, ref) {
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [viewingRecord, setViewingRecord] = useState(false);
  const localRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => localRef.current!);

  if (!isOpen) return null;

  const handleDayClick = (record: Record) => {
    setSelectedRecord(record);
    setViewingRecord(true);
  };

  const handleBackClick = () => {
    setSelectedRecord(null);
    setViewingRecord(false);
  };

  const renderDays = () => {
    return daysInMonth.map(day => {
      const dayRecords = records.filter(record => record.day === day);
      return (
        <div key={day} className={styles.dayCell}>
          <span>{day}</span>
          {dayRecords.length > 0 ? (
            <div className={styles.records}>
              {dayRecords.map(record => (
                <div key={record.id} className={styles.record} onClick={() => handleDayClick(record)}>
                  {record.title}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noRecords}>Нет записей</div>
          )}
        </div>
      );
    });
  };

  const renderSelectedRecord = () => {
    if (!selectedRecord) return null;

    return (
      <>
        <button onClick={handleBackClick} className={styles.backButton}>← Назад</button>
        <Dream
          id={selectedRecord.id}
          category="" // Обновите, если у вас есть категория в записи
          associations="" // Обновите, если у вас есть ассоциации в записи
          title={selectedRecord.title}
          content={selectedRecord.content || ""}
          isAnalyzed={selectedRecord.isAnalyzed || false}
          date={selectedRecord.date}
        />
      </>
    );
  };

  return (
    <div className={styles.overlay}>
      <div ref={localRef} className={styles.modal}>
        <button onClick={onClose} className={styles.closeButton}>×</button>
        {viewingRecord ? renderSelectedRecord() : (
          <>
            <h3>{selectedYear}</h3>
            <h4>{selectedMonth}</h4>
            <div className={styles.daysContainer}>
              {renderDays()}
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default Modal;
