import style from './dreams_memories.module.scss';
import { useState } from 'react';
import { useDreamStore } from '../../store';
import selfAnalys from '../../SVG/medecine.svg'
import LikeUnlikeIcon from '../../SVG/unlike.svg'; 

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

  const updateDream = useDreamStore((state) => state.updateDream);

  const handleEditClick = () => {
    if (isEditing) {
      updateDream({
        id,
        category: editedCategory,
        associations: editedAssociations,
        title: editedTitle,
        content: editedContent,
        isAnalyzed: editedIsAnalyzed,
        date: editedDate,
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
            <label>
              <p>Категория:</p>
              <input
                type="text"
                value={editedCategory}
                onChange={(e) => setEditedCategory(e.target.value)}
                className={style['dream-content-title']}
              />
            </label>
            <label>
              <p>Ассоциации:</p>
              <input
                type="text"
                value={editedAssociations}
                onChange={(e) => setEditedAssociations(e.target.value)}
                className={style['dream-content-associations']}
              />
            </label>
            <label>
              <p>Название:</p>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className={style['dream-content-title']}
              />
            </label>
            <label>
              <p>Содержание:</p>
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
                Дата:
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
    </li>
  );
};

export default Dream;
