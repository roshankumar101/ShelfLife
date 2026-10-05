import { Router } from 'express';
import { borrowBook, returnBook } from '../controllers/borrowController.js';
import { validateBorrow } from '../middleware/validate.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

// Protected: issue a book to a member
router.post('/borrow', authMiddleware, validateBorrow, borrowBook);

// Protected: return a borrowed book
router.post('/return/:borrowId', authMiddleware, returnBook);

export default router;
