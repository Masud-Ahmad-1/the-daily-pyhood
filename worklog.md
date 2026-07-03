---
Task ID: 1
Agent: Main Agent
Task: ফেজ ১ — "The Daily Prophet" থেকে "The Daily Pyhood" নাম পরিবর্তন, বাংলা ভাষায় রূপান্তর, Next.js ডাইনামিক সাইট, ডাটাবেস স্কিমা

Work Log:
- সমস্ত ১০টি আর্টিকেল, টিকার, আবহাওয়া, ওয়ান্টেড পোস্টার, ক্লাসিফাইড, ডিক্রি, চিঠি, বিজ্ঞাপন বাংলায় অনুবাদ করা হয়েছে
- Prisma schema তৈরি: Issue, Article, ArticleView, IssueView, Ticker, Weather, WantedPoster, Ad, Classified, Decree, Letter — মোট ১১টি টেবিল
- ডাটাবেস সিড করা হয়েছে সম্পূর্ণ বাংলা ডেটা সহ
- API Routes তৈরি: /api/newspaper (GET), /api/articles/view (POST)
- Layout.tsx আপডেট: Bengali fonts (Noto Sans Bengali, Hind Siliguri), Cinzel Decorative ও Playfair Display
- globals.css সম্পূর্ণ পুনরায় লেখা: পার্চমেন্ট থিম, Nox ডার্ক মোড, মন্ত্র ইফেক্ট, স্পার্কল, রেসপন্সিভ ডিজাইন, reduced motion
- page.tsx সম্পূর্ণ পুনরায় লেখা: ডাটাবেস-চালিত পত্রিকা, মন্ত্র সিস্টেম, স্পার্কল পার্টিকেল, আর্টিকেল ভিউ, ওয়ান্টেড পোস্টার ইন্টারেকশন, গোপন সেকশন
- অ্যাসেট কপি: hogwarts_sketch.png, wizard_portrait.png, potion_sketch.png → public/assets/
- Agent Browser দিয়ে যাচাই: ডেস্কটপ, মোবাইল, আর্টিকেল ভিউ, Nox মোড — সব কাজ করছে

Stage Summary:
- ✅ নাম পরিবর্তন: "The Daily Prophet" → "The Daily Pyhood" (মাস্টহেড, সিল, ফুটার, মেটাডেটা)
- ✅ বাংলা ভাষায় রূপান্তর: সমস্ত কন্টেন্ট বাংলায়, Noto Sans Bengali + Hind Siliguri ফন্ট
- ✅ Next.js 16 + Prisma + SQLite ডাইনামিক সাইট
- ✅ ডাটাবেস স্কিমা: ১১টি টেবিল সহ সম্পূর্ণ Prisma schema
- প্রিভিউ স্ক্রিনশট: pyhood-desktop.png, pyhood-mobile.png, pyhood-article-view.png, pyhood-nox-mode.png

---
Task ID: 2
Agent: Main Agent + full-stack-developer subagent
Task: ফেজ ২ — আর্টিকেল পেজ, আর্কাইভ, সেকশন ফিল্টারিং, অ্যানালিটিক্স ড্যাশবোর্ড

Work Log:
- API Route তৈরি: /api/articles/[slug] (GET) — slug দিয়ে আর্টিকেল, ভিউ কাউন্ট ইনক্রিমেন্ট, সম্পর্কিত সংবাদ
- API Route তৈরি: /api/archive (GET) — সমস্ত প্রকাশিত ইস্যু তালিকা ও আর্টিকেল কাউন্ট
- API Route তৈরি: /api/sections (GET) — সেকশন/লেখক ফিল্টার, প্যাজিনেশন
- API Route তৈরি: /api/analytics (GET) — ট্রেন্ডিং, সেকশন স্ট্যাট, দৈনিক ভিউ, জনপ্রিয় লেখক
- পেজ তৈরি: /article/[slug] — সম্পূর্ণ আর্টিকেল রিডার, সম্পর্কিত সংবাদ, ভিউ কাউন্ট, পার্চমেন্ট থিম
- পেজ তৈরি: /archive — ইস্যু কার্ড তালিকা, ক্লিকে আর্টিকেল সমূহ দেখায়
- পেজ তৈরি: /sections — ১১টি সেকশন ট্যাব, লেখক ড্রপডাউন, আর্টিকেল গ্রিড, প্যাজিনেশন
- পেজ তৈরি: /analytics — স্ট্যাট কার্ড, ট্রেন্ডিং টেবিল, CSS-only বার চার্ট, লেখক র‍্যাঙ্কিং
- হোমপেজ আপডেট: selectedArticle modal সরানো, openArticle → /article/[slug] নেভিগেশন
- হোমপেজ নেভিগেশন: টুলবারে আর্কাইব/বিভাগ/পরিসংখ্যান লিংক, ফুটারে নেভিগেশন
- globals.css আপডেট: ৫০০+ লাইন নতুন CSS (mini-masthead, archive, sections, analytics, responsive)
- ভেরিফিকেশন: Lint 0 errors, সব ৫টি পেজ HTTP 200, সব ৪টি API HTTP 200
- ব্রাউজার ভেরিফিকেশন: আর্টিকেল পেজ সম্পূর্ণ কন্টেন্ট সহ ভেরিফাইড

Stage Summary:
- ✅ টাস্ক ৫: /article/[slug] — বিস্তারিত আর্টিকেল পেজ (API + Page)
- ✅ টাস্ক ৬: /archive — আর্কাইভ ও পুরনো সংখ্যা ব্রাউজিং (API + Page)
- ✅ টাস্ক ৭: /sections — সেকশন ভিত্তিক পেজ ও ফিল্টারিং (API + Page)
- ✅ টাস্ক ৮: /analytics — অ্যানালিটিক্স ড্যাশবোর্ড (API + Page)
- ✅ হোমপেজ আপডেট: modal → route-based navigation, নেভিগেশন লিংক
- স্ক্রিনশট: pyhood-phase2-homepage.png, pyhood-phase2-article.png

---
Task ID: 3
Agent: Main Agent
Task: ফেজ ৩, টাস্ক ৯ — অ্যাডমিন প্যানেল (The Daily Pyhood)

Work Log:
- .env আপডেট: NEXTAUTH_SECRET, NEXTAUTH_URL, ADMIN_USERNAME, ADMIN_PASSWORD
- NextAuth v4 কনফিগারেশন: CredentialsProvider, JWT strategy, callbacks (jwt, session)
- API Route: /api/auth/[...nextauth]/route.ts — GET/POST, CredentialsProvider
- API Route: /api/auth/admin/route.ts — GET, সেশন যাচাই
- লগইন পেজ: /admin/login — পার্চমেন্ট থিম, ইউজারনেম/পাসওয়ার্ড ফর্ম, এরর হ্যান্ডলিং
- অ্যাডমিন লেআউট: /admin/layout.tsx — ডার্ক সাইডবার (#1a1816), gold accents, মোবাইল হ্যামবার্গার, অথেন্টিকেশন চেক
- ড্যাশবোর্ড: /admin/page.tsx — পরিসংখ্যি কার্ড (৫টি), সাম্প্রতিক আর্টিকেল (শেষ ৫টি), দ্রুত অ্যাকশন বাটন
- ইস্যু CRUD API: /api/admin/issues (GET/POST), /api/admin/issues/[id] (GET/PUT/DELETE)
- ইস্যু পেজ: /admin/issues — টেবিল, প্যাজিনেশন, তৈরি/সম্পাদনা ডায়ালগ, প্রকাশ টগল, মুছে ফেলা
- আর্টিকেল CRUD API: /api/admin/articles (GET/POST), /api/admin/articles/[id] (GET/PUT/DELETE)
- আর্টিকেল পেজ: /admin/articles — টেবিল, ইস্যু/সেকশন ফিল্টার, ১১টি সেকশন সিলেক্ট, ফর্ম ডায়ালগ (slug auto-generate, content JSON)
- কন্টেন্ট API (৭টি): tickers, weathers, wanted, ads, classifieds, decrees, letters — প্রতিটিতে GET/POST/PUT/DELETE
- কন্টেন্ট পেজ: /admin/content — ট্যাব ভিত্তিক (৭টি ট্যাব), ডায়নামিক ফর্ম, ইস্যু ফিল্টার, CRUD ডায়ালগ
- সাইডবার মেনু: ড্যাশবোর্ড, সংখ্যা পরিচালনা, আর্টিকেল পরিচালনা, কন্টেন্ট পরিচালনা (সাব-আইটেম সহ), লগআউট
- স্টাইলিং: পার্চমেন্ট থিম, shadcn/ui কম্পোনেন্ট, মোবাইল রেসপন্সিভ, বাংলা ফন্ট
- লিন্ট: 0 errors (শুধু ১টি pre-existing warning)

Stage Summary:
- ✅ অ্যাডমিন অথেন্টিকেশন: NextAuth v4, CredentialsProvider, JWT session
- ✅ লগইন পেজ: পার্চমেন্ট থিম, এরর হ্যান্ডলিং
- ✅ অ্যাডমিন লেআউট: ডার্ক সাইডবার, রেসপন্সিভ, অথেন্টিকেশন গার্ড
- ✅ ড্যাশবোর্ড: পরিসংখ্যি কার্ড, সাম্প্রতিক আর্টিকেল, দ্রুত অ্যাকশন
- ✅ ইস্যু পরিচালনা: CRUD API + ম্যানেজমেন্ট পেজ (টেবিল, ডায়ালগ, টগল)
- ✅ আর্টিকেল পরিচালনা: CRUD API + ম্যানেজমেন্ট পেজ (ফিল্টার, ১১ সেকশন, slug auto-generate)
- ✅ কন্টেন্ট পরিচালনা: ৭টি API route + ট্যাব ভিত্তিক পেজ (ডায়নামিক ফর্ম)

---
Task ID: 4
Agent: Main Agent
Task: ফেজ ৩, টাস্ক ১০ — কপিরাইট প্রটেকশন সিস্টেম (The Daily Pyhood)

Work Log:
- globals.css আপডেট: .copyright-overlay, .copyright-overlay::after, .protected-text CSS ক্লাস যোগ
- CopyrightProtection component তৈরি: /src/components/copyright-protection.tsx
  - টেক্সট সিলেকশন ব্লক (user-select: none, input/textarea ব্যতিত)
  - কন্টেক্সট মেনু ব্লক (contextmenu preventDefault)
  - কপি ব্লক + কাস্টম টোস্ট ("📜 ডেইলি পাইহুডের কপিরাইট সুরক্ষিত। অনুমোদন ছাড়া কপি করা নিষিধ্ধ।")
  - Ctrl+C, Ctrl+U, Ctrl+S, F12 কীবোর্ড শর্টকাট ব্লক
  - ইমেজ ড্র্যাগ ব্লক (dragstart preventDefault)
  - ইমেজ pointer-events: none (CSS injection)
  - অ্যাডমিন পেজে (/admin/*) প্রটেকশন নিষ্ক্রিয়
- layout.tsx আপডেট: <CopyrightProtection /> component children-র পরে রেন্ডার
- ওয়াটারমার্ক API তৈরি: /api/watermark/route.ts (POST)
  - sharp লাইব্রেরি দিয়ে ইমেজে ওয়াটারমার্ক কম্পোজিট
  - SVG text overlay: সেমি-ট্রান্সপ্যারেন্ট সাদা, shadow, ডান নিচে
  - Response: base64 data URL
  - Error handling: ইমেজ লোড/প্রসেস ব্যর্থতায় বাংলা ত্রুটি মেসেজ
- আর্টিকেল পেজ আপডেট: ছবির container-এ .copyright-overlay ক্লাস যোগ (CSS ::after overlay)
- লিন্ট: 0 errors

Stage Summary:
- ✅ ক্লায়েন্ট-সাইড প্রটেকশন: টেক্সট সিলেকশন, কন্টেক্সট মেনু, কপি, কীবোর্ড, ড্র্যাগ, ইমেজ ব্লক
- ✅ কাস্টম টোস্ট: কপি ব্লক সময় বাংলা মেসেজ প্রদর্শন
- ✅ অ্যাডমিন ব্যতিত: /admin/* পেজে প্রটেকশন নিষ্ক্রিয়
- ✅ ওয়াটারমার্ক API: sharp দিয়ে ইমেজে "© The Daily Pyhood" ওয়াটারমার্ক
- ✅ CSS ওভারলে: আর্টিকেল ছবিতে ::after পিসোডো-এলিমেন্ট দিয়ে কপিরাইট টেক্সট
- ✅ ব্লারড প্রিভিউ ফাউন্ডেশন: CSS ক্লাস প্রস্তুত (.copyright-overlay, .protected-text)

---
Task ID: 5
Agent: Main Agent
Task: ফেজ ৩, টাস্ক ১১-১২ — সাবস্ক্রিপশন সিস্টেম ও ইউজার প্রোফাইল (The Daily Pyhood)

Work Log:
- প্রিজমা স্কিমা আপডেট: User, Transaction, ArticleRead মডেল যোগ
  - User: username(unique), displayName, email(unique?), passwordHash, role, provider, galleons(default:50), sickles, knuts, subscriptionPlan, subscriptionEnds
  - Transaction: userId, type, amountG/S/K, description, balanceG
  - ArticleRead: userId, articleId (@unique compound)
  - bun run db:push সফল
- অথ API Routes:
  - /api/auth/register (POST): username unique চেক, SHA-256 হ্যাশ, ৫০G স্বাগত বোনাস + welcome transaction
  - /api/auth/login (POST): ভেরিফাই, ইউজার ডেটা রিটার্ন
  - /api/auth/me (GET): userId দিয়ে প্রোফাইল, expired subscription auto-reset
- সাবস্ক্রিপশন API Routes:
  - /api/subscription/plans (GET): আউল(5G), ফিনিক্স(15G), ড্রাগন(50G)
  - /api/subscribe (POST): ব্যালেন্স চেক, কাটা, ৩০ দিন subscription, transaction record
- ওয়ালেট API Routes:
  - /api/wallet (GET): ব্যালেন্স ৩ মুদ্রায় + totalInGalleons + শেষ ২০টি লেনদেন
  - /api/wallet/convert (POST): 1G=17S=493K রূপান্তর, knut-based calculation, transaction record
- পেজ তৈরি (৪টি):
  - /login — ট্যাব ভিত্তিক লগইন/রেজিস্ট্রেশন, পার্চমেন্ট থিম, localStorage auth, ৫০G বোনাস নোটিফিকেশন
  - /profile — অ্যাভাটার, পরিসংখ্যি (G/S/K/সাবস্ক্রিপশন), দ্রুত লিংক, শেষ ১০টি লেনদেন টেবিল, লগআউট
  - /subscribe — ৩ প্ল্যান কার্ড (আউল/ফিনিক্স/ড্রাগন), বর্তমান প্ল্যান হাইলাইট, ব্যালেন্স চেক, ড্রাগন গোল্ড বর্ডার + প্রিমিয়াম রিবন
  - /wallet — ৩ মুদ্রার বড় ব্যালেন্স কার্ড (সোনালী/রৌপ্য/ব্রোঞ্জ), মোট সম্পদ, মুদ্রা রূপান্তর ফর্ম, লেনদেন টেবিল
- নেভিগেশন আপডেট:
  - page.tsx টুলবার ও ফুটারে ৩টি নতুন লিংক (ওয়ালেট/প্রোফাইল/সাবস্ক্রিপশন)
  - admin/layout.tsx সাইডবারে "ইউজার ফিচার" সেকশন (৩টি লিংক)
- CSS (globals.css): ৮৫০+ লাইন নতুন CSS
  - পার্চমেন্ট পেজ কন্টেইনার, অথ ফর্ম, প্রোফাইল কার্ড, সাবস্ক্রিপশন প্ল্যান কার্ড
  - ওয়ালেট ব্যালেন্স কার্ড (গ্যালিয়ন=সোনালী, সিকেল=রৌপ্য, নাট=ব্রোঞ্জ)
  - মুদ্রা রূপান্তর ফর্ম, লেনদেন টেবিল, টাইপ ব্যাজ
  - লোডিং/সাকসেস/ওয়ার্নিং স্টেট, মোবাইল রেসপন্সিভ, Nox ডার্ক মোড সাপোর্ট
- লিন্ট: 0 errors (শুধু ১টি pre-existing warning)

Stage Summary:
- ✅ ডাটাবেস: User, Transaction, ArticleRead মডেল + db push
- ✅ অথ API: register, login, me (SHA-256 hash, ৫০G স্বাগত বোনাস)
- ✅ সাবস্ক্রিপশন API: plans (GET), subscribe (POST, ব্যালেন্স চেক + কাটা + ৩০ দিন)
- ✅ ওয়ালেট API: balance (GET, ৩ মুদ্রা + লেনদেন), convert (POST, 1G=17S=493K)
- ✅ লগইন/রেজিস্ট্রেশন পেজ: ট্যাব, পার্চমেন্ট থিম, localStorage auth
- ✅ প্রোফাইল পেজ: অ্যাভাটার, পরিসংখ্যি, সাবস্ক্রিপশন ব্যাজ, লেনদেন
- ✅ সাবস্ক্রিপশন পেজ: ৩ প্ল্যান কার্ড, ড্রাগন প্রিমিয়াম স্টাইল, ব্যালেন্স চেক
- ✅ ওয়ালেট পেজ: ৩ মুদ্রার ব্যালেন্স, রূপান্তর টুল, লেনদেন টেবিল
- ✅ নেভিগেশন: হোমপেজ + অ্যাডমিন সাইডবারে ৩টি নতুন লিংক
- ✅ CSS: ৮৫০+ লাইন, Nox ডার্ক মোড সাপোর্ট, মোবাইল রেসপন্সিভ