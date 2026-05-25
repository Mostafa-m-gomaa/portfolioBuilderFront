export type LocalizedString = {
  ar: string;
  en: string;
};

/** Active subscription package from GET /packages or GET /packages/:id */
export type Package = {
  _id: string;
  name: LocalizedString;
  description: LocalizedString;
  priceEgp: number;
  priceUsd: number;
  durationMonths: number;
  features: LocalizedString[];
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};
