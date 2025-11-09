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
        klien_profile: true,
      },
    });

    if (!user || !user.klien_profile) {
      return NextResponse.json(
        { error: "Klien profile not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    let whereClause: any = {
      klien_id: user.klien_profile.id,
    };

    if (status) {
      whereClause.status = status;
    }

    const projects = await db.project.findMany({
      where: whereClause,
      include: {
        seniman: {
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
        proposals: {
          include: {
            seniman: {
              include: {
                user: {
                  select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    profile_picture_url: true,
                  },
                },
              },
            },
          },
          orderBy: {
            created_at: "desc",
          },
        },
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

    const formattedProjects = projects.map((project) => {
      const senimanUser = project.seniman?.user;
      return {
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
        proposals_count: project.proposals.length,
        created_at: project.created_at.toISOString(),
        updated_at: project.updated_at.toISOString(),
        hired_seniman: senimanUser
          ? {
              id: senimanUser.id,
              name:
                `${senimanUser.first_name || ""} ${
                  senimanUser.last_name || ""
                }`.trim() || senimanUser.email,
              avatar: senimanUser.profile_picture_url || null,
              rating: Number(project.seniman?.rating_average) || 0,
            }
          : null,
        negotiating_seniman:
          project.status === "NEGOTIATING" && project.proposals.length > 0
            ? {
                id: project.proposals[0].seniman.user.id,
                name:
                  `${project.proposals[0].seniman.user.first_name || ""} ${
                    project.proposals[0].seniman.user.last_name || ""
                  }`.trim() || project.proposals[0].seniman.user.email,
                avatar:
                  project.proposals[0].seniman.user.profile_picture_url || null,
                rating:
                  Number(project.proposals[0].seniman.rating_average) || 0,
              }
            : null,
      };
    });

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
    console.error("Get klien projects error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil proyek" },
      { status: 500 }
    );
  }
}
