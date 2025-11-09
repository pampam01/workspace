import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        seniman_profile: true,
      },
    });

    if (!user || !user.seniman_profile) {
      return NextResponse.json(
        { error: "Seniman profile not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const portfolioId = searchParams.get("id");

    if (portfolioId) {
      // Get single portfolio item
      const portfolioItem = await db.portfolioItem.findFirst({
        where: {
          id: portfolioId,
          seniman_id: user.seniman_profile.id,
        },
      });

      if (!portfolioItem) {
        return NextResponse.json(
          { error: "Portfolio item not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        id: portfolioItem.id,
        title: portfolioItem.title,
        description: portfolioItem.description,
        category: portfolioItem.category,
        image_urls: portfolioItem.image_urls
          ? JSON.parse(portfolioItem.image_urls)
          : [],
        video_url: portfolioItem.video_url,
        project_date: portfolioItem.project_date?.toISOString() || null,
        client_name: portfolioItem.client_name,
        tools_used: portfolioItem.tools_used
          ? JSON.parse(portfolioItem.tools_used)
          : [],
        is_featured: portfolioItem.is_featured,
        created_at: portfolioItem.created_at.toISOString(),
        updated_at: portfolioItem.updated_at.toISOString(),
      });
    }

    // Get all portfolio items
    const portfolioItems = await db.portfolioItem.findMany({
      where: {
        seniman_id: user.seniman_profile.id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const formattedPortfolio = portfolioItems.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      image_url: item.image_urls
        ? JSON.parse(item.image_urls)[0] || "/placeholder.jpg"
        : "/placeholder.jpg",
      image_urls: item.image_urls ? JSON.parse(item.image_urls) : [],
      video_url: item.video_url,
      project_date: item.project_date?.toISOString() || null,
      client_name: item.client_name,
      tools_used: item.tools_used ? JSON.parse(item.tools_used) : [],
      is_featured: item.is_featured,
      views: 0, // TODO: Add view tracking
      likes: 0, // TODO: Add likes system
      created_at: item.created_at.toISOString(),
      updated_at: item.updated_at.toISOString(),
    }));

    return NextResponse.json({ portfolio: formattedPortfolio });
  } catch (error) {
    console.error("Get portfolio error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil portfolio" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        seniman_profile: true,
      },
    });

    if (!user || !user.seniman_profile) {
      return NextResponse.json(
        { error: "Seniman profile not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      image_urls,
      video_url,
      project_date,
      client_name,
      tools_used,
      is_featured,
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Judul portfolio wajib diisi" },
        { status: 400 }
      );
    }

    // Create portfolio item
    const portfolioItem = await db.portfolioItem.create({
      data: {
        seniman_id: user.seniman_profile.id,
        title,
        description: description || null,
        category: category || null,
        image_urls:
          image_urls && image_urls.length > 0
            ? JSON.stringify(image_urls)
            : null,
        video_url: video_url || null,
        project_date: project_date ? new Date(project_date) : null,
        client_name: client_name || null,
        tools_used:
          tools_used && tools_used.length > 0
            ? JSON.stringify(tools_used)
            : null,
        is_featured: is_featured || false,
      },
    });

    // Update portfolio count
    await db.senimanProfile.update({
      where: { id: user.seniman_profile.id },
      data: {
        portfolio_count: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(
      {
        message: "Portfolio berhasil ditambahkan",
        portfolio: {
          id: portfolioItem.id,
          title: portfolioItem.title,
          description: portfolioItem.description,
          category: portfolioItem.category,
          image_urls: portfolioItem.image_urls
            ? JSON.parse(portfolioItem.image_urls)
            : [],
          video_url: portfolioItem.video_url,
          project_date: portfolioItem.project_date?.toISOString() || null,
          client_name: portfolioItem.client_name,
          tools_used: portfolioItem.tools_used
            ? JSON.parse(portfolioItem.tools_used)
            : [],
          is_featured: portfolioItem.is_featured,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create portfolio error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menambahkan portfolio" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        seniman_profile: true,
      },
    });

    if (!user || !user.seniman_profile) {
      return NextResponse.json(
        { error: "Seniman profile not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      id,
      title,
      description,
      category,
      image_urls,
      video_url,
      project_date,
      client_name,
      tools_used,
      is_featured,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID portfolio wajib diisi" },
        { status: 400 }
      );
    }

    // Check if portfolio item exists and belongs to user
    const existingItem = await db.portfolioItem.findFirst({
      where: {
        id,
        seniman_id: user.seniman_profile.id,
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Portfolio item not found" },
        { status: 404 }
      );
    }

    // Update portfolio item
    const updatedItem = await db.portfolioItem.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existingItem.title,
        description:
          description !== undefined ? description : existingItem.description,
        category: category !== undefined ? category : existingItem.category,
        image_urls:
          image_urls !== undefined
            ? image_urls.length > 0
              ? JSON.stringify(image_urls)
              : null
            : existingItem.image_urls,
        video_url: video_url !== undefined ? video_url : existingItem.video_url,
        project_date:
          project_date !== undefined
            ? project_date
              ? new Date(project_date)
              : null
            : existingItem.project_date,
        client_name:
          client_name !== undefined ? client_name : existingItem.client_name,
        tools_used:
          tools_used !== undefined
            ? tools_used.length > 0
              ? JSON.stringify(tools_used)
              : null
            : existingItem.tools_used,
        is_featured:
          is_featured !== undefined ? is_featured : existingItem.is_featured,
      },
    });

    return NextResponse.json({
      message: "Portfolio berhasil diperbarui",
      portfolio: {
        id: updatedItem.id,
        title: updatedItem.title,
        description: updatedItem.description,
        category: updatedItem.category,
        image_urls: updatedItem.image_urls
          ? JSON.parse(updatedItem.image_urls)
          : [],
        video_url: updatedItem.video_url,
        project_date: updatedItem.project_date?.toISOString() || null,
        client_name: updatedItem.client_name,
        tools_used: updatedItem.tools_used
          ? JSON.parse(updatedItem.tools_used)
          : [],
        is_featured: updatedItem.is_featured,
      },
    });
  } catch (error) {
    console.error("Update portfolio error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memperbarui portfolio" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        seniman_profile: true,
      },
    });

    if (!user || !user.seniman_profile) {
      return NextResponse.json(
        { error: "Seniman profile not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const portfolioId = searchParams.get("id");

    if (!portfolioId) {
      return NextResponse.json(
        { error: "ID portfolio wajib diisi" },
        { status: 400 }
      );
    }

    // Check if portfolio item exists and belongs to user
    const existingItem = await db.portfolioItem.findFirst({
      where: {
        id: portfolioId,
        seniman_id: user.seniman_profile.id,
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Portfolio item not found" },
        { status: 404 }
      );
    }

    // Delete portfolio item
    await db.portfolioItem.delete({
      where: { id: portfolioId },
    });

    // Update portfolio count
    await db.senimanProfile.update({
      where: { id: user.seniman_profile.id },
      data: {
        portfolio_count: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json({
      message: "Portfolio berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete portfolio error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghapus portfolio" },
      { status: 500 }
    );
  }
}
