import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

// --- GET a single product by ID ---
export async function GET(request, { params }) {
  
    const { id } = await params;

  try {
    await dbConnect();

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// --- PUT (update) a product by ID ---
export async function PUT(request, { params }) {
  const { id } = await params;

  try {
    await dbConnect();
    
    const body = await request.json();

    const product = await Product.findByIdAndUpdate(id, body, {
      new: true, // Return the updated document
      runValidators: true, // Run Mongoose validation
    });

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// --- DELETE a product by ID ---
export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    await dbConnect();

    const deletedProduct = await Product.deleteOne({ _id: id });

    if (deletedProduct.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} }, { status: 200 }); // Return empty object on successful delete
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
