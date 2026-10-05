import axios from 'axios';
import type {
  LoginRequest,
  LoginResponse,
  AddBookRequest,
  Book,
  BooksResponse,
  AddMemberRequest,
  Member,
  MembersResponse,
  BorrowRequest,
  BorrowResponse,
  ReturnResponse,
  MemberHistoryResponse,
} from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');
const BASE_URL = `${API_BASE_URL}/api`;

// Axios instance with base URL
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

// --- Auth ---

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>('/auth/login', data);
  return res.data;
};

// --- Books ---

export const getBooks = async (params?: {
  page?: number;
  limit?: number;
  genre?: string;
  title?: string;
}): Promise<BooksResponse> => {
  const res = await api.get<BooksResponse>('/books', { params });
  return res.data;
};

export const addBook = async (data: AddBookRequest): Promise<{ message: string; book: Book }> => {
  const res = await api.post<{ message: string; book: Book }>('/books', data);
  return res.data;
};

// --- Members ---

export const getMembers = async (): Promise<MembersResponse> => {
  const res = await api.get<MembersResponse>('/members');
  return res.data;
};

export const addMember = async (
  data: AddMemberRequest
): Promise<{ message: string; member: Member }> => {
  const res = await api.post<{ message: string; member: Member }>('/members', data);
  return res.data;
};

export const getMemberHistory = async (memberId: string): Promise<MemberHistoryResponse> => {
  const res = await api.get<MemberHistoryResponse>(`/members/${memberId}/history`);
  return res.data;
};

// --- Borrow & Return ---

export const borrowBook = async (data: BorrowRequest): Promise<BorrowResponse> => {
  const res = await api.post<BorrowResponse>('/borrow', data);
  return res.data;
};

export const returnBook = async (borrowId: string): Promise<ReturnResponse> => {
  const res = await api.post<ReturnResponse>(`/return/${borrowId}`);
  return res.data;
};
