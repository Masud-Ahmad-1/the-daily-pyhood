'use client'

import { useEffect, useState } from 'react'
import { ArticleErrorBoundary } from '@/components/article-error-boundary'

interface ArticleData {
  article: {
    id: string
    slug: string
    section: string
    title: string
    subtitle: string | null
    author: string
    category: string
    snippet: string | null
    content: string
    imageUrl: string | null
    imageFilter: string | null
    imageCaption: string | null
    viewCount: number
    createdAt: string
  }
  relatedArticles: {
    id: string
    slug: string
    title: string
    section: string
    author: string
    snippet: string | null
    viewCount: number
  }[]
  issue: {
    id: string
    issueNumber: number
    publishDate: string
  }
}

const sectionNames: Record<string, string> = {
  headline: 'শিরোনাম',
  lead: 'প্রধান',
  ministry: 'মন্ত্রণালয়',
  sports: 'ক্রীড়া',
  world: 'বিশ্ব',
  security: 'নিরাপত্তা',
  gossip: 'গুজব',
  economy: 'অর্থনীতি',
  entertainment: 'বিনোদন',
  local: 'স্থানীয়',
  mystery: 'রহস্য',
}

function formatBengaliDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার']
    const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর']
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  } catch {
    return dateStr
  }
}

function parseContent(jsonStr: string): string[] {
  if (!jsonStr) return ['']
  try {
    const parsed = JSON.parse(jsonStr)
    if (Array.isArray(parsed)) return parsed
    return [String(parsed)]
  } catch {
    return [jsonStr]
  }
}

function ArticleContent({ data }: { data: ArticleData }) {
  const { article, relatedArticles, issue } = data
  const paragraphs = parseContent(article.content)
  const safeViewCount = typeof article.viewCount === 'number' ? article.viewCount : 0
  const safeIssueNumber = typeof issue.issueNumber === 'number' ? issue.issueNumber : 0
  const safeDate = typeof issue.publishDate === 'string' ? issue.publishDate : ''

  return (
    <>
      {/* ছোট মাস্টহেড */}
      <header className="mini-masthead">
        <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1 className="mini-logo-title">THE DAILY PYHOOD</h1>
        </a>
        <div className="mini-masthead-info">
          <span>{safeDate ? formatBengaliDate(safeDate) : ''}</span>
          <span>•</span>
          <span>নং {safeIssueNumber.toLocaleString('bn-BD')}</span>
        </div>
      </header>

      <hr className="double-divider" />

      {/* আর্টিকেল হেডার */}
      <article>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px dashed rgba(74,65,42,0.25)', paddingBottom: 8, fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', flexWrap: 'wrap', gap: 4 }}>
          <span style={{ color: 'var(--accent-red)' }}>{sectionNames[article.section] || article.section} • {article.category}</span>
          <span className="article-view-count">👁 {safeViewCount.toLocaleString('bn-BD')} ভিউ</span>
        </div>

        <h1 className="full-title">{article.title}</h1>
        {article.subtitle && <p className="full-subtitle">{article.subtitle}</p>}
        <p className="article-author">লেখক: {article.author}</p>

        <hr className="double-divider" />

        {/* ছবি */}
        {article.imageUrl && (
          <div className="photo-frame" style={{ maxWidth: 450, margin: '15px auto' }}>
            <div className="photo-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.imageUrl}
                alt={article.title}
                className={`magical-photo ${article.imageFilter || 'sepia-filter'}`}
                loading="lazy"
              />
            </div>
            {article.imageCaption && <p className="photo-caption">{article.imageCaption}</p>}
          </div>
        )}

        {/* বডি */}
        <div className="article-body-text">
          {paragraphs.map((para, i) => (
            <p key={i} className={i === 0 ? 'lead-para' : ''}>
              {i === 0 && para && para.length > 0 && (
                <span className="drop-cap">{para.charAt(0)}</span>
              )}
              {i === 0 ? (para || '').slice(1) : para}
            </p>
          ))}
        </div>
      </article>

      <hr className="double-divider" />

      {/* হোমপেজে ফিরে যাওয়া */}
      <div style={{ textAlign: 'center', margin: '25px 0' }}>
        <a href="/" className="article-back-btn">📜 ডেইলি পাইহুডে ফিরে যান</a>
      </div>

      {/* সম্পর্কিত সংবাদ */}
      {relatedArticles && relatedArticles.length > 0 && (
        <section>
          <h2 className="widget-title" style={{ fontSize: '1.2rem', textAlign: 'center' }}>
            📰 এই সংখ্যার অন্যান্য সংবাদ
          </h2>
          <div className="related-grid">
            {relatedArticles.map((ra) => (
              <a key={ra.id} href={`/article/${ra.slug}`} className="related-card">
                <span className="card-tag">{sectionNames[ra.section] || ra.section}</span>
                <h3 className="card-title">{ra.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'rgba(0,0,0,0.6)', marginBottom: 6 }}>
                  {ra.author}
                </p>
                {ra.snippet && <p className="card-snippet">{ra.snippet}</p>}
                <p style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', marginTop: 8, fontWeight: 700 }}>
                  👁 {(typeof ra.viewCount === 'number' ? ra.viewCount : 0).toLocaleString('bn-BD')}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}

      <hr className="double-divider" />

      <footer style={{ textAlign: 'center', padding: '10px 0', fontSize: '0.85rem', fontFamily: 'var(--font-bengali)', color: 'var(--border-color)', marginTop: 'auto' }}>
        <p>© ১৭৪৩-২০২৬ ডেইলি পাইহুড পাবলিকেশনস লিমিটেড। সর্বস্বত্ব সংরক্ষিত।</p>
        <nav style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 15, flexWrap: 'wrap' }}>
          <a href="/" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>হোমপেজ</a>
          <a href="/archive" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>আর্কাইভ</a>
          <a href="/sections" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>বিভাগ</a>
        </nav>
      </footer>
    </>
  )
}

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const [data, setData] = useState<ArticleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    params.then(p => {
      fetch(`/api/articles/${p.slug}`)
        .then(r => {
          if (!r.ok) throw new Error('আর্টিকেল পাওয়া যায়নি')
          return r.json()
        })
        .then(d => { setData(d); setLoading(false) })
        .catch(e => { setError(e.message); setLoading(false) })
    })
  }, [params])

  if (loading) {
    return (
      <div className="parchment-bg min-h-screen flex items-center justify-center">
        <p className="loading-state">📜 প্রতিবেদন লোড হচ্ছে...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="parchment-bg min-h-screen flex items-center justify-center" style={{ flexDirection: 'column', gap: 20 }}>
        <p className="loading-state">⚠️ {error || 'প্রতিবেদন পাওয়া যায়নি'}</p>
        <a href="/" className="article-back-btn">ডেইলি পাইহুডে ফিরে যান</a>
      </div>
    )
  }

  return (
    <div className="parchment-bg min-h-screen flex flex-col">
      <div className="newspaper-container">
        <ArticleErrorBoundary>
          <ArticleContent data={data} />
        </ArticleErrorBoundary>
      </div>
    </div>
  )
}