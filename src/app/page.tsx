'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

// ===== টাইপ ডিফিনিশন =====
interface Article {
  id: string; slug: string; section: string; title: string
  subtitle: string | null; author: string; category: string
  snippet: string | null; content: string; imageUrl: string | null
  imageFilter: string | null; imageCaption: string | null; viewCount: number
}
interface Ticker { id: string; message: string }
interface Weather { id: string; location: string; emoji: string; forecast: string }
interface WantedPoster { id: string; name: string; description: string; reward: string; imageUrl: string | null }
interface Classified { id: string; heading: string; body: string }
interface Decree { id: string; title: string; decreeNumber: string; body: string; signedBy: string }
interface Letter { id: string; author: string; body: string }
interface Ad { id: string; title: string; subtitle: string | null; description: string | null; imageUrl: string | null; price: string | null; articleSlug: string | null }

interface NewspaperData {
  issue: {
    id: string; issueNumber: number; publishDate: string; priceGalleons: number
    articles: Article[]; tickers: Ticker[]; weathers: Weather[]
    wantedPosters: WantedPoster[]; classifieds: Classified[]
    decrees: Decree[]; letters: Letter[]; ads: Ad[]
  }
}

// ===== উইজার্ডিং ডেট জেনারেটর =====
function generateWizardingDate(): string {
  const now = new Date()
  const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার']
  const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর']
  const dayName = days[now.getDay()]
  const dateNum = now.getDate()
  const monthName = months[now.getMonth()]
  const year = now.getFullYear()
  let suffix = ''
  if (year % 3 === 0) suffix = ' (ড্রাগনের বছর)'
  else if (year % 3 === 1) suffix = ' (ফিনিক্সের বছর)'
  else suffix = ' (হিপোগ্রিফের বছর)'
  return `${dayName}, ${dateNum} ${monthName} ${year}${suffix}`
}

// ===== মেইন কম্পোনেন্ট =====
export default function Home() {
  const [data, setData] = useState<NewspaperData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSpell, setActiveSpell] = useState('finite')
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [wantedName, setWantedName] = useState('সিরিয়াস ব্ল্যাক')
  const [secretUnlocked, setSecretUnlocked] = useState(false)
  const [wantedRevealed, setWantedRevealed] = useState(false)

  const sparkContainer = useRef<HTMLDivElement>(null)
  const spellThrottle = useRef(false)
  const soundPage = useRef<HTMLAudioElement | null>(null)
  const soundMagic = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    fetch('/api/newspaper')
      .then(r => { if (!r.ok) throw new Error('API error'); return r.json() })
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setLoading(false) })
  }, [])

  useEffect(() => {
    try {
      soundPage.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav')
      soundMagic.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav')
    } catch {}
  }, [])

  const createSparkle = useCallback((x: number, y: number) => {
    if (!sparkContainer.current) return
    const sparkle = document.createElement('div')
    sparkle.className = 'sparkle'
    const offset = 8
    sparkle.style.left = `${x + (Math.random() - 0.5) * offset}px`
    sparkle.style.top = `${y + (Math.random() - 0.5) * offset}px`
    const colors: Record<string, { bg: string; shadow: string }> = {
      lumos: { bg: '#fff9c4', shadow: '0 0 12px #fffde7, 0 0 22px #ffe082' },
      nox: { bg: '#b2dfdb', shadow: '0 0 12px #80cbc4, 0 0 22px #004d40' },
      confundo: { bg: '#e1bee7', shadow: '0 0 12px #ce93d8, 0 0 22px #4a148c' },
      finite: { bg: '#ffe082', shadow: '0 0 10px #ffb300, 0 0 20px #ffa000' },
    }
    const c = colors[activeSpell] || colors.finite
    sparkle.style.background = c.bg
    sparkle.style.boxShadow = c.shadow
    const size = Math.random() * 6 + 3
    sparkle.style.width = `${size}px`
    sparkle.style.height = `${size}px`
    sparkContainer.current.appendChild(sparkle)
    sparkle.addEventListener('animationend', () => sparkle.remove())
  }, [activeSpell])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      document.body.style.setProperty('--cursor-x', `${e.clientX}px`)
      document.body.style.setProperty('--cursor-y', `${e.clientY}px`)
      if (spellThrottle.current) return
      spellThrottle.current = true
      createSparkle(e.clientX, e.clientY)
      setTimeout(() => { spellThrottle.current = false }, 15)
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [createSparkle])

  const playSound = (type: 'page' | 'magic') => {
    if (!soundEnabled) return
    const audio = type === 'page' ? soundPage.current : soundMagic.current
    if (audio) { audio.currentTime = 0; audio.play().catch(() => {}) }
  }

  const castSpell = (spell: string) => {
    document.body.classList.remove('lumos-active', 'nox-active', 'confundo-active')
    setActiveSpell(spell)
    if (spell !== 'finite') {
      document.body.classList.add(`${spell}-active`)
      playSound('magic')
    } else {
      playSound('page')
    }
  }

  const openArticle = (article: Article) => {
    playSound('page')
    window.open('/article/' + article.slug, '_self')
  }

  const triggerRevelio = () => {
    playSound('magic')
    setWantedRevealed(true)
    setTimeout(() => setWantedRevealed(false), 4000)
  }

  // ===== লোডিং স্টেট =====
  if (loading) {
    return (
      <div className="parchment-bg min-h-screen flex items-center justify-center">
        <p className="loading-state">🪄 জাদুভিত্তিক প্রতিবেদন লোড হচ্ছে...</p>
      </div>
    )
  }

  if (!data || !data.issue) {
    return (
      <div className="parchment-bg min-h-screen flex items-center justify-center">
        <p className="loading-state">⚠️ প্রতিবেদন পাওয়া যায়নি</p>
      </div>
    )
  }

  const { issue } = data
  const articles = Array.isArray(issue.articles) ? issue.articles : []
  const headline = articles.find(a => a.section === 'headline')
  const otherArticles = articles.filter(a => a.section !== 'headline')
  const tickers = Array.isArray(issue.tickers) ? issue.tickers : []
  const weathers = Array.isArray(issue.weathers) ? issue.weathers : []
  const wantedPosters = Array.isArray(issue.wantedPosters) ? issue.wantedPosters : []
  const classifieds = Array.isArray(issue.classifieds) ? issue.classifieds : []
  const decrees = Array.isArray(issue.decrees) ? issue.decrees : []
  const letters = Array.isArray(issue.letters) ? issue.letters : []
  const ads = Array.isArray(issue.ads) ? issue.ads : []

  const tickerMessages = tickers.map(t => `⚡ ${t.message}`).join(' ')

  return (
    <div className="parchment-bg min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link">সরাসরি বিষয়বস্তুতে যান</a>
      <div className="spell-glow" aria-hidden="true" />
      <div ref={sparkContainer} className="sparkle-layer" aria-hidden="true" />

      <div className="newspaper-container">
        {/* টপ টুলবার */}
        <header className="top-toolbar" role="banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span aria-live="polite">✨ জাদুভিত্তিক সংযোগ: <span className="status-online">সক্রিয়</span></span>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }} aria-label="পৃষ্ঠা নেভিগেশন">
            <a href="/archive" className="spell-btn">📚 আর্কাইভ</a>
            <a href="/sections" className="spell-btn">📂 বিভাগ</a>
            <a href="/subscribe" className="spell-btn">🔮 সাবস্ক্রিপশন</a>
          </nav>
        </header>

        {/* মাস্টহেড */}
        <div className="masthead" role="img" aria-label="The Daily Pyhood পত্রিকার মাস্টহেড">
          <div className="masthead-decor" aria-hidden="true" />
          <div style={{ padding: '0 20px', textAlign: 'center' }}>
            <h1 className="logo-title">THE DAILY PYHOOD</h1>
            <p className="logo-tagline">জাদুভিত্তিক বিশ্বের শীর্ষ পত্রিকা • লন্ডন থেকে প্রকাশিত</p>
          </div>
          <div className="masthead-decor" aria-hidden="true" />
        </div>

        {/* ইস্যু বার */}
        <div className="issue-bar" aria-label="প্রকাশনা তথ্য">
          <span>{generateWizardingDate()}</span>
          <span>মূল্য: {issue.priceGalleons} গ্যালিয়ন</span>
          <span>নং {issue.issueNumber.toLocaleString('bn-BD')}</span>
        </div>

        {/* টিকার */}
        <div className="ticker-container" role="marquee" aria-label="ব্রেকিং সংবাদ">
          <div className="ticker-label">ব্রেকিং:</div>
          <div className="ticker-wrap" aria-live="off">
            <div className="ticker-content">{tickerMessages} ⚡</div>
          </div>
        </div>

        <hr className="double-divider" />

        {/* ===== সিঙ্গেল কলাম কন্টেন্ট ===== */}
        <main id="main-content" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* প্রধান শিরোনাম */}
          {headline && (
            <article style={{ marginBottom: 20 }}>
              <h2 className="main-headline" style={{ textAlign: 'center' }}>
                <a onClick={() => openArticle(headline)}>{headline.title}</a>
              </h2>
              {headline.subtitle && (
                <h3 className="main-subheadline" style={{ textAlign: 'center' }}>{headline.subtitle}</h3>
              )}
              {headline.imageUrl && (
                <div className="photo-frame" style={{ maxWidth: 500, margin: '15px auto' }}>
                  <div className="photo-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={headline.imageUrl}
                      alt={headline.title}
                      className={`magical-photo ${headline.imageFilter || ''}`}
                      loading="lazy"
                    />
                  </div>
                  {headline.imageCaption && <p className="photo-caption">{headline.imageCaption}</p>}
                </div>
              )}
              <div style={{ maxWidth: 700, margin: '0 auto' }}>
                <p className="lead-para" style={{ fontSize: '1rem' }}>
                  {headline.snippet && (
                    <>
                      <span className="drop-cap">{headline.snippet.charAt(0)}</span>
                      {headline.snippet.slice(1)}
                    </>
                  )}
                  {' '}
                  <a onClick={() => openArticle(headline)} className="read-more">সম্পূর্ণ প্রতিবেদন পড়ুন...</a>
                </p>
              </div>
            </article>
          )}

          <hr className="double-divider" />

          {/* ওয়ান্টেড পোস্টার */}
          {wantedPosters[0] && (
            <div className="wanted-poster" style={wantedRevealed ? { borderColor: 'var(--accent-gold)', boxShadow: '0 0 25px var(--accent-gold)' } : {}}>
              <div className="wanted-header">এই উইজার্ডকে দেখেছেন কি?</div>
              {wantedPosters[0].imageUrl && (
                <div className="wanted-img-frame" style={{ margin: '0 auto' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={wantedPosters[0].imageUrl}
                    alt="ওয়ান্টেড উইজার্ড"
                    className={`magical-photo ${wantedRevealed ? '' : 'grayscale-filter'}`}
                    style={wantedRevealed ? { filter: 'none', mixBlendMode: 'normal' } : {}}
                    loading="lazy"
                  />
                  <div className="wanted-label">ওয়ান্টেড</div>
                </div>
              )}
              <h2 className="wanted-name">{wantedName}</h2>
              <p style={{ fontSize: '0.85rem', fontStyle: 'italic', lineHeight: 1.3, padding: '0 10px' }}>
                {wantedPosters[0].description}
              </p>
              <div className="reward-box">
                <span style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '1.5px', fontWeight: 700 }}>পুরস্কার</span>
                <span className="reward-amount">{wantedPosters[0].reward}</span>
              </div>
              <div style={{ marginTop: 15, paddingTop: 12, borderTop: '1px dashed rgba(74,65,42,0.3)' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>
                  ওয়ান্টেড পোস্টারে নাম লিখুন:
                </label>
                <input
                  type="text"
                  className="parchment-input"
                  placeholder="নাম লিখুন..."
                  maxLength={20}
                  autoComplete="off"
                  value={wantedName === 'সিরিয়াস ব্ল্যাক' ? '' : wantedName}
                  onChange={e => setWantedName(e.target.value.trim().toUpperCase() || 'সিরিয়াস ব্ল্যাক')}
                />
                <button className="magic-btn" onClick={triggerRevelio}>
                  রেভেলিও মন্ত্র প্রয়োগ করুন
                </button>
              </div>
            </div>
          )}

          <hr className="column-divider" />

          {/* আবহাওয়া */}
          {weathers.length > 0 && (
            <div aria-label="জাদুভিত্তিক আবহাওয়া পূর্বাভাস">
              <h2 className="widget-title">মন্ত্রণালয় আবহাওয়া পূর্বাভাস</h2>
              <div className="weather-grid">
                {weathers.map(w => (
                  <div key={w.id} className="weather-item">
                    <span className="weather-location">{w.location}</span>
                    <div className="weather-emoji" aria-hidden="true">{w.emoji}</div>
                    <span className="weather-forecast">{w.forecast}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <hr className="column-divider" />

          {/* অন্যান্য সংবাদ */}
          {otherArticles.length > 0 && (
            <section>
              <h2 className="widget-title" style={{ fontSize: '1.3rem' }}>সংবাদ সমূহ</h2>
              {otherArticles.map(article => (
                <div key={article.id} className="mini-article" style={{ marginTop: 12 }}>
                  <h3 className="mini-title">
                    <a onClick={() => openArticle(article)}>{article.title}</a>
                  </h3>
                  <p className="mini-snippet">
                    {article.snippet} <a onClick={() => openArticle(article)} className="read-more">আরও পড়ুন...</a>
                  </p>
                </div>
              ))}
            </section>
          )}

          <hr className="column-divider" />

          {/* ডিক্রি */}
          {decrees[0] && (
            <div className="decree-box" role="complementary" aria-label="মন্ত্রণালয় ডিক্রি">
              <div className="decree-header">{decrees[0].title}</div>
              <div className="decree-number">{decrees[0].decreeNumber}</div>
              <p className="decree-body">&ldquo;{decrees[0].body}&rdquo;</p>
              <div className="decree-sign">স্বাক্ষরিত: {decrees[0].signedBy}</div>
            </div>
          )}

          <hr className="column-divider" />

          {/* পাঠকের চিঠি */}
          {letters[0] && (
            <div>
              <h2 className="widget-title">পাঠকের চিঠি</h2>
              <span className="letter-author">{letters[0].author}:</span>
              <p className="letter-body">&ldquo;{letters[0].body}&rdquo;</p>
            </div>
          )}

          <hr className="column-divider" />

          {/* বিজ্ঞাপন */}
          {ads[0] && (
            <div className="ad-container" aria-label="বিজ্ঞাপন">
              <div className="ad-label">বিজ্ঞাপন</div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 className="ad-title">
                  {ads[0].articleSlug ? (
                    <a onClick={() => {
                      const linked = articles.find(a => a.slug === ads[0].articleSlug)
                      if (linked) openArticle(linked)
                    }}>{ads[0].title}</a>
                  ) : ads[0].title}
                </h3>
                {ads[0].subtitle && <p className="ad-subtitle">{ads[0].subtitle}</p>}
                {ads[0].imageUrl && (
                  <div className="potion-img-frame">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ads[0].imageUrl} alt={ads[0].title} className="magical-photo potion-photo" loading="lazy" />
                  </div>
                )}
                {ads[0].description && (
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.3, margin: '6px 0' }}>
                    &ldquo;{ads[0].description}&rdquo;
                    {ads[0].articleSlug && (
                      <a onClick={() => {
                        const linked = articles.find(a => a.slug === ads[0].articleSlug)
                        if (linked) openArticle(linked)
                      }} className="read-more"> বিস্তারিত...</a>
                    )}
                  </p>
                )}
                {ads[0].price && <span className="ad-price">{ads[0].price}</span>}
              </div>
            </div>
          )}

          <hr className="column-divider" />

          {/* ক্লাসিফাইড */}
          {classifieds.length > 0 && (
            <div aria-label="দৈনিক বিজ্ঞাপন">
              <h2 className="widget-title">দৈনিক বিজ্ঞাপন</h2>
              {classifieds.map((c, i) => (
                <div key={c.id} style={i > 0 ? { marginTop: 10, borderTop: '1px dashed rgba(74,65,42,0.15)', paddingTop: 8 } : {}}>
                  <span className="classified-heading">{c.heading}</span>
                  <p className="classified-body">{c.body}</p>
                </div>
              ))}
            </div>
          )}

          <hr className="column-divider" />

          {/* ওয়ান্ড প্র্যাকটিস */}
          <div>
            <h2 className="widget-title">ওয়ান্ড প্র্যাকটিস</h2>
            <p style={{ fontSize: '0.85rem', marginBottom: 12 }}>
              পত্রিকার উপর আপনার ওয়ান্ড (মাউস) ঘুরিয়ে জাদুভিত্তিক স্পার্ক দেখুন!
            </p>
            <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }} aria-label="মন্ত্র নিয়ন্ত্রণ">
              {['lumos', 'nox', 'confundo', 'finite'].map(spell => (
                <button
                  key={spell}
                  className={`spell-btn ${activeSpell === spell ? 'active' : ''}`}
                  onClick={() => castSpell(spell)}
                  aria-pressed={activeSpell === spell}
                >
                  {spell === 'lumos' ? 'লুমোস' : spell === 'nox' ? 'নক্স' : spell === 'confundo' ? 'কনফুন্ডো' : 'ফাইনাইট'}
                </button>
              ))}
            </nav>
            <button className="magic-btn" onClick={() => { setSecretUnlocked(true); playSound('magic') }}>
              রেভেলিও (গোপন সেকশন উন্মোচন)
            </button>
            <div className={`secret-box ${secretUnlocked ? 'unlocked' : ''}`}>
              {!secretUnlocked ? (
                <div className="lock-icon" onClick={() => { setSecretUnlocked(true); playSound('magic') }}>
                  🔒 লক করা সেকশন
                </div>
              ) : (
                <p className="secret-content">
                  <em>&ldquo;আমরা জানতে পেরেছি যে রহস্যময় বিভাগ সম্প্রতি মিশর থেকে একটি রহস্যময় জ্বলজ্বলে অর্ব অধিগ্রহণ করেছে। মন্ত্রণালয়ের কর্মকর্তারা বিবরণ দিতে অস্বীকার করছেন...&rdquo;</em>
                </p>
              )}
            </div>
          </div>

          <hr className="column-divider" />

          {/* ওয়াক্স সিল */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '15px 0' }} aria-hidden="true">
            <div className="wax-seal">
              <div className="seal-inner">
                <span className="seal-letter">P</span>
                <span className="seal-text">PYHOOD APPROVED</span>
              </div>
            </div>
          </div>
        </main>

        <hr className="double-divider" />

        {/* ফুটার */}
        <footer style={{ textAlign: 'center', padding: '15px 0', fontSize: '0.85rem', fontFamily: 'var(--font-bengali)', color: 'var(--border-color)' }} role="contentinfo">
          <nav style={{ display: 'flex', justifyContent: 'center', gap: 15, marginBottom: 8, flexWrap: 'wrap' }} aria-label="ফুটার নেভিগেশন">
            <a href="/archive" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>📚 আর্কাইভ</a>
            <a href="/sections" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>📂 বিভাগ</a>
            <a href="/subscribe" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>🔮 সাবস্ক্রিপশন</a>
          </nav>
          <p>© ১৭৪৩-২০২৬ ডেইলি পাইহুড পাবলিকেশনস লিমিটেড। সর্বস্বত্ব সংরক্ষিত।</p>
        </footer>
      </div>
    </div>
  )
}