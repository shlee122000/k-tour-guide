import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

let tableReady = false;
async function ensureTable() {
  if (tableReady) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS place_translations (
      id SERIAL PRIMARY KEY,
      content_id VARCHAR(50) NOT NULL,
      locale VARCHAR(10) NOT NULL,
      overview TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(content_id, locale)
    );
  `);
  tableReady = true;
}

export async function POST(req: NextRequest) {
  try {
    const { contentId, locale, text } = await req.json();

    if (!contentId || !locale || !text) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    // 한국어면 번역 불필요
    if (locale === "ko") {
      return NextResponse.json({ translated: text, cached: false });
    }

    await ensureTable();

    // 1. 캐시 확인
    const cached = await pool.query(
      "SELECT overview FROM place_translations WHERE content_id = $1 AND locale = $2",
      [contentId, locale]
    );

    if (cached.rows.length > 0) {
      return NextResponse.json({ translated: cached.rows[0].overview, cached: true });
    }

    // 2. Google Translate API 호출
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Translation API not configured" }, { status: 500 });
    }

    const langMap: Record<string, string> = {
      en: "en", ja: "ja", zh: "zh-CN", es: "es", fr: "fr",
      de: "de", th: "th", vi: "vi", id: "id",
    };
    const targetLang = langMap[locale] || locale;

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          source: "ko",
          target: targetLang,
          format: "text",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Translate API error:", data);
      return NextResponse.json({ error: "Translation failed" }, { status: 500 });
    }

    const translated = data.data.translations[0].translatedText;

    // 3. 캐시 저장
    await pool.query(
      `INSERT INTO place_translations (content_id, locale, overview) 
       VALUES ($1, $2, $3)
       ON CONFLICT (content_id, locale) DO UPDATE SET overview = $3`,
      [contentId, locale, translated]
    );

    return NextResponse.json({ translated, cached: false });
  } catch (error) {
    console.error("Translation route error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
