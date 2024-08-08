import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import Dream from '../dreams_memories/dreams_memories';
import styles from './Modal.module.scss';
import { useCategoryStore } from '../../store'; 
import { fetchAssociationsById } from '../../API/associationByID'; 
import AddDreams from '../dreams_memories/Add_dreams_memories';


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
  const [isAdding, setIsAdding] = useState(false);
  const [currentDate, setCurrentDate] = useState<string | null>(null); 

  const localRef = useRef<HTMLDivElement>(null);

  const selectedCategory = useCategoryStore((state) => state.selectedCategory); 

  useImperativeHandle(ref, () => localRef.current!);

  if (!isOpen) return null;

  const handleDayClick = async (record: Record) => {
    setSelectedRecord(record);
    setViewingRecord(true);

    try {
      const fetchedAssociations = await fetchAssociationsById(selectedCategory, record.id);
      setAssociations(fetchedAssociations);
    } catch (error) {
      console.error('Ошибка при загрузке ассоциаций:', error);
      setAssociations("");
    }
  };


  const months: { [key: string]: number } = {Январь: 1,Февраль: 2,Март: 3,Апрель: 4,Май: 5,Июнь: 6,Июль: 7,Август: 8,Сентябрь: 9,Октябрь: 10,Ноябрь: 11,Декабрь: 12};
  const handleNoRecordsClick = (day: number) => {
    // Преобразуем название месяца в номер месяца
    const monthNumber = months[selectedMonth || ''] || 0;
    
    // Формируем дату в формате YYYY-MM-DD
    const formattedDate = `${selectedYear || ''}-${monthNumber.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    setCurrentDate(formattedDate);
    setIsAdding(true);
 
  };
  

  const renderAddForm = () => {
    if (isAdding) {
      return <AddDreams current_data={currentDate} />;
    }
    return null;
  };

  const handleBackClick = () => {
    setSelectedRecord(null);
    setViewingRecord(false);
    setAssociations(""); 
    setIsAdding(false); 
    setCurrentDate(null); 
  };

  const handleCloseClick = () => { 
    setViewingRecord(false);
    onClose()
  }
  
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
            <div className={styles.noRecords} onClick={() => handleNoRecordsClick(day)}>
              Нет записей. Нажмите, чтобы добавить.
            </div>
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
        
      
        <button onClick={handleCloseClick} className={styles.closeButton}>×</button>
        
        {viewingRecord ? renderSelectedRecord() : (
          <>
            <h3>{selectedYear} - {selectedMonth}</h3>

            {isAdding ?  (
            <div className={styles.add_container}> 
            {renderAddForm()}
            <button className={styles.close_add_btn} 
            onClick={() => setIsAdding(false)} >закрыть</button> 
            </div>
            )
              : ''
          }
            <div className={styles.daysContainer}>
              {renderDays()}
            </div>
            
          </>
        )}
      </div>
    </div>
  );
});

export default Modal