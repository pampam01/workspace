import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const senimanUsers = await prisma.user.findMany({
      where: { user_type: "SENIMAN" },
      select: {
        id: true,
        first_name: true,
        last_name: true,
      },
    });

    const portfolioItems = await prisma.portfolioItem.findMany({
      orderBy: { created_at: "desc" as const },
      include: {
        seniman: {
          include: {
            user: true,
          },
        },
      },
    });

    const formattedItems = portfolioItems.map((item) => {
      let imageUrl = "/placeholder.jpg";

      try {
        const parsed = JSON.parse(item.image_urls as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          imageUrl = parsed[0];
        } else if (typeof item.image_urls === "string") {
          imageUrl = item.image_urls;
        }
      } catch {
        if (typeof item.image_urls === "string") {
          imageUrl = item.image_urls;
        }
      }

      // 🔹 Ambil nama seniman
      const senimanUser = item.seniman?.user;
      const seniman_name = senimanUser
        ? `${senimanUser.first_name} ${senimanUser.last_name}`.trim()
        : "Seniman tidak diketahui";

      return {
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        tools_used: item.tools_used,
        client_name: item.client_name,
        created_at: item.created_at,
        video_url: item.video_url,
        image_urls: imageUrl,
        seniman_id: item.seniman_id,
        seniman_name,
      };
    });

    return NextResponse.json(
      {
        message: "Berhasil mengambil data portfolio items dan seniman",
        data: formattedItems,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching portfolio items:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
