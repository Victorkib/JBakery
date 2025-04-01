import mongoose from 'mongoose';

const RestockLogSchema = new mongoose.Schema(
  {
    ingredient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: true,
    },
    previousStock: {
      type: Number,
      required: true,
      min: 0,
    },
    newStock: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
    supplier: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notes: {
      type: String,
    },
    invoiceNumber: {
      type: String,
    },
    batchNumber: {
      type: String,
    },
    expiryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('RestockLog', RestockLogSchema);
