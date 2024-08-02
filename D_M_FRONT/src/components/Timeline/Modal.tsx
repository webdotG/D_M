import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import Dream from '../dreams_memories/dreams_memories';
import styles from './Modal.module.scss';
import { useCategoryStore } from '../../store'; 
import { fetchAssociationsById } from '../../API/associationByID'; 

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
  day?: number; 
  month?: number; 
  year?: number; 
  content?: string; 
  isAnalyzed?: boolean; 
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
  const [associations, setAssociations] = useState<string>("");
  const localRef = useRef<HTMLDivElement>(null);

  const selectedCategory = useCategoryStore((state) => state.selectedCategory); 

  useImperativeHandle(ref, () => localRef.current!);

  if (!isOpen) return null;

  const handleDayClick = async (record: Record) => {
    setSelectedRecord(record);
    setViewingRecord(true);

    // Загружаем ассоциации для выбранной записи
    try {
      const fetchedAssociations = await fetchAssociationsById(selectedCategory, record.id);
      setAssociations(fetchedAssociations);
    } catch (error) {
      console.error('Ошибка при загрузке ассоциаций:', error);
      setAssociations("");
    }
  };

  const handleBackClick = () => {
    setSelectedRecord(null);
    setViewingRecord(false);
    setAssociations(""); 
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
          category={selectedCategory} 
          associations={associations} 
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
