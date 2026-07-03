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

    // ভিউ কাউন্ট ইনক্রিমেন্ট
    await db.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    })

    // ArticleView রেকর্ড তৈরি
    await db.articleView.create({
      data: { articleId: article.id, issueId: article.issueId },
    })

    // একই ইস্যুতে থাকা অন্যান্য আর্টিকেল
    const relatedArticles = await db.article.findMany({
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

    const updatedArticle = { ...article, viewCount: article.viewCount + 1 }

    return NextResponse.json({
      article: updatedArticle,
      relatedArticles,
      issue: article.issue,
    })
  } catch (error) {
    console.error('আর্টিকেল API ত্রুটি:', error)
    return NextResponse.json({ error: 'ডেটা লোড করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}