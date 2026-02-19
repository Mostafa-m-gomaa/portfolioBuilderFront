export type LocalizedText = {
  ar?: string;
  en?: string;
};

export type SectionItem = {
  _id?: string;
  id?: string;
  [key: string]: unknown;
};

export type PortfolioSection = {
  key?: string;
  active?: boolean;
  title?: LocalizedText | string;
  desc?: LocalizedText | string;
  images?: string[];
  items?: SectionItem[];
  [key: string]: unknown;
};

export type Portfolio = {
  _id?: string;
  id?: string;
  userId?: string;
  subdomain?: string;
  languageMode?: 'ar' | 'en' | 'both' | string;
  isPublished?: boolean;
  sections?: Record<string, PortfolioSection>;
  [key: string]: unknown;
};

export type SectionUpsertPayload = Record<string, unknown>;
export type SectionItemPayload = Record<string, unknown>;

export type UploadImageResponse = {
  filePath: string;
  url?: string;
  message?: string;
};

export type UploadImagesResponse = {
  filePaths: string[];
  urls?: string[];
  message?: string;
};
