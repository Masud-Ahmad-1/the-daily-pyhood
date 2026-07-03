const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const { createClient } = require('@libsql/client');

const TURSO_URL = 'libsql://pyhood-masud-ahmad-1.aws-ap-south-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODMxMDIzOTcsImlkIjoiMDE5ZjI5MmUtOTkwMS03ODNjLThjMzAtMTYzNGFkNmM3YzdiIiwia2lkIjoiRDRyelJzMGxrVGJnTElpQ2p3VTJ0aVZHREJnWGZjNERId3prcTBxZmcxUSIsInJpZCI6IjE5NTNhNTNmLTljODQtNDM0My05NmU0LTdmNTUzMzIyNzMyYyJ9.9R08sRnJLPtFRswtEBthUQ83qGucznECpFkNo0dZDvxvhxqyEeuvQ1WY66pcj23CLKcmoFU242UuxAhrfuNZDw';

async function seed() {
  console.log('Seeding Turso database...');

  const libsql = createClient({ url: TURSO_URL });
  const adapter = new PrismaLibSql(libsql);
  
  // Dummy file URL for schema validation; adapter handles real connection
  process.env.DATABASE_URL = 'file:./dev.db';
  const db = new PrismaClient({ adapter });

  const issue = await db.issue.create({
    data: {
      issueNumber: 32847,
      title: 'The Daily Pyhood',
      isPublished: true,
      tickers: {
        create: [
          { message: 'মন্ত্রণালয় জরুরি অবস্থা ঘোষণা করেছে', sortOrder: 0 },
          { message: 'ডাম্বলডোর হগওয়ার্টসে অদ্ভুত ঘটনায় শান্তির আহ্বান', sortOrder: 1 },
          { message: 'ফ্লু নেটওয়ার্কে পিক্সি আক্রমণে গতি ১২% কমেছে', sortOrder: 2 },
          { message: 'স্লিকইজির হেয়ার পোশনের বিক্রি আকাশছোঁয়া', sortOrder: 3 },
          { message: 'ব্ল্যাক ফরেস্টে গ্রিন্ডেলওয়াল্ড সমর্থকদের দেখা গেছে', sortOrder: 4 },
          { message: 'পশ্চিম লন্ডনে পলাতক থেস্ট্রাল দেখা গেছে', sortOrder: 5 },
        ],
      },
      weathers: {
        create: [
          { location: 'হগসমিড', emoji: '☁️💧', forecast: 'পিক্সি বৃষ্টি', sortOrder: 0 },
          { location: 'ডায়াগন অ্যালি', emoji: '☀️✨', forecast: 'গরম/পরিষ্কার', sortOrder: 1 },
          { location: 'ফরবিডেন ফরেস্ট', emoji: '⛈️🕷️', forecast: 'বিপদ/কুয়াশা', sortOrder: 2 },
        ],
      },
      wantedPosters: {
        create: { name: 'সিরিয়াস ব্ল্যাক', description: 'চরম সতর্কতার সাথে পরিচিত হোন!', reward: '১০,০০০ গ্যালিয়ন', imageUrl: '/assets/wizard_portrait.png' },
      },
      classifieds: {
        create: [
          { heading: 'হারানো: পোষা ব্যাঙ', body: '"ট্রেভর" নামে সাড়া দেয়। গ্রিফিন্ডর কমন রুমের কাছে হারিয়েছে।', sortOrder: 0 },
          { heading: 'সাহায্য চাই: লিকি কড্রন', body: 'কড়িয়া পরিষ্কার করার সহকারী দরকার।', sortOrder: 1 },
        ],
      },
      decrees: {
        create: { title: 'মন্ত্রণালয় ডিক্রি', decreeNumber: 'শিক্ষা ডিক্রি নং ৮২', body: 'নিজের হাউসের প্রধানের লিখিত অনুমতি ছাড়া স্লিকইজির হেয়ার পোশন রাখলে ডিটেনশন হবে।', signedBy: 'কর্নেলিয়াস ফাজ' },
      },
      letters: {
        create: { author: 'কেন্টের অসন্তুষ্ট ডাইনি', body: '"আমার স্বামীর ঝাড়ুটি রাতে হগওয়ার্টসের স্কুল গান গুনগুন করছে।"' },
      },
      ads: {
        create: { title: 'স্লিকইজির', subtitle: 'হেয়ার পোশন ও স্ক্যাল্প ক্লিনজার', description: 'সবচেয়ে বিদ্রোহী চুলও শান্ত করে!', price: 'মাত্র ৩ সিকল!' },
      },
      articles: {
        create: [
          { slug: 'hogwarts-anomalies', section: 'headline', title: 'হগওয়ার্টস দুর্গে জাদুভিত্তিক অদ্ভুত ঘটনা শনাক্ত', subtitle: 'মন্ত্রণালয় গোপন তদন্ত শুরু করেছে', author: 'রিটা স্কিটার', category: 'প্রধান সংবাদ', snippet: 'হগওয়ার্টসের টাওয়ারগুলোর চারপাশে অব্যাখ্যাত বায়ুমণ্ডলীয় বিঘ্ন রিপোর্ট করা হয়েছে।', content: JSON.stringify(['মন্ত্রণালয়ের করিডোরে উদ্বেগের ঢেউ পাঠিয়ে একটি আশ্চর্য ঘটনা ঘটেছে। হগওয়ার্টস স্কুল অফ উইচক্রাফ্ট অ্যান্ড উইজার্ড্রির টাওয়ারগুলোর চারপাশে অব্যাখ্যাত বায়ুমণ্ডলীয় বিঘ্ন এবং প্রাচীন শক্তির স্পাইক রিপোর্ট করা হয়েছে।', 'প্রধানাচার্য আলবাস ডাম্বলডোর দৃঢ় রয়েছেন।']), isPublished: true, sortOrder: 1 },
          { slug: 'floo-rates', section: 'ministry', title: 'পিক্সি আক্রমণে ফ্লু নেটওয়ার্ক বন্ধ', subtitle: 'যাত্রী ভাড়া বৃদ্ধিতে ক্ষুব্ধ যাত্রীরা', author: 'পার্সি উইজলি', category: 'মন্ত্রণালয়', snippet: 'ফ্লু নেটওয়ার্ক কানেকশন হাব সম্পূর্ণ বন্ধ হয়ে গেছে।', content: JSON.stringify(['আজ সকালে জাদুভিত্তিক যাত্রীরা বড় ধরনের বিলম্বের সম্মুখীন হয়েছে।', 'পেস্ট কন্ট্রোল অফিসাররা আশা করছেন শুক্রবারের মধ্যে নেটওয়ার্ক পরিষ্কার হবে।']), isPublished: true, sortOrder: 2 },
          { slug: 'lockhart-book', section: 'entertainment', title: 'গিল্ডেরয় লকহার্ট নতুন আত্মজীবনী ঘোষণা করেছেন', subtitle: 'পাঁচবারের উইচ উইকলি বিজয়ী', author: 'বার্নাবি গাজিয়ন', category: 'বিনোদন', snippet: 'প্রাক্তন অধ্যাপক লকহার্ট একটি নতুন বই প্রকাশ করছেন।', content: JSON.stringify(['বইটির শিরোনাম "আমি কে?", যা ৩০০ পৃষ্ঠার সম্পূর্ণ ফাঁকা পার্চমেন্ট।', 'ডায়াগন অ্যালিতে প্রি-অর্ডার রেকর্ড ভাঙছে।']), isPublished: true, sortOrder: 3 },
          { slug: 'quidditch-tickets', section: 'sports', title: 'কুইডিচ বিশ্বকাপের টিকেট তিন মিনিটে বিক্রি', subtitle: 'গবলিন স্ক্যাল্পারদের বিরুদ্ধে অভিযোগ', author: 'লুডো ব্যাগম্যান', category: 'খেলাধুলা', snippet: 'বিশ্বকাপ ফাইনালের সমস্ত টিকেট তাৎক্ষণিকভাবে বিক্রি হয়ে গেছে।', content: JSON.stringify(['কুইডিচ ভক্তদের মধ্যে ক্রোধ বিস্ফোরিত হয়েছে।', 'গবলিনদের একটি কার্টেল স্পিড-চার্ম ব্যবহার করে মানক কিউ বাইপাস করেছে।']), isPublished: true, sortOrder: 5 },
        ],
      },
    },
    include: { articles: true },
  });

  console.log(`Done! Issue #${issue.issueNumber} with ${issue.articles.length} articles`);
  await db.$disconnect();
}

seed().catch(e => { console.error('Seed error:', e); process.exit(1); });