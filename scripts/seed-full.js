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
      snippet: 'গ্রিংগটস ব্যাংক গত মাসে গ্যালনের মূল্য মাগল মুদ্রার বিপরীতে ৫% বৃদ্ধি ঘোষণা করেছে। ড্রাগন পাহারার খরচ বৃদ্ধি, আন্তর্জাতিক জাদু বাণিজ্যে মন্দা এবং নতুন নিরাপত্তা ব্যবস্থার কারণে এই সিদ্ধান্ত নেওয়া হয়েছে।',
      content: JSON.stringify([
        { type: 'paragraph', text: 'গ্রিংগটস জাদুকর ব্যাংক গতকাল এক বিস্ময়কর ঘোষণায় জানিয়েছে যে গত মাসে গ্যালনের মূল্য মাগল মুদ্রার বিপরীতে প্রায় পাঁচ শতাংশ বৃদ্ধি পেয়েছে। এটি গত দুই বছরের মধ্যে সর্বোচ্চ মূল্যবৃদ্ধি হিসেবে চিহ্নিত হয়েছে এবং জাদুবিশ্বের অর্থনৈতিক মহলে ব্যাপক আলোচনার ঝড় তুলেছে। গ্রিংগটসের প্রধান গবলিন কর্মকর্তা গ্রিপহুক তার অফিস থেকে এই ঘোষণা দেন এবং সাংবাদিকদের বলেন যে এই সিদ্ধান্তটি অত্যন্ত সতর্কতার সাথে নেওয়া হয়েছে।' },
        { type: 'paragraph', text: 'মূল্যবৃদ্ধির পেছনে তিনটি প্রধান কারণ চিহ্নিত করা হয়েছে। প্রথমত, গ্রিংগটসের ভল্টগুলোর নিরাপত্তায় নিয়োজিত ড্রাগনগুলোর খাদ্য ও যত্নের খরচ গত ছয় মাসে প্রায় ত্রিশ শতাংশ বেড়েছে। রোমানিয়ান লংহর্ন ড্রাগনের খাবার বিশেষ করে দুর্লভ হয়ে পড়ায় গ্রিংগটসকে বিকল্প সরবরাহকারীদের উপর নির্ভর করতে হচ্ছে, যা অত্যন্ত ব্যয়বহুল। দ্বিতীয়ত, আন্তর্জাতিক জাদু বাণিজ্যে সাম্প্রতিক মন্দার প্রভাবে গ্যালনের চাহিদা ও সরবরাহের ভারসাম্য নষ্ট হয়েছে। এশিয়ার বিভিন্ন জাদু বাজারে গ্যালনের মজুদ কমে যাওয়ায় আন্তর্জাতিক বিনিময় হারে চাপ পড়েছে। তৃতীয়ত, গ্রিংগটস সম্প্রতি তাদের নতুন যাদু সুরক্ষা ব্যবস্থা চালু করেছে যা প্রতিটি লেনদেনে অতিরিক্ত খরচ যোগ করছে।' },
        { type: 'paragraph', text: 'জাদু অর্থনীতিবিদ প্রফেসর সিলভানা ক্রিকওয়েল হগওয়ার্টস থেকে বলেন, এই মূল্যবৃদ্ধির প্রভাব দীর্ঘমেয়াদী হতে পারে। তিনি ব্যাখ্যা করেন যে গত কয়েক বছর ধরে জাদুবিশ্বের অর্থনীতি মাগল অর্থনীতির সাথে আরও বেশি সম্পর্কিত হচ্ছে, ফলে মাগল মুদ্রার ওঠানামার প্রভাব সরাসরি গ্যালনের মূল্যে পড়ছে। প্রফেসর ক্রিকওয়েল আরও জানান যে ড্রাগন পাহারা ব্যবস্থার আধুনিকায়ন প্রয়োজন, অন্যথায় নিরাপত্তা খরচ আরও বাড়তে পারে এবং গ্রাহকদের উপর চাপ বাড়বে।' },
        { type: 'paragraph', text: 'ডায়াগন অ্যালির বিভিন্ন দোকানদাররা এই সিদ্ধান্তে উদ্বিগ্ন প্রতিক্রিয়া জানিয়েছেন। ফ্লোরিশ অ্যান্ড ব্লটসের মালিক জানান যে গ্যালনের মূল্যবৃদ্ধির ফলে তাদের পণ্যের দাম বাড়াতে হতে পারে। অন্যদিকে অলিভান্ডার্সের মালিক গ্যারিক অলিভান্ডার বলেন যে ওয়ান্ডের মতো অপরিহার্য পণ্যের দাম বাড়ানো কঠিন কারণ ক্রেতারা ইতিমধ্যে উচ্চ মূল্য দিচ্ছেন। তবে তিনি আশা প্রকাশ করেন যে বাজার শীঘ্রই স্থিতিশীল হবে।' },
        { type: 'paragraph', text: 'মন্ত্রমন্ত্রণালয়ের জাদু অর্থ বিভাগের উপমন্ত্রী ব্যারন নট জানিয়েছেন যে সরকার পরিস্থিতি পর্যবেক্ষণ করছে। তিনি বলেন, আমরা গ্রিংগটসের সিদ্ধান্তকে সম্মান করি এবং গ্রাহকদের স্বার্থ রক্ষায় প্রয়োজনীয় পদক্ষেপ নেব। উপমন্ত্রী আরও জানান যে মন্ত্রমন্ত্রণালয় গ্রিংগটসের সাথে যৌথ কমিটি গঠন করবে যা নিয়মিতভাবে মুদ্রার বিনিময় হার পর্যালোচনা করবে এবং প্রয়োজনে হস্তক্ষেপ করবে।' },
        { type: 'paragraph', text: 'গ্রিংগটসের মুখপাত্র এক বিবৃতিতে জানান, আমরা গ্রাহকদের আশ্বস্ত করছি যে তাদের সঞ্চয় সম্পূর্ণ নিরাপদ এবং সুরক্ষিত। নতুন নিরাপত্তা ব্যবস্থা গ্রাহকদের সম্পদের সর্বোচ্চ সুরক্ষা নিশ্চিত করবে। আমরা বুঝতে পারছি যে এই মূল্যবৃদ্ধি কিছু গ্রাহকের জন্য কষ্টকর হতে পারে, তবে এটি দীর্ঘমেয়াদে সবার স্বার্থে কাজ করবে। গ্রিংগটস বিগত কয়েক শতাব্দী ধরে জাদুকরদের সম্পদের নিরাপত্তা নিশ্চিত করে আসছে এবং ভবিষ্যতেও তা অব্যাহত থাকবে।' },
        { type: 'paragraph', text: 'সাধারণ জাদুকরদের মধ্যে মিশ্র প্রতিক্রিয়া দেখা যাচ্ছে। কেউ কেউ মূল্যবৃদ্ধিকে গ্রহণযোগ্য মনে করছেন যখন অনেকেই হতাশ হয়েছেন। হগসমিডের একজন নিয়মিত গ্রাহক বলেন, আমার মাসিক আয় বাড়েনি কিন্তু সবকিছুর দাম বাড়ছে। এভাবে চলতে থাকলে সাধারণ জাদুকরদের জীবন আরও কঠিন হবে। অন্যদিকে ডায়াগন অ্যালিতে একজন ব্যবসায়ী বলেন, গ্রিংগটসের সিদ্ধান্ত বুঝতে পারছি, নিরাপত্তার জন্য খরচ করতেই হবে। আগে যে ডাকাতি হয়েছিল তার পর থেকেই সবাই সচেতন হয়ে গেছে।' }
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