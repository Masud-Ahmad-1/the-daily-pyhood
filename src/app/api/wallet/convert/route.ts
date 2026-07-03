import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// রূপান্তর হার: 1G = 17S = 493K
function toKnuts(g: number, s: number, k: number): number {
  return g * 493 + s * 29 + k
}

function fromKnuts(totalKnuts: number): { g: number; s: number; k: number } {
  const g = Math.floor(totalKnuts / 493)
  let remaining = totalKnuts % 493
  const s = Math.floor(remaining / 29)
  const k = remaining % 29
  return { g, s, k }
}

const CURRENCY_NAMES: Record<string, string> = {
  galleons: 'গ্যালিয়ন',
  sickles: 'সিকেল',
  knuts: 'নাট',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, from, to, amount } = body

    if (!userId || !from || !to || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'সঠিক তথ্য দিন (userId, from, to, amount)' },
        { status: 400 }
      )
    }

    if (!['galleons', 'sickles', 'knuts'].includes(from) || !['galleons', 'sickles', 'knuts'].includes(to)) {
      return NextResponse.json(
        { success: false, error: 'অবৈধ মুদ্রা' },
        { status: 400 }
      )
    }

    if (from === to) {
      return NextResponse.json(
        { success: false, error: 'একই মুদ্রায় রূপান্তর সম্ভব নয়' },
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

    // ব্যালেন্স চেক
    if (from === 'galleons' && user.galleons < amount) {
      return NextResponse.json(
        { success: false, error: `পর্যাপ্ত গ্যালিয়ন নে। আপনার ব্যালেন্স: ${user.galleons}G` },
        { status: 400 }
      )
    }
    if (from === 'sickles' && user.sickles < amount) {
      return NextResponse.json(
        { success: false, error: `পর্যাপ্ত সিকেল নে। আপনার ব্যালেন্স: ${user.sickles}S` },
        { status: 400 }
      )
    }
    if (from === 'knuts' && user.knuts < amount) {
      return NextResponse.json(
        { success: false, error: `পর্যাপ্ত নাট নে। আপনার ব্যালেন্স: ${user.knuts}K` },
        { status: 400 }
      )
    }

    // রূপান্তর গণনা
    let currentKnuts = toKnuts(user.galleons, user.sickles, user.knuts)

    // source থেকে কাটা
    const fromKnutsPerUnit = from === 'galleons' ? 493 : from === 'sickles' ? 29 : 1
    currentKnuts -= amount * fromKnutsPerUnit

    // destination-এ যোগ
    const toKnutsPerUnit = to === 'galleons' ? 493 : to === 'sickles' ? 29 : 1
    const convertedAmount = Math.floor(amount * fromKnutsPerUnit / toKnutsPerUnit)
    currentKnuts += convertedAmount * toKnutsPerUnit

    const newBalance = fromKnuts(currentKnuts)

    // ইউজার আপডেট
    await db.user.update({
      where: { id: userId },
      data: newBalance,
    })

    // লেনদেন রেকর্ড
    await db.transaction.create({
      data: {
        userId,
        type: 'conversion',
        amountG: from === 'galleons' ? -amount : to === 'galleons' ? convertedAmount : 0,
        amountS: from === 'sickles' ? -amount : to === 'sickles' ? convertedAmount : 0,
        amountK: from === 'knuts' ? -amount : to === 'knuts' ? convertedAmount : 0,
        description: `${amount} ${CURRENCY_NAMES[from]} → ${convertedAmount} ${CURRENCY_NAMES[to]} রূপান্তর`,
        balanceG: newBalance.g,
      },
    })

    return NextResponse.json({
      success: true,
      converted: convertedAmount,
      newBalance,
      message: `${amount} ${CURRENCY_NAMES[from]} → ${convertedAmount} ${CURRENCY_NAMES[to]} রূপান্তরিত হয়েছে`,
    })
  } catch (error) {
    console.error('Convert error:', error)
    return NextResponse.json(
      { success: false, error: 'রূপান্তরে সমস্যা হয়েছে' },
      { status: 500 }
    )
  }
}