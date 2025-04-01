import mongoose from 'mongoose';

const InventoryLogSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
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
    change: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: [
        'initial',
        'manual',
        'order',
        'order-cancel',
        'return',
        'adjustment',
        'bulk',
        'deletion',
      ],
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('InventoryLog', InventoryLogSchema);
