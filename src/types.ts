export interface CategoryData {
  [key: number]: string;
}

export interface Categories {
  dreams: CategoryData;
  memorises: CategoryData;
}

export interface TranslationMap {
  [key: string]: string;
}
