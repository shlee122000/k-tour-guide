import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text");
  const from = searchParams.get("from") || "ko";
  const to = searchParams.get("to") || "en";

  if (!text) {
    return NextResponse.json({ error: "Missing text parameter" }, { status: 400 });
  }

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.responseStatus === 200) {
      return NextResponse.json({
        translatedText: data.responseData.translatedText,
        from,
        to,
      });
    } else {
      return NextResponse.json(
        { error: data.responseDetails || "Translation failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json({ error: "Failed to translate" }, { status: 500 });
  }
}
