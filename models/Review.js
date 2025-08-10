import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        index: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
    },
    // This will be set based on whether the user has purchased the item
    verifiedPurchase: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// Prevent a user from leaving more than one review per product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
