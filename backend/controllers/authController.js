import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

/**
 * POST /api/auth/login
 * Validates credentials against env-configured librarian account.
 * Issues a JWT on success.
 *
 * For a college project, librarian credentials are stored in .env.
 * In production, these would be stored in a database.
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const librarianEmail = process.env.LIBRARIAN_EMAIL;
    const librarianPassword = process.env.LIBRARIAN_PASSWORD;

    if (email !== librarianEmail || password !== librarianPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { email, role: 'librarian' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      email,
    });
  } catch (err) {
    next(err);
  }
};
