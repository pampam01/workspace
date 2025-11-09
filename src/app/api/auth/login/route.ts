import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password harus diisi" },
        { status: 400 }
      );
    }

    // Get user data from database
    const user = await db.user.findUnique({
      where: { email },
      include: {
        seniman_profile: true,
        klien_profile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      );
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      );
    }

    // Redirect to NextAuth callback to create session
    // The client should call /api/auth/callback/credentials or use NextAuth's signIn
    return NextResponse.json(
      {
        message: "Login berhasil",
        user: {
          id: user.id,
          email: user.email,
          name:
            `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
            user.email,
          userType: user.user_type,
          isVerified: user.is_verified,
          senimanProfile: user.seniman_profile,
          klienProfile: user.klien_profile,
        },
        // Include a flag to indicate client should call NextAuth
        requiresNextAuthCallback: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat login" },
      { status: 500 }
    );
  }
}
