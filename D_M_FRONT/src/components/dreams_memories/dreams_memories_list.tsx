import { useEffect, useState } from 'react';
import Dream from './dreams_memories';
import style from './dreams_memories_list.module.scss';
import Associations from '../Associations/Association';
import { loadDreams } from '../../API/dreams';
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
  const { translateToLanguage } = useTranslate();
  const selectedCategory = useCategoryStore((state) => state.selectedCategory); 
  const [dreams, setDreams] = useState<DreamType[]>([]);


  const fetchDreams = async (category: string) => {
    try {
      const data = await loadDreams(category); 
      setDreams(data); 
    } catch (error) {
      console.error('Failed to load dreams:', error); 
    }
  };

 
  useEffect(() => {
    fetchDreams(selectedCategory); 
  }, [selectedCategory]);


  return (
    <section className={style['dreams-memories']}>
      <Associations />
      {/* <h3 className={style['dreams-memories__title']}></h3> */}
      <h3 className={style['list-title']}>
      {translateToLanguage('Список всех')}
      { selectedCategory === "сны" 
      ? (
         <p>{translateToLanguage('снов')}</p>
      ) : (
        <p> {translateToLanguage('воспоминаний')}</p>
      )
      }
      </h3>
      <ul className={style['dreams-memories__list']}>
        {dreams.map((dream) => (
          <Dream key={dream.id} {...dream} /> 
        ))}
      </ul>
    </section>
  );
}
