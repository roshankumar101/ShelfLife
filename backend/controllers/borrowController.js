import Book from '../models/Book.js';
import Member from '../models/Member.js';
import BorrowRecord from '../models/BorrowRecord.js';

/**
 * POST /api/borrow
 * Issue a book to a member. Requires authentication.
 *
 * Concurrency Safety:
 * We use an atomic findOneAndUpdate with { availableCopies: { $gt: 0 } } condition
 * and { $inc: { availableCopies: -1 } } decrement in a single MongoDB operation.
 * This prevents two simultaneous requests from both decrementing the last available copy
 * (race condition), because only one will match the $gt: 0 condition after the other
 * has already decremented it. MongoDB's document-level locking ensures atomicity.
 */
export const borrowBook = async (req, res, next) => {
  try {
    const { bookId, memberId } = req.body;

    // 1. Verify member exists
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ error: 'Member not found.' });
    }

    // 2. Atomically check availableCopies > 0 and decrement (prevents race conditions)
    const book = await Book.findOneAndUpdate(
      { _id: bookId, availableCopies: { $gt: 0 } },
      { $inc: { availableCopies: -1 } },
      { new: true }
    );

    if (!book) {
      // Either book doesn't exist or no copies available
      const bookExists = await Book.findById(bookId);
      if (!bookExists) {
        return res.status(404).json({ error: 'Book not found.' });
      }
      return res.status(400).json({ error: 'No available copies for this book.' });
    }

    // 3. Create the borrow record
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2-week loan period

    const borrowRecord = new BorrowRecord({
      book: bookId,
      member: memberId,
      issueDate,
      dueDate,
      returnDate: null,
      status: 'issued',
    });

    const saved = await borrowRecord.save();
    const populated = await saved.populate('book', 'title author ISBN');

    res.status(201).json({
      message: 'Book issued successfully',
      borrowRecord: populated,
      availableCopies: book.availableCopies,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/return/:borrowId
 * Return a borrowed book. Requires authentication.
 */
export const returnBook = async (req, res, next) => {
  try {
    const { borrowId } = req.params;

    // 1. Find the borrow record
    const record = await BorrowRecord.findById(borrowId);
    if (!record) {
      return res.status(404).json({ error: 'Borrow record not found.' });
    }

    // 2. Check if already returned
    if (record.status === 'returned') {
      return res.status(400).json({ error: 'This book has already been returned.' });
    }

    // 3. Update borrow record
    record.returnDate = new Date();
    record.status = 'returned';
    await record.save();

    // 4. Increment availableCopies on the book
    const book = await Book.findByIdAndUpdate(
      record.book,
      { $inc: { availableCopies: 1 } },
      { new: true }
    );

    res.status(200).json({
      message: 'Book returned successfully',
      borrowRecord: record,
      availableCopies: book ? book.availableCopies : null,
    });
  } catch (err) {
    next(err);
  }
};
