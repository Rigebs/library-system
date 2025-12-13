import { User } from '../../../core/models/user.model';
import { Book } from '../../books/models/book.model';

export type LoanStatus = 'ACTIVE' | 'RETURNED' | 'OVERDUE';

export interface Loan {
  id: number;
  user: User;
  book: Book;
  loanDate: string;
  expectedReturnDate: string;
  actualReturnDate: string | null;
  status: LoanStatus;
}

export interface LoanPayload {
  userId: number;
  bookId: number;
}

export interface LoanReturnPayload {
  actualReturnDate: string;
}
