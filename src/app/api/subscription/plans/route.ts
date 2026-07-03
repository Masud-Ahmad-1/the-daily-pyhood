import { NextResponse } from 'next/server'

const plans = [
  {
    id: 'owl',
    name: 'আউল প্ল্যান',
    priceGalleons: 5,
    priceSickles: 0,
    features: ['সম্পূর্ণ সংবাদ পড়ুন', 'মোবাইল অ্যাক্সেস'],
    icon: '🦉',
  },
  {
    id: 'phoenix',
    name: 'ফিনিক্স প্ল্যান',
    priceGalleons: 15,
    priceSickles: 0,
    features: ['আউল এর সব', 'সকল আর্কাইভ অ্যাক্সেস', 'বিজ্ঞাপনমুক্ত অভিজ্ঞতা'],
    icon: '🔥',
  },
  {
    id: 'dragon',
    name: 'ড্রাগন প্ল্যান',
    priceGalleons: 50,
    priceSickles: 0,
    features: ['ফিনিক্স এর সব', 'এক্সক্লুসিভ সংবাদ', 'প্রিমিয়াম ফিচার', 'প্রাথমিক সহায়তা'],
    icon: '🐉',
  },
]

export async function GET() {
  return NextResponse.json({ plans })
}