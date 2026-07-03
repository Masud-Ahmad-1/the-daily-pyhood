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
- আর্টিকেল পেজ: /admin/articles — টেবিল, ইস্যু/সেকশন ফিল্টার, ১১টি সেকশন সিলেক্ট, ফর্ম ডায়ালগ
- কন্টেন্ট API (৭টি): tickers, weathers, wanted, ads, classifieds, decrees, letters
- কন্টেন্ট পেজ: /admin/content — ট্যাব ভিত্তিক (৭টি ট্যাব), ডায়নামিক ফর্ম, ইস্যু ফিল্টার
- লিন্ট: 0 errors

Files Created (20):
- src/app/api/auth/[...nextauth]/route.ts
- src/app/api/auth/admin/route.ts
- src/app/admin/login/page.tsx
- src/app/admin/layout.tsx
- src/app/admin/page.tsx
- src/app/api/admin/issues/route.ts
- src/app/api/admin/issues/[id]/route.ts
- src/app/admin/issues/page.tsx
- src/app/api/admin/articles/route.ts
- src/app/api/admin/articles/[id]/route.ts
- src/app/admin/articles/page.tsx
- src/app/api/admin/tickers/route.ts
- src/app/api/admin/weathers/route.ts
- src/app/api/admin/wanted/route.ts
- src/app/api/admin/ads/route.ts
- src/app/api/admin/classifieds/route.ts
- src/app/api/admin/decrees/route.ts
- src/app/api/admin/letters/route.ts
- src/app/admin/content/page.tsx
- .env (updated)