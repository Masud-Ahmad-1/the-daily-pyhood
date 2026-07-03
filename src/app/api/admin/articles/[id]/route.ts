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
  const article = await db.article.findUnique({
    where: { id },
    include: { issue: { select: { issueNumber: true, title: true } } },
  })

  if (!article) {
    return NextResponse.json({ error: 'আর্টিকেল পাওয়া যায়নি' }, { status: 404 })
  }

  return NextResponse.json(article)
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
    const { section, title, subtitle, author, category, snippet, content, imageUrl, imageFilter, imageCaption, isPublished, sortOrder, slug } = body

    const article = await db.article.update({
      where: { id },
      data: {
        ...(section !== undefined && { section }),
        ...(title !== undefined && { title }),
        ...(subtitle !== undefined && { subtitle: subtitle || null }),
        ...(author !== undefined && { author }),
        ...(category !== undefined && { category }),
        ...(snippet !== undefined && { snippet: snippet || null }),
        ...(content !== undefined && { content }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
        ...(imageFilter !== undefined && { imageFilter: imageFilter || null }),
        ...(imageCaption !== undefined && { imageCaption: imageCaption || null }),
        ...(isPublished !== undefined && { isPublished }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(slug !== undefined && { slug }),
      },
    })

    return NextResponse.json(article)
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
    await db.article.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'মুছে ফেলতে সমস্যা' }, { status: 500 })
  }
}