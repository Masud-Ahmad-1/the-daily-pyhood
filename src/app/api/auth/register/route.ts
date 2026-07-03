import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// সরল হ্যাশ ফাংশন (production-এ bcrypt ব্যবহার করুন)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'pyhood_salt_2024')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, displayName, password, email } = body

    if (!username || !displayName || !password) {
      return NextResponse.json(
        { success: false, error: 'ইউজারনেম, প্রদর্শন নাম এবং পাসওয়ার্ড প্রয়োজন' },
        { status: 400 }
      )
    }

    if (username.length < 3) {
      return NextResponse.json(
        { success: false, error: 'ইউজারনেম কমপক্ষে ৩ অক্ষরের হতে হবে' },
        { status: 400 }
      )
    }

    if (password.length < 4) {
      return NextResponse.json(
        { success: false, error: 'পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে' },
        { status: 400 }
      )
    }

    // username unique চেক
    const existing = await db.user.findUnique({ where: { username } })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'এই ইউজারনেমটি ইতিমধ্যে ব্যবহৃত হচ্ছে' },
        { status: 409 }
      )
    }

    // email unique চেক
    if (email) {
      const existingEmail = await db.user.findUnique({ where: { email } })
      if (existingEmail) {
        return NextResponse.json(
          { success: false, error: 'এই ইমেইলটি ইতিমধ্যে নিবন্ধিত' },
          { status: 409 }
        )
      }
    }

    const passwordHash = await hashPassword(password)

    // স্বাগত বোনাস: ৫০ গ্যালিয়ন
    const welcomeGalleons = 50

    const user = await db.user.create({
      data: {
        username,
        displayName,
        passwordHash,
        email: email || null,
        galleons: welcomeGalleons,
        transactions: {
          create: {
            type: 'bonus',
            amountG: welcomeGalleons,
            amountS: 0,
            amountK: 0,
            description: 'গ্রিংগটস ব্যাংকে স্বাগত বোনাস',
            balanceG: welcomeGalleons,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        galleons: user.galleons,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'নিবন্ধনে সমস্যা হয়েছে' },
      { status: 500 }
    )
  }
}