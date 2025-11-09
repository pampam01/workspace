import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// NextAuth v4 with App Router - using dynamic route
// This works because Next.js App Router handles the catch-all route
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
