// Валидация ассоциаций
export const validateAssociations = (associations: string | string[]): boolean => {
    if (typeof associations === 'string') {
      // Если передана строка, проверяем её
      return associations.trim() !== '';
    } else if (Array.isArray(associations)) {
      // Если передан массив строк, проверяем каждую строку
      return associations.every((assoc) => assoc.trim() !== '');
    } else {
      // В случае некорректного типа данных возвращаем false
      return false;
    }
  };
      