import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import styles from './Add_dreams_memories.module.scss';
import { useDreamStore } from '../../store';
import { fetchAssociations } from '../../API/associationSearch';
// import { addAssociationsJSON } from '../../hooks/associationJSON'; 

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

  const addDream = useDreamStore((state) => state.addDream);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadAssociations() {
      try {
        const fetchedAssociations = await fetchAssociations(category);
        setAssociationsList(fetchedAssociations);
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

    const now = new Date().toISOString();

    let newDream = {
      title,
      content,
      isAnalyzed,
      category,
      date: date ? date.toISOString() : '',
      createdAt: now,
      updatedAt: now,
      associations: '',
      video: '',
      img: ''
    };

    try {
      newDream = await addAssociationsJSON(newDream, selectedAssociation, newAssociation);
      await addDream(newDream);

      // Reset form fields
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
      // Handle error as needed
    }
  };

  const handleReset = () => {
    // Reset all form fields
    setTitle('');
    setContent('');
    setIsAnalyzed(false);
    setCategory('сны');
    setDate(null);
    setSelectedAssociation('');
    setNewAssociation('');
    setIsAddingNewAssociation(false);

    // Fetch associations again for the default category 'сны'
    fetchAndSetAssociations('сны');
  };

  return (
    <div className={styles['add-dreams-container']}>
      <form onSubmit={handleSubmit} className={styles['add-dreams-form']}>
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
          <label htmlFor="category">Категория</label>
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
          <label htmlFor="associations">Ассоциации</label>
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
          <label htmlFor="date">Дата</label>
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
          <button type="submit" className={styles['submit-button']}>
            Сохранить
          </button>
          <button type="button" className={styles['reset-button']} onClick={handleReset}>
            Сбросить
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDreams;
