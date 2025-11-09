import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { notificationId, notificationIds, markAll } = body;

    if (markAll) {
      // Mark all notifications as read
      await db.notification.updateMany({
        where: {
          user_id: session.user.id,
          is_read: false,
        },
        data: {
          is_read: true,
        },
      });

      return NextResponse.json({
        message: "Semua notifikasi ditandai sebagai dibaca",
      });
    } else if (notificationId) {
      // Mark single notification as read
      await db.notification.updateMany({
        where: {
          id: notificationId,
          user_id: session.user.id,
        },
        data: {
          is_read: true,
        },
      });

      return NextResponse.json({
        message: "Notifikasi ditandai sebagai dibaca",
      });
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      await db.notification.updateMany({
        where: {
          id: { in: notificationIds },
          user_id: session.user.id,
        },
        data: {
          is_read: true,
        },
      });

      return NextResponse.json({
        message: "Notifikasi ditandai sebagai dibaca",
      });
    } else {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
  } catch (error) {
    console.error("Mark notifications as read error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menandai notifikasi" },
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

    const body = await request.json();
    const { notificationIds, markAll } = body;

    if (markAll) {
      // Mark all notifications as read
      await db.notification.updateMany({
        where: {
          user_id: session.user.id,
          is_read: false,
        },
        data: {
          is_read: true,
        },
      });

      return NextResponse.json({
        message: "Semua notifikasi ditandai sebagai dibaca",
      });
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      await db.notification.updateMany({
        where: {
          id: { in: notificationIds },
          user_id: session.user.id,
        },
        data: {
          is_read: true,
        },
      });

      return NextResponse.json({
        message: "Notifikasi ditandai sebagai dibaca",
      });
    } else {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
  } catch (error) {
    console.error("Mark notifications as read error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menandai notifikasi" },
      { status: 500 }
    );
  }
}
