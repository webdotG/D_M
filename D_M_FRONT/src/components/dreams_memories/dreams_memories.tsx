import style from './dreams_memories.module.scss'
import { useState } from 'react';
import { useDreamStore } from '../../store';

type DreamProps = {
  id: number;
  date: string;
  content: string;
  category: string;
  isAnalyzed: boolean;
};

export default function Dream({ id, date, content, category, isAnalyzed }: DreamProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDate, setEditedDate] = useState(date);
  const [editedContent, setEditedContent] = useState(content);
  const [editedCategory, setEditedCategory] = useState(category);
  const [editedIsAnalyzed, setEditedIsAnalyzed] = useState(isAnalyzed);

  const updateDream = useDreamStore((state) => state.updateDream);

  const handleEditClick = () => {
    if (isEditing) {
      // Сохранить изменения
      updateDream({
        id,
        date: editedDate,
        content: editedContent,
        category: editedCategory,
        isAnalyzed: editedIsAnalyzed,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleAnalysisClick = () => {
    if (isEditing) {
      setEditedIsAnalyzed(!editedIsAnalyzed);
    }
  };

  return (
    <li className={style['dream']}>
      <div className={style['dream-content']}>
        {isEditing ? (
          <>
            <input
              type="text"
              value={editedCategory}
              onChange={(e) => setEditedCategory(e.target.value)}
              className={style['dream-content-title']}
            />
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className={style['dream-content-text']}
            />
          </>
        ) : (
          <>
            <h3 className={style['dream-content-title']}>{editedCategory}</h3>
            <p className={style['dream-content-text']}>{editedContent}</p>
          </>
        )}
        <div className={style['dream-content-info']}>
          <div className={style['dream-date']}>
            {isEditing ? (
              <input
                type="text"
                value={editedDate}
                onChange={(e) => setEditedDate(e.target.value)}
              />
            ) : (
              <p>{editedDate}</p>
            )}
          </div>
          <div className={style['dream-category']}>
            <p>{category}</p>
          </div>
        </div>
      </div>
      <div className={style['dream-function']}>
        <button className={style['dream-function__edit-btn']} onClick={handleEditClick}>
          {isEditing ? 'Сохранить' : 'Редактировать'}
        </button>
        <button className={style['dream-function__edit-btn']} onClick={handleAnalysisClick}>
          {editedIsAnalyzed ? (
            <img src='' alt='картинка что анализировано' width='12px' height='12px' />
          ) : (
            <img src='' alt='картинка что НЕ анализировано' />
          )}
          {editedIsAnalyzed ? <p>сделано</p> : <p>анализировать</p>}
        </button>
      </div>
    </li>
  );
}