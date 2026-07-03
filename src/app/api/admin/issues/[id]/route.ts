import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'অনুমোদিত নয়' }, { status: 401 })
  }

  const { id } = await params
  const issue = await db.issue.findUnique({
    where: { id },
    include: {
      _count: { select: { articles: true, tickers: true, weathers: true, wantedPosters: true, ads: true, classifieds: true, decrees: true, letters: true } },
    },
  })

  if (!issue) {
    return NextResponse.json({ error: 'ইস্যু পাওয়া যায়নি' }, { status: 404 })
  }

  return NextResponse.json(issue)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'অনুমোদিত নয়' }, { status: 401 })
  }

  const { id } = await params
  try {
    const body = await req.json()
    const { title, priceGalleons, isPublished, publishDate } = body

    const issue = await db.issue.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(priceGalleons !== undefined && { priceGalleons }),
        ...(isPublished !== undefined && { isPublished }),
        ...(publishDate !== undefined && { publishDate: new Date(publishDate) }),
      },
    })

    return NextResponse.json(issue)
  } catch (error) {
    return NextResponse.json({ error: 'আপডেটে সমস্যা' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'অনুমোদিত নয়' }, { status: 401 })
  }

  const { id } = await params
  try {
    await db.issue.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'মুছে ফেলতে সমস্যা' }, { status: 500 })
  }
}