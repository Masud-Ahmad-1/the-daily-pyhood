import { db } from '@/lib/db'
import type { Metadata } from 'next'
import { NewsArticleJsonLd } from '@/components/json-ld'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  const article = await db.article.findUnique({
    where: { slug, isPublished: true },
    select: {
      title: true,
      subtitle: true,
      author: true,
      snippet: true,
      imageUrl: true,
      updatedAt: true,
    },
  })

  if (!article) {
    return {
      title: 'আর্টিকেল পাওয়া যায়নি | The Daily Pyhood',
    }
  }

  const description = article.snippet || article.subtitle || `${article.title} — The Daily Pyhood`

  return {
    title: `${article.title} | The Daily Pyhood`,
    description,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description,
      type: 'article',
      publishedTime: article.updatedAt.toISOString(),
      authors: [article.author],
      siteName: 'The Daily Pyhood',
      images: article.imageUrl ? [{ url: article.imageUrl }] : [{ url: 'https://pyhood.com/assets/hogwarts_sketch.png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: article.imageUrl ? [article.imageUrl] : ['https://pyhood.com/assets/hogwarts_sketch.png'],
    },
  }
}

export default async function ArticleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const article = await db.article.findUnique({
    where: { slug, isPublished: true },
    select: {
      title: true,
      snippet: true,
      subtitle: true,
      author: true,
      imageUrl: true,
      updatedAt: true,
    },
  })

  const description = article?.snippet || article?.subtitle || ''
  const articleUrl = `https://pyhood.com/article/${slug}`

  return (
    <>
      {article && (
        <NewsArticleJsonLd
          title={article.title}
          description={description}
          author={article.author}
          url={articleUrl}
          imageUrl={article.imageUrl}
          publishedTime={article.updatedAt.toISOString()}
        />
      )}
      {children}
    </>
  )
}