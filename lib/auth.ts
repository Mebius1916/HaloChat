import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { connectToDB } from "@/mongodb/index";
import { User } from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;
        if (!email || !password) {
          throw new Error("Invalid email or password");
        }
        await connectToDB()
        const user = await User.findOne({ email });
        if (!user || !user?.password) {
          throw new Error("Invalid email or password");
        }
        const isMatch = await compare(password, user.password);

        if (!isMatch) {
          throw new Error("Invalid password");
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session }) {
      const mongodbUser = await User.findOne({ email: session.user.email });
      session.user.id = mongodbUser._id.toString();
      session.user = { ...session.user, ...mongodbUser._doc };
      return session;
    },
  },
});

