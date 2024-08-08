import React, { useState, useEffect } from 'react';
import styles from './Add_dreams_memories.module.scss';
import { fetchAssociations } from '../../API/associationALL';
import { AddRecord } from '../../API/AddRecord';
import { useTranslate } from '../../hooks/useTranslate';
import { useCategoryStore } from '../../store'; 
import { useNavigate } from 'react-router-dom';


interface AddDreamsProps {
  current_data: string | null;
}

const AddDreams: React.FC<AddDreamsProps> = ({ current_data }) => {
console.log('currnt_DATA >>> ', current_data)
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false);
  const [date, setDate] = useState<string>(current_data || ''); 
  const [associationsList, setAssociationsList] = useState<string[]>([]);
  const [selectedAssociation, setSelectedAssociation] = useState<string>('');
  const [newAssociation, setNewAssociation] = useState<string>('');
  const [isAddingNewAssociation, setIsAddingNewAssociation] = useState<boolean>(false);

  const { selectedCategory, setSelectedCategory } = useCategoryStore();
  const [category, setCategory] = useState<string>(selectedCategory); // Инициализируйте состояние из хука

  const navigate = useNavigate();
  const { translateToLanguage } = useTranslate();

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
    setSelectedCategory(newCategory); 
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
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


  const handleAssociationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedAssociation(value);
    setIsAddingNewAssociation(value === 'new');
  };

  const handleNewAssociationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewAssociation(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const associations = isAddingNewAssociation && newAssociation
      ? newAssociation
      : selectedAssociation;

    const newDream = {
      title: title || ' ... ',
      content: content || ' ... ',  
      isAnalyzed,
      category,
      date: date || '',
      associations: associations || ' ... ',  
      video: '', 
      img: ''
    };

    try {
      await AddRecord(newDream);

      setTitle('');
      setContent('');
      setIsAnalyzed(false);
      setDate('');
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
    setDate('');
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
              {translateToLanguage('Записываем')}
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="сны">{translateToLanguage('Сон')}</option>
              <option value="воспоминания">{translateToLanguage('Воспоминание')}</option>
            </select>
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="title">
              {translateToLanguage('Заголовок')}
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
              {translateToLanguage('Текст')}
            </label>
            <textarea
              id="content"
              value={content}
              onChange={handleContentChange}
            />
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="associations">
              {translateToLanguage('Ассоциации')}
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
                <option value="">
                  {translateToLanguage('Варианты')}
                </option>
                {associationsList.map((association, index) => (
                  <option key={index} value={association}>
                    {association}
                  </option>
                ))}
                <option value="new">
                  {translateToLanguage('Записать новую ассоциацию')}
                </option>
              </select>
            )}
          </div>

          <div className={styles['form-group']}>
            <label>
              {translateToLanguage('Анализировано')}
              <input
                type="checkbox"
                checked={isAnalyzed}
                onChange={handleIsAnalyzedChange}
              />
            </label>
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="date">
              {translateToLanguage('Дата')}
            </label>
            <input
              type="date"
              id="date"
              onChange={handleDateChange}
              value={date}
              placeholder="Выберите дату"
            />
          </div>

          <div className={styles['form-group']}>
            <button type="submit" className={styles['submit-button']}>
              {translateToLanguage('Сохранить')}
            </button> 
            <button type="button" className={styles['reset-button']} onClick={handleReset}>
              {translateToLanguage('Сбросить')}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddDreams;
