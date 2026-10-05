import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    membershipId: { type: String, required: true, unique: true, trim: true },
    joinedDate: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

const Member = mongoose.model('Member', memberSchema);

export default Member;
