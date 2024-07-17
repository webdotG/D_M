import React, { useState, useEffect } from 'react';
import style from './dreams_memories.module.scss';
import { useDreamStore, useCategoryStore } from '../../store';
import selfAnalys from '../../SVG/medecine.svg';
import LikeUnlikeIcon from '../../SVG/unlike.svg';
import { updateDreamMemories } from '../../API/updateDream';
import { moveDreamToDifferentCategory } from '../../API/moveDreamCategory';
import D_M from '../../SVG/d_m.svg';
import Confirm from '../../SVG/confirm.svg';
import Cancel from '../../SVG/delete.svg';
import { deleteRecordById } from '../../API/dreams';

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
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // New state for delete confirmation
  
  const { selectedCategory, setSelectedCategory } = useCategoryStore();
  const updateDream = useDreamStore((state) => state.updateDream);

  useEffect(() => {
    if (!isEditing) {
      setEditedCategory(selectedCategory);
    }
  }, [selectedCategory, isEditing]);

  const handleEditClick = async () => {
    if (isEditing) {
      try {
        let result;
        console.log('editedCategory', editedCategory)
        console.log('category', category)
        if (editedCategory !== category) {
          result = await moveDreamToDifferentCategory(
            id,
            editedCategory,
            editedAssociations,
            editedTitle,
            editedContent,
            editedIsAnalyzed,
            editedDate
          );
        } else {
          result = await updateDreamMemories(
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
          category: result.category || editedCategory,
          associations: editedAssociations,
          title: editedTitle,
          content: editedContent,
          isAnalyzed: editedIsAnalyzed,
          date: editedDate,
        });

        setSelectedCategory(result.category || editedCategory);
        setIsEditing(false);
      } catch (error) {
        console.error('Ошибка при редактировании текущей записи:', error);
      }
    } else {
      setIsEditing(true);
    }
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

  const handleCategoryConfirm = async () => {
    setEditedCategory(tempCategory);
    setShowConfirmation(false);
  };

  const handleDeleteClick = async () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteRecordById(selectedCategory, id);
      window.location.reload();
    } catch (error) {
      console.error('Ошибка при удалении записи:', error);
    } finally {
      setShowDeleteConfirmation(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <li className={style['dream']}>
      <div className={style['dream-content']}>
        {isEditing ? (
          <>
            <img className={style['D_M']} src={D_M} alt='категории лого' />
            <h3>Это </h3>
            <div className={style['category-label__wrapper']}>
              <label className={style['category-label__dream']}>
                <p className={style['label-title']} >Сон</p>
                <input
                  type="radio"
                  value="сны"
                  checked={editedCategory === 'сны'}
                  onChange={handleCategoryChange}
                />
                <span>
                  <img
                    className={style['category-label__img']}
                    src={editedCategory === 'сны' ? Confirm : Cancel}
                    alt=''
                  />
                </span>
              </label>
              <p className={style['tiny-p']}>или</p>
              <label>
                <p className={style['label-title']} >Воспоминание</p>
                <input
                  type="radio"
                  value="воспоминания"
                  checked={editedCategory === 'воспоминания'}
                  onChange={handleCategoryChange}
                />
                <span>
                  <img
                    className={style['category-label__img']}
                    src={editedCategory === 'воспоминания' ? Confirm : Cancel}
                    alt=''
                  />
                </span>
              </label>
            </div>
            <label>
              <p className={style['label-title']} >Ассоциации :</p>
              <input
                type="text"
                value={editedAssociations}
                onChange={(e) => setEditedAssociations(e.target.value)}
                className={style['dream-content-associations']}
              />
            </label>
            <label>
              <p className={style['label-title']} >Название :</p>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className={style['dream-content-title']}
              />
            </label>
            <label>
              <p className={style['label-title']} >Содержание :</p>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className={style['dream-content-text']}
                rows={3}
              />
            </label>
            <label>
              <p className={style['label-title']} >Когда это было :</p>
              <input
                type="date"
                value={editedDate}
                onChange={(e) => setEditedDate(e.target.value)}
              />
            </label>
            <button className={style['dream-function__delete-btn']} 
              onClick={handleDeleteClick}
            >
              УДАЛИТЬ ЗАПИСЬ
            </button>
          </>
        ) : (
          <>
            <h3 className={style['dream-content-title']}>{title}</h3>
            <p className={style['dream-content-associations']}>{associations}</p>
            <p className={style['dream-content-text']}>{content}</p>
            <p className={style['dream-content-date']}>{date}</p>
          </>
        )}
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
          <p>Вы уверены, что хотите изменить категорию?<br />
            Это приведет к перезаписи в другую структуру!
          </p>
          <button onClick={handleCategoryConfirm}>Да</button>
          <button onClick={() => setShowConfirmation(false)}>Нет</button>
        </div>
      )}
      {showDeleteConfirmation && (
        <div className={style['confirmation-modal']}>
          <p>Вы уверены, что хотите удалить эту запись?</p>
          <button onClick={confirmDelete}>Да</button>
          <button onClick={cancelDelete}>Нет</button>
        </div>
      )}
    </li>
  );
};

export default Dream;
