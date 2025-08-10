import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

// --- GET all products ---
export async function GET(request) {
  try {
    await dbConnect();
    const products = await Product.find({});
    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// --- POST a new product ---
export async function POST(request) {
  try {
    await dbConnect();

    // Get the request body
    const body = await request.json();

    // Create a new product in the database
    const product = await Product.create(body);

    // Return a successful response with the new product data
    return NextResponse.json({ success: true, data: product }, { status: 201 }); // 201 Created
  } catch (error) {
    // If there's an error (e.g., validation fails), return an error response
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
