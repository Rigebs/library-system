export interface Category {
  id: number;
  name: string;
}

export type CategoryPayload = Omit<Category, 'id'>;
