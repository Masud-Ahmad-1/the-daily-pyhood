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