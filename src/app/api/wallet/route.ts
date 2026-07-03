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
        galleons: true,
        sickles: true,
        knuts: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'ইউজার পাওয়া যায়নি' },
        { status: 404 }
      )
    }

    // মোট ব্যালেন্স গ্যালিয়নে রূপান্তর
    // 1G = 17S = 493K
    const totalInGalleons =
      user.galleons +
      user.sickles / 17 +
      user.knuts / 493

    // সাম্প্রতিক লেনদেন (শেষ ২০টি)
    const transactions = await db.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    return NextResponse.json({
      galleons: user.galleons,
      sickles: user.sickles,
      knuts: user.knuts,
      totalInGalleons: Math.round(totalInGalleons * 100) / 100,
      transactions,
    })
  } catch (error) {
    console.error('Wallet error:', error)
    return NextResponse.json(
      { success: false, error: 'ওয়ালেট লোডে সমস্যা' },
      { status: 500 }
    )
  }
}