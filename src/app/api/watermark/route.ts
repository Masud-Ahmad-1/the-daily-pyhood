import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageUrl, text } = body as { imageUrl: string; text?: string }

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'imageUrl প্রদান করুন' },
        { status: 400 }
      )
    }

    const watermarkText = text || '© পাইপত্র'

    // ইমেজ ফেচ করুন
    let imageBuffer: Buffer
    try {
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error(`ইমেজ লোড করতে ব্যর্থ: ${response.status}`)
      }
      const arrayBuffer = await response.arrayBuffer()
      imageBuffer = Buffer.from(arrayBuffer)
    } catch {
      return NextResponse.json(
        { error: 'ইমেজ লোড করতে ব্যর্থ। URL সঠিক কিনা যাচাই করুন।' },
        { status: 400 }
      )
    }

    // ইমেজ মেটাডেটা পান
    let image: sharp.Sharp
    try {
      image = sharp(imageBuffer)
    } catch {
      return NextResponse.json(
        { error: 'ইমেজ প্রসেস করতে ব্যর্থ। সমর্থিত ফরম্যাট ব্যবহার করুন।' },
        { status: 400 }
      )
    }

    const metadata = await image.metadata()
    const width = metadata.width || 800
    const height = metadata.height || 600

    // ওয়াটারমার্কের ফন্ট সাইজ ইমেজের আকার অনুযায়ী
    const fontSize = Math.max(14, Math.min(Math.floor(width / 18), 40))

    // SVG ওয়াটারমার্ক তৈরি
    const svgText = `
      <svg width="${width}" height="${height}">
        <defs>
          <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="1" dy="1" stdDeviation="2" flood-color="rgba(0,0,0,0.8)" flood-opacity="1"/>
          </filter>
        </defs>
        <text
          x="${width - 16}"
          y="${height - 16}"
          font-family="Arial, sans-serif"
          font-size="${fontSize}"
          fill="rgba(255,255,255,0.7)"
          text-anchor="end"
          filter="url(#shadow)"
        >${watermarkText}</text>
      </svg>
    `

    const svgBuffer = Buffer.from(svgText)

    // ওয়াটারমার্ক কম্পোজিট করুন
    const outputBuffer = await image
      .composite([
        {
          input: svgBuffer,
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toBuffer()

    const base64 = outputBuffer.toString('base64')
    const dataUrl = `data:image/png;base64,${base64}`

    return NextResponse.json({ watermarkedImage: dataUrl })
  } catch (error) {
    console.error('ওয়াটারমার্ক তৈরি ত্রুটি:', error)
    return NextResponse.json(
      { error: 'ওয়াটারমার্ক তৈরি করতে সমস্যা হয়েছে।' },
      { status: 500 }
    )
  }
}