import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section') || undefined
    const author = searchParams.get('author') || undefined
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')))

    const where: Record<string, unknown> = { isPublished: true }
    if (section) where.section = section
    if (author) where.author = author

    const [articles, total, uniqueSections, uniqueAuthors] = await Promise.all([
      db.article.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          slug: true,
          title: true,
          subtitle: true,
          section: true,
          author: true,
          category: true,
          snippet: true,
          imageUrl: true,
          viewCount: true,
          createdAt: true,
        },
      }),
      db.article.count({ where }),
      db.article.findMany({
        where: { isPublished: true },
        distinct: ['section'],
        select: { section: true },
      }),
      db.article.findMany({
        where: { isPublished: true },
        distinct: ['author'],
        select: { author: true },
      }),
    ])

    return NextResponse.json({
      articles,
      total,
      page,
      limit,
      sections: uniqueSections.map(s => s.section),
      authors: uniqueAuthors.map(a => a.author),
    })
  } catch (error) {
    console.error('সেকশন API ত্রুটি:', error)
    return NextResponse.json({ error: 'ডেটা লোড করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}