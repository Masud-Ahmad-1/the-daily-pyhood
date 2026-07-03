import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

const PLAN_PRICES: Record<string, number> = {
  owl: 5,
  phoenix: 15,
  dragon: 50,
}

const PLAN_NAMES: Record<string, string> = {
  owl: 'আউল প্ল্যান',
  phoenix: 'ফিনিক্স প্ল্যান',
  dragon: 'ড্রাগন প্ল্যান',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, plan } = body

    if (!userId || !plan) {
      return NextResponse.json(
        { success: false, error: 'userId এবং plan প্রয়োজন' },
        { status: 400 }
      )
    }

    if (!PLAN_PRICES[plan]) {
      return NextResponse.json(
        { success: false, error: 'অবৈধ প্ল্যান' },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'ইউজার পাওয়া যায়নি' },
        { status: 404 }
      )
    }

    const price = PLAN_PRICES[plan]

    // ব্যালেন্স চেক
    if (user.galleons < price) {
      return NextResponse.json(
        {
          success: false,
          error: `পর্যাপ্ত গ্যালিয়ন নেই। প্রয়োজন: ${price}G, আপনার ব্যালেন্স: ${user.galleons}G`,
          required: price,
          current: user.galleons,
        },
        { status: 400 }
      )
    }

    const newBalance = user.galleons - price
    const endsAt = new Date()
    endsAt.setDate(endsAt.getDate() + 30)

    // আপডেট ইউজার
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        galleons: newBalance,
        subscriptionPlan: plan,
        subscriptionEnds: endsAt,
      },
    })

    // লেনদেন রেকর্ড
    await db.transaction.create({
      data: {
        userId,
        type: 'subscription',
        amountG: -price,
        amountS: 0,
        amountK: 0,
        description: `${PLAN_NAMES[plan]} সাবস্ক্রিপশন (৩০ দিন)`,
        balanceG: newBalance,
      },
    })

    return NextResponse.json({
      success: true,
      newBalance,
      plan,
      endsAt: endsAt.toISOString(),
      message: `${PLAN_NAMES[plan]} সফলভাবে সাবস্ক্রাইব হয়েছে!`,
    })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { success: false, error: 'সাবস্ক্রিপশনে সমস্যা হয়েছে' },
      { status: 500 }
    )
  }
}