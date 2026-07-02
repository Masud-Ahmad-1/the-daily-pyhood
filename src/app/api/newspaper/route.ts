import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const issue = await db.issue.findFirst({
      where: { isPublished: true },
      orderBy: { publishDate: 'desc' },
      include: {
        articles: {
          where: { isPublished: true },
          orderBy: { sortOrder: 'asc' },
        },
        tickers: { orderBy: { sortOrder: 'asc' } },
        weathers: { orderBy: { sortOrder: 'asc' } },
        wantedPosters: { where: { isPublished: true } },
        classifieds: { orderBy: { sortOrder: 'asc' } },
        decrees: { orderBy: { sortOrder: 'asc' } },
        letters: { orderBy: { sortOrder: 'asc' } },
        ads: { orderBy: { sortOrder: 'asc' } },
      },
    })

    if (!issue) {
      return NextResponse.json({ error: 'কোনো প্রকাশিত ইস্যু পাওয়া যায়নি' }, { status: 404 })
    }

    // ভিউ কাউন্ট রেকর্ড করুন
    await db.issueView.create({
      data: { issueId: issue.id },
    })

    return NextResponse.json({ issue })
  } catch (error) {
    console.error('API ত্রুটি:', error)
    return NextResponse.json({ error: 'ডেটা লোড করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}