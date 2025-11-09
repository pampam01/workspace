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
    const userId = searchParams.get('userId')
    const projectId = searchParams.get('projectId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    let whereClause: any = {}

    if (userId) {
      whereClause.OR = [
        { sender_id: session.user.id, receiver_id: userId },
        { sender_id: userId, receiver_id: session.user.id }
      ]
    }

    if (projectId) {
      whereClause.project_id = projectId
    }

    const messages = await db.message.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            profile_picture_url: true
          }
        },
        receiver: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            profile_picture_url: true
          }
        }
      },
      orderBy: {
        created_at: 'asc'
      },
      skip: offset,
      take: limit
    })

    // Mark messages as read
    if (userId) {
      await db.message.updateMany({
        where: {
          sender_id: userId,
          receiver_id: session.user.id,
          is_read: false
        },
        data: {
          is_read: true,
          read_at: new Date()
        }
      })
    }

    return NextResponse.json({ messages })

  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil pesan' },
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
      receiverId,
      projectId,
      message,
      attachmentUrls
    } = body

    // Validate required fields
    if (!receiverId || !message) {
      return NextResponse.json(
        { error: 'Receiver ID dan message harus diisi' },
        { status: 400 }
      )
    }

    // Create message
    const newMessage = await db.message.create({
      data: {
        project_id: projectId || null,
        sender_id: session.user.id,
        receiver_id: receiverId,
        message,
        attachment_urls: attachmentUrls || null
      }
    })

    // Create notification
    await db.notification.create({
      data: {
        user_id: receiverId,
        type: 'message_received',
        title: 'Pesan Baru',
        description: `Anda menerima pesan baru dari ${session.user.first_name || session.user.email}`,
        related_id: projectId
      }
    })

    return NextResponse.json(
      { message: 'Pesan berhasil dikirim', data: newMessage },
      { status: 201 }
    )

  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengirim pesan' },
      { status: 500 }
    )
  }
}