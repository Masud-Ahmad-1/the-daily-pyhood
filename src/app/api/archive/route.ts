import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const issues = await db.issue.findMany({
      where: { isPublished: true },
      orderBy: { publishDate: 'desc' },
      include: {
        _count: {
          select: { articles: { where: { isPublished: true } } },
        },
      },
    })

    const formatted = issues.map(issue => ({
      id: issue.id,
      issueNumber: issue.issueNumber,
      publishDate: issue.publishDate.toISOString(),
      title: issue.title,
      priceGalleons: issue.priceGalleons,
      _count: issue._count,
    }))

    return NextResponse.json({ issues: formatted })
  } catch (error) {
    console.error('আর্কাইভ API ত্রুটি:', error)
    return NextResponse.json({ error: 'ডেটা লোড করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}