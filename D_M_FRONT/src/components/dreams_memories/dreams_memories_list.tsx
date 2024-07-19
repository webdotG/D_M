import { useEffect, useState } from 'react';
import Dream from './dreams_memories';
import style from './dreams_memories_list.module.scss';
import Associations from '../Associations/Association';
import { loadDreams } from '../../API/dreams'; 

export interface DreamType {
  id: number;
  title: string;
  content: string;
  category: string; 
  associations: string[]; 
  isAnalyzed: boolean; 
  date: string; 
}

export default function DreamsList() {
  const [selectedCategory, setSelectedCategory] = useState<string>('сны'); 
  const [dreams, setDreams] = useState<DreamType[]>([]);

  // Функция для загрузки данных
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

  useEffect(() => {
    if (dreams.length > 0) {
      console.log('Список загружен ... >>> ... ');
    }
  }, [dreams]);

  return (
    <section className={style['dreams-memories']}>
      <h3 className={style['dreams-memories__title']}>{selectedCategory}</h3>
      <Associations />
      <h3 className={style['list-title']}>Список</h3>
      <ul className={style['dreams-memories__list']}>
        {dreams.map((dream) => (
          <Dream key={dream.id} {...dream} />
        ))}
      </ul>
    </section>
  );
}
