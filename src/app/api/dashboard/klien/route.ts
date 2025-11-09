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
        klien_profile: {
          include: {
            projects: {
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
                },
                transactions: true,
              },
              orderBy: { updated_at: "desc" },
              take: 10,
            },
            reviews_given: {
              include: {
                project: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
            transactions: {
              include: {
                project: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
                seniman: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                      },
                    },
                  },
                },
              },
              orderBy: { created_at: "desc" },
              take: 10,
            },
          },
        },
      },
    });

    if (!user || !user.klien_profile) {
      return NextResponse.json(
        { error: "Klien profile not found" },
        { status: 404 }
      );
    }

    const profile = user.klien_profile;

    // Calculate stats
    const totalProjects = await db.project.count({
      where: { klien_id: profile.id },
    });

    const activeProjects = await db.project.count({
      where: {
        klien_id: profile.id,
        status: "IN_PROGRESS",
      },
    });

    const completedProjects = await db.project.count({
      where: {
        klien_id: profile.id,
        status: "COMPLETED",
      },
    });

    // Calculate total spent from completed transactions
    const transactions = await db.transaction.findMany({
      where: {
        klien_id: profile.id,
        status: "COMPLETED",
      },
    });

    const totalSpent = transactions.reduce(
      (sum, t) => sum + Number(t.amount),
      0
    );

    // Monthly spent (current month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyTransactions = transactions.filter(
      (t) => new Date(t.completed_at || t.created_at) >= startOfMonth
    );
    const monthlySpent = monthlyTransactions.reduce(
      (sum, t) => sum + Number(t.amount),
      0
    );

    // Get pending proposals count
    const pendingProposals = await db.projectProposal.count({
      where: {
        project: {
          klien_id: profile.id,
        },
        status: "PENDING",
      },
    });

    // Get average rating from reviews given
    const reviewsGiven = await db.review.findMany({
      where: {
        reviewer_id: user.id,
        reviewer_type: "KLIEN",
      },
    });

    const averageRating =
      reviewsGiven.length > 0
        ? reviewsGiven.reduce((sum, r) => sum + r.rating, 0) /
          reviewsGiven.length
        : 0;

    // Get notifications
    const notifications = await db.notification.findMany({
      where: { user_id: user.id },
      orderBy: { created_at: "desc" },
      take: 10,
    });

    // Format recent projects
    const recentProjects = profile.projects.map((project) => {
      const senimanUser = project.seniman?.user;
      return {
        id: project.id,
        title: project.title,
        category: project.category,
        status: project.status,
        budget: Number(project.budget),
        budget_type: project.budget_type,
        deadline: project.deadline?.toISOString() || null,
        proposals_count: project.proposals.length,
        created_at: project.created_at.toISOString(),
        hired_seniman: senimanUser
          ? {
              name:
                `${senimanUser.first_name || ""} ${
                  senimanUser.last_name || ""
                }`.trim() || senimanUser.email,
              avatar: senimanUser.profile_picture_url || null,
              rating: Number(project.seniman?.rating_average) || 0,
            }
          : undefined,
        negotiating_seniman:
          project.status === "NEGOTIATING" && project.proposals.length > 0
            ? {
                name:
                  `${project.proposals[0].seniman.user.first_name || ""} ${
                    project.proposals[0].seniman.user.last_name || ""
                  }`.trim() || project.proposals[0].seniman.user.last_name,
                avatar:
                  project.proposals[0].seniman.user.profile_picture_url || null,
                rating:
                  Number(project.proposals[0].seniman.rating_average) || 0,
              }
            : undefined,
      };
    });

    // Format notifications
    const formattedNotifications = notifications.map((notif) => ({
      id: notif.id,
      type: notif.type,
      title: notif.title,
      description: notif.description,
      time: formatTimeAgo(notif.created_at),
      is_read: notif.is_read,
    }));

    // Format transactions
    const recentTransactions = profile.transactions.map((transaction) => {
      const senimanUser = transaction.seniman.user;
      return {
        id: transaction.id,
        project_title: transaction.project.title,
        seniman_name:
          `${senimanUser.first_name || ""} ${
            senimanUser.last_name || ""
          }`.trim() || senimanUser.last_name,
        amount: Number(transaction.amount),
        status: transaction.status,
        date: transaction.created_at.toISOString(),
      };
    });

    // TODO: Implement saved artisans feature
    const savedArtisans: any[] = [];

    return NextResponse.json({
      user: {
        id: user.id,
        name:
          profile.company_name ||
          `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
          user.email,
        avatar: user.profile_picture_url || null,
        email: user.email,
        company_size: profile.company_size,
        industry: profile.industry,
      },
      stats: {
        total_projects: totalProjects,
        active_projects: activeProjects,
        completed_projects: completedProjects,
        total_spent: totalSpent,
        monthly_spent: monthlySpent,
        average_rating: averageRating,
        total_reviews: reviewsGiven.length,
        saved_artisans: savedArtisans.length,
        pending_proposals: pendingProposals,
      },
      recentProjects,
      notifications: formattedNotifications,
      savedArtisans,
      recentTransactions,
    });
  } catch (error) {
    console.error("Dashboard klien error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data dashboard" },
      { status: 500 }
    );
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Baru saja";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} hari yang lalu`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} minggu yang lalu`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} bulan yang lalu`;
}
