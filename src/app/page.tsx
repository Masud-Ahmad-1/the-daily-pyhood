'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

// ===== টাইপ ডিফিনিশন =====
interface Article {
  id: string
  slug: string
  section: string
  title: string
  subtitle: string | null
  author: string
  category: string
  snippet: string | null
  content: string // JSON string
  imageUrl: string | null
  imageFilter: string | null
  imageCaption: string | null
  viewCount: number
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
    id: string
    issueNumber: number
    publishDate: string
    priceGalleons: number
    articles: Article[]
    tickers: Ticker[]
    weathers: Weather[]
    wantedPosters: WantedPoster[]
    classifieds: Classified[]
    decrees: Decree[]
    letters: Letter[]
    ads: Ad[]
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
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [wantedName, setWantedName] = useState('সিরিয়াস ব্ল্যাক')
  const [secretUnlocked, setSecretUnlocked] = useState(false)
  const [wantedRevealed, setWantedRevealed] = useState(false)

  const sparkContainer = useRef<HTMLDivElement>(null)
  const spellThrottle = useRef(false)
  const soundPage = useRef<HTMLAudioElement | null>(null)
  const soundMagic = useRef<HTMLAudioElement | null>(null)

  // ===== ডেটা ফেচ =====
  useEffect(() => {
    fetch('/api/newspaper')
      .then(r => {
        if (!r.ok) throw new Error('API error')
        return r.json()
      })
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setLoading(false) })
  }, [])

  // ===== সাউন্ড ইনিশিয়ালাইজ =====
  useEffect(() => {
    soundPage.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav')
    soundMagic.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav')
    soundPage.current.preload = 'auto'
    soundMagic.current.preload = 'auto'
  }, [])

  // ===== স্পার্কল সিস্টেম =====
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

  const burstSparkles = useCallback((cx: number, cy: number, count: number, sx: number, sy: number) => {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        createSparkle(cx + (Math.random() - 0.5) * sx, cy + (Math.random() - 0.5) * sy)
      }, i * 20)
    }
  }, [createSparkle])

  // ===== মাউস মুভ =====
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

  // ===== সাউন্ড প্লে =====
  const playSound = (type: 'page' | 'magic') => {
    if (!soundEnabled) return
    const audio = type === 'page' ? soundPage.current : soundMagic.current
    if (audio) { audio.currentTime = 0; audio.play().catch(() => {}) }
  }

  // ===== মন্ত্র সিস্টেম =====
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

  // ===== আর্টিকেল ওপেন =====
  const openArticle = (article: Article) => {
    playSound('page')
    window.open('/article/' + article.slug, '_self')
  }

  // ===== রেভেলিও ওয়ান্টেড =====
  const triggerRevelio = () => {
    playSound('magic')
    setWantedRevealed(true)
    burstSparkles(window.innerWidth * 0.2, window.innerHeight * 0.35, 25, 200, 250)
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
  const leftArticles = articles.filter(a => ['local', 'ministry'].includes(a.section))
  const centerArticles = articles.filter(a => a.section === 'entertainment')
  const rightArticles = articles.filter(a => ['mystery', 'economy'].includes(a.section))
  const bottomArticles = articles.filter(a => ['sports', 'world', 'security', 'gossip'].includes(a.section))

  const tickers = Array.isArray(issue.tickers) ? issue.tickers : []
  const weathers = Array.isArray(issue.weathers) ? issue.weathers : []
  const wantedPosters = Array.isArray(issue.wantedPosters) ? issue.wantedPosters : []
  const classifieds = Array.isArray(issue.classifieds) ? issue.classifieds : []
  const decrees = Array.isArray(issue.decrees) ? issue.decrees : []
  const letters = Array.isArray(issue.letters) ? issue.letters : []
  const ads = Array.isArray(issue.ads) ? issue.ads : []

  const tickerMessages = tickers.map(t => `⚡ ${t.message}`).join(' ')


  // ===== মূল পত্রিকা পেজ =====
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }} aria-label="পৃষ্ঠা নেভিগেশন">
              <a href="/archive" className="spell-btn">📚 আর্কাইভ</a>
              <a href="/sections" className="spell-btn">📂 বিভাগ</a>
              <a href="/subscribe" className="spell-btn">🔮 সাবস্ক্রিপশন</a>
            </nav>
            <button
              className="spell-btn"
              onClick={() => { setSoundEnabled(!soundEnabled); playSound('page') }}
              aria-label="সাউন্ড টগল"
            >
              {soundEnabled ? '🔊 সাউন্ড: চালু' : '🔇 সাউন্ড: বন্ধ'}
            </button>
            <nav style={{ display: 'flex', alignItems: 'center', gap: 5 }} aria-label="মন্ত্র নিয়ন্ত্রণ">
              <span style={{ fontSize: '0.8rem' }}>মন্ত্র:</span>
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
          </div>
        </header>

        {/* মাস্টহেড */}
        <div className="masthead" role="img" aria-label="The Daily Pyhood পত্রিকার মাস্টহেড">
          <div className="masthead-decor" aria-hidden="true" />
          <div style={{ padding: '0 20px' }}>
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

        {/* মূল গ্রিড */}
        <main className="newspaper-grid" id="main-content">
          {/* === বাম কলাম === */}
          <aside className="left-column" aria-label="বাম কলাম: ওয়ান্টেড পোস্টার ও পার্শ্ব সংবাদ" style={{ display: 'flex', flexDirection: 'column' }}>
            {/* ওয়ান্টেড পোস্টার */}
            {wantedPosters[0] && (
              <div className="wanted-poster" style={wantedRevealed ? { borderColor: 'var(--accent-gold)', boxShadow: '0 0 25px var(--accent-gold)' } : {}}>
                <div className="wanted-header">এই উইজার্ডকে দেখেছেন কি?</div>
                {wantedPosters[0].imageUrl && (
                  <div className="wanted-img-frame">
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

            {/* বাম কলাম আর্টিকেল */}
            {leftArticles.map(article => (
              <div key={article.id} className="mini-article" style={{ marginTop: 15 }}>
                <h3 className="mini-title">
                  <a onClick={() => openArticle(article)}>{article.title}</a>
                </h3>
                <p className="mini-snippet">
                  {article.snippet} <a onClick={() => openArticle(article)} className="read-more">আরও পড়ুন...</a>
                </p>
              </div>
            ))}

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
          </aside>

          {/* === মধ্য কলাম === */}
          <section className="main-column" aria-label="প্রধান সংবাদ">
            {headline && (
              <article>
                <h2 className="main-headline">
                  <a onClick={() => openArticle(headline)}>{headline.title}</a>
                </h2>
                {headline.subtitle && (
                  <h3 className="main-subheadline">{headline.subtitle}</h3>
                )}

                {headline.imageUrl && (
                  <div className="photo-frame">
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

                <div className="article-columns">
                  <p className="lead-para">
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

            <hr className="column-divider" />

            {/* সেকেন্ডারি আর্টিকেল */}
            {centerArticles.map(article => (
              <div key={article.id} className="news-block">
                <h3 className="block-title">
                  <a onClick={() => openArticle(article)}>{article.title}</a>
                </h3>
                <p className="block-snippet">
                  {article.snippet} <a onClick={() => openArticle(article)} className="read-more">সম্পূর্ণ গল্প...</a>
                </p>
              </div>
            ))}

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
          </section>

          {/* === ডান কলাম === */}
          <aside className="right-column" aria-label="ডান কলাম: আবহাওয়া, সংবাদ ও ইন্টারেক্টিভ ফিচার" style={{ display: 'flex', flexDirection: 'column' }}>
            {/* আবহাওয়া */}
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

            <hr className="column-divider" />

            {/* স্কুপস ও চিঠি */}
            <div>
              <h2 className="widget-title">হগওয়ার্টস ও বিশ্বের স্কুপ</h2>
              {rightArticles.map(article => (
                <div key={article.id} style={{ marginTop: 15, borderTop: '1px dashed rgba(74,65,42,0.15)', paddingTop: 10 }}>
                  <h3 style={{ fontFamily: 'var(--font-bn-headline)', fontSize: '1rem', fontWeight: 800, lineHeight: 1.2, marginBottom: 5 }}>
                    <a onClick={() => openArticle(article)}>{article.title}</a>
                  </h3>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
                    {article.snippet} <a onClick={() => openArticle(article)} className="read-more">আরও পড়ুন...</a>
                  </p>
                </div>
              ))}

              {/* পাঠকের চিঠি */}
              {letters[0] && (
                <div style={{ marginTop: 15, borderTop: '1px dashed rgba(74,65,42,0.15)', paddingTop: 10 }}>
                  <span className="letter-author">{letters[0].author}:</span>
                  <p className="letter-body">&ldquo;{letters[0].body}&rdquo;</p>
                </div>
              )}
            </div>

            <hr className="column-divider" />

            {/* ওয়ান্ড প্র্যাকটিস */}
            <div>
              <h2 className="widget-title">ওয়ান্ড প্র্যাকটিস</h2>
              <p style={{ fontSize: '0.85rem', marginBottom: 12, fontFamily: 'var(--font-bengali)' }}>
                পত্রিকার উপর আপনার ওয়ান্ড (মাউস) ঘুরিয়ে জাদুভিত্তিক স্পার্ক দেখুন!
              </p>
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

            {/* ক্লাসিফাইড */}
            <div aria-label="দৈনিক বিজ্ঞাপন">
              <h2 className="widget-title">দৈনিক বিজ্ঞাপন</h2>
              {classifieds.map((c, i) => (
                <div key={c.id} style={i > 0 ? { marginTop: 10, borderTop: '1px dashed rgba(74,65,42,0.15)', paddingTop: 8 } : {}}>
                  <span className="classified-heading">{c.heading}</span>
                  <p className="classified-body">{c.body}</p>
                </div>
              ))}
            </div>

            <hr className="column-divider" />

            {/* ওয়াক্স সিল */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }} aria-hidden="true">
              <div className="wax-seal">
                <div className="seal-inner">
                  <span className="seal-letter">P</span>
                  <span className="seal-text">PYHOOD APPROVED</span>
                </div>
              </div>
            </div>
          </aside>
        </main>

        <hr className="double-divider" />

        {/* নিচের সেকশন */}
        <section style={{ margin: '20px 0' }} aria-label="জাদুভিত্তিক বিশ্বের চারপাশে">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, textAlign: 'center', letterSpacing: '1px', marginBottom: 20, borderBottom: '1px solid var(--border-color)', paddingBottom: 8 }}>
            জাদুভিত্তিক বিশ্বের চারপাশে
          </h2>
          <div className="bottom-grid">
            {bottomArticles.map(article => (
              <div key={article.id} className="bottom-card">
                <span className="card-tag">{article.category}</span>
                <h3 className="card-title">
                  <a onClick={() => openArticle(article)}>{article.title}</a>
                </h3>
                <p className="card-snippet">
                  {article.snippet} <a onClick={() => openArticle(article)} className="read-more">আরও পড়ুন...</a>
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr className="double-divider" />

        {/* ফুটার */}
        <footer style={{ textAlign: 'center', padding: '10px 0', fontSize: '0.85rem', fontFamily: 'var(--font-bengali)', color: 'var(--border-color)' }} role="contentinfo">
          <nav style={{ display: 'flex', justifyContent: 'center', gap: 15, marginBottom: 8, flexWrap: 'wrap' }} aria-label="ফুটার নেভিগেশন">
            <a href="/archive" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>📚 আর্কাইভ</a>
            <a href="/sections" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>📂 বিভাগ</a>
            <a href="/subscribe" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>🔮 সাবস্ক্রিপশন</a>
          </nav>
          <p>© ১৭৪৩-২০২৬ ডেইলি পাইহুড পাবলিকেশনস লিমিটেড। সর্বস্বত্ব সংরক্ষিত। উইজার্ডিং প্রেস গিল্ডের অধীনে নিবন্ধিত। অননুমোদিত নকল ব্যাঙে রূপান্তরের সম্মুখীন হবে।</p>
        </footer>
      </div>
    </div>
  )
}