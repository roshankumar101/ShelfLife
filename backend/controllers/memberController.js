import Member from '../models/Member.js';
import BorrowRecord from '../models/BorrowRecord.js';

/**
 * POST /api/members
 * Register a new member.
 */
export const addMember = async (req, res, next) => {
  try {
    const member = new Member(req.body);
    const saved = await member.save();
    res.status(201).json({ message: 'Member registered successfully', member: saved });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/members
 * List all members (used by frontend dropdowns).
 */
export const getMembers = async (req, res, next) => {
  try {
    const members = await Member.find().sort({ name: 1 });
    res.status(200).json({ members });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/members/:id/history
 * Get full borrow history for a specific member.
 * Populates book title and relevant borrow info.
 */
export const getMemberHistory = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found.' });
    }

    const records = await BorrowRecord.find({ member: req.params.id })
      .populate('book', 'title author ISBN genre')
      .sort({ issueDate: -1 });

    res.status(200).json({ member, records });
  } catch (err) {
    next(err);
  }
};
