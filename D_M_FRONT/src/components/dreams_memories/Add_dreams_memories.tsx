import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import styles from './Add_dreams_memories.module.scss';
import { useDreamStore } from '../../store';

const AddDreams: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false);
  const [category, setCategory] = useState<string>('сны'); 
  const [date, setDate] = useState<Date | null>(null); 
  const [associations, setAssociations] = useState<string>('');

  const addDream = useDreamStore((state) => state.addDream);
  const updateDream = useDreamStore((state) => state.updateDream);
  const navigate = useNavigate();

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const handleIsAnalyzedChange = () => {
    setIsAnalyzed(!isAnalyzed);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
  };

  const handleDateChange = (date: Date | null) => {
    setDate(date);
  };

  const handleAssociationsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAssociations(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newDream = {
      id: Date.now(), // временный ID
      title,
      content,
      isAnalyzed,
      category,
      date: date ? date.toISOString() : '',
      associations,
    };
    await addDream(newDream); // zustand store
    // Сброс состояний после отправки данных
    setTitle('');
    setContent('');
    setIsAnalyzed(false);
    setCategory('сны');
    setDate(null);
    setAssociations('');
    navigate('/D_M/'); 
  };

  useEffect(() => {
    const newDream = {
      id: Date.now(), // временный ID
      title,
      content,
      isAnalyzed,
      category,
      date: date ? date.toISOString() : '',
      associations,
    };
    updateDream(newDream); // Автосохранение изменений
  }, [title, content, isAnalyzed, category, date, associations]);

  return (
    <div className={styles['add-dreams-container']}>
      <form onSubmit={handleSubmit} className={styles['add-dreams-form']}>
        <div className={styles['category-buttons']}>
          <button 
            type="button" 
            onClick={() => handleCategoryChange('сны')} 
            className={`${styles['category-button']} ${category === 'сны' ? styles['selected'] : ''}`}
          >
            <h2>Сон</h2>
          </button>
          <p>или</p>
          <button 
            type="button" 
            onClick={() => handleCategoryChange('воспоминания')} 
            className={`${styles['category-button']} ${category === 'воспоминания' ? styles['selected'] : ''}`}
          >
            <h2>Воспоминание</h2>
          </button>
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="title">Заголовок</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="content">Текст</label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <label>
            <input
              type="checkbox"
              checked={isAnalyzed}
              onChange={handleIsAnalyzedChange}
            />
            Анализировано
          </label>
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="associations">из категории : </label>
          <textarea
            id="associations"
            value={associations}
            onChange={handleAssociationsChange}
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="date">Дата</label>
          <DatePicker
            selected={date}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            isClearable
          />
        </div>
        <button type="submit" className={styles['submit-button']}>
          Сохранить
        </button>
      </form>
    </div>
  );
};

export default AddDreams;
