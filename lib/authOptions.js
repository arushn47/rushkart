import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodbClient";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || user._id;
        token.role = user.role;
        token.email = user.email;
      } else if (token.email) {
        await dbConnect();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.role = dbUser.role;
          token.id = dbUser._id?.toString();
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export { authOptions };
