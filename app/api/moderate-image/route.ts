import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { imageUrl } = await req.json()

  if (!imageUrl) {
    return NextResponse.json({ safe: false, error: 'No image URL provided' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            image: { source: { imageUri: imageUrl } },
            features: [{ type: 'SAFE_SEARCH_DETECTION' }]
          }]
        })
      }
    )

    const data = await response.json()
    const safe = data.responses?.[0]?.safeSearchAnnotation

    if (!safe) return NextResponse.json({ safe: true }) // if Vision fails, don't block

    // Flag if likely or very likely adult or violent content
    const unsafe = ['LIKELY', 'VERY_LIKELY']
    const isSafe = !unsafe.includes(safe.adult) && !unsafe.includes(safe.violence)

    return NextResponse.json({ 
      safe: isSafe,
      reason: !isSafe ? 'Image contains inappropriate content.' : null
    })

  } catch (err) {
    // If Vision API errors, don't block the listing — log and continue
    console.error('Vision API error:', err)
    return NextResponse.json({ safe: true })
  }
}