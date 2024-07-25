import React, { useState, useEffect } from 'react';
import style from './dreams_memories.module.scss';
import { useCategoryStore } from '../../store';
import { fetchAssociationsById } from '../../API/associationByID';
import UpdateDream from './Update_dreams_memories';

type DreamProps = {
  id: number;
  category: string;
  associations: string;
  title: string;
  content: string;
  isAnalyzed: boolean;
  date: string;
};

const Dream: React.FC<DreamProps> = ({
  id,
  category,
  associations,
  title,
  content,
  isAnalyzed,
  date
}: DreamProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAssociations, setEditedAssociations] = useState(associations);

  const selectedCategory = useCategoryStore((state) => state.selectedCategory);

  useEffect(() => {
    const loadAssociations = async () => {
      try {
        console.log(`Fetching associations for category: ${category}, id: ${id}`);
        const fetchedAssociations = await fetchAssociationsById(category, id);
        console.log(`Fetched associations: ${fetchedAssociations}`);
        setEditedAssociations(fetchedAssociations);
      } catch (error) {
        console.error('Ошибка при загрузке ассоциаций:', error);
      }
    };

    loadAssociations();
  }, [id, category, selectedCategory]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
  };

  return (
    <li className={style['dream']}>
      <div className={style['dream-content']}>
        <h3 className={style['dream-content-title']}>{title}</h3>
        <p className={style['dream-content-associations']}>{editedAssociations}</p>
        <p className={style['dream-content-text']}>{content}</p>
        <p className={style['dream-content-date']}>{date}</p>
        <p className={style['dream-content-date']}>{isAnalyzed}</p>
      </div>
      <div className={style['dream-function']}>
      {isEditing ? (
       <p className={style['dream-function__edit-btn']} >
        Режим редактирования ... 
      </p>
      ):(
        <button className={style['dream-function__edit-btn']} onClick={handleEditClick}>
          редактировать
        </button>
      )}
        
      </div>
      {isEditing && (
        <UpdateDream 
          id={id}
          category={category}
          associations={editedAssociations}
          title={title}
          content={content}
          isAnalyzed={isAnalyzed}
          date={date}
          onClose={handleCloseModal}
        />
      )}
    </li>
  );
};

export default Dream;
