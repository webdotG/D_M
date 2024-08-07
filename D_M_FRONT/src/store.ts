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

interface AuthState {
  isAuthenticated: boolean;
  token: string;
  user: {
    id: string | null;
    userName: string | null;
    email: string | null;
    dateOfBirth: string | null;
  };
  setAuthenticated: (auth: boolean, token?: string, user?: any) => void;
}

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
  user: {
    id: null,
    userName: null,
    email: null,
    dateOfBirth: null,
  },
  
 
  setAuthenticated: (auth: boolean, token?: string, user?: any) => {
    
    set((state) => {
      const newState = {
        isAuthenticated: auth,
        token: state.token,
        user: state.user,
      };

      // Логирование информации о пользователе
      console.log('Обновлен статус аутентификации:', auth);
      if (user) {
        console.log('Сохранён в стор пользователь :', user);
      }

      return newState;
    });

    localStorage.setItem('isAuthenticated', JSON.stringify(auth));
    if (token) {
      localStorage.setItem('token', token);
      console.log('В локалСторадж записан token');
    }
  },
}));

