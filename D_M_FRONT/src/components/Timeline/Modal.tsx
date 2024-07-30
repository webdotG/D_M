import React, { forwardRef, useImperativeHandle, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>; // Передача рефа
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(({ isOpen, onClose, content }, ref) => {
  const localRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => localRef.current!);

  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay}>
      <div ref={localRef} style={modalStyles.modal}>
        <button onClick={onClose} style={modalStyles.closeButton}>×</button>
        <div style={modalStyles.content}>{content}</div>
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
};

export default Modal;
