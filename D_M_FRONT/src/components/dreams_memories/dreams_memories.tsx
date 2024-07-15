import React, { useState, useEffect } from 'react';
import style from './dreams_memories.module.scss';
import { useDreamStore, useCategoryStore } from '../../store';
import selfAnalys from '../../SVG/medecine.svg';
import LikeUnlikeIcon from '../../SVG/unlike.svg';
import { updateDreamMemories } from '../../API/updateDream';
import { moveDreamToDifferentCategory} from '../../API/moveDreamCategory'

type DreamProps = {
  id: number;
  category: string;
  associations: string;
  title: string;
  content: string;
  isAnalyzed: boolean;
  date: string;
};

const Dream = ({ id, category, associations, title, content, isAnalyzed, date }: DreamProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCategory, setEditedCategory] = useState(category);
  const [editedAssociations, setEditedAssociations] = useState(associations);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);
  const [editedIsAnalyzed, setEditedIsAnalyzed] = useState(isAnalyzed);
  const [editedDate, setEditedDate] = useState(date);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [tempCategory, setTempCategory] = useState(category);

  const { selectedCategory } = useCategoryStore();
  const updateDream = useDreamStore((state) => state.updateDream);

  useEffect(() => {
    if (!isEditing) {
      setEditedCategory(selectedCategory);
    }
  }, [selectedCategory, isEditing]);

  const handleEditClick = async () => {
    if (isEditing) {
      try {
        if (editedCategory !== category) {
          await moveDreamToDifferentCategory(
            id,
            editedCategory,
            editedAssociations,
            editedTitle,
            editedContent,
            editedIsAnalyzed,
            editedDate
          );
        } else {
          await updateDreamMemories(
            id,
            editedCategory,
            editedAssociations,
            editedTitle,
            editedContent,
            editedIsAnalyzed,
            editedDate
          );
        }
        updateDream({
          id,
          category: editedCategory,
          associations: editedAssociations,
          title: editedTitle,
          content: editedContent,
          isAnalyzed: editedIsAnalyzed,
          date: editedDate,
        });
      } catch (error) {
        console.error('Failed to update dream category:', error);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleAnalysisClick = () => {
    if (isEditing) {
      setEditedIsAnalyzed(!editedIsAnalyzed);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCategory = e.target.value;
    if (newCategory !== editedCategory) {
      setTempCategory(newCategory);
      setShowConfirmation(true);
    }
  };

  const handleCategoryConfirm = () => {
    setEditedCategory(tempCategory);
    setShowConfirmation(false);
  };

  return (
    <li className={style['dream']}>
      <div className={style['dream-content']}>
        {isEditing ? (
          <>
            <label>
              <p>Категория :</p>
              <label>
                <input
                  type="radio"
                  value="сны"
                  checked={editedCategory === 'сны'}
                  onChange={handleCategoryChange}
                />
                Сны
              </label>
              <label>
                <input
                  type="radio"
                  value="воспоминания"
                  checked={editedCategory === 'воспоминания'}
                  onChange={handleCategoryChange}
                />
                Воспоминания
              </label>
            </label>
            <label>
              <p>Ассоциации :</p>
              <input
                type="text"
                value={editedAssociations}
                onChange={(e) => setEditedAssociations(e.target.value)}
                className={style['dream-content-associations']}
              />
            </label>
            <label>
              <p>Название :</p>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className={style['dream-content-title']}
              />
            </label>
            <label>
              <p>Содержание :</p>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className={style['dream-content-text']}
                rows={3}
              />
            </label>
          </>
        ) : (
          <>
            <h3 className={style['dream-content-title']}>{title}</h3>
            <p className={style['dream-content-associations']}>{associations}</p>
            <p className={style['dream-content-text']}>{content}</p>
          </>
        )}
        <div className={style['dream-content-info']}>
          <div className={style['dream-date']}>
            {isEditing ? (
              <label>
                Когда было :
                <input
                  type="text"
                  value={editedDate}
                  onChange={(e) => setEditedDate(e.target.value)}
                />
              </label>
            ) : (
              <p>{date}</p>
            )}
          </div>
        </div>
      </div>
      <div className={style['dream-function']}>
        <button className={style['dream-function__edit-btn']} onClick={handleEditClick}>
          {isEditing ? 'Сохранить' : 'Редактировать'}
        </button>
        <button className={style['dream-function__edit-btn']} onClick={handleAnalysisClick}>
          {editedIsAnalyzed ? (
            <img src={selfAnalys} alt='Не анализировать' />
          ) : (
            <img className={style['LikeUnlike']} src={LikeUnlikeIcon} alt='Анализировать' />
          )}
        </button>
      </div>
      {showConfirmation && (
        <div className={style['confirmation-modal']}>
          <p>Вы уверены, что хотите изменить категорию?</p>
          <button onClick={handleCategoryConfirm}>Да</button>
          <button onClick={() => setShowConfirmation(false)}>Нет</button>
        </div>
      )}
    </li>
  );
};

export default Dream;
