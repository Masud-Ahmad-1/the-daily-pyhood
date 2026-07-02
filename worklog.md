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