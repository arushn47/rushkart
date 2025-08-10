import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

// PATCH (update) an order to cancel it
export async function PATCH(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const { id } = await params;

        // Find the order and ensure it belongs to the logged-in user before updating
        const updatedOrder = await Order.findOneAndUpdate(
            { _id: id, user: session.user.id },
            { status: 'Cancelled' },
            { new: true }
        );

        if (!updatedOrder) {
            return NextResponse.json({ success: false, error: 'Order not found or you do not have permission to cancel it.' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedOrder }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}