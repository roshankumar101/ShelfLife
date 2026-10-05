import { Router } from 'express';
import { addMember, getMembers, getMemberHistory } from '../controllers/memberController.js';
import { validateMember } from '../middleware/validate.js';

const router = Router();

// List all members (used by frontend dropdowns)
router.get('/', getMembers);

// Register a new member
router.post('/', validateMember, addMember);

// Get member borrow history
router.get('/:id/history', getMemberHistory);

export default router;
