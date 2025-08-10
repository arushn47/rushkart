import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

// GET a single product by ID (Public)
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

// PUT (update) a product by ID (Secure)
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'seller') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    await dbConnect();
    const body = await request.json();

    // Find and update the product ONLY if the ID and seller ID match
    const product = await Product.findOneAndUpdate(
      { _id: id, seller: session.user.id }, 
      body, 
      { new: true, runValidators: true }
    );

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found or you do not have permission to edit it.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE a product by ID (Secure)
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'seller') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  
  const { id } = params;
  try {
    await dbConnect();

    // Delete the product ONLY if the ID and seller ID match
    const deletedProduct = await Product.deleteOne({ _id: id, seller: session.user.id });

    if (deletedProduct.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Product not found or you do not have permission to delete it.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
