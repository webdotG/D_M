import React, { useState, useEffect } from 'react';
import style from './UpdateDream.module.scss';
import selfAnalys from '../../SVG/medecine.svg';
import LikeUnlikeIcon from '../../SVG/unlike.svg';
import { updateDreamMemories } from '../../API/updateDream';
import { moveDreamToDifferentCategory } from '../../API/moveDreamCategory';
import { deleteRecordById } from '../../API/deleteRecord';
import { useCategoryStore } from '../../store';
import { fetchAssociationsById } from '../../API/associationByID'; 
import {fetchAssociations} from '../../API/associationALL'
import {useTranslate} from '../../hooks/useTranslate'


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

  const [editedCategory, setEditedCategory] = useState(category);
  const [editedAssociations, setEditedAssociations] = useState(associations);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);
  const [editedIsAnalyzed, setEditedIsAnalyzed] = useState(isAnalyzed);
  const [editedDate, setEditedDate] = useState(date);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [tempCategory, setTempCategory] = useState(category);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  // const [associationsList, setAssociationsList] = useState<string[]>([]);
  // console.log('ASSOCIATION LIST >>>> ', associationsList)
  
  const selectedCategory = useCategoryStore((state) => state.selectedCategory);
  const setSelectedCategory = useCategoryStore((state) => state.setSelectedCategory);
  const { translateToLanguage: translate } = useTranslate(); 

  useEffect(() => {
 
    setEditedCategory(selectedCategory);

    const loadAssociations = async () => {
      try {
        console.log(`Fetching associations for category: ${category}, id: ${id}`);
        const fetchedAssociations = await fetchAssociationsById(category, id);
        console.log(`Fetched associations: ${fetchedAssociations}`);
        setEditedAssociations(fetchedAssociations);

        const fetchedAssociationsALL = await fetchAssociations(category);
        console.log(`Fetched associations: ${fetchedAssociationsALL}`);
        // setAssociationsList(fetchedAssociations);
        
      } catch (error) {
        // setAssociationsList([]);
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

      try {
        let result;
        // Проверка категории
        const editedCategoryName = editedCategory === 'dreams' ? 'сны' : editedCategory === 'memories' ? 'воспоминания' : editedCategory;
        const currentCategoryName = category === 'dreams' ? 'сны' : category === 'memories' ? 'воспоминания' : category;
  
        if (editedCategoryName !== currentCategoryName) {
          console.log("Запись в категорию ... ", editedCategory);
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
       
        window.location.reload();
      } catch (error) {
        console.error('Ошибка при редактировании текущей записи:', error);
      }
    
  };

  const handleAnalysisClick = () => {
    console.log("Analysis Clicked. Is Analyzed:", editedIsAnalyzed);
    setEditedIsAnalyzed(!editedIsAnalyzed);
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
    <>
      <div className={style['dream-content']}>
          <>
          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
	  viewBox="0 0 72 72" enableBackground="new 0 0 72 72" xmlSpace="preserve">
<g>
	<path d="M48.055,14.837c0.322,0,0.637-0.155,0.832-0.443c0.852-1.27,2.273-2.029,3.801-2.029c0.551,0,1-0.447,1-1
		c0-0.553-0.449-1-1-1c-2.195,0-4.237,1.09-5.463,2.914c-0.308,0.459-0.185,1.08,0.273,1.388
		C47.669,14.782,47.863,14.837,48.055,14.837z"/>
	<path d="M12.548,32.147c-0.544-0.102-1.066,0.252-1.17,0.794c-0.071,0.369-0.07,0.53-0.062,0.76l0.005,0.237c0,0.553,0.447,1,1,1
		c0.552,0,1-0.447,1.001-1c0-0.132-0.003-0.227-0.006-0.305c-0.005-0.14-0.005-0.148,0.026-0.315
		C13.446,32.775,13.091,32.251,12.548,32.147z"/>
	<path d="M18.686,26.571c-2.46,0-4.748,1.222-6.12,3.268c-0.308,0.458-0.185,1.08,0.273,1.388c0.172,0.114,0.366,0.169,0.557,0.169
		c0.323,0,0.639-0.155,0.831-0.444c1-1.49,2.667-2.381,4.459-2.381c0.552,0,1-0.447,1-1C19.686,27.018,19.238,26.571,18.686,26.571z
		"/>
	<path d="M51.688,36.271c-5.841,0-10.935,3.217-13.629,7.967l-7.105-3.484c1.127-2.021,1.776-4.343,1.776-6.816
		c0-1.568-0.27-3.072-0.746-4.481l10.917-4.696c2.3,2.872,5.829,4.718,9.786,4.718c6.916,0,12.541-5.625,12.543-12.541
		c0-6.916-5.627-12.542-12.543-12.542s-12.541,5.626-12.541,12.542c0,1.519,0.285,2.97,0.782,4.318l-10.757,4.626
		c-2.543-3.614-6.739-5.987-11.485-5.987c-7.742,0-14.041,6.299-14.041,14.042c0,7.742,6.299,14.041,14.041,14.041
		c3.802,0,7.251-1.524,9.782-3.987l8.084,3.964c-0.336,1.274-0.533,2.604-0.533,3.982c0,8.64,7.027,15.666,15.667,15.666
		c8.638,0,15.668-7.026,15.668-15.666C67.355,43.299,60.326,36.271,51.688,36.271z M52.688,8.396c4.709,0,8.543,3.832,8.543,8.542
		s-3.834,8.541-8.543,8.541c-4.711,0-8.541-3.831-8.541-8.541S47.977,8.396,52.688,8.396z M18.687,43.979
		c-5.537,0-10.041-4.504-10.041-10.041c0-5.537,4.504-10.042,10.041-10.042s10.042,4.505,10.043,10.042
		C28.73,39.475,24.224,43.979,18.687,43.979z M51.688,63.604c-6.434,0-11.666-5.231-11.666-11.666
		c0-6.434,5.232-11.666,11.666-11.666c6.433,0,11.668,5.232,11.668,11.666C63.355,58.372,58.121,63.604,51.688,63.604z"/>
	<path d="M50.688,42.713c-2.75,0-5.304,1.365-6.834,3.648c-0.308,0.459-0.185,1.08,0.274,1.389c0.171,0.113,0.365,0.168,0.556,0.168
		c0.322,0,0.639-0.154,0.832-0.443c1.157-1.729,3.092-2.762,5.172-2.762c0.551,0,1-0.447,1-1S51.238,42.713,50.688,42.713z"/>
</g>
</svg>
            <h3>{translate('Это')}</h3>
            <div className={style['category-label__wrapper']}>
              <label className={style['category-label__dream']}>
                <p className={style['label-title']} >
                {translate('Сон')} 
                  </p>
                <input
                  type="radio"
                  value="сны"
                  checked={editedCategory === 'сны'}
                  onChange={handleCategoryChange}
                />
                <span>
                  {editedCategory === 'сны'
                  ? 
                  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
                     viewBox="0 0 72 72" enableBackground="new 0 0 72 72" xmlSpace="preserve">
                  <g>
                    <path d="M24.014,70.462c-2.617,0-5.073-1.016-6.917-2.859L2.175,53.877c-1.908-1.906-2.926-4.364-2.926-6.979
                      s1.018-5.072,2.866-6.92c1.849-1.849,4.307-2.866,6.921-2.866c2.591,0,5.029,1,6.872,2.818l8.102,7.109L55.861,4.618
                      c0.057-0.075,0.119-0.146,0.186-0.213c1.849-1.85,4.307-2.867,6.921-2.867s5.072,1.018,6.921,2.867
                      c3.784,3.784,3.815,9.923,0.093,13.747L31.697,67.416c-0.051,0.065-0.106,0.128-0.165,0.188c-1.914,1.912-4.498,2.926-7.214,2.854
                      C24.216,70.46,24.116,70.462,24.014,70.462z M9.037,41.112c-1.546,0-2.999,0.602-4.093,1.695C3.851,43.9,3.25,45.353,3.25,46.898
                      s0.602,3,1.694,4.093l14.922,13.726c1.148,1.146,2.6,1.914,4.148,1.914l0.227,0.164c0.05,0,0.1,0,0.151,0l0.221-0.164
                      c1.51,0,2.929-0.654,4.008-1.69l38.275-49.294c0.051-0.065,0.105-0.148,0.165-0.207c2.256-2.258,2.256-5.939,0-8.195
                      c-1.094-1.094-2.547-1.701-4.093-1.701c-1.502,0-2.917,0.566-3.999,1.602L25.914,51.169c-0.335,0.445-0.84,0.73-1.394,0.787
                      c-0.551,0.057-1.106-0.118-1.525-0.486l-9.771-8.573c-0.032-0.028-0.064-0.058-0.095-0.089
                      C12.036,41.714,10.583,41.112,9.037,41.112z"/>
                  </g>
                  </svg>
                  : 
                  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
                    viewBox="0 0 72 72" enableBackground="new 0 0 72 72" xmlSpace="preserve">
                  <g>
                    <path d="M53.678,61.824c-2.27,0-4.404-0.885-6.01-2.49L36,47.667L24.332,59.334c-1.604,1.605-3.739,2.49-6.01,2.49
                      s-4.404-0.885-6.01-2.49c-1.605-1.604-2.49-3.739-2.49-6.01c0-2.271,0.885-4.405,2.491-6.011l11.666-11.667l-10.96-10.961
                      c-1.605-1.604-2.49-3.739-2.49-6.01s0.885-4.405,2.49-6.01c1.605-1.605,3.739-2.49,6.011-2.49c2.271,0,4.405,0.885,6.01,2.49
                      L36,23.626l10.96-10.96c1.605-1.605,3.738-2.49,6.01-2.49s4.406,0.885,6.01,2.49c1.605,1.604,2.49,3.739,2.49,6.01
                      s-0.885,4.405-2.49,6.01L48.021,35.646l11.666,11.668c1.605,1.604,2.49,3.738,2.49,6.01c0,2.271-0.885,4.405-2.49,6.01
                      C58.084,60.939,55.949,61.824,53.678,61.824z M36,42.839c0.511,0,1.023,0.195,1.414,0.586l13.082,13.081
                      c0.852,0.851,1.98,1.318,3.182,1.318c1.203,0,2.332-0.468,3.182-1.318c0.852-0.851,1.318-1.98,1.318-3.182
                      c0-1.202-0.467-2.332-1.318-3.181l-13.08-13.083c-0.781-0.781-0.781-2.047,0-2.828l12.373-12.375
                      c0.852-0.851,1.318-1.979,1.318-3.182s-0.467-2.331-1.318-3.182c-0.85-0.851-1.98-1.318-3.182-1.318s-2.332,0.468-3.18,1.318
                      L37.414,27.868c-0.781,0.781-2.046,0.781-2.828,0L22.21,15.494c-0.85-0.851-1.979-1.318-3.181-1.318
                      c-1.202,0-2.332,0.468-3.182,1.318c-0.851,0.851-1.319,1.979-1.319,3.182s0.469,2.331,1.318,3.182l12.374,12.375
                      c0.781,0.781,0.781,2.047,0,2.828L15.14,50.143c-0.85,0.85-1.318,1.979-1.318,3.182c0,1.201,0.469,2.331,1.318,3.182
                      c0.851,0.851,1.98,1.318,3.182,1.318c1.202,0,2.332-0.468,3.182-1.318l13.083-13.081C34.977,43.034,35.489,42.839,36,42.839z"/>
                  </g>
                  </svg>
                  }
               </span>
              </label>
              <p className={style['tiny-p']}>
              {translate('или')}
                </p>
              <label>
                <p className={style['label-title']} >
                {translate('Воспоминание')}
                  </p>
                <input
                  type="radio"
                  value="воспоминания"
                  checked={editedCategory === 'воспоминания'}
                  onChange={handleCategoryChange}
                />
                <span>
                {editedCategory === 'воспоминания'
                  ? 
                  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
                     viewBox="0 0 72 72" enableBackground="new 0 0 72 72" xmlSpace="preserve">
                  <g>
                    <path d="M24.014,70.462c-2.617,0-5.073-1.016-6.917-2.859L2.175,53.877c-1.908-1.906-2.926-4.364-2.926-6.979
                      s1.018-5.072,2.866-6.92c1.849-1.849,4.307-2.866,6.921-2.866c2.591,0,5.029,1,6.872,2.818l8.102,7.109L55.861,4.618
                      c0.057-0.075,0.119-0.146,0.186-0.213c1.849-1.85,4.307-2.867,6.921-2.867s5.072,1.018,6.921,2.867
                      c3.784,3.784,3.815,9.923,0.093,13.747L31.697,67.416c-0.051,0.065-0.106,0.128-0.165,0.188c-1.914,1.912-4.498,2.926-7.214,2.854
                      C24.216,70.46,24.116,70.462,24.014,70.462z M9.037,41.112c-1.546,0-2.999,0.602-4.093,1.695C3.851,43.9,3.25,45.353,3.25,46.898
                      s0.602,3,1.694,4.093l14.922,13.726c1.148,1.146,2.6,1.914,4.148,1.914l0.227,0.164c0.05,0,0.1,0,0.151,0l0.221-0.164
                      c1.51,0,2.929-0.654,4.008-1.69l38.275-49.294c0.051-0.065,0.105-0.148,0.165-0.207c2.256-2.258,2.256-5.939,0-8.195
                      c-1.094-1.094-2.547-1.701-4.093-1.701c-1.502,0-2.917,0.566-3.999,1.602L25.914,51.169c-0.335,0.445-0.84,0.73-1.394,0.787
                      c-0.551,0.057-1.106-0.118-1.525-0.486l-9.771-8.573c-0.032-0.028-0.064-0.058-0.095-0.089
                      C12.036,41.714,10.583,41.112,9.037,41.112z"/>
                  </g>
                  </svg>
                  : 
                  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
                    viewBox="0 0 72 72" enableBackground="new 0 0 72 72" xmlSpace="preserve">
                  <g>
                    <path d="M53.678,61.824c-2.27,0-4.404-0.885-6.01-2.49L36,47.667L24.332,59.334c-1.604,1.605-3.739,2.49-6.01,2.49
                      s-4.404-0.885-6.01-2.49c-1.605-1.604-2.49-3.739-2.49-6.01c0-2.271,0.885-4.405,2.491-6.011l11.666-11.667l-10.96-10.961
                      c-1.605-1.604-2.49-3.739-2.49-6.01s0.885-4.405,2.49-6.01c1.605-1.605,3.739-2.49,6.011-2.49c2.271,0,4.405,0.885,6.01,2.49
                      L36,23.626l10.96-10.96c1.605-1.605,3.738-2.49,6.01-2.49s4.406,0.885,6.01,2.49c1.605,1.604,2.49,3.739,2.49,6.01
                      s-0.885,4.405-2.49,6.01L48.021,35.646l11.666,11.668c1.605,1.604,2.49,3.738,2.49,6.01c0,2.271-0.885,4.405-2.49,6.01
                      C58.084,60.939,55.949,61.824,53.678,61.824z M36,42.839c0.511,0,1.023,0.195,1.414,0.586l13.082,13.081
                      c0.852,0.851,1.98,1.318,3.182,1.318c1.203,0,2.332-0.468,3.182-1.318c0.852-0.851,1.318-1.98,1.318-3.182
                      c0-1.202-0.467-2.332-1.318-3.181l-13.08-13.083c-0.781-0.781-0.781-2.047,0-2.828l12.373-12.375
                      c0.852-0.851,1.318-1.979,1.318-3.182s-0.467-2.331-1.318-3.182c-0.85-0.851-1.98-1.318-3.182-1.318s-2.332,0.468-3.18,1.318
                      L37.414,27.868c-0.781,0.781-2.046,0.781-2.828,0L22.21,15.494c-0.85-0.851-1.979-1.318-3.181-1.318
                      c-1.202,0-2.332,0.468-3.182,1.318c-0.851,0.851-1.319,1.979-1.319,3.182s0.469,2.331,1.318,3.182l12.374,12.375
                      c0.781,0.781,0.781,2.047,0,2.828L15.14,50.143c-0.85,0.85-1.318,1.979-1.318,3.182c0,1.201,0.469,2.331,1.318,3.182
                      c0.851,0.851,1.98,1.318,3.182,1.318c1.202,0,2.332-0.468,3.182-1.318l13.083-13.081C34.977,43.034,35.489,42.839,36,42.839z"/>
                  </g>
                  </svg>
                  }
                </span>
              </label>
            </div>
            <label>
              <p className={style['label-title']} >
              {translate('Ассоциации')}
              </p>
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
              <p className={style['label-title']} >
              {translate('Заголовок')}
              </p>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className={style['dream-content-title']}
              />
            </label>
            <label>
              <p className={style['label-title']} >
              {translate('Текст')}
              </p>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className={style['dream-content-text']}
                rows={3}
              />
            </label>
            <label>
              <p className={style['label-title']} >
                {translate('Дата')}
              </p>
              <input
                type="date"
                value={editedDate}
                onChange={(e) => setEditedDate(e.target.value)}
              />
            </label>

            <div className={style['dream-function__edit-btn']}>
              АНАЛ
            <button  
              onClick={handleAnalysisClick}>
          {editedIsAnalyzed ? 
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
                viewBox="0 0 72 72" enableBackground="new 0 0 72 72" xmlSpace="preserve">
            <g>
              <g>
                <path d="M18.787,69.824c-3.299,0-6.398-1.283-8.729-3.615l-4.268-4.266c-2.332-2.332-3.615-5.432-3.615-8.729
                  c0-3.299,1.283-6.398,3.615-8.729L44.486,5.791c2.332-2.331,5.432-3.615,8.729-3.615s6.396,1.284,8.729,3.615l4.266,4.268
                  c2.332,2.331,3.615,5.431,3.615,8.728s-1.283,6.396-3.615,8.728L27.514,66.209C25.184,68.541,22.084,69.824,18.787,69.824z
                   M53.215,6.175c-2.229,0-4.324,0.868-5.9,2.443L8.619,47.314c-1.576,1.576-2.443,3.67-2.443,5.9c0,2.229,0.867,4.324,2.443,5.9
                  l4.268,4.266c1.576,1.576,3.67,2.443,5.9,2.443c2.229,0,4.322-0.867,5.898-2.443l38.695-38.696
                  c1.576-1.576,2.443-3.671,2.443-5.899s-0.867-4.323-2.443-5.899l-4.266-4.268C57.539,7.043,55.443,6.175,53.215,6.175z"/>
              </g>
              <g>
                <path d="M49.971,34.679c-0.258,0-0.516-0.099-0.711-0.297L38.51,23.507c-0.389-0.393-0.385-1.026,0.008-1.414
                  c0.395-0.39,1.027-0.386,1.414,0.008l10.75,10.875c0.389,0.393,0.385,1.026-0.008,1.414
                  C50.479,34.583,50.225,34.679,49.971,34.679z"/>
              </g>
              <g>
                <path d="M32.971,51.68c-0.258,0-0.516-0.1-0.711-0.297L21.51,40.508c-0.389-0.393-0.385-1.027,0.008-1.414
                  c0.395-0.391,1.027-0.387,1.414,0.008l10.75,10.875c0.389,0.393,0.385,1.025-0.008,1.414C33.479,51.584,33.225,51.68,32.971,51.68
                  z"/>
              </g>
              <circle cx="35.783" cy="43.617" r="1.313"/>
              <circle cx="42.783" cy="35.617" r="1.313"/>
              <circle cx="28.783" cy="36.617" r="1.313"/>
              <circle cx="35.783" cy="28.617" r="1.313"/>
            </g>
            </svg>
           : 
           <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
           viewBox="0 0 72 72" enableBackground="new 0 0 72 72" xmlSpace="preserve">
        <g>
          <path d="M24.014,70.462c-2.617,0-5.073-1.016-6.917-2.859L2.175,53.877c-1.908-1.906-2.926-4.364-2.926-6.979
            s1.018-5.072,2.866-6.92c1.849-1.849,4.307-2.866,6.921-2.866c2.591,0,5.029,1,6.872,2.818l8.102,7.109L55.861,4.618
            c0.057-0.075,0.119-0.146,0.186-0.213c1.849-1.85,4.307-2.867,6.921-2.867s5.072,1.018,6.921,2.867
            c3.784,3.784,3.815,9.923,0.093,13.747L31.697,67.416c-0.051,0.065-0.106,0.128-0.165,0.188c-1.914,1.912-4.498,2.926-7.214,2.854
            C24.216,70.46,24.116,70.462,24.014,70.462z M9.037,41.112c-1.546,0-2.999,0.602-4.093,1.695C3.851,43.9,3.25,45.353,3.25,46.898
            s0.602,3,1.694,4.093l14.922,13.726c1.148,1.146,2.6,1.914,4.148,1.914l0.227,0.164c0.05,0,0.1,0,0.151,0l0.221-0.164
            c1.51,0,2.929-0.654,4.008-1.69l38.275-49.294c0.051-0.065,0.105-0.148,0.165-0.207c2.256-2.258,2.256-5.939,0-8.195
            c-1.094-1.094-2.547-1.701-4.093-1.701c-1.502,0-2.917,0.566-3.999,1.602L25.914,51.169c-0.335,0.445-0.84,0.73-1.394,0.787
            c-0.551,0.057-1.106-0.118-1.525-0.486l-9.771-8.573c-0.032-0.028-0.064-0.058-0.095-0.089
            C12.036,41.714,10.583,41.112,9.037,41.112z"/>
        </g>
        </svg>
          }
        </button>
        </div>

            <button className={style['dream-function__delete-btn']} 
              onClick={handleDeleteClick}
            >
              {translate('удалить')}
            </button>
          </>
      </div>

      <div className={style['dream-function']}>
      <button type="button" className={style['cancel-button']} 
        onClick={onClose}>
          {translate('Отменить')}
        </button>
        <button className={style['dream-function__edit-btn']} 
        onClick={handleEditClick}>
          {translate('Сохранить')}
        </button>
        </div>
      
      {showConfirmation && (
        <div className={style['confirmation-modal']}>
          <p>
          {translate('Вы уверены, что хотите изменить категорию ?')}
          </p>
          <button onClick={handleCategoryConfirm}>
          {translate('Да')}
            </button>
          <button onClick={() => setShowConfirmation(false)}>
          {translate('Нет')}
            </button>
        </div>
      )}
      {showDeleteConfirmation && (
        <div className={style['confirmation-modal']}>
          <p>
          {translate('Вы уверены, что хотите удалить эту запись ?')}
          </p>
          <button onClick={confirmDelete}>
          {translate('Да')}
          </button>
          <button onClick={cancelDelete}>
            {translate('Нет')}
          </button>
        </div>
      )}
      
 </>
  );
};

export default UpdateDream;
