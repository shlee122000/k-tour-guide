import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_TTS_API_KEY || "";

// 언어별 최적 음성 매핑
const voiceMap: Record<string, { name: string; languageCode: string }> = {
  ko: { name: "ko-KR-Wavenet-A", languageCode: "ko-KR" },
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

export async function POST(request: NextRequest) {
  try {
    const { text, lang } = await request.json();

    if (!text || !lang) {
      return NextResponse.json({ error: "Missing text or lang" }, { status: 400 });
    }

    if (!API_KEY) {
      return NextResponse.json({ error: "TTS API key not configured" }, { status: 500 });
    }

    const voice = voiceMap[lang] || voiceMap["en"];

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { text: text.substring(0, 500) },
          voice: {
            languageCode: voice.languageCode,
            name: voice.name,
          },
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate: 0.9,
            pitch: 0,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Google TTS error:", error);
      return NextResponse.json({ error: "TTS failed" }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ audioContent: data.audioContent });
  } catch (error) {
    console.error("TTS API error:", error);
    return NextResponse.json({ error: "TTS failed" }, { status: 500 });
  }
}
