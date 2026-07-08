import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT: লাইক
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { action } = body // 'like'

    if (action === 'like') {
      const comment = await db.comment.update({
        where: { id },
        data: { likes: { increment: 1 } },
      })
      return NextResponse.json({ likes: comment.likes })
    }

    return NextResponse.json({ error: 'অবৈধ অ্যাকশন' }, { status: 400 })
  } catch (error) {
    console.error('Comment PUT error:', error)
    return NextResponse.json({ error: 'আপডেট করতে সমস্যা' }, { status: 500 })
  }
}

// DELETE: মন্তব্য মুছুন
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    const comment = await db.comment.findUnique({ where: { id } })
    if (!comment) {
      return NextResponse.json({ error: 'মন্তব্য পাওয়া যায়নি' }, { status: 404 })
    }

    // নিজের মন্তব্য বা অ্যাডমিন
    if (comment.userId !== userId) {
      if (userId) {
        const user = await db.user.findUnique({ where: { id: userId } })
        if (user?.role !== 'admin') {
          return NextResponse.json({ error: 'অনুমতি নেই' }, { status: 403 })
        }
      } else {
        return NextResponse.json({ error: 'অনুমতি নেই' }, { status: 403 })
      }
    }

    await db.comment.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Comment DELETE error:', error)
    return NextResponse.json({ error: 'মুছে ফেলতে সমস্যা' }, { status: 500 })
  }
}