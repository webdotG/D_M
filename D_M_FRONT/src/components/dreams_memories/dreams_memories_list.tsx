import { useEffect, useState } from 'react';
import Dream from './dreams_memories';
import style from './dreams_memories_list.module.scss';
import Associations from '../Associations/Association';
import { loadDreams } from '../../API/dreams'; 
import { searchDreamsByAssociation } from '../../API/serachDreamByAssociation'; 
import { useCategoryStore } from '../../store'; 
import { useTranslate } from '../../hooks/useTranslate';

export interface DreamType {
  id: number;
  title: string;
  content: string;
  category: string; 
  associations: string; 
  isAnalyzed: boolean; 
  date: string; 
}

export default function DreamsList() {
  const [dreams, setDreams] = useState<DreamType[]>([]);
  const [filteredByAssociation, setFilteredByAssociation] = useState<boolean>(false);
  const [currentAssociation, setCurrentAssociation] = useState<string>('');

  const { translateToLanguage } = useTranslate();
  const selectedCategory = useCategoryStore((state) => state.selectedCategory); 

  const fetchDreams = async (category: string) => {
    try {
      const data = await loadDreams(category); 
      setDreams(data); 
      setFilteredByAssociation(false);
      setCurrentAssociation('');
    } catch (error) {
      console.error('Failed to load dreams:', error); 
    }
  };

  const fetchDreamsByAssociation = async (category: string, association: string) => {
    try {
      const data = await searchDreamsByAssociation(category, association); 
      setDreams(data);
      setFilteredByAssociation(true);
      setCurrentAssociation(association);
    } catch (error) {
      console.error('Failed to load dreams by association:', error); 
    }
  };

  const filterDreamsByAssociation = (association: string) => {
    if (association === '') {
      fetchDreams(selectedCategory); 
    } else {
      fetchDreamsByAssociation(selectedCategory, association);
    }
  };

  useEffect(() => {
    fetchDreams(selectedCategory); 
  }, [selectedCategory]);

  return (
    <section className={style['dreams-memories']}>
      <Associations onAssociationClick={filterDreamsByAssociation} />

      <h3 className={style['list-title']}>
        {filteredByAssociation
          ? `${translateToLanguage('Все записи связанные с ассоциацией : ')} "${currentAssociation}"`
          : `${translateToLanguage('Список всех')} ${selectedCategory === "сны" ? translateToLanguage('снов') : translateToLanguage('воспоминаний')}`
        }
      </h3>

      <ul className={style['dreams-memories__list']}>
        {dreams.map((dream) => (
          <Dream key={dream.id} {...dream} /> 
        ))}
      </ul>

      {filteredByAssociation && (
        <button className={style['back-button']} onClick={() => fetchDreams(selectedCategory)}>
          {translateToLanguage('Вернуться ко всем записям')}
        </button>
      )}
    </section>
  );
}
