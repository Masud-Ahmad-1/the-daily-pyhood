import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// seed data sync — update ও insert উভয় সমর্থন করে
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { mode, id, issueId, slug, section, title, subtitle, author, category, snippet, content, sortOrder } = body

    if (mode === 'insert' && id && issueId) {
      const article = await db.article.create({
        data: {
          id,
          issueId,
          slug: slug || id,
          section: section || 'world',
          title: title || '',
          subtitle: subtitle || null,
          author: author || 'দ্য প্রফেট',
          category: category || 'সংবাদ',
          snippet: snippet || null,
          content: content || '[]',
          imageUrl: null,
          imageFilter: null,
          imageCaption: null,
          isPublished: true,
          sortOrder: sortOrder || 0,
          viewCount: 0,
        },
      })
      return NextResponse.json({ success: true, articleId: article.id })
    }

    if (!id || !content) {
      return NextResponse.json({ error: 'id ও content প্রয়োজন' }, { status: 400 })
    }

    const article = await db.article.update({
      where: { id },
      data: {
        content,
        ...(snippet && { snippet }),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, articleId: article.id })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'সমস্যা'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}