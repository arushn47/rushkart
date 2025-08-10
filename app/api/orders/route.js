import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    await dbConnect();
    const orders = await Order.find({ user: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ success: false, error: "Server error while fetching orders." }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { items, totalAmount } = body;

    // Input validation
    if (!items || items.length === 0 || !totalAmount) {
      return NextResponse.json(
        { success: false, error: "Missing required order information." },
        { status: 400 }
      );
    }
    await dbConnect();

    // Step 1: Validate stock for all products
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product not found: ${item.product}` },
          { status: 404 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `Insufficient stock for ${product.name} (requested: ${item.quantity}, available: ${product.stock})`
          },
          { status: 400 }
        );
      }
    }

    // Step 2: Deduct stock atomically for each product
    for (const item of items) {
      const result = await Product.updateOne(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
      if (result.modifiedCount === 0) {
        return NextResponse.json(
          {
            success: false,
            error: `Failed to update stock for product ${item.product}. It may be out of stock.`
          },
          { status: 500 }
        );
      }
    }

    // Step 3: Create the order
    const newOrder = new Order({
      user: session.user.id,
      items,
      totalAmount,
      status: "Placed"
    });
    const savedOrder = await newOrder.save();

    return NextResponse.json({ success: true, data: savedOrder }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: "Server error while creating order." },
      { status: 500 }
    );
  }
}
