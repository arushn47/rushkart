import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions"; // path must match where you put it

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
