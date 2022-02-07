import mongoose from 'mongoose';

const transactionModel = new mongoose.Schema(
  {
    // ПРИМЕТКА: Предполагается два типа транакций -доход и расход ( income, exprnse)
    transactionType: {
      type: String,
      required: true,
    },

    sum: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },
    dayCreate: {
      type: Number,
      required: true,
    },
    monthCreate: {
      type: Number,
      required: true,
    },
    yearCreate: {
      type: Number,
      required: true,
    },

    dateOfTransaction: {
      type: Date,
      default: Date.now(),
    },

    // ПРИМЕТКА: Это поле будем расскоментировать и добавлять, когда будет создана коллекция 'user' или 'users'
    // owner: {
    //   type: SchemaTypes.ObjectId,
    //   ref: 'user', // или 'users'
    //   required: true,
    // }
  },
  { versionKey: false, timestamps: false },
);

export default mongoose.model('transactions', transactionModel);
