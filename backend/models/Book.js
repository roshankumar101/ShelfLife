import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    ISBN: { type: String, required: true, unique: true, trim: true },
    genre: { type: String, required: true, trim: true },
    totalCopies: { type: Number, required: true, min: 0 },
    availableCopies: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

// Ensure availableCopies never exceeds totalCopies
bookSchema.pre('save', function (next) {
  if (this.availableCopies > this.totalCopies) {
    return next(new Error('availableCopies cannot exceed totalCopies'));
  }
  next();
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
