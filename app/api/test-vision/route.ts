import { NextResponse } from 'next/server'

export async function GET() {
  // Test with a known safe public image
  const testImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png'

  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{
          image: { source: { imageUri: testImageUrl } },
          features: [{ type: 'SAFE_SEARCH_DETECTION' }]
        }]
      })
    }
  )

  const data = await response.json()
  return NextResponse.json(data)
}