import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// সরল হ্যাশ ফাংশন
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
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'ইউজারনেম এবং পাসওয়ার্ড প্রয়োজন' },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({ where: { username } })
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, error: 'ইউজারনেম বা পাসওয়ার্ড ভুল' },
        { status: 401 }
      )
    }

    const inputHash = await hashPassword(password)
    if (inputHash !== user.passwordHash) {
      return NextResponse.json(
        { success: false, error: 'ইউজারনেম বা পাসওয়ার্ড ভুল' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        galleons: user.galleons,
        sickles: user.sickles,
        knuts: user.knuts,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionEnds: user.subscriptionEnds,
        role: user.role,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'লগইনে সমস্যা হয়েছে' },
      { status: 500 }
    )
  }
}