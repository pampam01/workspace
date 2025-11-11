import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user exists first
    const userCheck = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, user_type: true },
    });

    if (!userCheck) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is a seniman
    if (userCheck.user_type !== "SENIMAN") {
      return NextResponse.json(
        { error: "User is not a seniman" },
        { status: 403 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        seniman_profile: {
          include: {
            portfolio_items: {
              orderBy: { created_at: "desc" },
              take: 6,
            },
            projects: {
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
              orderBy: { updated_at: "desc" },
              take: 10,
            },
            reviews_received: {
              include: {
                reviewer: {
                  select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    profile_picture_url: true,
                  },
                },
                project: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.seniman_profile) {
      return NextResponse.json(
        {
          error:
            "Seniman profile not found. Please complete your profile setup.",
        },
        { status: 404 }
      );
    }

    const profile = user.seniman_profile;

    // Stats
    const totalProjects = await db.project.count({
      where: { seniman_id: profile.id },
    });

    const activeProjects = await db.project.count({
      where: {
        seniman_id: profile.id,
        status: "IN_PROGRESS",
      },
    });

    const completedProjects = await db.project.count({
      where: {
        seniman_id: profile.id,
        status: "COMPLETED",
      },
    });

    const transactions = await db.transaction.findMany({
      where: {
        seniman_id: profile.id,
        status: "COMPLETED",
      },
    });

    const totalEarnings = transactions.reduce(
      (sum, t) => sum + Number(t.net_amount),
      0
    );

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyTransactions = transactions.filter(
      (t) => new Date(t.completed_at || t.created_at) >= startOfMonth
    );
    const monthlyEarnings = monthlyTransactions.reduce(
      (sum, t) => sum + Number(t.net_amount),
      0
    );

    const unreadNotifications = await db.notification.count({
      where: {
        user_id: user.id,
        is_read: false,
      },
    });

    const notifications = await db.notification.findMany({
      where: { user_id: user.id },
      orderBy: { created_at: "desc" },
      take: 10,
    });

    // 🧩 Format projects
    const recentProjects = profile.projects.map((project) => ({
      id: project.id,
      title: project.title,
      client:
        project.klien.company_name ||
        `${project.klien.user.first_name} ${project.klien.user.last_name}`.trim() ||
        project.klien.user.email,
      status: project.status,
      budget: Number(project.budget),
      deadline: project.deadline?.toISOString() || null,
      start_date: project.start_date?.toISOString() || null,
      progress:
        project.status === "COMPLETED"
          ? 100
          : project.status === "IN_PROGRESS"
          ? 50
          : 0,
      client_avatar: project.klien.user.profile_picture_url || null,
    }));

    // 🧩 FIX: image_urls error-safe parser
    const portfolio = profile.portfolio_items.map((item) => {
      let imageUrl = "/placeholder.jpg";

      if (item.image_urls) {
        try {
          if (typeof item.image_urls === "string") {
            if (item.image_urls.trim().startsWith("[")) {
              const parsed = JSON.parse(item.image_urls);
              if (Array.isArray(parsed) && parsed.length > 0) {
                imageUrl = parsed[0];
              }
            } else {
              // langsung URL tunggal
              imageUrl = item.image_urls;
            }
          } else if (Array.isArray(item.image_urls)) {
            imageUrl = item.image_urls[0] || "/placeholder.jpg";
          }
        } catch {
          imageUrl = "/placeholder.jpg";
        }
      }

      return {
        id: item.id,
        title: item.title,
        category: item.category || "",
        image_url: imageUrl,
        views: 0,
        likes: 0,
        is_featured: item.is_featured,
      };
    });

    // 🧩 Format notifikasi
    const formattedNotifications = notifications.map((notif) => ({
      id: notif.id,
      type: notif.type,
      title: notif.title,
      description: notif.description,
      time: formatTimeAgo(notif.created_at),
      is_read: notif.is_read,
    }));

    return NextResponse.json({
      user: {
        id: user.id,
        name:
          `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
          user.email,
        avatar: user.profile_picture_url || null,
        email: user.email,
        verification_status: profile.verification_status,
        is_featured: profile.is_featured,
      },
      stats: {
        total_projects: totalProjects,
        active_projects: activeProjects,
        completed_projects: completedProjects,
        total_earnings: totalEarnings,
        monthly_earnings: monthlyEarnings,
        average_rating: Number(profile.rating_average) || 0,
        total_reviews: profile.total_reviews || 0,
        profile_views: 0,
        response_rate: 98,
        response_time: profile.response_time_hours || 0,
      },
      recentProjects,
      notifications: formattedNotifications,
      portfolio,
    });
  } catch (error) {
    console.error("Dashboard seniman error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error details:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: "Terjadi kesalahan saat mengambil data dashboard",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Baru saja";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks} minggu yang lalu`;
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} bulan yang lalu`;
}
