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

  useEffect(() => {
    async function loadAssociations() {
      try {
        const fetchedAssociations = await fetchAssociations(category);
        if (Array.isArray(fetchedAssociations)) {
          setAssociationsList(fetchedAssociations);
        } else {
          console.error('fetchAssociations returned non-array data:', fetchedAssociations);
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
      setAssociationsList(fetchedAssociations);
    } catch (error) {
      console.error('Failed to fetch associations:', error);
      setAssociationsList([]);
    }
  };

  const handleDateChange = (newDate: Date | null) => {
    setDate(newDate);
  };

  const handleAssociationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAssociation(event.target.value);
    setIsAddingNewAssociation(event.target.value === 'new');
  };

  const handleNewAssociationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewAssociation(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let associations: string[] = [];
    if (isAddingNewAssociation && newAssociation) {
      associations = [newAssociation];
    } else if (selectedAssociation) {
      associations = [selectedAssociation];
    }

    const newDream = {
      title,
      content,
      isAnalyzed,
      category,
      date: date ? date.toISOString() : '',
      associations,
      video: '', 
      img: ''    
    };

    try {
      await AddRecord(newDream);

      // Сброс состояния формы
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
              <p>Категория</p>
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
              required
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
              required
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
                placeholder="Введите новую ассоциацию"
                required
              />
            ) : (
              <select
                id="associations"
                value={selectedAssociation}
                onChange={handleAssociationChange}
                required
              >
                <option value="">Выберите ассоциацию</option>
                {associationsList.map((association) => (
                  <option key={association} value={association}>
                    {association}
                  </option>
                ))}
                <option value="new">Добавить новую</option>
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
              required
            />
          </div>

          <div className={styles['form-group']}>
            <button type="button" className={styles['reset-button']} onClick={handleReset}>
              Сбросить
            </button>
            <button type="submit" className={styles['submit-button']}>
              Сохранить
            </button> 
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AddDreams;
