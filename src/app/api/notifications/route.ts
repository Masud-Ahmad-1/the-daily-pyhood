import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: ইউজারের নোটিফিকেশন
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const skip = (page - 1) * limit

    if (!userId) {
      return NextResponse.json({ error: 'userId প্রয়োজন' }, { status: 400 })
    }

    const where: Record<string, unknown> = { userId }
    if (unreadOnly) where.isRead = false

    const [notifications, total, unreadCount] = await Promise.all([
      db.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.notification.count({ where }),
      db.notification.count({ where: { userId, isRead: false } }),
    ])

    return NextResponse.json({
      notifications,
      total,
      unreadCount,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Notifications GET error:', error)
    return NextResponse.json({ error: 'নোটিফিকেশন লোড করতে সমস্যা' }, { status: 500 })
  }
}

// POST: নোটিফিকেশন তৈরি (সিস্টেম/অ্যাডমিন)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, type, title, message, link } = body

    if (!userId || !type || !title || !message) {
      return NextResponse.json({ error: 'সব ফিল্ড প্রয়োজন' }, { status: 400 })
    }

    const validTypes = ['comment_reply', 'new_article', 'subscription_expiry', 'galleon_earned', 'system']
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'অবৈধ নোটিফিকেশন টাইপ' }, { status: 400 })
    }

    const notification = await db.notification.create({
      data: { userId, type, title, message, link: link || null },
    })

    return NextResponse.json({ notification }, { status: 201 })
  } catch (error) {
    console.error('Notification POST error:', error)
    return NextResponse.json({ error: 'নোটিফিকেশন তৈরিতে সমস্যা' }, { status: 500 })
  }
}

// PUT: পড়া হয়েছে মার্ক
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { ids, markAll, userId } = body

    if (markAll && userId) {
      await db.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      })
      return NextResponse.json({ success: true, message: 'সব নোটিফিকেশন পড়া হয়েছে' })
    }

    if (ids && Array.isArray(ids)) {
      await db.notification.updateMany({
        where: { id: { in: ids } },
        data: { isRead: true },
      })
      return NextResponse.json({ success: true, message: `${ids.length}টি নোটিফিকেশন পড়া হয়েছে` })
    }

    return NextResponse.json({ error: 'ids বা markAll প্রয়োজন' }, { status: 400 })
  } catch (error) {
    console.error('Notification PUT error:', error)
    return NextResponse.json({ error: 'আপডেট করতে সমস্যা' }, { status: 500 })
  }
}