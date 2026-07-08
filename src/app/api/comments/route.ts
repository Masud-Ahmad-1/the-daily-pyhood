import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: আর্টিকেলের অনুমোদিত মন্তব্য (articleId query param)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const articleId = searchParams.get('articleId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const parentId = searchParams.get('parentId') // null = top-level comments
    const skip = (page - 1) * limit

    if (!articleId) {
      return NextResponse.json({ error: 'articleId প্রয়োজন' }, { status: 400 })
    }

    const where: Record<string, unknown> = {
      articleId,
      isApproved: true,
      parentId: parentId || null,
    }

    const [comments, total] = await Promise.all([
      db.comment.findMany({
        where,
        include: {
          user: { select: { id: true, username: true, displayName: true, subscriptionPlan: true } },
          replies: {
            where: { isApproved: true },
            include: {
              user: { select: { id: true, username: true, displayName: true, subscriptionPlan: true } },
            },
            orderBy: { createdAt: 'asc' },
          },
          _count: { select: { replies: { where: { isApproved: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.comment.count({ where }),
    ])

    return NextResponse.json({
      comments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Comments GET error:', error)
    return NextResponse.json({ error: 'মন্তব্য লোড করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}

// POST: নতুন মন্তব্য যোগ
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { articleId, content, parentId, userId } = body

    if (!articleId || !content || content.trim().length === 0) {
      return NextResponse.json({ error: 'আর্টিকেল আইডি এবং মন্তব্য প্রয়োজন' }, { status: 400 })
    }

    if (content.length > 2000) {
      return NextResponse.json({ error: 'মন্তব্য ২০০০ অক্ষরের বেশি হতে পারে না' }, { status: 400 })
    }

    // আর্টিকেল আছে কিনা চেক
    const article = await db.article.findUnique({ where: { id: articleId } })
    if (!article) {
      return NextResponse.json({ error: 'আর্টিকেল পাওয়া যায়নি' }, { status: 404 })
    }

    // রিপ্লাই হলে প্যারেন্ট চেক
    if (parentId) {
      const parent = await db.comment.findUnique({ where: { id: parentId } })
      if (!parent) {
        return NextResponse.json({ error: 'মূল মন্তব্য পাওয়া যায়নি' }, { status: 404 })
      }
    }

    // ইউজার নাম নির্ধারণ
    let authorName = 'বেনামী উইজার্ড'
    if (userId) {
      const user = await db.user.findUnique({ where: { id: userId } })
      if (user) authorName = user.displayName || user.username
    } else if (body.authorName) {
      authorName = body.authorName.trim().slice(0, 50)
    }

    const comment = await db.comment.create({
      data: {
        articleId,
        userId: userId || null,
        authorName,
        content: content.trim(),
        parentId: parentId || null,
        isApproved: true, // অটো-অ্যাপ্রুভ (পরে অ্যাডমিন মডারেশন যোগ করা যাবে)
      },
      include: {
        user: { select: { id: true, username: true, displayName: true, subscriptionPlan: true } },
      },
    })

    // রিপ্লাই হলে প্যারেন্ট ইউজারকে নোটিফিকেশন
    if (parentId) {
      const parentComment = await db.comment.findUnique({
        where: { id: parentId },
        include: { user: { select: { id: true } } },
      })
      if (parentComment?.userId && parentComment.userId !== userId) {
        await db.notification.create({
          data: {
            userId: parentComment.userId,
            type: 'comment_reply',
            title: 'নতুন জবাব',
            message: `${authorName} আপনার মন্তব্যের জবাব দিয়েছেন`,
            link: `/article/${article.slug}`,
          },
        })
      }
    }

    // মন্তব্যকারীকে ১ নাট পুরস্কার
    if (userId) {
      await db.user.update({
        where: { id: userId },
        data: { knuts: { increment: 1 } },
      })
      await db.transaction.create({
        data: {
          userId,
          type: 'earning',
          amountK: 1,
          description: 'মন্তব্য পুরস্কার (১ নাট)',
          balanceG: 0,
        },
      })
    }

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    console.error('Comment POST error:', error)
    return NextResponse.json({ error: 'মন্তব্য যোগ করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}