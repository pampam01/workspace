import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { error } from "console";

export async function GET(req: NextRequest) {
  try {
    const getCategoriesSeniman = await db.senimanProfile.findMany({
      select: {
        kategori: true,
      },
    });

    if (!getCategoriesSeniman) {
      return NextResponse.json(
        { error: "kategori not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Berhasil mengambil data portfolio items dan seniman",
        data: getCategoriesSeniman,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
