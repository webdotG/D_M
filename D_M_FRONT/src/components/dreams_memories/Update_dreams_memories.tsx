import React, { useState, useEffect } from 'react';
import style from './UpdateDream.module.scss';
import selfAnalys from '../../SVG/medecine.svg';
import LikeUnlikeIcon from '../../SVG/unlike.svg';
import { updateDreamMemories } from '../../API/updateDream';
import { moveDreamToDifferentCategory } from '../../API/moveDreamCategory';
import D_M from '../../SVG/d_m.svg';
import Confirm from '../../SVG/confirm.svg';
import Cancel from '../../SVG/delete.svg';
import { deleteRecordById } from '../../API/deleteRecord';
import { useCategoryStore } from '../../store';
import { fetchAssociationsById } from '../../API/associationByID'; 

type UpadteDreamProps = {
  id: number;
  category: string;
  associations: string;
  title: string;
  content: string;
  isAnalyzed: boolean;
  date: string;
  onClose: () => void;
};

const UpdateDream = ({
  id,
  category,
  associations,
  title,
  content,
  isAnalyzed,
  date,
  onClose
}: UpadteDreamProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCategory, setEditedCategory] = useState(category);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);
  const [editedIsAnalyzed, setEditedIsAnalyzed] = useState(isAnalyzed);
  const [editedDate, setEditedDate] = useState(date);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [tempCategory, setTempCategory] = useState(category);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [editedAssociations, setEditedAssociations] = useState(associations);

  const selectedCategory = useCategoryStore((state) => state.selectedCategory);
  const setSelectedCategory = useCategoryStore((state) => state.setSelectedCategory);

  useEffect(() => {
 
    setEditedCategory(selectedCategory);

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

  const handleEditClick = async () => {
    console.log("Входящие данные на редактирование : ", {
      editedCategory,
      editedAssociations,
      editedTitle,
      editedContent,
      editedIsAnalyzed,
      editedDate,
    });

    if (isEditing) {
      try {
        let result;
        // Проверка категории
        const editedCategoryName = editedCategory === 'dreams' ? 'сны' : editedCategory === 'memories' ? 'воспоминания' : editedCategory;
        const currentCategoryName = category === 'dreams' ? 'сны' : category === 'memories' ? 'воспоминания' : category;
  
        if (editedCategoryName !== currentCategoryName) {
          console.log("Запись в категорию ... ", editedAssociations);
          console.log("Удаление из категории ... ", currentCategoryName);
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
          console.log("Обновление ... ");
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

        console.log("Update Result:", result);
        setSelectedCategory(result.category || editedCategory);
        setIsEditing(false);
        onClose()
      } catch (error) {
        console.error('Ошибка при редактировании текущей записи:', error);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleAnalysisClick = () => {
    console.log("Analysis Clicked. Is Analyzed:", editedIsAnalyzed);
    if (isEditing) {
      setEditedIsAnalyzed(!editedIsAnalyzed);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCategory = e.target.value;
    console.log("Категория изменена на : ", newCategory);
    if (newCategory !== editedCategory) {
      setTempCategory(newCategory);
      setShowConfirmation(true);
    }
  };

  const handleCategoryConfirm = async () => {
    console.log("Category Change Confirmed. New Category:", tempCategory);
    setEditedCategory(tempCategory);
    setShowConfirmation(false);
  };

  const handleDeleteClick = async () => {
    // console.log("Delete Clicked");
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    // console.log("Delete Confirmed");
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
    // console.log("Delete Canceled");
    setShowDeleteConfirmation(false);
  };

  return (
    <li className={style['dream']}>
      <div className={style['dream-content']}>
       
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
                onChange={(e) => {
                //   console.log("Associations Changed to:", e.target.value);
                  setEditedAssociations(e.target.value)
                }}
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
              удалить
            </button>
          </>
        
      </div>
      <div className={style['dream-function']}>
        <button className={style['dream-function__edit-btn']} onClick={handleEditClick}>
          Сохранить
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
      <button type="button" className={style['cancel-button']} onClick={onClose}>Отменить</button>
    </li>
  );
};

export default UpdateDream;
