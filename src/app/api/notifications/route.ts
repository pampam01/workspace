import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const offset = (page - 1) * limit

    let whereClause: any = {
      user_id: session.user.id
    }

    if (unreadOnly) {
      whereClause.is_read = false
    }

    const notifications = await db.notification.findMany({
      where: whereClause,
      orderBy: {
        created_at: 'desc'
      },
      skip: offset,
      take: limit
    })

    const total = await db.notification.count({
      where: whereClause
    })

    const unreadCount = await db.notification.count({
      where: {
        user_id: session.user.id,
        is_read: false
      }
    })

    return NextResponse.json({
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil notifikasi' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      userId,
      type,
      title,
      description,
      relatedId
    } = body

    // Validate required fields
    if (!userId || !type || !title || !description) {
      return NextResponse.json(
        { error: 'Field wajib harus diisi' },
        { status: 400 }
      )
    }

    // Create notification
    const notification = await db.notification.create({
      data: {
        user_id: userId,
        type,
        title,
        description,
        related_id: relatedId || null
      }
    })

    return NextResponse.json(
      { message: 'Notifikasi berhasil dibuat', notification },
      { status: 201 }
    )

  } catch (error) {
    console.error('Create notification error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat notifikasi' },
      { status: 500 }
    )
  }
}