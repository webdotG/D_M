import Dream from './dreams_memories';
import style from './dreams_memories_list.module.scss';
import { useCategoryStore, useDreamStore } from '../../store';
import { useEffect } from 'react';
import Associations from '../Associations/Association';

export default function DreamsList() {
  const selectedCategory = useCategoryStore((state) => state.selectedCategory);
  
  const { dreams, loadDreams } = useDreamStore((state) => ({
    dreams: state.dreams,
    loadDreams: state.loadDreams,
  }));

  useEffect(() => {
    loadDreams(selectedCategory);
  }, [selectedCategory, loadDreams]);

  useEffect(() => {
    console.log('Dreams List ... >>> ... :', dreams);
  }, [dreams]);

  return (
    <section key={selectedCategory} className={style['dreams-memories']}>
      <h3 className={style['dreams-memories__title']}>{selectedCategory}</h3>
      <Associations />
      <ul className={style['dreams-memories__list']}>
        {dreams.map((dream) => (
          <Dream key={dream.id} {...dream} />
        ))}
      </ul>
    </section>
  );
}
