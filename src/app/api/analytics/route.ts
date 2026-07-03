import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [totalIssueViews, totalArticleViews, trendingArticles, sectionStats, topAuthors] =
      await Promise.all([
        // টোটাল ইস্যু ভিউ
        db.issueView.count(),

        // টোটাল আর্টিকেল ভিউ
        db.articleView.count(),

        // ট্রেন্ডিং আর্টিকেল (top 10)
        db.article.findMany({
          where: { isPublished: true },
          orderBy: { viewCount: 'desc' },
          take: 10,
          select: {
            id: true,
            slug: true,
            title: true,
            section: true,
            author: true,
            viewCount: true,
          },
        }),

        // সেকশন অনুযায়ী ভিউ
        db.article.groupBy({
          by: ['section'],
          where: { isPublished: true },
          _sum: { viewCount: true },
          _count: { viewCount: true },
          orderBy: { _sum: { viewCount: 'desc' } },
        }),

        // সবচেয়ে জনপ্রিয় লেখক (top 5)
        db.article.groupBy({
          by: ['author'],
          where: { isPublished: true },
          _sum: { viewCount: true },
          _count: { id: true },
          orderBy: { _sum: { viewCount: 'desc' } },
          take: 5,
        }),
      ])

    // দৈনিক ভিউ ট্রেন্ড (শেষ ৭ দিন)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const dailyViewsRaw = await db.articleView.groupBy({
      by: ['viewedAt'],
      where: { viewedAt: { gte: sevenDaysAgo } },
      _count: { id: true },
    })

    // তারিখ অনুযায়ী গ্রুপিং
    const dailyViews: { date: string; count: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const dayViews = dailyViewsRaw.filter(
        v => v.viewedAt.toISOString().split('T')[0] === dateStr
      )
      const count = dayViews.reduce((acc, v) => acc + v._count.id, 0)
      dailyViews.push({ date: dateStr, count })
    }

    return NextResponse.json({
      totalIssueViews,
      totalArticleViews,
      trendingArticles,
      sectionStats,
      dailyViews,
      topAuthors,
    })
  } catch (error) {
    console.error('অ্যানালিটিক্স API ত্রুটি:', error)
    return NextResponse.json({ error: 'ডেটা লোড করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}