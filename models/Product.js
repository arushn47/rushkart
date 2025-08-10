import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this product.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for this product.'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price for this product.'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL for this product.'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category for this product.'],
  },
  rating: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    default: 0,
  },
  // --- This is the required field that was missing ---
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
