interface WebSiteJsonLdProps {
  url?: string
  name?: string
  description?: string
}

export function WebSiteJsonLd({
  url = 'https://pyhood.com',
  name = 'The Daily Pyhood',
  description = 'জাদুভিত্তিক বিশ্বের শীর্ষ বাংলা পত্রিকা',
}: WebSiteJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    publisher: {
      '@type': 'Organization',
      name: 'The Daily Pyhood',
      logo: {
        '@type': 'ImageObject',
        url: 'https://pyhood.com/assets/hogwarts_sketch.png',
      },
    },
    inLanguage: 'bn',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface NewsArticleJsonLdProps {
  title: string
  description: string
  author: string
  url: string
  imageUrl?: string | null
  publishedTime?: string
}

export function NewsArticleJsonLd({
  title,
  description,
  author,
  url,
  imageUrl,
  publishedTime,
}: NewsArticleJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Daily Pyhood',
      logo: {
        '@type': 'ImageObject',
        url: 'https://pyhood.com/assets/hogwarts_sketch.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    image: imageUrl || 'https://pyhood.com/assets/hogwarts_sketch.png',
    datePublished: publishedTime,
    inLanguage: 'bn',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}