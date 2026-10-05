import mongoose from 'mongoose';

const borrowRecordSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    issueDate: { type: Date, required: true, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date, default: null },
    // issued | returned | overdue
    status: {
      type: String,
      enum: ['issued', 'returned', 'overdue'],
      required: true,
      default: 'issued',
    },
  },
  { timestamps: true }
);

const BorrowRecord = mongoose.model('BorrowRecord', borrowRecordSchema);

export default BorrowRecord;
