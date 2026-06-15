import { NextRequest, NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_TTS_API_KEY || "";
const TYPECAST_API_KEY = process.env.TYPECAST_API_KEY || "";
const TYPECAST_VOICE_ID = "tc_68f9c6a72f0f04a417bb136f";

const voiceMap: Record<string, { name: string; languageCode: string }> = {
  en: { name: "en-US-Wavenet-F", languageCode: "en-US" },
  ja: { name: "ja-JP-Wavenet-B", languageCode: "ja-JP" },
  "zh-CN": { name: "cmn-CN-Wavenet-A", languageCode: "cmn-CN" },
  es: { name: "es-ES-Wavenet-C", languageCode: "es-ES" },
  fr: { name: "fr-FR-Wavenet-C", languageCode: "fr-FR" },
  th: { name: "th-TH-Standard-A", languageCode: "th-TH" },
  vi: { name: "vi-VN-Wavenet-A", languageCode: "vi-VN" },
  id: { name: "id-ID-Wavenet-A", languageCode: "id-ID" },
  de: { name: "de-DE-Wavenet-C", languageCode: "de-DE" },
};

// Typecast TTS (한국어 전용)
async function typecastTTS(text: string): Promise<string | null> {
  try {
    const res = await fetch("https://api.typecast.ai/v1/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": TYPECAST_API_KEY,
      },
      body: JSON.stringify({
        text: text.substring(0, 500),
        voice_id: TYPECAST_VOICE_ID,
        model: "ssfm-v30",
      }),
    });

    console.log("Typecast status:", res.status);
    if (!res.ok) {
      const errText = await res.text();
      console.log("Typecast error:", errText);
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return base64;
  } catch (e) {
    console.log("Typecast exception:", e);
    return null;
  }
}

// Google Cloud TTS
async function googleTTS(text: string, lang: string): Promise<string | null> {
  try {
    const voice = voiceMap[lang] || voiceMap["en"];
    const res = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { text: text.substring(0, 500) },
          voice: { languageCode: voice.languageCode, name: voice.name },
          audioConfig: { audioEncoding: "MP3", speakingRate: 0.9, pitch: 0 },
        }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.audioContent || null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, lang } = await request.json();
    if (!text || !lang) {
      return NextResponse.json({ error: "Missing text or lang" }, { status: 400 });
    }

    let audioContent: string | null = null;

    // 한국어는 Typecast 사용
    console.log("lang:", lang, "TYPECAST_API_KEY exists:", !!TYPECAST_API_KEY);
    if (lang === "ko" && TYPECAST_API_KEY) {
      audioContent = await typecastTTS(text);
    }

    // 다른 언어 또는 Typecast 실패 시 Google TTS
    if (!audioContent && GOOGLE_API_KEY) {
      audioContent = await googleTTS(text, lang);
    }

    if (!audioContent) {
      return NextResponse.json({ error: "TTS failed" }, { status: 500 });
    }

    return NextResponse.json({ audioContent });
  } catch (error) {
    console.error("TTS API error:", error);
    return NextResponse.json({ error: "TTS failed" }, { status: 500 });
  }
}