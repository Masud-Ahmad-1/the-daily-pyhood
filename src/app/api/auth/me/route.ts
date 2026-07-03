import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId প্রয়োজন' },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        displayName: true,
        email: true,
        role: true,
        galleons: true,
        sickles: true,
        knuts: true,
        subscriptionPlan: true,
        subscriptionEnds: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'ইউজার পাওয়া যায়নি' },
        { status: 404 }
      )
    }

    // সাবস্ক্রিপশন মেয়াদ শেষ হয়ে গেলে রিসেট করুন
    let plan = user.subscriptionPlan
    let endsAt = user.subscriptionEnds
    if (endsAt && new Date(endsAt) < new Date()) {
      plan = null
      endsAt = null
      await db.user.update({
        where: { id: userId },
        data: { subscriptionPlan: null, subscriptionEnds: null },
      })
    }

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        subscriptionPlan: plan,
        subscriptionEnds: endsAt,
      },
    })
  } catch (error) {
    console.error('Me error:', error)
    return NextResponse.json(
      { success: false, error: 'প্রোফাইল লোডে সমস্যা' },
      { status: 500 }
    )
  }
}