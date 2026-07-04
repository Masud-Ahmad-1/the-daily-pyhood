import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const article = await db.article.findUnique({
      where: { slug, isPublished: true },
      include: { issue: true },
    })

    if (!article) {
      return NextResponse.json({ error: 'আর্টিকেল পাওয়া যায়নি' }, { status: 404 })
    }

    if (!article.issue) {
      return NextResponse.json({ error: 'সংশ্লিষ্ট ইস্যু পাওয়া যায়নি' }, { status: 404 })
    }

    // ভিউ কাউন্ট ইনক্রিমেন্ট (fire-and-forget)
    db.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {})

    // ArticleView রেকর্ড তৈরি (fire-and-forget)
    db.articleView.create({
      data: { articleId: article.id, issueId: article.issueId },
    }).catch(() => {})

    // একই ইস্যুতে থাকা অন্যান্য আর্টিকেল
    let relatedArticles: Array<{
      id: string; slug: string; title: string; section: string
      author: string; snippet: string | null; viewCount: number
    }> = []
    try {
      relatedArticles = await db.article.findMany({
        where: {
          issueId: article.issueId,
          isPublished: true,
          id: { not: article.id },
        },
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          slug: true,
          title: true,
          section: true,
          author: true,
          snippet: true,
          viewCount: true,
        },
      })
    } catch {}

    const updatedArticle = { ...article, viewCount: article.viewCount + 1 }

    return NextResponse.json({
      article: {
        id: updatedArticle.id,
        slug: updatedArticle.slug,
        section: updatedArticle.section,
        title: updatedArticle.title,
        subtitle: updatedArticle.subtitle ?? null,
        author: updatedArticle.author,
        category: updatedArticle.category,
        snippet: updatedArticle.snippet ?? null,
        content: updatedArticle.content,
        imageUrl: updatedArticle.imageUrl ?? null,
        imageFilter: updatedArticle.imageFilter ?? null,
        imageCaption: updatedArticle.imageCaption ?? null,
        viewCount: updatedArticle.viewCount ?? 0,
        createdAt: updatedArticle.createdAt instanceof Date ? updatedArticle.createdAt.toISOString() : String(updatedArticle.createdAt),
      },
      relatedArticles,
      issue: {
        id: article.issue.id,
        issueNumber: typeof article.issue.issueNumber === 'number' ? article.issue.issueNumber : 0,
        publishDate: article.issue.publishDate instanceof Date ? article.issue.publishDate.toISOString() : String(article.issue.publishDate),
      },
    })
  } catch (error) {
    console.error('আর্টিকেল API ত্রুটি:', error)
    return NextResponse.json({ error: 'ডেটা লোড করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}