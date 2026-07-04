const { createClient } = require('@libsql/client');

const DB_URL = 'libsql://pyhood-masud-ahmad-1.aws-ap-south-1.turso.io';
const AUTH_TOKEN = process.env.TURSO_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODMxMDIzOTcsImlkIjoiMDE5ZjI5MmUtOTkwMS03ODNjLThjMzAtMTYzNGFkNmM3YzdiIiwia2lkIjoiRDRyelJzMGxrVGJnTElpQ2p3VTJ0aVZHREJnWGZjNERId3prcTBxZmcxUSIsInJpZCI6IjE5NTNhNTNmLTljODQtNDM0My05NmU0LTdmNTUzMzIyNzMyYyJ9.9R08sRnJLPtFRswtEBthUQ83qGucznECpFkNo0dZDvxvhxqyEeuvQ1WY66pcj23CLKcmoFU242UuxAhrfuNZDw';

const client = createClient({ url: DB_URL, authToken: AUTH_TOKEN });
const ISSUE_ID = 'issue-32847';
const now = new Date().toISOString();

async function run() {
  console.log('🌱 Seeding full newspaper data...');

  // ===== টিকার =====
  const tickers = [
    '⚡ হগওয়ার্টস এক্সপ্রেস আজ থেকে নতুন সময়সূচী অনুসারে চলবে',
    '⚡ মন্ত্রমন্ত্রণালয়ে নতুন জাদুদণ্ড নিয়ন্ত্রণ আইন পাস',
    '⚡ ডায়াগন অ্যালিতে আজ বিকেলে বিশেষ ছাড় — সব পণ্য ৩০% পর্যন্ত ছাড়!',
    '⚡ কুইডিচ বিশ্বকাপ ১৯৯৭ এর টিকেট এখনো পাওয়া যাচ্ছে',
    '⚡ প্রফেসর স্নেপের নতুন মন্ত্র বই বেস্টসেলার!',
  ];
  for (let i = 0; i < tickers.length; i++) {
    await client.execute({
      sql: `INSERT INTO Ticker (id, issueId, message, sortOrder) VALUES (?, ?, ?, ?)`,
      args: [`ticker-${i+1}`, ISSUE_ID, tickers[i], i+1]
    });
  }
  console.log(`  ✅ ${tickers.length} tickers`);

  // ===== ওয়েদার =====
  const weathers = [
    { location: 'হগওয়ার্টস', emoji: '🌧️', forecast: 'হালকা বৃষ্টি, মেঘলা আকাশ। আজ রাতে আকাশে নক্ষত্র দেখা যাবে না।' },
    { location: 'ডায়াগন অ্যালি', emoji: '☀️', forecast: 'পরিষ্কার আকাশ, উষ্ণ। দুপুরে সূর্যের তেজ বেশি থাকবে।' },
    { location: 'হগসমিড', emoji: '🌦️', forecast: 'বিক্ষিপ্ত বজ্রপাতসহ বৃষ্টি। হানিডিউকস এ সাবধান থাকুন!' },
    { location: 'আজকাবান', emoji: '🌫️', forecast: 'ঘন কুয়াশা, শীতল বাতাস। দৃশ্যমানতা খুবই কম।' },
  ];
  for (let i = 0; i < weathers.length; i++) {
    const w = weathers[i];
    await client.execute({
      sql: `INSERT INTO Weather (id, issueId, location, emoji, forecast, sortOrder) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [`weather-${i+1}`, ISSUE_ID, w.location, w.emoji, w.forecast, i+1]
    });
  }
  console.log(`  ✅ ${weathers.length} weathers`);

  // ===== ওয়ান্টেড পোস্টার =====
  const wanted = [
    { name: 'সিরিয়াস ব্ল্যাক', description: 'আজকাবান থেকে পলাতক। বিশ্বাসঘাতক হিসেবে অভিযুক্ত। বিপজ্জনক বলে বিবেচিত।', reward: '১০,০০০ গ্যালন', isPublished: 1 },
    { name: 'বেলাট্রিক্স লেস্ট্র্যাঞ্জ', description: 'মন্ত্রমন্ত্রণালয়ে হামলার পর থেকে পলাতক। কালো জাদু ব্যবহারে দক্ষ।', reward: '১৫,০০০ গ্যালন', isPublished: 1 },
  ];
  for (let i = 0; i < wanted.length; i++) {
    const w = wanted[i];
    await client.execute({
      sql: `INSERT INTO WantedPoster (id, issueId, name, description, reward, imageUrl, isPublished) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [`wanted-${i+1}`, ISSUE_ID, w.name, w.description, w.reward, null, w.isPublished]
    });
  }
  console.log(`  ✅ ${wanted.length} wanted posters`);

  // ===== ক্লাসিফাইড =====
  const classifieds = [
    { heading: 'বিক্রি: ফায়ারবোল্ট', body: 'দ্বিতীয় হাত ফায়ারবোল্ট বিক্রি হবে। খুব ভালো অবস্থায়। মূল্য: ৫০০ গ্যালন। যোগাযোগ: ফ্লো নেটওয়ার্ক ID: ওলিভান্ডার্স_ফ্যান' },
    { heading: 'ভাড়া দেওয়া হবে', body: 'হগসমিডে ছোট দোকান ভাড়া দেওয়া হবে। জাদুকরি পণ্যের দোকানের জন্য আদর্শ। মাসিক ১০০ গ্যালন।' },
    { heading: 'পাঠদান', body: 'স্নাতকোত্তর জাদুকর। চার্মস ও ডিফেন্স এগেইন্স্ট দ্য ডার্ক আর্টসে পাঠদান করি। গৃহপাঠে বা হগওয়ার্টসে।' },
    { heading: 'হারানো: সোনালী স্নিচ', body: 'গত শুক্রবার হগসমিডে সোনালী স্নিচ হারিয়েছি। পুরস্কার দেওয়া হবে। যোগাযোগ: হুইস্পারনেট' },
  ];
  for (let i = 0; i < classifieds.length; i++) {
    const c = classifieds[i];
    await client.execute({
      sql: `INSERT INTO Classified (id, issueId, heading, body, sortOrder) VALUES (?, ?, ?, ?, ?)`,
      args: [`classified-${i+1}`, ISSUE_ID, c.heading, c.body, i+1]
    });
  }
  console.log(`  ✅ ${classifieds.length} classifieds`);

  // ===== ডিক্রি =====
  const decrees = [
    { title: 'জাদুদণ্ড নিবন্ধন আইন', decreeNumber: '৩২৮৪৭/ডি', body: 'সকল জাদুদণ্ড ব্যবহারকারীকে অবিলম্বে মন্ত্রমন্ত্রণালয়ে নিবন্ধন করতে হবে। অনিবন্ধিত জাদুদণ্ড ব্যবহার শাস্তিযোগ্য অপরাধ।', signedBy: 'কর্নেলিয়াস ফাজ, মন্ত্রী' },
    { title: 'স্মেলটিং সীমাবদ্ধতা', decreeNumber: '৩২৮৪৭/এস', body: 'আগামী ৩০ দিনের জন্য সমস্ত স্মেলটিং কার্যক্রম সীমিত থাকবে। বিশেষ অনুমতি ছাড়া নতুন স্মেলটিং নিষিদ্ধ।', signedBy: 'কর্নেলিয়াস ফাজ, মন্ত্রী' },
  ];
  for (let i = 0; i < decrees.length; i++) {
    const d = decrees[i];
    await client.execute({
      sql: `INSERT INTO Decree (id, issueId, title, decreeNumber, body, signedBy, sortOrder) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [`decree-${i+1}`, ISSUE_ID, d.title, d.decreeNumber, d.body, d.signedBy, i+1]
    });
  }
  console.log(`  ✅ ${decrees.length} decrees`);

  // ===== লেটার টু এডিটর =====
  const letters = [
    { author: 'আর্থার ওয়েসলি', body: 'সম্প্রদির সম্পাদক, মাগল-বিষয়ক আর্টিফ্যাক্ট অফিসে নতুন নিয়মগুলো নিয়ে আমার গভীর উদ্বেগ প্রকাশ করছি। মাগল প্রযুক্তি নিয়ে গবেষণা জাদুকরদের জন্য উপকারী হতে পারে!' },
    { author: 'মলি ওয়েসলি', body: 'আপনার পত্রিকায় রান্নার মন্ত্র নিয়ে যে প্রতিবেদন ছাপা হয়েছে, তা দেখে আমি খুশি। তবে বোলাঘ্রাট সসের রেসিপিতে একটি ভুল আছে — লেমন জুসের বদলে লেমন রিন্ড ব্যবহার করতে হবে!' },
    { author: 'রিমাস লুপিন', body: 'আপনার সাম্প্রতিক নিবন্ধে ওয়্যারওলফ অধিকার নিয়ে যে আলোচনা হয়েছে তা প্রশংসনীয়। জাদুকর সমাজকে আরও সহানুভূতিশীল হতে হবে।' },
  ];
  for (let i = 0; i < letters.length; i++) {
    const l = letters[i];
    await client.execute({
      sql: `INSERT INTO Letter (id, issueId, author, body, sortOrder) VALUES (?, ?, ?, ?, ?)`,
      args: [`letter-${i+1}`, ISSUE_ID, l.author, l.body, i+1]
    });
  }
  console.log(`  ✅ ${letters.length} letters`);

  // ===== বিজ্ঞাপন =====
  const ads = [
    { title: 'ওলিভান্ডার্স', subtitle: 'যেহেতু ৩৮২ খ্রিস্টপূর্বাব্দ', description: 'বিশ্বের সেরা জাদুদণ্ড নির্মাতা। আপনার জাদুদণ্ড আপনাকে বেছে নেয়!', price: '৫০০-৫,০০০ গ্যালন', articleSlug: null },
    { title: 'ফ্লো পাউডার নেটওয়ার্ক', subtitle: 'সর্বত্র পৌঁছানোর সহজ উপায়', description: 'সারা বিশ্বে দ্রুত ও নিরাপদ ভ্রমণ। সাপ্তাহিক পাস মাত্র ২০ গ্যালন!', price: '৫০ গ্যালন থেকে', articleSlug: 'floo-rates' },
    { title: 'জাদু প্রাণী সংরক্ষণ সংঘ', subtitle: 'নিউট স্ক্যাম্যান্ডার ফাউন্ডেশন', description: 'বিপন্ন জাদু প্রাণীদের রক্ষায় আমাদের সাথে যোগ দিন। দান করুন, জীবন বাঁচান!', price: null, articleSlug: null },
  ];
  for (let i = 0; i < ads.length; i++) {
    const a = ads[i];
    await client.execute({
      sql: `INSERT INTO Ad (id, issueId, title, subtitle, description, imageUrl, price, articleSlug, sortOrder) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [`ad-${i+1}`, ISSUE_ID, a.title, a.subtitle, a.description, null, a.price, a.articleSlug, i+1]
    });
  }
  console.log(`  ✅ ${ads.length} ads`);

  // ===== আরও ৫টি আর্টিকেল =====
  const moreArticles = [
    {
      id: 'issue-32847-a4', slug: 'ministry-magic-trace', section: 'ministry',
      title: 'মন্ত্রমন্ত্রণালয়ে নতুন ম্যাজিক ট্রেসিং সিস্টেম',
      subtitle: 'আইনশৃঙ্খলা বিভাগে আধুনিক প্রযুক্তি চালু',
      author: 'রিটা স্কিটার', category: 'সরকার', sortOrder: 3,
      snippet: 'মন্ত্রমন্ত্রণালয় আজ ঘোষণা করেছে নতুন "ম্যাজিক ট্রেসিং নেটওয়ার্ক" চালু হতে যাচ্ছে।',
      content: JSON.stringify([
        { type: 'paragraph', text: 'মন্ত্রমন্ত্রণালয়ের আইনশৃঙ্খলা বিভাগ আজ ঘোষণা করেছে যে নতুন "ম্যাজিক ট্রেসিং নেটওয়ার্ক" আগামী সপ্তাহ থেকে পরীক্ষামূলকভাবে চালু হবে। এই সিস্টেমটি অবৈধ জাদু ব্যবহার সনাক্ত করতে সক্ষম হবে বলে দাবি করা হয়েছে।' },
        { type: 'paragraph', text: 'অ্যামোস ডিগরি, আইনশৃঙ্খলা বিভাগের প্রধান, জানান যে নতুন সিস্টেমটি প্রতিটি জাদুর অবশিষ্টাংশ (magical signature) রেকর্ড করবে এবং সন্দেহজনক কার্যকলাপ সনাক্ত করলে তাৎক্ষণিকভাবে অ্যালার্ম জারি করবে।' },
        { type: 'paragraph', text: 'তবে মানবাধিকার সংগঠনগুলো এই পদক্ষেপকে গোপনীয়তা লঙ্ঘন বলে সমালোচনা করেছেন। উইজেনগামোট সদস্য ডাম্বলডোর বলেন, "আমরা নিরাপত্তা চাই, কিন্তু স্বাধীনতার মূল্যও বুঝি।"' }
      ])
    },
    {
      id: 'issue-32847-a5', slug: 'quidditch-world-cup-preview', section: 'sports',
      title: 'কুইডিচ বিশ্বকাপ ১৯৯৭: প্রাক-পর্যালোচনা',
      subtitle: 'বুলগেরিয়া বনাম আয়ারল্যান্ড — কে জিতবে?',
      author: 'কিয়ার কিটিঞ্জ', category: 'খেলাধুলা', sortOrder: 6,
      snippet: 'আগামী সপ্তাহে কুইডিচ বিশ্বকাপের সেমিফাইনালে মুখোমুখি হবে বুলগেরিয়া ও আয়ারল্যান্ড।',
      content: JSON.stringify([
        { type: 'paragraph', text: 'কুইডিচ বিশ্বকাপ ১৯৯৭ এর সেমিফাইনালে বুলগেরিয়া ও আয়ারল্যান্ড মুখোমুখি হতে যাচ্ছে। ভিক্টর ক্রামের নেতৃত্বে বুলগেরিয়া দল এবং আয়ারল্যান্ড দল উভয়েই চমৎকার ফর্মে রয়েছে।' },
        { type: 'paragraph', text: 'বিশেষজ্ঞরা মনে করছেন বুলগেরিয়ার সুবিধা বেশি, কারণ ক্রাম বিশ্বের অন্যতম সেরা সিকার। তবে আয়ারল্যান্ডের চেজাররা অত্যন্ত দ্রুতগতির, যা ম্যাচের গতি পরিবর্তন করতে পারে।' },
        { type: 'paragraph', text: 'টিকেট এখনও পাওয়া যাচ্ছে। আগ্রহীরা মন্ত্রমন্ত্রণালয়ের ক্রীড়া বিভাগে যোগাযোগ করতে পারেন। ম্যাচটি আগামী শনিবার সন্ধ্যায় অনুষ্ঠিত হবে।' }
      ])
    },
    {
      id: 'issue-32847-a6', slug: 'knockturn-alley-mystery', section: 'mystery',
      title: 'নকটার্ন অ্যালিতে রহস্যময় চোখের আলো',
      subtitle: 'কয়েকজন জাদুকর অজ্ঞান অবস্থায় পাওয়া গেছে',
      author: 'দ্য কোরিয়ার স্পেশাল', category: 'রহস্য', sortOrder: 4,
      snippet: 'নকটার্ন অ্যালির গভীরে রাতের বেলায় অদ্ভুত বেগুনি আলো দেখা যাচ্ছে।',
      content: JSON.stringify([
        { type: 'paragraph', text: 'নকটার্ন অ্যালির গভীরে গত সপ্তাহ থেকে রাতের বেলায় অদ্ভুত বেগুনি আলো দেখা যাচ্ছে। কয়েকজন পথচারী জাদুকর অজ্ঞান অবস্থায় পাওয়া গেছে, যাদের স্মৃতি সাময়িকভাবে মুছে গেছে।' },
        { type: 'paragraph', text: 'অরোররা বিভাগের কর্মকর্তারা তদন্ত শুরু করেছেন। প্রাথমিক তদন্তে ধারণা করা হচ্ছে কোনো নিষিদ্ধ স্মৃতি-মুছে ফেলার মন্ত্র ব্যবহার করা হচ্ছে।' },
        { type: 'paragraph', text: 'মন্ত্রমন্ত্রণালয় নাগরিকদের সতর্ক থাকার পরামর্শ দিয়েছে এবং রাতে নকটার্ন অ্যালিতে যাওয়া থেকে বিরত থাকতে বলেছে।' }
      ])
    },
    {
      id: 'issue-32847-a7', slug: 'gringotts-galleon-rates', section: 'economy',
      title: 'গ্রিংগটসে গ্যালনের মূল্য বৃদ্ধি',
      subtitle: 'মাগল মুদ্রার বিপরীতে জাদুকর মুদ্রার দাম বেড়েছে',
      author: 'দ্য প্রফেট', category: 'অর্থনীতি', sortOrder: 7,
      snippet: 'গত মাসে গ্যালনের মূল্য ৫% বৃদ্ধি পেয়েছে। বিশেষজ্ঞরা এর কারণ হিসেবে ড্রাগন পাহারার খরচ বৃদ্ধিকে দায়ী করছেন।',
      content: JSON.stringify([
        { type: 'paragraph', text: 'গ্রিংগটস ব্যাংক আজ ঘোষণা করেছে যে গত মাসে গ্যালনের মূল্য মাগল মুদ্রার বিপরীতে ৫% বৃদ্ধি পেয়েছে। এটি গত দুই বছরের মধ্যে সর্বোচ্চ বৃদ্ধি।' },
        { type: 'paragraph', text: 'অর্থনীতিবিদরা মনে করছেন ড্রাগন পাহারার খরচ বৃদ্ধি, নতুন নিরাপত্তা ব্যবস্থা এবং আন্তর্জাতিক জাদু বাণিজ্যে মন্দার কারণে এই মূল্যবৃদ্ধি হয়েছে।' },
        { type: 'paragraph', text: 'গ্রিংগটসের মুখপাত্র জানান, "আমরা গ্রাহকদের আশ্বস্ত করছি যে তাদের সঞ্চয় সম্পূর্ণ নিরাপদ। নতুন নিরাপত্তা ব্যবস্থা গ্রাহকদের সম্পদের সুরক্ষা নিশ্চিত করবে।"' }
      ])
    },
    {
      id: 'issue-32847-a8', slug: 'honeydukes-new-chocolates', section: 'entertainment',
      title: 'হানিডিউকসে নতুন জাদু চকলেট কালেকশন',
      subtitle: 'ভালেন্টাইন স্পেশাল "অ্যামোর্টেনশা ট্রাফলস"',
      author: 'গ্ল্যাডিস গগলউইক', category: 'বিনোদন', sortOrder: 8,
      snippet: 'হানিডিউকস নতুন চকলেট কালেকশন বাজারে আনছে যা খাওয়ার পর সাময়িকভাবে প্রেমের অনুভূতি তৈরি করে!',
      content: JSON.stringify([
        { type: 'paragraph', text: 'হানিডিউকস জাদু মিষ্টির দোকান আজ তাদের নতুন "অ্যামোর্টেনশা ট্রাফলস" কালেকশন উন্মোচন করেছে। এই বিশেষ চকলেটগুলো খাওয়ার পর সাময়িকভাবে প্রেমের অনুভূতি তৈরি করে বলে দাবি করা হয়েছে।' },
        { type: 'paragraph', text: 'তবে মন্ত্রমন্ত্রণালয়ের জাদু পণ্য নিয়ন্ত্রণ বিভাগ এই পণ্যটি পরীক্ষা করছে। একজন মুখপাত্র জানান, "আমরা নিশ্চিত হতে চাই যে পণ্যটি নিরাপদ এবং কোনো নিয়ন্ত্রণহীন প্রভাব নেই।"' },
        { type: 'paragraph', text: 'হানিডিউকসের মালিক জানান যে প্রতিটি ট্রাফলের দাম ৫ সিকল এবং হগসমিডের দোকানেই কেবল পাওয়া যাবে।' }
      ])
    },
  ];

  for (const a of moreArticles) {
    await client.execute({
      sql: `INSERT INTO Article (id, slug, issueId, section, title, subtitle, author, category, snippet, content, imageUrl, imageFilter, imageCaption, isPublished, sortOrder, viewCount, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [a.id, a.slug, ISSUE_ID, a.section, a.title, a.subtitle, a.author, a.category, a.snippet, a.content, null, null, null, 1, a.sortOrder, 0, now, now]
    });
  }
  console.log(`  ✅ ${moreArticles.length} more articles`);

  console.log('\n🎉 Full newspaper seeded successfully!');
  console.log(`   Total: ${tickers.length} tickers, ${weathers.length} weathers, ${wanted.length} wanted, ${classifieds.length} classifieds, ${decrees.length} decrees, ${letters.length} letters, ${ads.length} ads, ${moreArticles.length} articles`);
}

run().catch(e => { console.error('❌ Seed error:', e.message); process.exit(1); });