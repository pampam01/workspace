import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // Note: auth is imported but not used
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  // Basic validation for the ID
  if (!id) {
    return NextResponse.json(
      { error: "An ID must be provided" },
      { status: 400 }
    );
  }

  try {
    const senimanProfileData = await db.portfolioItem.findMany({
      where: {
        id: id,
      },
      include: {
        seniman: {
          include: {
            portfolio_items: {
              select: {
                id: true,
                category: true,
                image_urls: true,
                title: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!senimanProfileData) {
      return NextResponse.json(
        { error: "Seniman profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Seniman profile data fetched successfully",
        data: senimanProfileData,
      },
      { status: 200 }
    );
  } catch (error) {
    // --- THIS WAS THE BUG ---
    // You cannot both 'throw' an error and 'return' a response.
    // Throwing an error here crashes the server-side function,
    // which causes the client-side 'fetch' to fail.

    // REMOVED: throw new Error("Failed to fetch seniman profile data");

    // This is correct. Now, if the database query fails, this JSON
    // response will be sent to the client.
    console.error("Failed to fetch seniman profile data:", error); // Log the actual error for debugging
    return NextResponse.json(
      { error: "Failed to fetch seniman profile data" },
      { status: 500 }
    );
  }
}
