import React, { forwardRef, useImperativeHandle, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: React.ReactNode;
  daysInMonth: number[];
  records: Record[];
}

interface Record {
  id: number;
  title: string;
  date: string;
  day?: number;
  month?: number;
  year?: number;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal({
  isOpen,
  onClose,
  content,
  daysInMonth,
  records
}, ref) {
  const localRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => localRef.current!);

  if (!isOpen) return null;

  const renderDays = () => {
    return daysInMonth.map(day => {
      const dayRecords = records.filter(record => record.day === day);
      return (
        <div key={day} style={modalStyles.dayCell}>
          <span>{day}</span>
          {dayRecords.length > 0 && (
            <div style={modalStyles.records}>
              {dayRecords.map(record => (
                <div key={record.id} style={modalStyles.record}>
                  {record.title}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div style={modalStyles.overlay}>
      <div ref={localRef} style={modalStyles.modal}>
        <button onClick={onClose} style={modalStyles.closeButton}>×</button>
        <div style={modalStyles.content}>
          {content}
          <div style={modalStyles.daysContainer}>
            {renderDays()}
          </div>
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
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  daysContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '10px',
  },
  dayCell: {
    width: '30px',
    height: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #ddd',
    borderRadius: '4px',
    position: 'relative' as 'relative',
    textAlign: 'center',
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
};

export default Modal;
