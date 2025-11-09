import { NextResponse } from "next/server";

import { signOut } from "next-auth/react";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await signOut();
    return NextResponse.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
