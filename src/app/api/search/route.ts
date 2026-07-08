import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: আর্টিকেল সার্চ
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') || '').trim()
    const section = searchParams.get('section')
    const author = searchParams.get('author')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    if (!q || q.length < 2) {
      return NextResponse.json({ error: 'কমপক্ষে ২ অক্ষর লিখুন' }, { status: 400 })
    }

    const where: Record<string, unknown> = {
      isPublished: true,
      issue: { isPublished: true },
      OR: [
        { title: { contains: q } },
        { subtitle: { contains: q } },
        { author: { contains: q } },
        { snippet: { contains: q } },
        { content: { contains: q } },
        { section: { contains: q } },
        { category: { contains: q } },
      ],
    }

    if (section) {
      ;(where as Record<string, unknown>).section = section
      // Re-add the OR with section removed
      delete (where as Record<string, unknown>).OR
      ;(where as Record<string, unknown>).OR = [
        { title: { contains: q } },
        { subtitle: { contains: q } },
        { author: { contains: q } },
        { snippet: { contains: q } },
        { content: { contains: q } },
        { category: { contains: q } },
      ]
      ;(where as Record<string, unknown>).section = section
    }

    if (author) {
      ;(where as Record<string, unknown>).author = { contains: author }
    }

    const [articles, total] = await Promise.all([
      db.article.findMany({
        where,
        include: {
          issue: { select: { issueNumber: true, publishDate: true } },
        },
        orderBy: { viewCount: 'desc' },
        skip,
        take: limit,
      }),
      db.article.count({ where }),
    ])

    // হাইলাইট করার জন্য snippet তৈরি
    const results = articles.map(a => {
      let highlightSnippet = a.snippet || ''
      if (!highlightSnippet) {
        // content JSON থেকে প্রথম প্যারাগ্রাফ
        try {
          const paras = JSON.parse(a.content)
          highlightSnippet = paras[0]?.slice(0, 150) || ''
        } catch {
          highlightSnippet = a.content.slice(0, 150)
        }
      }
      if (highlightSnippet.length > 200) highlightSnippet = highlightSnippet.slice(0, 200) + '...'
      return {
        id: a.id,
        slug: a.slug,
        title: a.title,
        subtitle: a.subtitle,
        author: a.author,
        section: a.section,
        category: a.category,
        snippet: highlightSnippet,
        imageUrl: a.imageUrl,
        viewCount: a.viewCount,
        issueNumber: a.issue.issueNumber,
        publishDate: a.issue.publishDate,
        createdAt: a.createdAt,
      }
    })

    return NextResponse.json({
      results,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      query: q,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'সার্চে সমস্যা হয়েছে' }, { status: 500 })
  }
}