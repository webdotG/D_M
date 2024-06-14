import { create }  from 'zustand';

type CategoryState = {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
};

type LanguageState = {
  language: string;
  setLanguage: (language: string) => void;
};

type ThemeState = {
  theme: "Светлая" | "Тёмная" | "Мордер"; 
  setTheme: (theme: "Светлая" | "Тёмная" | "Мордер") => void;
};

const CATEGORY = ['сны', 'воспоминания'];
const LANGUAGES = ['Русский', 'English', 'Morder'];
const THEMES = ['Светлая', 'Тёмная', 'Мордер'];

export const useCategoryStore = create<CategoryState>((set) => ({
  selectedCategory: CATEGORY[0],
  setSelectedCategory: (category: string) => {
    console.log(`Store selectedCategory : ${category}`);
    set({ selectedCategory: category });
  },
}));

export const useLanguageStore = create<LanguageState>((set) => ({
  language: LANGUAGES[0],
  setLanguage: (language: string) => {
    console.log(`Store language : ${language}`);
    set({ language });
  },
}));

export const useThemeStore = create<ThemeState>((set) => ({
  theme: THEMES[1],
  setTheme: (theme: 'Светлая' | 'Тёмная' | 'Мордер') => {
    console.log(`Store theme :  ${theme} `);
    set({ theme });
  },
}));
