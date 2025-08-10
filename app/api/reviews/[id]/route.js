import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Review from '@/models/Review';
import User from '@/models/User';
import mongoose from 'mongoose';

// GET all reviews for a specific product
export async function GET(request, { params }) {
    // --- FIX: Use 'id' to match the folder name [id] ---
    const { id: productId } = await params;

    // Validate if the productId is a valid MongoDB ObjectId
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return NextResponse.json({ success: false, error: 'Invalid Product ID format.' }, { status: 400 });
    }

    try {
        await dbConnect();
        
        const reviews = await Review.find({ product: productId })
            .populate({
                path: 'user',
                model: User,
                select: 'name image' // Select only the user's name and image
            })
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: reviews }, { status: 200 });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json({ success: false, error: 'Server error while fetching reviews.' }, { status: 500 });
    }
}
