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
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    let whereClause: any = {}

    if (userId) {
      whereClause.reviewee_id = userId
    }

    if (projectId) {
      whereClause.project_id = projectId
    }

    const reviews = await db.review.findMany({
      where: whereClause,
      include: {
        reviewer: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            profile_picture_url: true
          }
        },
        project: {
          select: {
            id: true,
            title: true,
            category: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      skip: offset,
      take: limit
    })

    const total = await db.review.count({
      where: whereClause
    })

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get reviews error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil review' },
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
      projectId,
      revieweeId,
      rating,
      comment,
      professionalism,
      quality_of_work,
      communication,
      timeliness,
      would_hire_again
    } = body

    // Validate required fields
    if (!projectId || !revieweeId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Field wajib harus diisi' },
        { status: 400 }
      )
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating harus antara 1-5' },
        { status: 400 }
      )
    }

    // Check if user already reviewed this project
    const existingReview = await db.review.findFirst({
      where: {
        project_id: projectId,
        reviewer_id: session.user.id
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'Anda sudah memberikan review untuk proyek ini' },
        { status: 400 }
      )
    }

    // Check if project is completed
    const project = await db.project.findUnique({
      where: { id: projectId }
    })

    if (!project || project.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Hanya proyek yang sudah selesai yang bisa direview' },
        { status: 400 }
      )
    }

    // Create review
    const review = await db.review.create({
      data: {
        project_id: projectId,
        reviewer_id: session.user.id,
        reviewee_id: revieweeId,
        reviewer_type: session.user.userType === 'KLIEN' ? 'klien' : 'seniman',
        rating,
        comment,
        professionalism,
        quality_of_work,
        communication,
        timeliness,
        would_hire_again
      }
    })

    // Update seniman profile rating
    if (session.user.userType === 'KLIEN') {
      const allReviews = await db.review.findMany({
        where: {
          reviewee_id: revieweeId,
          reviewer_type: 'klien'
        }
      })

      const averageRating = allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length

      await db.senimanProfile.update({
        where: { user_id: revieweeId },
        data: {
          rating_average: averageRating,
          total_reviews: allReviews.length
        }
      })
    }

    // Update klien profile rating
    if (session.user.userType === 'SENIMAN') {
      const allReviews = await db.review.findMany({
        where: {
          reviewee_id: revieweeId,
          reviewer_type: 'seniman'
        }
      })

      const averageRating = allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length

      await db.klienProfile.update({
        where: { user_id: revieweeId },
        data: {
          rating_as_buyer: averageRating
        }
      })
    }

    // Create notification
    await db.notification.create({
      data: {
        user_id: revieweeId,
        type: 'review_posted',
        title: 'Review Baru',
        description: `Anda menerima review ${rating} bintang untuk proyek ${project.title}`,
        related_id: projectId
      }
    })

    return NextResponse.json(
      { message: 'Review berhasil dikirim', review },
      { status: 201 }
    )

  } catch (error) {
    console.error('Create review error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat review' },
      { status: 500 }
    )
  }
}