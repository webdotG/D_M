import { create } from 'zustand';

const CATEGORY = ['сны', 'воспоминания'];
const LANGUAGES = ['RU', 'EN', 'BS'];
const THEMES = ['Светлая', 'Тёмная', 'Мордер'];

type CategoryState = {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
};

type LanguageState = {
  language: string;
  setLanguage: (language: string) => void;
};

type ThemeState = {
  theme: string;
  setTheme: (theme: string) => void;
};

type AuthState = {
  isAuthenticated: boolean;
  token: string;
  setAuthenticated: (auth: boolean, token?: string) => void;
};

// Категория по умолчанию загружается из localStorage, если она там есть
const getStoredCategory = () => {
  return localStorage.getItem('selectedCategory') || CATEGORY[0];
};

export const useCategoryStore = create<CategoryState>((set) => ({
  selectedCategory: getStoredCategory(),
  setSelectedCategory: (category: string) => {
    console.log(`Store selectedCategory : ${category}`);
    set({ selectedCategory: category });
    localStorage.setItem('selectedCategory', category); 
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
  setTheme: (theme: string) => {
    console.log(`Store theme :  ${theme} `);
    set({ theme });
  },
}));

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: JSON.parse(localStorage.getItem('isAuthenticated') || 'false'),
  token: localStorage.getItem('token') || '',
  setAuthenticated: (auth: boolean, token?: string) => {
    set({ isAuthenticated: auth });
    localStorage.setItem('isAuthenticated', JSON.stringify(auth));
    if (token) {
      set({ token });
      localStorage.setItem('token', token);
      console.log('Token set:', token);
    } else {
      set({ token: '' });
      localStorage.removeItem('token');
      console.log('Token removed');
    }
  },
}));

