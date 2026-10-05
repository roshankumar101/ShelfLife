import { Router } from 'express';
import { addBook, getBooks } from '../controllers/bookController.js';
import { validateBook } from '../middleware/validate.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

// Public: list books
router.get('/', getBooks);

// Protected: add book
router.post('/', authMiddleware, validateBook, addBook);

export default router;
