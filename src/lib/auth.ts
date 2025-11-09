import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { Adapter } from "next-auth/adapters";

// Ensure AUTH_SECRET is set
const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

if (!authSecret) {
  console.warn(
    "⚠️  WARNING: AUTH_SECRET or NEXTAUTH_SECRET is not set. NextAuth may not work correctly."
  );
  console.warn(
    "   Please set AUTH_SECRET in your .env file. Generate one with: openssl rand -base64 32"
  );
}

export const authOptions: NextAuthOptions = {
  secret: authSecret,
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email as string,
          },
          include: {
            seniman_profile: true,
            klien_profile: true,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password_hash
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name:
            `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
            user.email,
          userType: user.user_type,
          isVerified: user.is_verified,
          senimanProfile: user.seniman_profile,
          klienProfile: user.klien_profile,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userType = user.userType;
        token.isVerified = user.isVerified;
        token.senimanProfile = user.senimanProfile;
        token.klienProfile = user.klienProfile;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.userType = token.userType as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.senimanProfile = token.senimanProfile as any;
        session.user.klienProfile = token.klienProfile as any;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
};

// Compatibility functions for NextAuth v4
export const auth = async () => {
  return await getServerSession(authOptions);
};

export const signIn = async (
  provider: string,
  options?: { email?: string; password?: string; redirect?: boolean }
) => {
  // This is a placeholder - actual signIn should be handled by NextAuth route
  // For v4, we can't directly call signIn from server-side like v5
  // This function exists for API compatibility but should redirect to NextAuth endpoint
  throw new Error(
    "signIn should be called from client-side or via NextAuth API endpoint"
  );
};

export const signOut = async () => {
  // Placeholder for compatibility
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
};
