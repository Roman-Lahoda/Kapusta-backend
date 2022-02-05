import mongoose from 'mongoose';

const transactionModel = new mongoose.Schema(
  {
    transactionType: { type: String, required: true },
    sum: { type: Number, required: true },
    category: { type: String, required: true },
    destination: { type: String, required: true },
  },
  { versionKey: false, timestamps: true },
);

export default mongoose.model('transactions', transactionModel);
