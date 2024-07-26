import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import styles from './Add_dreams_memories.module.scss';
import { fetchAssociations } from '../../API/associationALL';
import { AddRecord } from '../../API/AddRecord';
import Footer from '../footer/footer';

const AddDreams: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false);
  const [category, setCategory] = useState<string>('сны');
  const [date, setDate] = useState<Date | null>(null);
  const [associationsList, setAssociationsList] = useState<string[]>([]);
  const [selectedAssociation, setSelectedAssociation] = useState<string>('');
  const [newAssociation, setNewAssociation] = useState<string>('');
  const [isAddingNewAssociation, setIsAddingNewAssociation] = useState<boolean>(false);

  const navigate = useNavigate();

  // Загрузка ассоциаций при изменении категории
  useEffect(() => {
    async function loadAssociations() {
      try {
        const fetchedAssociations = await fetchAssociations(category);
        if (Array.isArray(fetchedAssociations)) {
          setAssociationsList(fetchedAssociations);
        } else {
          console.error('fetchAssociations returned invalid data:', fetchedAssociations);
          setAssociationsList([]);
        }
      } catch (error) {
        console.error('Failed to fetch associations:', error);
        setAssociationsList([]);
      }
    }
    loadAssociations();
  }, [category]);

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
    fetchAndSetAssociations(newCategory);
  };

  const fetchAndSetAssociations = async (newCategory: string) => {
    try {
      const fetchedAssociations = await fetchAssociations(newCategory);
      if (Array.isArray(fetchedAssociations)) {
        setAssociationsList(fetchedAssociations);
      } else {
        console.error('fetchAssociations returned invalid data:', fetchedAssociations);
        setAssociationsList([]);
      }
    } catch (error) {
      console.error('Failed to fetch associations:', error);
      setAssociationsList([]);
    }
  };

  const handleDateChange = (newDate: Date | null) => {
    setDate(newDate);
  };

  const handleAssociationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedAssociation(value);
    setIsAddingNewAssociation(value === 'new');
  };

  const handleNewAssociationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewAssociation(event.target.value);
  };

  const formatDateToDDMMYYYY = (date: Date | null): string => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const associations = isAddingNewAssociation && newAssociation
      ? newAssociation
      : selectedAssociation;

    const newDream = {
      title: title || ' ... ',  // Передаем пустую строку, если значение отсутствует
      content: content || ' ... ',  
      isAnalyzed,
      category,
      date: date ? formatDateToDDMMYYYY(date) : '',  
      associations: associations || ' ... ',  
      video: '', 
      img: ''
    };

    try {
      await AddRecord(newDream);

      setTitle('');
      setContent('');
      setIsAnalyzed(false);
      setDate(null);
      setSelectedAssociation('');
      setNewAssociation('');
      setIsAddingNewAssociation(false);

      navigate('/D_M/');
    } catch (error) {
      console.error('Error adding dream:', error);
    }
  };

  const handleReset = () => {
    setTitle('');
    setContent('');
    setIsAnalyzed(false);
    setCategory('сны');
    setDate(null);
    setSelectedAssociation('');
    setNewAssociation('');
    setIsAddingNewAssociation(false);
    fetchAndSetAssociations('сны');
  };

  return (
    <>
      <div className={styles['add-dreams-container']}>
        <form onSubmit={handleSubmit} className={styles['add-dreams-form']}>

          <div className={styles['form-group']}>
            <label htmlFor="category">
              <p>Записываем : </p>
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="сны">Сон</option>
              <option value="воспоминания">Воспоминание</option>
            </select>
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="title">
              <p>Заголовок</p>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
            
            />
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="content">
              <p>Текст</p>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={handleContentChange}
              
            />
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="associations">
              <p>Ассоциации</p>
            </label>
            {isAddingNewAssociation ? (
              <input
                type="text"
                value={newAssociation}
                onChange={handleNewAssociationChange}
                placeholder="Новая ассоциация"
                
              />
            ) : (
              <select
                id="associations"
                value={selectedAssociation}
                onChange={handleAssociationChange}
                
              >
                <option value="">Варианты</option>
                {associationsList.map((association, index) => (
                  <option key={index} value={association}>
                    {association}
                  </option>
                ))}
                <option value="new">Записать новую ...</option>
              </select>
            )}
          </div>

          <div className={styles['form-group']}>
            <label>
              <p>Анализировано</p>
              <input
                type="checkbox"
                checked={isAnalyzed}
                onChange={handleIsAnalyzedChange}
              />
            </label>
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="date">
              <p>Дата</p>
            </label>
            <DatePicker
              id="date"
              selected={date}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              isClearable
              placeholderText="Выберите дату"
         
            />
          </div>

          <div className={styles['form-group']}>
          <button type="submit" className={styles['submit-button']}>
              Сохранить
            </button> 
            <button type="button" className={styles['reset-button']} onClick={handleReset}>
              Сбросить
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AddDreams;
