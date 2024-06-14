import { create } from 'zustand';

export const CATEGORY: string[] = ['сны', 'воспоминания'];

type CategoryState = {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
};

const useCategoryStore = create<CategoryState>((set, get) => ({
  selectedCategory: CATEGORY[0],
  setSelectedCategory: (category: string) => {
    set({ selectedCategory: category });
    const currentState = get();
    console.log('STORE currentState : ', currentState);
  },
}));

export default useCategoryStore;
