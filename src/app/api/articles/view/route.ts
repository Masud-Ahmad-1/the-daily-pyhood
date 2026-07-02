import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { articleId } = await request.json()
    if (!articleId) {
      return NextResponse.json({ error: 'আর্টিকেল আইডি প্রয়োজন' }, { status: 400 })
    }

    await db.article.update({
      where: { id: articleId },
      data: { viewCount: { increment: 1 } },
    })

    await db.articleView.create({
      data: { articleId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('ভিউ ত্রুটি:', error)
    return NextResponse.json({ error: 'ভিউ রেকর্ড করতে সমস্যা' }, { status: 500 })
  }
}