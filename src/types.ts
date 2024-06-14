export interface CategoryData {
  [key: number]: string;
}

export interface Categories {
  dreams: CategoryData;
  memorises: CategoryData;
}

export type TranslationMap = {
  RU: {
    [key: string]: string;
  };
  EN: {
    [key: string]: string;
  };
  BS: {
    [key: string]: string;
  };
};
