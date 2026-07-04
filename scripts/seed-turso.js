const { createClient } = require('@libsql/client');

// Turso connection
const url = process.env.DATABASE_URL || 'libsql://pyhood-masud-ahmad-1.aws-ap-south-1.turso.io';
const client = createClient({ url });

function cuid() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  // timestamp part
  const ts = Date.now().toString(36);
  id += ts;
  // random part
  for (let i = 0; i < 20 - ts.length; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

async function seed() {
  console.log('🌱 Turso ডাটাবেসে সিড ডেটা ঢোকানো হচ্ছে...');

  // Generate IDs
  const issueId = cuid();
  const articleIds = Array.from({ length: 10 }, () => cuid());
  const tickerIds = Array.from({ length: 6 }, () => cuid());
  const weatherIds = Array.from({ length: 3 }, () => cuid());
  const wantedId = cuid();
  const classifiedIds = Array.from({ length: 3 }, () => cuid());
  const decreeId = cuid();
  const letterId = cuid();
  const adId = cuid();

  const now = new Date().toISOString().replace('T', ' ').split('.')[0];

  try {
    // 1. Create Issue
    await client.execute({
      sql: `INSERT INTO Issue (id, issueNumber, title, publishDate, priceGalleons, isPublished, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [issueId, 32847, 'The Daily Pyhood', now, 5, 1, now, now],
    });
    console.log('✅ Issue তৈরি হয়েছে');

    // 2. Create Articles
    const articles = [
      {
        id: articleIds[0], issueId, slug: 'hogwarts-anomalies', section: 'headline',
        title: 'হগওয়ার্টস দুর্গে জাদুভিত্তিক অদ্ভুত ঘটনা শনাক্ত',
        subtitle: 'মন্ত্রণালয় গোপন তদন্ত শুরু করেছে; ডাম্বলডোর হগওয়ার্টস কর্মীদের স্বায়ত্তশাসন দাবি করেছেন',
        author: 'রিটা স্কিটার, বিশেষ প্রতিবেদক', category: 'প্রধান সংবাদ',
        snippet: 'হগওয়ার্টসের টাওয়ারগুলোর চারপাশে অব্যাখ্যাত বায়ুমণ্ডলীয় বিঘ্ন এবং প্রাচীন শক্তির স্পাইক রিপোর্ট করা হয়েছে।',
        content: JSON.stringify(['মন্ত্রণালয়ের করিডোরে উদ্বেগের ঢেউ পাঠিয়ে একটি আশ্চর্য ঘটনা ঘটেছে। হগওয়ার্টস স্কুল অফ উইচক্রাফ্ট অ্যান্ড উইজার্ড্রির টাওয়ারগুলোর চারপাশে অব্যাখ্যাত বায়ুমণ্ডলীয় বিঘ্ন এবং প্রাচীন শক্তির স্পাইক রিপোর্ট করা হয়েছে।', 'স্কুলের ভেতরের সূত্রগুলো জানিয়েছে যে ভাসমান ক্যান্ডেলাব্রাগুলো অদ্ভুত আচরণ করছে, ডানজনের তাপমাত্রা কয়েক সেকেন্ডের মধ্যে হিমাঙ্কে নেমে আসছে, এবং লাইব্রেরির বইগুলো নিজে থেকেই প্রাচীন রুনিক আকারে সাজানো হচ্ছে।', 'মন্ত্রী কর্নেলিয়াস ফাজ আজ সকালে একটি জরুরি সংবাদ সম্মেলনে বলেছেন: আমাদের কারণে বিশ্বাস করার যথেষ্ট ভিত্তি আছে যে নির্দিষ্ট কিছু স্থানীয় অদ্ভুত ঘটনা ঘটছে।', 'তবে প্রধানাচার্য আলবাস ডাম্বলডোর তাদের অবস্থানে দৃঢ় রয়েছেন: হগওয়ার্টস শতাব্দীর জাদুভিত্তিক বিবর্তন বেঁচে গেছে।', 'অভিভাবকদের পরামর্শ দেওয়া হচ্ছে তাদের পেঁচার চিঠিপত্রের উপর নজর রাখতে।']),
        imageUrl: '/assets/hogwarts_sketch.png', imageFilter: 'sepia-filter',
        imageCaption: 'হগওয়ার্টস স্কুল অফ উইচক্রাফ্ট অ্যান্ড উইজার্ড্রি।', isPublished: 1, sortOrder: 1,
      },
      {
        id: articleIds[1], issueId, slug: 'floo-rates', section: 'ministry',
        title: 'পিক্সি আক্রমণে ফ্লু নেটওয়ার্কের হার নিয়ন্ত্রণ করছে মন্ত্রণালয়',
        subtitle: 'যাত্রী ভাড়া বৃদ্ধিতে ক্ষুব্ধ যাত্রীরা',
        author: 'পার্সি উইজলি, মন্ত্রীর জুনিয়র সহকারী', category: 'মন্ত্রণালয়',
        snippet: 'মূল ফ্লু ফায়ারপ্লেস হাবে কর্নিশ পিক্সিদের হঠাৎ আক্রমণে ফ্লু নেটওয়ার্ক কানেকশন হাব সম্পূর্ণ বন্ধ হয়ে গেছে।',
        content: JSON.stringify(['আজ সকালে জাদুভিত্তিক যাত্রীরা বড় ধরনের বিলম্বের সম্মুখীন হয়েছে কারণ ফ্লু নেটওয়ার্ক কানেকশন হাব সম্পূর্ণ বন্ধ হয়ে গেছে।', 'মন্ত্রণালয়ের জাদুভিত্তিক পরিবহন বিভাগ একটি লেভেল-টু কন্টেইনমেন্ট সতর্কতা ঘোষণা করেছে।', 'পেস্ট কন্ট্রোল অফিসাররা আশা করছেন শুক্রবারের মধ্যে নেটওয়ার্ক সম্পূর্ণভাবে পরিষ্কার হবে।']),
        isPublished: 1, sortOrder: 2,
      },
      {
        id: articleIds[2], issueId, slug: 'lockhart-book', section: 'entertainment',
        title: 'গিল্ডেরয় লকহার্ট নতুন ফাঁকা আত্মজীবনী ঘোষণা করেছেন',
        subtitle: 'পাঁচবারের উইচ উইকলি সবচেয়ে আকর্ষণীয় হাসি বিজয়ী',
        author: 'বার্নাবি গাজিয়ন, সাহিত্য সমালোচক', category: 'বিনোদন',
        snippet: 'স্মৃতিভ্রমগ্রস্ত প্রাক্তন হগওয়ার্টস অধ্যাপক গিল্ডেরয় লকহার্ট তাদের নতুন বইয়ের জন্য প্রকাশনা চুক্তি স্বাক্ষর করেছেন।',
        content: JSON.stringify(['সাহিত্যিক মহলে খবরটি ছড়িয়ে পড়েছে যে প্রাক্তন হগওয়ার্টস ডিফেন্স এগেনস্ট দ্য ডার্ক আর্টস অধ্যাপক গিল্ডেরয় লকহার্ট একটি নতুন বই প্রকাশ করছেন।', 'বইটির শিরোনাম "আমি কে?", যা ৩০০ পৃষ্ঠার সম্পূর্ণ ফাঁকা পার্চমেন্ট।', 'ডায়াগন অ্যালিতে প্রি-অর্ডার ইতিমধ্যে রেকর্ড ভাঙছে।']),
        isPublished: 1, sortOrder: 3,
      },
      {
        id: articleIds[3], issueId, slug: 'london-thestral', section: 'local',
        title: 'পশ্চিম লন্ডনের মাগল রাস্তায় পলাতক থেস্ট্রালে আতঙ্ক',
        subtitle: 'মন্ত্রণালয়ের জাদুভিত্তিক প্রাণী নিয়ন্ত্রণ বিভাগ অবলিভিয়েটর পাঠিয়েছে',
        author: 'আর্থার উইজলি, মাগল আর্টিফ্যাক্ট মিসইউজ অফিস', category: 'স্থানীয়',
        snippet: 'একটি স্থানীয় গাড়ি কোম্পানি থেকে পলাতক থেস্ট্রাল মাগল লন্ডনে পালিয়ে গেছে।',
        content: JSON.stringify(['গতকাল বিকেলে মাগল পশ্চিম লন্ডনে একটি বন্য থেস্ট্রাল ট্রাফিক বিশৃঙ্খলা সৃষ্টি করেছে।', 'অ্যাক্সিডেন্টাল ম্যাজিক রিভার্সাল স্কোয়াড তাৎক্ষণিকভাবে পাঠানো হয়েছিল।', 'মন্ত্রণালয়ের মুখপাত্র আর্থার উইজলি জনসাধারণকে স্মরণ করিয়ে দিয়েছেন সমস্ত গৃহপালিত জাদুভিত্তিক প্রাণীকে সঠিক ডিসিলুশনমেন্ট মন্ত্র দিয়ে সুরক্ষিত রাখতে হবে।']),
        imageUrl: '/assets/wizard_portrait.png', imageFilter: 'grayscale-filter',
        isPublished: 1, sortOrder: 4,
      },
      {
        id: articleIds[4], issueId, slug: 'quidditch-tickets', section: 'sports',
        title: 'কুইডিচ বিশ্বকাপের টিকেট রেকর্ড তিন মিনিটে বিক্রি',
        subtitle: 'গবলিন স্ক্যাল্পারদের বিরুদ্ধে বাজার দখলের অভিযোগ',
        author: 'লুডো ব্যাগম্যান, ম্যাজিক্যাল গেমস অ্যান্ড স্পোর্টস প্রধান', category: 'খেলাধুলা',
        snippet: 'আসন্ন কুইডিচ বিশ্বকাপ ফাইনালের সমস্ত টিকেট প্রায় তাৎক্ষণিকভাবে বিক্রি হয়ে গেছে।',
        content: JSON.stringify(['কুইডিচ ভক্তদের মধ্যে ক্রোধ বিস্ফোরিত হয়েছে কারণ আসন্ন বিশ্বকাপ ফাইনালের সমস্ত টিকেট বুকিং পেঁচা ছাড়ার তিন মিনিটের মধ্যে বিক্রি হয়ে গেছে।', 'গুজমে বলা হচ্ছে গবলিন কার্টেল স্পিড-চার্ম ব্যবহার করেছে।', 'গ্রিংগটস ব্যাংক তাদের কর্মচারীদের জড়িত থাকার বিষয়টি তীব্রভাবে অস্বীকার করেছে।']),
        isPublished: 1, sortOrder: 5,
      },
      {
        id: articleIds[5], issueId, slug: 'dragon-flight', section: 'world',
        title: 'মাগল নিরাপত্তার জন্য স্নোডোনিয়ায় ড্রাগন উড়ানের পথ পরিবর্তন',
        subtitle: 'হাইকারদের সাথে সম্মুখীন হওয়ার পর ওয়েলশ গ্রিন ড্রাগনদের সরানো হয়েছে',
        author: 'চার্লি উইজলি, ড্রাগন স্যাংচুয়ারি ওয়ার্ডেন', category: 'বিশ্ব',
        snippet: 'স্নোডোনিয়া, ওয়েলসে ড্রাগন উড়ান করিডোরের সীমানা পুনরায় আঁকা হয়েছে।',
        content: JSON.stringify(['মন্ত্রণালয় স্নোডোনিয়ায় ড্রাগন উড়ান করিডোরের সীমানা পুনরায় আঁকেছে।', 'রোমানিয়ান স্যাংচুয়ারি থেকে ড্রাগন ওয়ার্ডেনদের ডাকা হয়েছিল।', 'চার্লি উইজলি বলেছেন: ওয়েলশ গ্রিন সাধারণত শান্ত, কিন্তু তারা উঁচু রিজগুলোতে সূর্য স্নান করতে পছন্দ করে।']),
        isPublished: 1, sortOrder: 6,
      },
      {
        id: articleIds[6], issueId, slug: 'black-forest-aurors', section: 'security',
        title: 'ব্ল্যাক ফরেস্টে রহস্যময় অন্ধকার সমাবেশ; অরোর পাঠানো হয়েছে',
        subtitle: 'স্থানীয় সেন্টররা মধ্যরাতে ছায়াময় চিত্র দেখে সতর্ক করেছে',
        author: 'কিংসলি শ্যাকলবোল্ট, সিনিয়র অরোর', category: 'নিরাপত্তা',
        snippet: 'জার্মানির ব্ল্যাক ফরেস্টের গভীরে একটি গোপন স্কাউটিং মিশন অনুমোদন করা হয়েছে।',
        content: JSON.stringify(['জার্মান মন্ত্রণালয়ের সাথে সমন্বয়ে ব্ল্যাক ফরেস্টের গভীরে একটি গোপন স্কাউটিং মিশন অনুমোদন করা হয়েছে।', 'বনের সেন্টর উপজাতিরা হুডেড উইজার্ডদের দল দেখেছে বলে জানিয়েছে।', 'সিনিয়র অরোর কিংসলি শ্যাকলবোল্ট সতর্কতা অবলম্বন করার আহ্বান জানিয়েছেন।']),
        isPublished: 1, sortOrder: 7,
      },
      {
        id: articleIds[7], issueId, slug: 'sleekeazy-shortage', section: 'economy',
        title: 'স্লিকইজির হেয়ার পোশনের বিক্রি আকাশছোঁয়া; সারাদেশে ঘাটতি',
        subtitle: 'বার্ষিক হগওয়ার্টস ইউল বলের আগে ডায়াগন অ্যালির দোকানগুলো ক্রয় সীমিত করেছে',
        author: 'সেলেস্টিনা ওয়ারবেক, সোসাইটি কলামিস্ট', category: 'অর্থনীতি',
        snippet: 'স্লিকইজির হেয়ার পোশনের বিশাল ঘাটতি দোকানগুলোতে আঘাত হেনেছে।',
        content: JSON.stringify(['দেশব্যাপী ফ্যাশন-সচেতন ডাইনি এবং উইজার্ডদের জন্য বিপর্যয় নেমে এসেছে।', 'ঘাটতির জন্য আসন্ন হগওয়ার্টস বলের আগে হঠাৎ কেনার ঝাঁক দায়ী করা হয়েছে।', 'অ্যাপোথেকারি মালিক মালপেপার বলেছেন: প্রতি গ্রাহকে একটি বোতল বিক্রি সীমিত করতে হয়েছে।']),
        imageUrl: '/assets/potion_sketch.png', imageFilter: 'potion-photo',
        isPublished: 1, sortOrder: 8,
      },
      {
        id: articleIds[8], issueId, slug: 'niffler-gringotts', section: 'gossip',
        title: 'গ্রিংগটস ব্যাংকের নিচের ভল্টে পলাতক নিফলারের খবর',
        subtitle: 'গবলিন গার্ডরা ভল্ট নিরাপত্তা অভেদ্য রয়েছে বলে জোর দিচ্ছে',
        author: 'গ্রিপহুক, গ্রিংগটস জনসংযোগ', category: 'গুজব',
        snippet: 'ডায়াগন অ্যালির কোবলস্টোন করিডোর থেকে ফিসফিস ছড়িয়ে পড়ছে যে গ্রিংগটসের নিচের ভল্টে একটি পশমি সমস্যা রয়েছে।',
        content: JSON.stringify(['ডায়াগন অ্যালির কোবলস্টোন করিডোর থেকে ফিসফিস ছড়িয়ে পড়ছে গ্রিংগটস ব্যাংকের নিচের ভল্টে একটি পশমি সমস্যা রয়েছে।', 'নাম প্রকাশে অনিচ্ছুক সূত্র অনুযায়ী, এক জোড়া নিফলার একটি ভ্রমণকারী জাদুভিত্তিক পশু ব্যবসায়ী থেকে পালিয়ে উচ্চ-নিরাপত্তা ভল্টে বুরো করে ঢুকেছে।', 'গ্রিপহুক বলেছেন: গ্রিংগটস ভল্ট প্রাচীন মন্ত্র দ্বারা সুরক্ষিত। একটি নিফলার আমাদের নিরাপত্তা বাইপাস করতে পারে না।']),
        isPublished: 1, sortOrder: 9,
      },
      {
        id: articleIds[9], issueId, slug: 'egyptian-orb', section: 'mystery',
        title: 'রহস্যময় বিভাগ জ্বলজ্বলে মিশরীয় অর্ব অধিগ্রহণ করেছে',
        subtitle: 'আনস্পিকেবলরা প্রাচীন আর্টিফ্যাক্টের উদ্দেশ্য প্রকাশ করতে অস্বীকার করেছেন',
        author: 'ব্রোডেরিক বোড, আনস্পিকেবল', category: 'রহস্য',
        snippet: 'মিশরের গিজায় একটি সমাধি খননের সময় আবিষ্কৃত একটি প্রাচীন জ্বলজ্বলে পাথরের অর্ব গত রাতে ভারী পাহারায় মন্ত্রণালয়ে পৌঁছেছে।',
        content: JSON.stringify(['গত রাতে ভারী পাহারায় মন্ত্রণালয়ে একটি অত্যন্ত গোপনীয় কন্টেইনমেন্ট ক্রেট পৌঁছেছে।', 'ফিসফিস অনুযায়ী অর্বটি উষ্ণ নীল আলোয় পালস করে।', 'মন্ত্রণালয়ের প্রতিনিধিরা বলেছেন: আর্টিফ্যাক্টটি নিয়মিত অধ্যয়নের অধীনে।']),
        isPublished: 1, sortOrder: 10,
      },
    ];

    for (const a of articles) {
      await client.execute({
        sql: `INSERT INTO Article (id, slug, issueId, section, title, subtitle, author, category, snippet, content, imageUrl, imageFilter, imageCaption, isPublished, sortOrder, viewCount, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
        args: [a.id, a.slug, a.issueId, a.section, a.title, a.subtitle || null, a.author, a.category, a.snippet || null, a.content, a.imageUrl || null, a.imageFilter || null, a.imageCaption || null, a.isPublished, a.sortOrder, now, now],
      });
    }
    console.log(`✅ ${articles.length}টি আর্টিকেল তৈরি হয়েছে`);

    // 3. Tickers
    const tickers = [
      { id: tickerIds[0], issueId, message: 'মন্ত্রণালয় জরুরি অবস্থা ঘোষণা করেছে', sortOrder: 0 },
      { id: tickerIds[1], issueId, message: 'ডাম্বলডোর হগওয়ার্টসে অদ্ভুত ঘটনায় শান্তির আহ্বান জানিয়েছেন', sortOrder: 1 },
      { id: tickerIds[2], issueId, message: 'ফ্লু নেটওয়ার্কে পিক্সি আক্রমণে গতি ১২% কমেছে', sortOrder: 2 },
      { id: tickerIds[3], issueId, message: 'স্লিকইজির হেয়ার পোশনের বিক্রি ডায়াগন অ্যালিতে আকাশছোঁয়া', sortOrder: 3 },
      { id: tickerIds[4], issueId, message: 'ব্ল্যাক ফরেস্টে গ্রিন্ডেলওয়াল্ড সমর্থকদের দেখা গেছে', sortOrder: 4 },
      { id: tickerIds[5], issueId, message: 'পশ্চিম লন্ডনে পলাতক থেস্ট্রাল দেখা গেছে', sortOrder: 5 },
    ];
    for (const t of tickers) {
      await client.execute({
        sql: 'INSERT INTO Ticker (id, issueId, message, sortOrder) VALUES (?, ?, ?, ?)',
        args: [t.id, t.issueId, t.message, t.sortOrder],
      });
    }
    console.log(`✅ ${tickers.length}টি টিকার তৈরি হয়েছে`);

    // 4. Weathers
    const weathers = [
      { id: weatherIds[0], issueId, location: 'হগসমিড', emoji: '☁️💧', forecast: 'পিক্সি বৃষ্টি', sortOrder: 0 },
      { id: weatherIds[1], issueId, location: 'ডায়াগন অ্যালি', emoji: '☀️✨', forecast: 'গরম/পরিষ্কার', sortOrder: 1 },
      { id: weatherIds[2], issueId, location: 'ফরবিডেন ফরেস্ট', emoji: '⛈️🕷️', forecast: 'বিপদ/কুয়াশা', sortOrder: 2 },
    ];
    for (const w of weathers) {
      await client.execute({
        sql: 'INSERT INTO Weather (id, issueId, location, emoji, forecast, sortOrder) VALUES (?, ?, ?, ?, ?, ?)',
        args: [w.id, w.issueId, w.location, w.emoji, w.forecast, w.sortOrder],
      });
    }
    console.log(`✅ ${weathers.length}টি আবহাওয়া তৈরি হয়েছে`);

    // 5. Wanted Poster
    await client.execute({
      sql: 'INSERT INTO WantedPoster (id, issueId, name, description, reward, imageUrl, isPublished) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: [wantedId, issueId, 'সিরিয়াস ব্ল্যাক', 'চরম সতর্কতার সাথে পরিচিত হোন! এই ব্যক্তির বিরুদ্ধে জাদু ব্যবহার করবেন না।', '১০,০০০ গ্যালিয়ন', '/assets/wizard_portrait.png', 1],
    });
    console.log('✅ ওয়ান্টেড পোস্টার তৈরি হয়েছে');

    // 6. Classifieds
    const classifieds = [
      { id: classifiedIds[0], issueId, heading: 'হারানো: পোষা ব্যাং', body: '"ট্রেভর" নামে সাড়া দেয়। গ্রিফিন্ডর কমন রুমের কাছে হারিয়েছে। পুরস্কার: ২ সিকল।', sortOrder: 0 },
      { id: classifiedIds[1], issueId, heading: 'সাহায্য চাই: লিকি কড্রন', body: 'কড়িয়া পরিষ্কার করার সহকারী দরকার। ড্রাগন পক্সে রোগী হওয়া বাধ্যতামূলক।', sortOrder: 1 },
      { id: classifiedIds[2], issueId, heading: 'বিক্রয়: ব্যবহৃত নিম্বাস ২০০০', body: 'চমৎকার অবস্থা, লেজের গোড়ায় সামান্য ক্ষতি। ৩৫ গ্যালিয়ন বা প্রস্তাবিত মূল্য।', sortOrder: 2 },
    ];
    for (const c of classifieds) {
      await client.execute({
        sql: 'INSERT INTO Classified (id, issueId, heading, body, sortOrder) VALUES (?, ?, ?, ?, ?)',
        args: [c.id, c.issueId, c.heading, c.body, c.sortOrder],
      });
    }
    console.log(`✅ ${classifieds.length}টি ক্লাসিফাইড তৈরি হয়েছে`);

    // 7. Decree
    await client.execute({
      sql: 'INSERT INTO Decree (id, issueId, title, decreeNumber, body, signedBy, sortOrder) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: [decreeId, issueId, 'মন্ত্রণালয় ডিক্রি', 'শিক্ষা ডিক্রি নং ৮২', 'যেকোনো শিক্ষার্থী যদি নিজের হাউসের প্রধানের লিখিত অনুমতি ছাড়া স্লিকইজির হেয়ার পোশন রাখে, তাহলে সে ডিটেনশন এবং পদার্থের তাৎক্ষণিক বাজেয়াপ্তির সম্মুখীন হবে।', 'কর্নেলিয়াস ফাজ, মন্ত্রী', 0],
    });
    console.log('✅ ডিক্রি তৈরি হয়েছে');

    // 8. Letter
    await client.execute({
      sql: 'INSERT INTO Letter (id, issueId, author, body, sortOrder) VALUES (?, ?, ?, ?, ?)',
      args: [letterId, issueId, 'কেন্টের অসন্তুষ্ট ডাইনি', '"আমার স্বামীর ঝাড়ুটি রাতের বিভিন্ন সময়ে হগওয়ার্টসের স্কুল গান গুনগুন করছে। এটা কি মন্ত্রণালয়ের কাজ?"', 0],
    });
    console.log('✅ চিঠি তৈরি হয়েছে');

    // 9. Ad
    await client.execute({
      sql: 'INSERT INTO Ad (id, issueId, title, subtitle, description, imageUrl, price, articleSlug, sortOrder) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      args: [adId, issueId, 'স্লিকইজির', 'হেয়ার পোশন ও স্ক্যাল্প ক্লিনজার', '"এমনকী সবচেয়ে বিদ্রোহী চুলও শান্ত করে! মাত্র দুটি ফোঁটা!"', '/assets/potion_sketch.png', 'মাত্র ৩ সিকল!', 'sleekeazy-shortage', 0],
    });
    console.log('✅ বিজ্ঞাপন তৈরি হয়েছে');

    // Verify
    const result = await client.execute('SELECT COUNT(*) as cnt FROM Article');
    console.log(`\n📊 মোট আর্টিকেল: ${result.rows[0].cnt}`);

    const issueResult = await client.execute('SELECT id, issueNumber, isPublished FROM Issue');
    console.log(`📊 ইস্যু: #${issueResult.rows[0].issueNumber}, প্রকাশিত: ${issueResult.rows[0].isPublished === 1 ? 'হ্যাঁ' : 'না'}`);

    console.log('\n📰 The Daily Pyhood - সিড সম্পূর্ণ! 🎉');
  } catch (error) {
    console.error('❌ সিড ত্রুটি:', error);
    process.exit(1);
  }
}

seed();