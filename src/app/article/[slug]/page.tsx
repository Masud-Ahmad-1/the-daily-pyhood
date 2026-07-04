import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

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
  const d = new Date(dateStr)
  const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার']
  const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর']
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

function parseContent(jsonStr: string): string[] {
  try { return JSON.parse(jsonStr) } catch { return [jsonStr] }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let article: Awaited<ReturnType<typeof db.article.findUnique>> | null = null

  try {
    article = await db.article.findUnique({
      where: { slug, isPublished: true },
      include: { issue: true },
    })

    if (!article) {
      notFound()
    }

    // ভিউ কাউন্ট ইনক্রিমেন্ট (নন-ব্লকিং)
    db.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {})

    // ArticleView রেকর্ড তৈরি (নন-ব্লকিং)
    if (article.issueId) {
      db.articleView.create({
        data: { articleId: article.id, issueId: article.issueId },
      }).catch(() => {})
    }
  } catch {
    notFound()
  }

  // একই ইস্যুতে থাকা অন্যান্য আর্টিকেল
  let relatedArticles: { id: string; slug: string; title: string; section: string; author: string; snippet: string | null; viewCount: number }[] = []
  if (article.issueId) {
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
    } catch {
      // related articles fetch ব্যর্থ হলে মূল আর্টিকেল দেখাও
    }
  }

  const paragraphs = parseContent(article.content)
  const issue = article.issue!
  const viewCount = article.viewCount + 1

  return (
    <div className="parchment-bg min-h-screen flex flex-col">
      <div className="newspaper-container">
        {/* ছোট মাস্টহেড */}
        <header className="mini-masthead">
          <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1 className="mini-logo-title">THE DAILY PYHOOD</h1>
          </a>
          <div className="mini-masthead-info">
            <span>{formatBengaliDate(issue.publishDate as string)}</span>
            <span>•</span>
            <span>নং {(issue.issueNumber as number).toLocaleString('bn-BD')}</span>
          </div>
        </header>

        <hr className="double-divider" />

        {/* আর্টিকেল হেডার */}
        <article>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px dashed rgba(74,65,42,0.25)', paddingBottom: 8, fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', flexWrap: 'wrap', gap: 4 }}>
            <span style={{ color: 'var(--accent-red)' }}>{sectionNames[article.section as string] || article.section} • {article.category as string}</span>
            <span className="article-view-count">👁 {viewCount.toLocaleString('bn-BD')} ভিউ</span>
          </div>

          <h1 className="full-title">{article.title as string}</h1>
          {article.subtitle && <p className="full-subtitle">{article.subtitle as string}</p>}
          <p className="article-author">লেখক: {article.author as string}</p>

          <hr className="double-divider" />

          {/* ছবি */}
          {article.imageUrl && (
            <div className="photo-frame" style={{ maxWidth: 450, margin: '15px auto' }}>
              <div className="photo-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.imageUrl as string}
                  alt={article.title as string}
                  className={`magical-photo ${article.imageFilter || 'sepia-filter'}`}
                  loading="lazy"
                />
              </div>
              {article.imageCaption && <p className="photo-caption">{article.imageCaption as string}</p>}
            </div>
          )}

          {/* বডি */}
          <div className="article-body-text">
            {paragraphs.map((para: string, i: number) => (
              <p key={i} className={i === 0 ? 'lead-para' : ''}>
                {i === 0 && para.length > 0 && (
                  <span className="drop-cap">{para.charAt(0)}</span>
                )}
                {i === 0 ? para.slice(1) : para}
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
        {relatedArticles.length > 0 && (
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
                    👁 {ra.viewCount.toLocaleString('bn-BD')}
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
      </div>
    </div>
  )
}