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
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    let whereClause: any = {
      seniman_id: user.seniman_profile.id,
    };

    if (status) {
      whereClause.status = status;
    }

    const projects = await db.project.findMany({
      where: whereClause,
      include: {
        klien: {
          include: {
            user: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                profile_picture_url: true,
                email: true,
              },
            },
          },
        },
        transactions: true,
      },
      orderBy: {
        updated_at: "desc",
      },
      skip: offset,
      take: limit,
    });

    const total = await db.project.count({
      where: whereClause,
    });

    const formattedProjects = projects.map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      category: project.category,
      budget: Number(project.budget),
      budget_type: project.budget_type,
      status: project.status,
      start_date: project.start_date?.toISOString() || null,
      deadline: project.deadline?.toISOString() || null,
      estimated_duration_days: project.estimated_duration_days,
      client:
        project.klien.company_name ||
        `${project.klien.user.first_name} ${project.klien.user.last_name}`.trim() ||
        project.klien.user.email,
      client_avatar: project.klien.user.profile_picture_url || null,
      progress:
        project.status === "COMPLETED"
          ? 100
          : project.status === "IN_PROGRESS"
          ? 50
          : 0,
      created_at: project.created_at.toISOString(),
      updated_at: project.updated_at.toISOString(),
    }));

    return NextResponse.json({
      projects: formattedProjects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get seniman projects error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil proyek" },
      { status: 500 }
    );
  }
}
