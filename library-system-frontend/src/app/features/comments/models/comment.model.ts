import { User } from '../../../core/models/user.model';
import { Book } from '../../books/models/book.model';

export type CommentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Comment {
  id: number;
  text: string;
  status: CommentStatus;
  createdAt: string;
  book: Book;
  user: User;
}

export interface CommentPayload {
  text: string;
  bookId: number;
  userId: number;
}
