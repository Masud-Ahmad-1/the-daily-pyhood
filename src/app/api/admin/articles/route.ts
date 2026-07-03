import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'অনুমোদিত নয়' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const issueId = searchParams.get('issueId')
  const section = searchParams.get('section')
  const isPublished = searchParams.get('isPublished')
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}
  if (issueId) where.issueId = issueId
  if (section) where.section = section
  if (isPublished === 'true') where.isPublished = true
  else if (isPublished === 'false') where.isPublished = false

  const [articles, total] = await Promise.all([
    db.article.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { issue: { select: { issueNumber: true, title: true } } },
    }),
    db.article.count({ where }),
  ])

  return NextResponse.json({
    articles,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'অনুমোদিত নয়' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { issueId, section, title, subtitle, author, category, snippet, content, imageUrl, imageFilter, imageCaption, isPublished, sortOrder } = body

    // বাংলা টাইটেল থেকে slug তৈরি
    const slug = title
      .replace(/[^a-zA-Z0-9\u0980-\u09FF\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase()
      + '-' + Date.now().toString(36)

    const article = await db.article.create({
      data: {
        slug,
        issueId,
        section,
        title,
        subtitle: subtitle || null,
        author: author || 'বেনামী সাংবাদিক',
        category: category || 'সংবাদ',
        snippet: snippet || null,
        content: content || '[]',
        imageUrl: imageUrl || null,
        imageFilter: imageFilter || null,
        imageCaption: imageCaption || null,
        isPublished: isPublished ?? false,
        sortOrder: sortOrder ?? 0,
      },
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'আর্টিকেল তৈরিতে সমস্যা' }, { status: 500 })
  }
}