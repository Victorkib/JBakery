import mongoose from 'mongoose';

const IngredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    unit: {
      type: String,
      required: [true, 'Please add a unit'],
      enum: [
        'kg',
        'g',
        'l',
        'ml',
        'pcs',
        'bottles',
        'boxes',
        'cups',
        'tbsp',
        'tsp',
        'oz',
        'lb',
      ],
    },
    minStockLevel: {
      type: Number,
      required: [true, 'Please add minimum stock level'],
      min: [0, 'Minimum stock level cannot be negative'],
      default: 5,
    },
    supplier: {
      type: String,
      required: [true, 'Please add a supplier'],
    },
    cost: {
      type: Number,
      required: [true, 'Please add a cost'],
      min: [0, 'Cost must be at least 0'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: [
        'Flour',
        'Sugar',
        'Dairy',
        'Eggs',
        'Flavors',
        'Fruits',
        'Nuts',
        'Other',
      ],
    },
    lastRestocked: {
      type: Date,
      default: Date.now,
    },
    supplierContact: {
      name: String,
      email: String,
      phone: String,
    },
    reorderLeadTime: {
      type: Number,
      min: [0, 'Reorder lead time cannot be negative'],
      default: 3,
      comment: 'Days needed for reorder delivery',
    },
    notes: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for total value
IngredientSchema.virtual('totalValue').get(function () {
  return this.stock * this.cost;
});

// Virtual for stock status
IngredientSchema.virtual('stockStatus').get(function () {
  if (this.stock === 0) {
    return 'Out of Stock';
  } else if (this.stock <= this.minStockLevel) {
    return 'Low Stock';
  } else {
    return 'In Stock';
  }
});

export default mongoose.model('Ingredient', IngredientSchema);
