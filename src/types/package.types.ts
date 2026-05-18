/** Active subscription package from GET /packages or GET /packages/:id */
export type Package = {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  durationMonths: number;
  features: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};
