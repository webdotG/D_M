import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import styles from './Add_dreams_memories.module.scss';
import { useDreamStore} from '../../store';

const AddDreams: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false);
  const [category, setCategory] = useState<string>('сны'); 
  const [date, setDate] = useState<Date | null>(null); 
  const [associations, setAssociations] = useState<string>('');
  const [newAssociation, setNewAssociation] = useState<string>('');
  const [isAddingNewAssociation, setIsAddingNewAssociation] = useState<boolean>(false);

  const addDream = useDreamStore((state) => state.addDream);
  // const updateDream = useDreamStore((state) => state.updateDream);
  // const loadAssociations = useAssociationsStore((state) => state.loadAssociations);
  // const associationsList = useAssociationsStore((state) => state.associations);

  const navigate = useNavigate();

  // useEffect(() => {
  //   loadAssociations();
  // }, [loadAssociations]);

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

  const handleAssociationsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAssociations(event.target.value);
    setIsAddingNewAssociation(event.target.value === 'new');
  };

  const handleNewAssociationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewAssociation(event.target.value);
  };

  const now = new Date().toISOString();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
const newDream = {
  id: Date.now(),
  title,
  content,
  isAnalyzed,
  category,
  date: date ? date.toISOString() : '',
  createdAt: now,
  updatedAt: now,
  associations: isAddingNewAssociation ? newAssociation : associations,
    };
    await addDream(newDream);
    setTitle('');
    setContent('');
    setIsAnalyzed(false);
    setCategory('сны');
    setDate(null);
    setAssociations('');
    setNewAssociation('');
    setIsAddingNewAssociation(false);
    navigate('/D_M/');
  };

  // useEffect(() => {
  //   const newDream = {
  //     id: Date.now(),
  //     title,
  //     content,
  //     isAnalyzed,
  //     category,
  //     date: date ? date.toISOString() : '',
  //     associations: isAddingNewAssociation ? newAssociation : associations,
  //   };
  //   addDream(newDream);
  // }, [
  //   title, 
  //   content, 
  //   isAnalyzed, 
  //   category, 
  //   date, 
  //   associations, 
  //   newAssociation, 
  //   isAddingNewAssociation]);

  const handleBackToHome = () => {
    navigate('/D_M/');
  };

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
          <label htmlFor="associations">Ассоциации</label>
          <select id="associations" value={associations} onChange={handleAssociationsChange}>
            <option value="">Выберите ассоциацию</option>
            {/* {associationsList.map((association) => (
              <option key={association} value={association}>
                {association}
              </option>
            ))} */}
            <option value="new">Добавить новую</option>
          </select>
          {isAddingNewAssociation && (
            <input
              type="text"
              value={newAssociation}
              onChange={handleNewAssociationChange}
              placeholder="Введите новую ассоциацию"
            />
          )}
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
        <button type="button" className={styles['back-button']} onClick={handleBackToHome}>
          На главную
        </button>
      </form>
    </div>
  );
};

export default AddDreams;
