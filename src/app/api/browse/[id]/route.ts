import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  try {
    // ✅ Kalau ada id → ambil satu item saja (bukan array)
    if (id) {
      const item = await db.portfolioItem.findFirst({
        where: { id: id },
        include: {
          seniman: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!item) {
        return NextResponse.json(
          { error: "Portofolio tidak ditemukan" },
          { status: 404 }
        );
      }

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

      const senimanUser = item.seniman?.user;
      const seniman_name = senimanUser
        ? `${senimanUser.first_name} ${senimanUser.last_name}`.trim()
        : "Seniman tidak diketahui";

      const formattedItem = {
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

      return NextResponse.json(
        { message: "Data portofolio berhasil diambil", data: formattedItem },
        { status: 200 }
      );
    }

    // 🔹 Kalau tidak ada id → ambil semua
    const portfolioItems = await db.portfolioItem.findMany({
      orderBy: { created_at: "desc" },
      include: {
        seniman: {
          include: { user: true },
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
        message: "Berhasil mengambil semua data portofolio",
        data: formattedItems,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Gagal ambil data portofolio:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
