import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import styles from './Add_dreams_memories.module.scss';
import { useDreamStore } from '../../store';
import { fetchAssociations } from '../../API/associationSearch';
import Category from '../category/categoryAssociation';

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
  const [searchQuery, setSearchQuery] = useState<string>('');

  const addDream = useDreamStore((state) => state.addDream);
  const navigate = useNavigate();

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const handleIsAnalyzed = () => {
    setIsAnalyzed(!isAnalyzed);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
  };

  const handleDateChange = (date: Date | null) => {
    setDate(date);
  };

  const handleAssociation = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAssociation(event.target.value);
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
      associations: isAddingNewAssociation ? newAssociation : selectedAssociation,
    };
    await addDream(newDream);
    setTitle('');
    setContent('');
    setIsAnalyzed(false);
    setCategory('сны');
    setDate(null);
    setSelectedAssociation('');
    setNewAssociation('');
    setIsAddingNewAssociation(false);
    navigate('/D_M/');
  };

  useEffect(() => {
    async function loadAssociations() {
      const fetchedAssociations = await fetchAssociations(category);
      setAssociationsList(fetchedAssociations);
    }
    loadAssociations();
  }, [category]);

  const handleBackToHome = () => {
    navigate('/D_M/');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredAssociations = associationsList.filter((association) =>
    association.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles['add-dreams-container']}>
      <form onSubmit={handleSubmit} className={styles['add-dreams-form']}>
        <div className={styles['category-buttons']}>
          <button
            type="button"
            onClick={() => handleCategoryChange('сны')}
            className={`
              ${styles['category-button']}
              ${category === 'сны' ? styles['selected'] : ''}`}
          >
            <h2>Сон</h2>
          </button>
          <p>или</p>
          <button
            type="button"
            onClick={() => handleCategoryChange('воспоминания')}
            className={`
              ${styles['category-button']}
              ${category === 'воспоминания' ? styles['selected'] : ''}`}
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
            onChange={handleTitle}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="content">Текст</label>
          <textarea
            id="content"
            value={content}
            onChange={handleContent}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <label>
            <input
              type="checkbox"
              checked={isAnalyzed}
              onChange={handleIsAnalyzed}
            />
            Анализировано
          </label>
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="associations">Ассоциации</label>
          <input
            type="text"
            id="search"
            placeholder="Поиск ассоциаций"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <select
            id="associations"
            value={selectedAssociation}
            onChange={handleAssociation}
          >
            <option value="">Выберите ассоциацию</option>
            {filteredAssociations.map((association) => (
              <option key={association} value={association}>
                {association}
              </option>
            ))}
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
      <Category />
    </div>
  );
};

export default AddDreams;
