// Book type matching backend Book model
export interface Book {
  _id: string;
  title: string;
  author: string;
  ISBN: string;
  genre: string;
  totalCopies: number;
  availableCopies: number;
  createdAt: string;
  updatedAt: string;
}

// Member type matching backend Member model
export interface Member {
  _id: string;
  name: string;
  email: string;
  membershipId: string;
  joinedDate: string;
  createdAt: string;
  updatedAt: string;
}

// BorrowRecord type matching backend BorrowRecord model
export interface BorrowRecord {
  _id: string;
  book: Book | string;
  member: Member | string;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'issued' | 'returned' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

// Pagination info returned by GET /api/books
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Request types
export interface AddBookRequest {
  title: string;
  author: string;
  ISBN: string;
  genre: string;
  totalCopies: number;
}

export interface AddMemberRequest {
  name: string;
  email: string;
  membershipId: string;
  joinedDate?: string;
}

export interface BorrowRequest {
  bookId: string;
  memberId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// API Response types
export interface LoginResponse {
  message: string;
  token: string;
  email: string;
}

export interface BooksResponse {
  books: Book[];
  pagination: Pagination;
}

export interface MembersResponse {
  members: Member[];
}

export interface MemberHistoryResponse {
  member: Member;
  records: BorrowRecord[];
}

export interface BorrowResponse {
  message: string;
  borrowRecord: BorrowRecord;
  availableCopies: number;
}

export interface ReturnResponse {
  message: string;
  borrowRecord: BorrowRecord;
  availableCopies: number;
}

export interface ApiError {
  error: string;
}
