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


type Dream = {
  id: number;
  category: string;
  associations: string;
  title: string;
  content: string;
  isAnalyzed: boolean;
  date: string;
};

type DreamState = {
  dreams: Dream[];
  loadDreams: (category: string) => void;
  updateDream: (updatedDream: Dream) => void;
  addDream: (newDream: Omit<Dream, 'id'>) => void;
  loadAssociations: (category: string) => void;
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


export const useDreamStore = create<DreamState>((set) => ({
  dreams: [],
  loadDreams: async (category: string) => {
    try {
      const params = new URLSearchParams();
      params.append('category', category);
  
      const response = await fetch(`/api/dreams/all?${params}`);
      if (!response.ok) {
        throw new Error(`Error loading dreams: ${response.statusText}`);
      }
      const dreams = await response.json();
      set({ dreams });
     
    } catch (error) {
      console.error('Failed to load dreams:', error);
      throw error;
    }
  },
  loadAssociations: async (category: string) => {
    try {
      const response = await fetch(`/api/dreams/associationSearch?category=${category}`);
      if (!response.ok) {
        throw new Error(`Error loading associations: ${response.statusText}`);
      }
      const associations = await response.json();
      console.log('Ассоциации загружены:', associations);
      return associations; 
    } catch (error) {
      console.error('Failed to load associations:', error);
      throw error;
    }
  },
  
  updateDream: (updatedDream: Dream) => {
    set((state) => ({
      dreams: state.dreams.map((dream) => (dream.id === updatedDream.id ? updatedDream : dream)),
    }));
    console.log(`Запись c id - ${updatedDream.id} обовлена в сторе`);
  },
  // Пример исправленной функции addDream
addDream: async (newDream) => {
  try {
    // Преобразование associations в массив, если оно строка
    if (typeof newDream.associations === 'string') {
      newDream.associations = JSON.parse(newDream.associations);
    }

    const response = await fetch('/api/dreams/add', {
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
    // console.log('Auth store ... >>> ... ', auth);
    // console.log('Token store ... >>> ... ', token || 'Token removed');
  },
}));


// Установка начального значения 
const initialAuthState = JSON.parse(localStorage.getItem('isAuthenticated') || 'false');
const initialToken = localStorage.getItem('token') || '';
useAuthStore.setState({ isAuthenticated: initialAuthState, token: initialToken });


