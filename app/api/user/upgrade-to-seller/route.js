import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // shared spot
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const userEmail = session.user.email;
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }

  user.role = "seller";
  await user.save();

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
