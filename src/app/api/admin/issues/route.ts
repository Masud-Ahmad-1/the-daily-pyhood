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
  const skip = (page - 1) * limit

  const [issues, total] = await Promise.all([
    db.issue.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { articles: true, tickers: true, weathers: true, wantedPosters: true, ads: true, classifieds: true, decrees: true, letters: true } },
      },
    }),
    db.issue.count(),
  ])

  return NextResponse.json({
    issues,
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
    const { title, priceGalleons, publishDate, isPublished } = body

    const lastIssue = await db.issue.findFirst({
      orderBy: { issueNumber: 'desc' },
      select: { issueNumber: true },
    })

    const nextNumber = (lastIssue?.issueNumber || 0) + 1

    const issue = await db.issue.create({
      data: {
        issueNumber: nextNumber,
        title: title || 'The Daily Pyhood',
        priceGalleons: priceGalleons ?? 5,
        publishDate: publishDate ? new Date(publishDate) : new Date(),
        isPublished: isPublished ?? false,
      },
    })

    return NextResponse.json(issue, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'ইস্যু তৈরিতে সমস্যা' }, { status: 500 })
  }
}