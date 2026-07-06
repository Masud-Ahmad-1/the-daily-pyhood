import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// একবার ব্যবহারের জন্য — আর্টিকেল আপডেট রুট (seed data sync)
// ডিপ্লয়ের পর একবার কল করলে Turso-তে আপডেট হবে
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, content, snippet } = body

    if (!id || !content) {
      return NextResponse.json({ error: 'id ও content প্রয়োজন' }, { status: 400 })
    }

    const article = await db.article.update({
      where: { id },
      data: {
        content,
        ...(snippet && { snippet }),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, articleId: article.id })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'আপডেটে সমস্যা'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}