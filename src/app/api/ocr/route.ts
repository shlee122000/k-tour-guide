import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { imageBase64 } = await request.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "Missing image" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const visionResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [
            {
              image: { content: imageBase64 },
              features: [{ type: "TEXT_DETECTION" }],
            },
          ],
        }),
      }
    );

    const data = await visionResponse.json();

    const detectedText =
      data.responses?.[0]?.fullTextAnnotation?.text ||
      data.responses?.[0]?.textAnnotations?.[0]?.description ||
      "";

    return NextResponse.json({ text: detectedText.trim() });
  } catch (error) {
    console.error("Vision API error:", error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}