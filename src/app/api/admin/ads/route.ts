import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'অনুমোদিত নয়' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const issueId = searchParams.get('issueId')
  const where: Record<string, unknown> = {}
  if (issueId) where.issueId = issueId

  const items = await db.ad.findMany({ where, orderBy: { sortOrder: 'asc' } })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'অনুমোদিত নয়' }, { status: 401 })

  try {
    const body = await req.json()
    const item = await db.ad.create({
      data: {
        issueId: body.issueId, title: body.title, subtitle: body.subtitle || null,
        description: body.description || null, imageUrl: body.imageUrl || null,
        price: body.price || null, articleSlug: body.articleSlug || null, sortOrder: body.sortOrder ?? 0,
      },
    })
    return NextResponse.json(item, { status: 201 })
  } catch { return NextResponse.json({ error: 'তৈরিতে সমস্যা' }, { status: 500 }) }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'অনুমোদিত নয়' }, { status: 401 })

  try {
    const body = await req.json()
    const item = await db.ad.update({
      where: { id: body.id },
      data: {
        title: body.title, subtitle: body.subtitle, description: body.description,
        imageUrl: body.imageUrl, price: body.price, articleSlug: body.articleSlug,
        sortOrder: body.sortOrder, issueId: body.issueId,
      },
    })
    return NextResponse.json(item)
  } catch { return NextResponse.json({ error: 'আপডেটে সমস্যা' }, { status: 500 }) }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'অনুমোদিত নয়' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'আইডি প্রয়োজন' }, { status: 400 })

  try {
    await db.ad.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'মুছে ফেলতে সমস্যা' }, { status: 500 }) }
}