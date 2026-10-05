import Book from '../models/Book.js';

/**
 * POST /api/books
 * Add a new book. Requires authentication.
 */
export const addBook = async (req, res, next) => {
  try {
    const book = new Book(req.body);
    const saved = await book.save();
    res.status(201).json({ message: 'Book added successfully', book: saved });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/books
 * List books with optional pagination, genre filter, and title search.
 * Query params: page, limit, genre, title
 */
export const getBooks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.genre) {
      filter.genre = { $regex: req.query.genre, $options: 'i' };
    }
    if (req.query.title) {
      filter.title = { $regex: req.query.title, $options: 'i' };
    }

    const [books, total] = await Promise.all([
      Book.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Book.countDocuments(filter),
    ]);

    res.status(200).json({
      books,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};
