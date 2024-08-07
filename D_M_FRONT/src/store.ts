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
  user: {
    id: number | null;
    userName: string | null;
    email: string | null;
    dateOfBirth: string | null;
  };
  setAuthenticated: (auth: boolean, token?: string, user?: any) => void;
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
  user: JSON.parse(localStorage.getItem('user') || '{}'),
  setAuthenticated: (auth: boolean, token?: string, user?: any) => {
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
    if (user) {
      set({ user });
      localStorage.setItem('user', JSON.stringify(user));
      console.log('User set:', user);
    } else {
      set({ user: { id: null, userName: null, email: null, dateOfBirth: null } });
      localStorage.removeItem('user');
      console.log('User removed');
    }
  },
}));
