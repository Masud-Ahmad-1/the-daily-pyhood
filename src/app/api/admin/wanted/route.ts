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

  const items = await db.wantedPoster.findMany({ where, orderBy: { id: 'desc' } })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'অনুমোদিত নয়' }, { status: 401 })

  try {
    const body = await req.json()
    const item = await db.wantedPoster.create({
      data: {
        issueId: body.issueId, name: body.name || 'সিরিয়াস ব্ল্যাক',
        description: body.description, reward: body.reward || '১০,০০০ গ্যালিয়ন',
        imageUrl: body.imageUrl || null, isPublished: body.isPublished ?? true,
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
    const item = await db.wantedPoster.update({
      where: { id: body.id },
      data: {
        name: body.name, description: body.description, reward: body.reward,
        imageUrl: body.imageUrl, isPublished: body.isPublished, issueId: body.issueId,
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
    await db.wantedPoster.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'মুছে ফেলতে সমস্যা' }, { status: 500 }) }
}