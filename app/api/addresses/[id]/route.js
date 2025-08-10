import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Address from '@/models/Address';

// DELETE an address by its ID
export async function DELETE(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    try {
        await dbConnect();
        
        const address = await Address.findById(id);

        // Ensure the address exists and belongs to the logged-in user
        if (!address || address.user.toString() !== session.user.id) {
            return NextResponse.json({ success: false, error: 'Address not found or permission denied' }, { status: 404 });
        }

        await Address.findByIdAndDelete(id);

        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error) {
        console.error("Error deleting address:", error);
        return NextResponse.json({ success: false, error: 'Server error while deleting address.' }, { status: 500 });
    }
}
