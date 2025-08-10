import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      name: { type: String, required: true },
      description: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      imageUrl: { type: String, required: true },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Placed', 'Cancelled'],
    default: 'Placed',
  },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
