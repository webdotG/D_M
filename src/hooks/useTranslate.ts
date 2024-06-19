import { useLanguageStore } from '../store';
import translations from '../translations.json';

export const useTranslate = () => {
  const { language } = useLanguageStore();

  const translateToLanguage = (text: string): string => {
    if (!(language in translations)) {
      throw new Error(`Язык '${language}' не поддерживается.`);
    }

    const languageTranslations = translations[language as keyof typeof translations];

    if (!(text in languageTranslations)) {
      throw new Error(`Перевод для текста '${text}' не найден в языке '${language}'.`);
    }

    return languageTranslations[text as keyof typeof languageTranslations];
  };

  return { translateToLanguage };
};
