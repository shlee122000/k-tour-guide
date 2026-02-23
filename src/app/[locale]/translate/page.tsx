"use client";

// SpeechRecognition 타입 선언
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}
interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import BottomNav from "@/components/BottomNav";
import { useState, useRef, useEffect, useCallback } from "react";

// 언어 코드 매핑 (앱 locale → 번역 API 코드)
const langMap: Record<string, { code: string; name: string; flag: string; speechCode: string }> = {
  ko: { code: "ko", name: "한국어", flag: "🇰🇷", speechCode: "ko-KR" },
  en: { code: "en", name: "English", flag: "🇺🇸", speechCode: "en-US" },
  ja: { code: "ja", name: "日本語", flag: "🇯🇵", speechCode: "ja-JP" },
  zh: { code: "zh-CN", name: "中文", flag: "🇨🇳", speechCode: "zh-CN" },
  es: { code: "es", name: "Español", flag: "🇪🇸", speechCode: "es-ES" },
  fr: { code: "fr", name: "Français", flag: "🇫🇷", speechCode: "fr-FR" },
  th: { code: "th", name: "ไทย", flag: "🇹🇭", speechCode: "th-TH" },
  vi: { code: "vi", name: "Tiếng Việt", flag: "🇻🇳", speechCode: "vi-VN" },
  id: { code: "id", name: "Indonesia", flag: "🇮🇩", speechCode: "id-ID" },
  de: { code: "de", name: "Deutsch", flag: "🇩🇪", speechCode: "de-DE" },
};

// 여행 회화 카테고리
const phraseCategories = [
  { key: "greetings", icon: "👋", color: "bg-blue-100 text-blue-600" },
  { key: "restaurant", icon: "🍽️", color: "bg-orange-100 text-orange-600" },
  { key: "transport", icon: "🚌", color: "bg-green-100 text-green-600" },
  { key: "shopping", icon: "🛍️", color: "bg-pink-100 text-pink-600" },
  { key: "emergency_phrases", icon: "🆘", color: "bg-red-100 text-red-600" },
  { key: "accommodation", icon: "🏨", color: "bg-purple-100 text-purple-600" },
];

// 여행 회화 데이터 (한국어 원문)
const phrases: Record<string, { ko: string; pronunciation: string }[]> = {
  greetings: [
    { ko: "안녕하세요", pronunciation: "an-nyeong-ha-se-yo" },
    { ko: "감사합니다", pronunciation: "gam-sa-ham-ni-da" },
    { ko: "죄송합니다", pronunciation: "joe-song-ham-ni-da" },
    { ko: "네 / 아니요", pronunciation: "ne / a-ni-yo" },
    { ko: "실례합니다", pronunciation: "sil-lye-ham-ni-da" },
    { ko: "안녕히 가세요", pronunciation: "an-nyeong-hi ga-se-yo" },
    { ko: "만나서 반갑습니다", pronunciation: "man-na-seo ban-gap-seum-ni-da" },
    { ko: "한국어를 못해요", pronunciation: "han-gu-geo-reul mot-hae-yo" },
    { ko: "영어 할 수 있어요?", pronunciation: "yeong-eo hal su iss-eo-yo?" },
    { ko: "도와주세요", pronunciation: "do-wa-ju-se-yo" },
  ],
  restaurant: [
    { ko: "메뉴판 주세요", pronunciation: "me-nyu-pan ju-se-yo" },
    { ko: "이것 주세요", pronunciation: "i-geot ju-se-yo" },
    { ko: "물 주세요", pronunciation: "mul ju-se-yo" },
    { ko: "계산서 주세요", pronunciation: "gye-san-seo ju-se-yo" },
    { ko: "맛있어요!", pronunciation: "mas-iss-eo-yo!" },
    { ko: "매운 음식은 안 돼요", pronunciation: "mae-un eum-sig-eun an dwae-yo" },
    { ko: "채식 메뉴 있어요?", pronunciation: "chae-sik me-nyu iss-eo-yo?" },
    { ko: "알레르기가 있어요", pronunciation: "al-le-reu-gi-ga iss-eo-yo" },
    { ko: "추천 메뉴가 뭐예요?", pronunciation: "chu-cheon me-nyu-ga mwo-ye-yo?" },
    { ko: "포장해 주세요", pronunciation: "po-jang-hae ju-se-yo" },
  ],
  transport: [
    { ko: "이 버스 ~에 가요?", pronunciation: "i beo-seu ~e ga-yo?" },
    { ko: "지하철역이 어디예요?", pronunciation: "ji-ha-cheol-yeog-i eo-di-ye-yo?" },
    { ko: "택시 불러 주세요", pronunciation: "taek-si bul-leo ju-se-yo" },
    { ko: "여기서 내려 주세요", pronunciation: "yeo-gi-seo nae-ryeo ju-se-yo" },
    { ko: "얼마예요?", pronunciation: "eol-ma-ye-yo?" },
    { ko: "서울역 가 주세요", pronunciation: "seo-ul-yeok ga ju-se-yo" },
    { ko: "환승 어떻게 해요?", pronunciation: "hwan-seung eo-tteo-ke hae-yo?" },
    { ko: "몇 정거장 남았어요?", pronunciation: "myeot jeong-geo-jang nam-ass-eo-yo?" },
    { ko: "막차가 언제예요?", pronunciation: "mak-cha-ga eon-je-ye-yo?" },
    { ko: "교통카드 충전해 주세요", pronunciation: "gyo-tong-ka-deu chung-jeon-hae ju-se-yo" },
  ],
  shopping: [
    { ko: "얼마예요?", pronunciation: "eol-ma-ye-yo?" },
    { ko: "좀 깎아 주세요", pronunciation: "jom kkakk-a ju-se-yo" },
    { ko: "카드 돼요?", pronunciation: "ka-deu dwae-yo?" },
    { ko: "다른 색상 있어요?", pronunciation: "da-reun saek-sang iss-eo-yo?" },
    { ko: "사이즈가 안 맞아요", pronunciation: "sa-i-jeu-ga an maj-a-yo" },
    { ko: "교환/환불 가능해요?", pronunciation: "gyo-hwan/hwan-bul ga-neung-hae-yo?" },
    { ko: "면세 가능해요?", pronunciation: "myeon-se ga-neung-hae-yo?" },
    { ko: "영수증 주세요", pronunciation: "yeong-su-jeung ju-se-yo" },
    { ko: "이거 인기 있어요?", pronunciation: "i-geo in-gi iss-eo-yo?" },
    { ko: "선물용으로 포장해 주세요", pronunciation: "seon-mul-yong-eu-ro po-jang-hae ju-se-yo" },
  ],
  emergency_phrases: [
    { ko: "도와주세요!", pronunciation: "do-wa-ju-se-yo!" },
    { ko: "경찰 불러 주세요", pronunciation: "gyeong-chal bul-leo ju-se-yo" },
    { ko: "병원에 가야 해요", pronunciation: "byeong-won-e ga-ya hae-yo" },
    { ko: "여권을 잃어버렸어요", pronunciation: "yeo-gwon-eul ilh-eo-beo-ryeoss-eo-yo" },
    { ko: "길을 잃었어요", pronunciation: "gil-eul ilh-eoss-eo-yo" },
    { ko: "아파요", pronunciation: "a-pa-yo" },
    { ko: "약국이 어디예요?", pronunciation: "yak-gug-i eo-di-ye-yo?" },
    { ko: "대사관에 연락해 주세요", pronunciation: "dae-sa-gwan-e yeol-lag-hae ju-se-yo" },
    { ko: "지갑을 도둑맞았어요", pronunciation: "ji-gab-eul do-duk-maj-ass-eo-yo" },
    { ko: "화재입니다!", pronunciation: "hwa-jae-im-ni-da!" },
  ],
  accommodation: [
    { ko: "체크인 하려고요", pronunciation: "che-keu-in ha-ryeo-go-yo" },
    { ko: "체크아웃 시간이 언제예요?", pronunciation: "che-keu-a-ut si-gan-i eon-je-ye-yo?" },
    { ko: "와이파이 비밀번호가 뭐예요?", pronunciation: "wa-i-pa-i bi-mil-beon-ho-ga mwo-ye-yo?" },
    { ko: "방을 바꿔 주세요", pronunciation: "bang-eul ba-kkwo ju-se-yo" },
    { ko: "수건 더 주세요", pronunciation: "su-geon deo ju-se-yo" },
    { ko: "에어컨이 안 돼요", pronunciation: "e-eo-keon-i an dwae-yo" },
    { ko: "짐을 맡아 주세요", pronunciation: "jim-eul mat-a ju-se-yo" },
    { ko: "근처에 편의점 있어요?", pronunciation: "geun-cheo-e pyeon-ui-jeom iss-eo-yo?" },
    { ko: "조식은 몇 시예요?", pronunciation: "jo-sig-eun myeot si-ye-yo?" },
    { ko: "늦은 체크아웃 가능해요?", pronunciation: "neuj-eun che-keu-a-ut ga-neung-hae-yo?" },
  ],
};

export default function TranslatePage() {
  const t = useTranslations("translate");
  const locale = useLocale();

  // 번역 탭 상태
  const [activeTab, setActiveTab] = useState<"translate" | "phrases">("translate");

  // 텍스트 번역 상태
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [fromLang, setFromLang] = useState("ko");
  const [toLang, setToLang] = useState(locale === "ko" ? "en" : locale);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  // 음성 입력 상태
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // 회화 상태
  const [activeCategory, setActiveCategory] = useState("greetings");
  const [phraseTranslations, setPhraseTranslations] = useState<Record<string, string>>({});
  const [translatingPhrases, setTranslatingPhrases] = useState(false);

  // 번역 함수
  const translateText = useCallback(async (text: string, from: string, to: string) => {
    if (!text.trim()) return "";
    const fromCode = langMap[from]?.code || from;
    const toCode = langMap[to]?.code || to;
    try {
      const res = await fetch(
        `/api/translate?text=${encodeURIComponent(text)}&from=${fromCode}&to=${toCode}`
      );
      const data = await res.json();
      return data.translatedText || "";
    } catch {
      return "";
    }
  }, []);

  // 텍스트 번역 실행
  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    const result = await translateText(inputText, fromLang, toLang);
    setTranslatedText(result);
    setIsTranslating(false);
  };

  // 언어 교체
  const swapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  // 음성 입력
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert(t("voiceNotSupported"));
      return;
    }
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = langMap[fromLang]?.speechCode || "ko-KR";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      setInputText(transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  // TTS 읽기 (Google Cloud TTS)
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speakText = async (text: string, lang: string) => {
    if (isSpeaking) {
      // 재생 중이면 중지
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    try {
      const langCode = langMap[lang]?.code || lang;
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang: langCode }),
      });
      const data = await res.json();

      if (data.audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        audioRef.current = audio;
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => setIsSpeaking(false);
        await audio.play();
      } else {
        // 폴백: 브라우저 TTS
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = langMap[lang]?.speechCode || "ko-KR";
          utterance.rate = 0.85;
          utterance.onend = () => setIsSpeaking(false);
          window.speechSynthesis.speak(utterance);
        } else {
          setIsSpeaking(false);
        }
      }
    } catch {
      // 폴백: 브라우저 TTS
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langMap[lang]?.speechCode || "ko-KR";
        utterance.rate = 0.85;
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsSpeaking(false);
      }
    }
  };

  // 클립보드 복사
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback
    }
  };

  // 회화 카테고리 변경 시 번역
  useEffect(() => {
    const translatePhrases = async () => {
      if (toLang === "ko") {
        setPhraseTranslations({});
        return;
      }
      setTranslatingPhrases(true);
      const currentPhrases = phrases[activeCategory] || [];
      const results: Record<string, string> = {};
      for (const phrase of currentPhrases) {
        const translated = await translateText(phrase.ko, "ko", toLang);
        results[phrase.ko] = translated;
      }
      setPhraseTranslations(results);
      setTranslatingPhrases(false);
    };
    translatePhrases();
  }, [activeCategory, toLang, translateText]);

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto pb-20">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 pt-12 pb-4">
        <h1 className="text-xl font-bold">🌐 {t("title")}</h1>
        <p className="text-blue-200 text-xs mt-0.5">{t("subtitle")}</p>
      </div>

      {/* 탭 전환 */}
      <div className="flex bg-white border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => setActiveTab("translate")}
          className={`flex-1 py-3 text-sm font-bold transition-colors ${
            activeTab === "translate"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-400"
          }`}
        >
          ✍️ {t("textTab")}
        </button>
        <button
          onClick={() => setActiveTab("phrases")}
          className={`flex-1 py-3 text-sm font-bold transition-colors ${
            activeTab === "phrases"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-400"
          }`}
        >
          💬 {t("phrasesTab")}
        </button>
      </div>

      {/* === 텍스트 번역 탭 === */}
      {activeTab === "translate" && (
        <div className="px-4 mt-4">
          {/* 언어 선택 바 */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
            {/* 출발 언어 */}
            <button
              onClick={() => { setShowFromPicker(!showFromPicker); setShowToPicker(false); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-lg">{langMap[fromLang]?.flag}</span>
              <span className="text-sm font-bold text-gray-700">{langMap[fromLang]?.name}</span>
              <span className="text-gray-400 text-xs">▼</span>
            </button>

            {/* 교체 버튼 */}
            <button
              onClick={swapLanguages}
              className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 active:scale-90 transition-all"
            >
              ⇄
            </button>

            {/* 도착 언어 */}
            <button
              onClick={() => { setShowToPicker(!showToPicker); setShowFromPicker(false); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-lg">{langMap[toLang]?.flag}</span>
              <span className="text-sm font-bold text-gray-700">{langMap[toLang]?.name}</span>
              <span className="text-gray-400 text-xs">▼</span>
            </button>
          </div>

          {/* 언어 선택 드롭다운 - From */}
          {showFromPicker && (
            <div className="bg-white rounded-xl mt-2 shadow-lg border border-gray-100 p-2 grid grid-cols-2 gap-1">
              {Object.entries(langMap).map(([key, lang]) => (
                <button
                  key={key}
                  onClick={() => { setFromLang(key); setShowFromPicker(false); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    fromLang === key ? "bg-blue-50 text-blue-600 font-bold" : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* 언어 선택 드롭다운 - To */}
          {showToPicker && (
            <div className="bg-white rounded-xl mt-2 shadow-lg border border-gray-100 p-2 grid grid-cols-2 gap-1">
              {Object.entries(langMap).map(([key, lang]) => (
                <button
                  key={key}
                  onClick={() => { setToLang(key); setShowToPicker(false); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    toLang === key ? "bg-blue-50 text-blue-600 font-bold" : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* 입력 영역 */}
          <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t("inputPlaceholder")}
                className="w-full p-4 pb-12 text-base text-gray-800 resize-none focus:outline-none min-h-[120px]"
                rows={4}
              />
              {/* 입력 하단 버튼들 */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <div className="flex gap-2">
                  {/* 음성 입력 */}
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`p-2 rounded-full transition-all ${
                      isListening
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    🎤
                  </button>
                  {/* 읽기 */}
                  {inputText && (
                    <button
                      onClick={() => speakText(inputText, fromLang)}
                      className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                    >
                      🔊
                    </button>
                  )}
                  {/* 지우기 */}
                  {inputText && (
                    <button
                      onClick={() => { setInputText(""); setTranslatedText(""); }}
                      className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                    >
                      ✕
                    </button>
                  )}
                </div>
                {isListening && (
                  <span className="text-xs text-red-500 font-medium animate-pulse">
                    {t("listening")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 번역 버튼 */}
          <button
            onClick={handleTranslate}
            disabled={!inputText.trim() || isTranslating}
            className="w-full mt-3 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-base
              hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            {isTranslating ? (
              <>
                <span className="animate-spin">⏳</span> {t("translating")}
              </>
            ) : (
              <>🌐 {t("translateBtn")}</>
            )}
          </button>

          {/* 번역 결과 */}
          {translatedText && (
            <div className="mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-600">
                    {langMap[toLang]?.flag} {langMap[toLang]?.name}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => speakText(translatedText, toLang)}
                      className="p-1.5 rounded-lg bg-white/70 hover:bg-white text-blue-600 transition-colors"
                    >
                      🔊
                    </button>
                    <button
                      onClick={() => copyToClipboard(translatedText)}
                      className="p-1.5 rounded-lg bg-white/70 hover:bg-white text-blue-600 transition-colors"
                    >
                      📋
                    </button>
                  </div>
                </div>
                <p className="text-lg text-gray-800 leading-relaxed">{translatedText}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* === 여행 회화 탭 === */}
      {activeTab === "phrases" && (
        <div className="px-4 mt-4">
          {/* 대상 언어 선택 */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-bold text-gray-600">{t("translateTo")}:</span>
            <div className="flex gap-1 flex-wrap">
              {Object.entries(langMap)
                .filter(([key]) => key !== "ko")
                .map(([key, lang]) => (
                  <button
                    key={key}
                    onClick={() => setToLang(key)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                      toLang === key
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {lang.flag} {lang.name}
                  </button>
                ))}
            </div>
          </div>

          {/* 카테고리 선택 */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {phraseCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-all ${
                  activeCategory === cat.key
                    ? "bg-blue-600 text-white shadow-md"
                    : `${cat.color} hover:opacity-80`
                }`}
              >
                <span>{cat.icon}</span>
                <span>{t(`cat_${cat.key}`)}</span>
              </button>
            ))}
          </div>

          {/* 회화 목록 */}
          <div className="mt-4 space-y-2">
            {translatingPhrases && (
              <div className="text-center py-4 text-sm text-gray-400">
                <span className="animate-spin inline-block mr-2">⏳</span>
                {t("translatingPhrases")}
              </div>
            )}
            {(phrases[activeCategory] || []).map((phrase, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-[0.99] transition-transform"
              >
                {/* 한국어 원문 */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-base">{phrase.ko}</p>
                    <p className="text-xs text-gray-400 mt-0.5 italic">{phrase.pronunciation}</p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => speakText(phrase.ko, "ko")}
                      className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500"
                    >
                      🔊
                    </button>
                    <button
                      onClick={() => copyToClipboard(phrase.ko)}
                      className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500"
                    >
                      📋
                    </button>
                  </div>
                </div>

                {/* 번역 결과 */}
                {toLang !== "ko" && phraseTranslations[phrase.ko] && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <span className="text-xs text-blue-500 font-medium">
                          {langMap[toLang]?.flag} {langMap[toLang]?.name}
                        </span>
                        <p className="text-sm text-blue-700 mt-0.5">{phraseTranslations[phrase.ko]}</p>
                      </div>
                      <button
                        onClick={() => speakText(phraseTranslations[phrase.ko], toLang)}
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 ml-2"
                      >
                        🔊
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
