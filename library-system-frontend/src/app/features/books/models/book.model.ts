export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  summary: string;
  fileUrl: string;
  coverUrl: string;
  totalQuantity: number;
}

export type BookPayload = Omit<Book, 'id'>;
