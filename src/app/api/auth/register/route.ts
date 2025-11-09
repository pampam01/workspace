import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userType,
      email,
      password,
      firstName,
      lastName,
      phone,
      // Seniman fields
      bio,
      lokasi,
      kategori,
      ratePerHour,
      ratePerProject,
      yearsExperience,
      // Klien fields
      companyName,
      companyDescription,
      companyWebsite,
      companySize,
      industry
    } = body

    // Validate required fields
    if (!email || !password || !firstName || !userType) {
      return NextResponse.json(
        { error: 'Email, password, nama, dan tipe user harus diisi' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const user = await db.user.create({
      data: {
        email,
        password_hash: passwordHash,
        user_type: userType,
        first_name: firstName,
        last_name: lastName || '',
        phone: phone || '',
        is_verified: false
      }
    })

    // Create profile based on user type
    if (userType === 'SENIMAN') {
      await db.senimanProfile.create({
        data: {
          user_id: user.id,
          bio: bio || '',
          lokasi: lokasi || '',
          kategori: kategori || '',
          rate_per_hour: ratePerHour || null,
          rate_per_project: ratePerProject || null,
          years_experience: yearsExperience ? parseInt(yearsExperience) : null,
          availability_status: 'AVAILABLE',
          verification_status: 'UNVERIFIED'
        }
      })
    } else if (userType === 'KLIEN') {
      await db.klienProfile.create({
        data: {
          user_id: user.id,
          company_name: companyName || '',
          company_description: companyDescription || '',
          company_website: companyWebsite || '',
          company_size: companySize || 'PERSONAL',
          industry: industry || ''
        }
      })
    }

    return NextResponse.json(
      { 
        message: 'Registrasi berhasil! Silakan cek email untuk verifikasi.',
        userId: user.id
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat registrasi' },
      { status: 500 }
    )
  }
}