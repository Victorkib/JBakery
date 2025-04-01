import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    barcode: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    ingredients: {
      type: String,
      required: [true, 'Please add ingredients'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price must be at least 0'],
    },
    comparePrice: {
      type: Number,
      min: [0, 'Compare price must be at least 0'],
    },
    costPrice: {
      type: Number,
      min: [0, 'Cost price must be at least 0'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please add a category'],
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: [0, 'Low stock threshold cannot be negative'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'out_of_stock', 'low_stock'],
      default: 'active',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: '/placeholder.svg',
    },
    additionalImages: [String],
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative'],
    },
    dimensions: {
      length: {
        type: Number,
        min: [0, 'Length cannot be negative'],
      },
      width: {
        type: Number,
        min: [0, 'Width cannot be negative'],
      },
      height: {
        type: Number,
        min: [0, 'Height cannot be negative'],
      },
    },
    nutritionalInfo: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      sugar: Number,
      fiber: Number,
    },
    allergens: {
      gluten: {
        type: Boolean,
        default: false,
      },
      dairy: {
        type: Boolean,
        default: false,
      },
      nuts: {
        type: Boolean,
        default: false,
      },
      eggs: {
        type: Boolean,
        default: false,
      },
      soy: {
        type: Boolean,
        default: false,
      },
      wheat: {
        type: Boolean,
        default: false,
      },
    },
    shelfLife: {
      type: Number,
      min: [0, 'Shelf life cannot be negative'],
    },
    taxClass: {
      type: String,
      enum: ['standard', 'reduced', 'zero', 'exempt'],
      default: 'standard',
    },
    shippingClass: {
      type: String,
      enum: ['standard', 'express', 'fragile', 'refrigerated'],
      default: 'standard',
    },
    sold: {
      type: Number,
      default: 0,
      min: [0, 'Sold count cannot be negative'],
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Update status based on stock
ProductSchema.pre('save', function (next) {
  if (this.stock === 0) {
    this.status = 'out_of_stock';
  } else if (this.stock <= this.lowStockThreshold) {
    this.status = 'low_stock';
  } else if (this.status === 'out_of_stock' || this.status === 'low_stock') {
    this.status = 'active';
  }
  next();
});

// Create SKU if not provided
ProductSchema.pre('save', function (next) {
  if (!this.sku && this.isNew) {
    // Generate SKU based on name and random number
    const namePrefix = this.name.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    this.sku = `${namePrefix}-${randomNum}`;
  }
  next();
});

export default mongoose.model('Product', ProductSchema);
