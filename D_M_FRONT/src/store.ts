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
  setAuthenticated: (auth: boolean) => void;
};

type Dream = {
  id: number;
  date: string;
  content: string;
  category: string;
  isAnalyzed: boolean;
};

type DreamState = {
  dreams: Dream[];
  loadDreams: (category: string) => void;
  updateDream: (updatedDream: Dream) => void;
  addDream: (newDream: Omit<Dream, 'id'>) => void;
};

type AssociationsState = {
  associations: string[];
  loadAssociations: () => void;
};

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
  setTheme: (theme: string) => {
    console.log(`Store theme :  ${theme} `);
    set({ theme });
  },
}));

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false, 
  setAuthenticated: (auth: boolean) => {
    set({ isAuthenticated: auth });
    localStorage.setItem('isAuthenticated', JSON.stringify(auth)); 
  },
}));

export const useDreamStore = create<DreamState>((set) => ({
  dreams: [],
  addDream: async (newDream) => {
    try {
      const response = await fetch('/api/dreams/add_d-m', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDream),
      });
      if (!response.ok) {
        throw new Error(`Error adding dream: ${response.statusText}`);
      }
      const addedDreamFromDB = await response.json();
      set((state) => ({
        dreams: [...state.dreams, addedDreamFromDB],
      }));
      console.log('Dream added successfully:', addedDreamFromDB);
    } catch (error) {
      console.error('Failed to add dream:', error);
      throw error;
    }
  },
  loadDreams: async (category: string) => {
    try {
      const response = await fetch(`/api/dreams/all?category=${category}`);
      if (!response.ok) {
        throw new Error(`Error loading dreams: ${response.statusText}`);
      }
      const dreams = await response.json();
      set({ dreams });
      console.log('Dreams loaded successfully:', dreams);
    } catch (error) {
      console.error('Failed to load dreams:', error);
      throw error;
    }
  },
  updateDream: async (updatedDream: Dream) => {
    try {
      const response = await fetch(`/api/dreams/change/${updatedDream.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDream),
      });
      if (!response.ok) {
        throw new Error(`Error updating dream: ${response.statusText}`);
      }
      const updatedDreamFromDB = await response.json();
      set((state) => ({
        dreams: state.dreams.map((dream) =>
          dream.id === updatedDreamFromDB.id ? updatedDreamFromDB : dream
        ),
      }));
      console.log('Dream updated successfully:', updatedDreamFromDB);
    } catch (error) {
      console.error('Failed to update dream:', error);
      throw error;
    }
  },
}));

export const useAssociationsStore = create<AssociationsState>((set) => ({
  associations: [],
  loadAssociations: async () => {
    try {
      const response = await fetch('/api/associations');
      if (!response.ok) {
        throw new Error(`Error loading associations: ${response.statusText}`);
      }
      const associations = await response.json();
      set({ associations });
      console.log('Associations loaded successfully:', associations);
    } catch (error) {
      console.error('Failed to load associations:', error);
      throw error;
    }
  },
}));

// Проверка аутентификации при загрузке приложения
const initialAuthState = JSON.parse(localStorage.getItem('isAuthenticated') || 'false');
useAuthStore.setState({ isAuthenticated: initialAuthState });