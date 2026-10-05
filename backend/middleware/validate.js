/**
 * Validation middleware factory.
 * Returns a middleware that validates req.body against the provided schema function.
 * The schema function should return { error, value } (similar to Joi).
 */
const validate = (schemaFn) => (req, res, next) => {
  const { error, value } = schemaFn(req.body);
  if (error) {
    return res.status(400).json({ error: error });
  }
  req.body = value;
  next();
};

// --- Book validation ---
export const validateBook = validate((body) => {
  const { title, author, ISBN, genre, totalCopies } = body;
  const errors = [];

  if (!title || typeof title !== 'string' || !title.trim())
    errors.push('title is required');
  if (!author || typeof author !== 'string' || !author.trim())
    errors.push('author is required');
  if (!ISBN || typeof ISBN !== 'string' || !ISBN.trim())
    errors.push('ISBN is required');
  if (!genre || typeof genre !== 'string' || !genre.trim())
    errors.push('genre is required');
  if (totalCopies === undefined || totalCopies === null)
    errors.push('totalCopies is required');
  if (typeof totalCopies !== 'number' || !Number.isInteger(totalCopies) || totalCopies < 1)
    errors.push('totalCopies must be a positive integer');

  if (errors.length) return { error: errors.join(', ') };

  return {
    value: {
      title: title.trim(),
      author: author.trim(),
      ISBN: ISBN.trim(),
      genre: genre.trim(),
      totalCopies,
      availableCopies: totalCopies, // on creation, all copies are available
    },
  };
});

// --- Member validation ---
export const validateMember = validate((body) => {
  const { name, email, membershipId, joinedDate } = body;
  const errors = [];

  if (!name || typeof name !== 'string' || !name.trim())
    errors.push('name is required');
  if (!email || typeof email !== 'string' || !email.trim())
    errors.push('email is required');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push('email must be valid');
  if (!membershipId || typeof membershipId !== 'string' || !membershipId.trim())
    errors.push('membershipId is required');

  if (errors.length) return { error: errors.join(', ') };

  return {
    value: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      membershipId: membershipId.trim(),
      joinedDate: joinedDate ? new Date(joinedDate) : new Date(),
    },
  };
});

// --- Borrow validation ---
export const validateBorrow = validate((body) => {
  const { bookId, memberId } = body;
  const errors = [];

  if (!bookId || typeof bookId !== 'string') errors.push('bookId is required');
  if (!memberId || typeof memberId !== 'string') errors.push('memberId is required');

  if (errors.length) return { error: errors.join(', ') };

  return { value: { bookId, memberId } };
});

// --- Login validation ---
export const validateLogin = validate((body) => {
  const { email, password } = body;
  const errors = [];

  if (!email || typeof email !== 'string') errors.push('email is required');
  if (!password || typeof password !== 'string') errors.push('password is required');

  if (errors.length) return { error: errors.join(', ') };

  return { value: { email: email.trim().toLowerCase(), password } };
});
