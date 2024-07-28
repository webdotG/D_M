import { create } from 'zustand';

const CATEGORY = ['сны', 'воспоминания'];
const LANGUAGES = ['РУ', 'EN', 'BS'];
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

// Функции для получения значений из localStorage
const getStoredCategory = () => {
  return localStorage.getItem('selectedCategory') || CATEGORY[0];
};

const getStoredLanguage = () => {
  return localStorage.getItem('language') || LANGUAGES[0];
};

const getStoredTheme = () => {
  return localStorage.getItem('theme') || THEMES[0];
};

export const useCategoryStore = create<CategoryState>((set) => ({
  selectedCategory: getStoredCategory(),
  setSelectedCategory: (category: string) => {
    console.log(`Выбранная категория : ${category}`);
    set({ selectedCategory: category });
    localStorage.setItem('selectedCategory', category);
  },
}));

export const useLanguageStore = create<LanguageState>((set) => ({
  language: getStoredLanguage(),
  setLanguage: (language: string) => {
    console.log(`Выбранный язык : ${language}`);
    set({ language });
    localStorage.setItem('language', language);
  },
}));

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getStoredTheme(),
  setTheme: (theme: string) => {
    console.log(`Выбранная тема : ${theme}`);
    set({ theme });
    localStorage.setItem('theme', theme);
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
