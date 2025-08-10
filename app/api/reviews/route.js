import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Review from '@/models/Review';
import Order from '@/models/Order';

// POST a new review
export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { productId, rating, title, text } = body;

        if (!productId || !rating || !title || !text) {
            return NextResponse.json({ success: false, error: 'Missing required fields.' }, { status: 400 });
        }

        await dbConnect();

        // **Verification Logic**: Check if the user has purchased this product.
        const hasPurchased = await Order.findOne({
            'user': session.user.id,
            'items.product': productId,
            'status': 'Placed' // Or whatever status confirms a completed order
        });

        const newReview = new Review({
            product: productId,
            user: session.user.id,
            rating,
            title,
            text,
            verifiedPurchase: !!hasPurchased // Set to true if an order is found, false otherwise
        });

        await newReview.save();

        // Populate user details before sending back
        const populatedReview = await Review.findById(newReview._id).populate('user', 'name image');

        return NextResponse.json({ success: true, data: populatedReview }, { status: 201 });

    } catch (error) {
        // Handle duplicate review error
        if (error.code === 11000) {
            return NextResponse.json({ success: false, error: 'You have already reviewed this product.' }, { status: 409 });
        }
        console.error("Error creating review:", error);
        return NextResponse.json({ success: false, error: 'Server error while creating review.' }, { status: 500 });
    }
}
