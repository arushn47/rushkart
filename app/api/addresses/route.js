import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Address from '@/models/Address';

// GET all addresses for the logged-in user
export async function GET(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const addresses = await Address.find({ user: session.user.id });
        return NextResponse.json({ success: true, data: addresses }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST a new address for the logged-in user
export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const body = await request.json();
        
        const newAddress = await Address.create({
            ...body,
            user: session.user.id, // Link the address to the logged-in user
        });

        return NextResponse.json({ success: true, data: newAddress }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
