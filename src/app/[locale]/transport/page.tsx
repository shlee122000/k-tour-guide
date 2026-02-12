"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import BottomNav from "@/components/BottomNav";

interface TransportResult {
  id: number;
  type: "bus" | "subway" | "train" | "taxi";
  icon: string;
  routeName: string;
  detail: Record<string, string>;
  departure: Record<string, string>;
  arrival: Record<string, string>;
  fare: Record<string, string>;
  duration: string;
  schedule: string[];
  transfers?: number;
  color: string;
}

const popularRoutes = [
  {
    from: { ko: "인천공항", en: "Incheon Airport", ja: "仁川空港", zh: "仁川机场" },
    to: { ko: "서울역", en: "Seoul Station", ja: "ソウル駅", zh: "首尔站" },
    icon: "✈️",
  },
  {
    from: { ko: "서울역", en: "Seoul Station", ja: "ソウル駅", zh: "首尔站" },
    to: { ko: "경복궁", en: "Gyeongbokgung", ja: "景福宮", zh: "景福宫" },
    icon: "🏯",
  },
  {
    from: { ko: "서울역", en: "Seoul Station", ja: "ソウル駅", zh: "首尔站" },
    to: { ko: "부산역", en: "Busan Station", ja: "釜山駅", zh: "釜山站" },
    icon: "🚄",
  },
  {
    from: { ko: "명동", en: "Myeongdong", ja: "明洞", zh: "明洞" },
    to: { ko: "남산타워", en: "N Seoul Tower", ja: "Nソウルタワー", zh: "南山塔" },
    icon: "🗼",
  },
];

const sampleResults: TransportResult[] = [
  {
    id: 1,
    type: "subway",
    icon: "🚇",
    routeName: "Line 1 → Line 3",
    detail: {
      ko: "1호선 서울역 → 종로3가 → 3호선 환승 → 경복궁역",
      en: "Line 1 Seoul Stn. → Jongno 3-ga → Transfer Line 3 → Gyeongbokgung",
      ja: "1号線ソウル駅→鍾路3街→3号線乗換→景福宮駅",
      zh: "1号线首尔站→钟路3街→换乘3号线→景福宫站",
    },
    departure: { ko: "서울역", en: "Seoul Station", ja: "ソウル駅", zh: "首尔站" },
    arrival: { ko: "경복궁역 5번 출구", en: "Gyeongbokgung Stn. Exit 5", ja: "景福宮駅5番出口", zh: "景福宫站5号出口" },
    fare: { ko: "1,400원", en: "₩1,400", ja: "1,400ウォン", zh: "1,400韩元" },
    duration: "15",
    schedule: ["05:30", "~", "23:40", "(2~3min)"],
    transfers: 1,
    color: "bg-green-500",
  },
  {
    id: 2,
    type: "bus",
    icon: "🚌",
    routeName: "Bus 171",
    detail: {
      ko: "171번 버스 서울역버스환승센터 → 경복궁 앞",
      en: "Bus 171: Seoul Stn. Bus Center → Gyeongbokgung",
      ja: "171番バス ソウル駅バスセンター → 景福宮前",
      zh: "171路公交 首尔站公交中心 → 景福宫前",
    },
    departure: { ko: "서울역버스환승센터", en: "Seoul Stn. Bus Center", ja: "ソウル駅バスセンター", zh: "首尔站公交中心" },
    arrival: { ko: "경복궁 앞 정류장", en: "Gyeongbokgung Bus Stop", ja: "景福宮前停留所", zh: "景福宫前站" },
    fare: { ko: "1,200원 (카드) / 1,300원 (현금)", en: "₩1,200 (Card) / ₩1,300 (Cash)", ja: "1,200ウォン(カード) / 1,300ウォン(現金)", zh: "1,200韩元(卡) / 1,300韩元(现金)" },
    duration: "20",
    schedule: ["04:30", "06:10", "06:25", "06:40", "06:55", "07:08", "07:20", "07:32"],
    color: "bg-blue-500",
  },
  {
    id: 3,
    type: "bus",
    icon: "🚌",
    routeName: "Bus 272",
    detail: {
      ko: "272번 버스 서울역 → 세종로 → 경복궁",
      en: "Bus 272: Seoul Stn. → Sejong-ro → Gyeongbokgung",
      ja: "272番バス ソウル駅 → 世宗路 → 景福宮",
      zh: "272路 首尔站 → 世宗路 → 景福宫",
    },
    departure: { ko: "서울역", en: "Seoul Station", ja: "ソウル駅", zh: "首尔站" },
    arrival: { ko: "경복궁 앞 정류장", en: "Gyeongbokgung Bus Stop", ja: "景福宮前停留所", zh: "景福宫前站" },
    fare: { ko: "1,200원 (카드)", en: "₩1,200 (Card)", ja: "1,200ウォン(カード)", zh: "1,200韩元(卡)" },
    duration: "25",
    schedule: ["05:00", "06:00", "06:20", "06:35", "06:50", "07:05", "07:18", "07:30"],
    color: "bg-blue-500",
  },
  {
    id: 4,
    type: "bus",
    icon: "🚌",
    routeName: "Bus 109",
    detail: {
      ko: "109번 버스 서울역 → 광화문 → 경복궁",
      en: "Bus 109: Seoul Stn. → Gwanghwamun → Gyeongbokgung",
      ja: "109番バス ソウル駅 → 光化門 → 景福宮",
      zh: "109路 首尔站 → 光化门 → 景福宫",
    },
    departure: { ko: "서울역", en: "Seoul Station", ja: "ソウル駅", zh: "首尔站" },
    arrival: { ko: "경복궁 앞", en: "Gyeongbokgung Stop", ja: "景福宮前", zh: "景福宫前" },
    fare: { ko: "1,200원 (카드)", en: "₩1,200 (Card)", ja: "1,200ウォン(カード)", zh: "1,200韩元(卡)" },
    duration: "22",
    schedule: ["05:10", "06:05", "06:22", "06:38", "06:52", "07:07", "07:22", "07:35"],
    color: "bg-green-600",
  },
  {
    id: 5,
    type: "taxi",
    icon: "🚕",
    routeName: "Taxi",
    detail: {
      ko: "서울역 → 경복궁 (일반택시)",
      en: "Seoul Stn. → Gyeongbokgung (Regular Taxi)",
      ja: "ソウル駅 → 景福宮（一般タクシー）",
      zh: "首尔站 → 景福宫（普通出租车）",
    },
    departure: { ko: "서울역", en: "Seoul Station", ja: "ソウル駅", zh: "首尔站" },
    arrival: { ko: "경복궁", en: "Gyeongbokgung", ja: "景福宮", zh: "景福宫" },
    fare: { ko: "약 6,000~8,000원", en: "~₩6,000~8,000", ja: "約6,000~8,000ウォン", zh: "约6,000~8,000韩元" },
    duration: "12",
    schedule: ["24h"],
    color: "bg-yellow-500",
  },
];

const ktxResults: TransportResult[] = [
  {
    id: 10,
    type: "train",
    icon: "🚄",
    routeName: "KTX",
    detail: {
      ko: "KTX 서울역 → 부산역",
      en: "KTX Seoul → Busan",
      ja: "KTX ソウル → 釜山",
      zh: "KTX 首尔 → 釜山",
    },
    departure: { ko: "서울역", en: "Seoul Station", ja: "ソウル駅", zh: "首尔站" },
    arrival: { ko: "부산역", en: "Busan Station", ja: "釜山駅", zh: "釜山站" },
    fare: { ko: "59,800원 (일반실)", en: "₩59,800 (Standard)", ja: "59,800ウォン(一般席)", zh: "59,800韩元(普通席)" },
    duration: "150",
    schedule: ["05:15", "05:40", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30"],
    color: "bg-red-500",
  },
  {
    id: 11,
    type: "train",
    icon: "🚄",
    routeName: "SRT",
    detail: {
      ko: "SRT 수서역 → 부산역",
      en: "SRT Suseo → Busan",
      ja: "SRT 水西 → 釜山",
      zh: "SRT 水西 → 釜山",
    },
    departure: { ko: "수서역", en: "Suseo Station", ja: "水西駅", zh: "水西站" },
    arrival: { ko: "부산역", en: "Busan Station", ja: "釜山駅", zh: "釜山站" },
    fare: { ko: "52,600원 (일반실)", en: "₩52,600 (Standard)", ja: "52,600ウォン(一般席)", zh: "52,600韩元(普通席)" },
    duration: "145",
    schedule: ["05:00", "05:30", "06:00", "06:25", "06:50", "07:20", "07:50", "08:15"],
    color: "bg-purple-500",
  },
  {
    id: 12,
    type: "train",
    icon: "🚃",
    routeName: "ITX-Saemaeul",
    detail: {
      ko: "ITX-새마을 서울역 → 부산역",
      en: "ITX-Saemaeul Seoul → Busan",
      ja: "ITX-セマウル ソウル → 釜山",
      zh: "ITX-新村号 首尔 → 釜山",
    },
    departure: { ko: "서울역", en: "Seoul Station", ja: "ソウル駅", zh: "首尔站" },
    arrival: { ko: "부산역", en: "Busan Station", ja: "釜山駅", zh: "釜山站" },
    fare: { ko: "42,600원 (일반실)", en: "₩42,600 (Standard)", ja: "42,600ウォン(一般席)", zh: "42,600韩元(普通席)" },
    duration: "320",
    schedule: ["07:25", "09:05", "11:20", "14:00", "16:30", "18:45"],
    color: "bg-orange-500",
  },
  {
    id: 13,
    type: "taxi",
    icon: "🚕",
    routeName: "Taxi (Not Recommended)",
    detail: {
      ko: "서울 → 부산 (일반택시, 비추천)",
      en: "Seoul → Busan (Regular Taxi, Not Recommended)",
      ja: "ソウル → 釜山（タクシー、非推奨）",
      zh: "首尔 → 釜山（出租车，不推荐）",
    },
    departure: { ko: "서울역", en: "Seoul Station", ja: "ソウル駅", zh: "首尔站" },
    arrival: { ko: "부산역", en: "Busan Station", ja: "釜山駅", zh: "釜山站" },
    fare: { ko: "약 350,000~400,000원", en: "~₩350,000~400,000", ja: "約350,000~400,000ウォン", zh: "约350,000~400,000韩元" },
    duration: "270",
    schedule: ["24h"],
    color: "bg-yellow-500",
  },
];

const airportResults: TransportResult[] = [
  {
    id: 20,
    type: "train",
    icon: "🚄",
    routeName: "AREX Express",
    detail: {
      ko: "공항철도 직통열차 인천공항 T1 → 서울역",
      en: "AREX Express: Incheon Airport T1 → Seoul Station",
      ja: "空港鉄道直通 仁川空港T1 → ソウル駅",
      zh: "机场铁路直达 仁川机场T1 → 首尔站",
    },
    departure: { ko: "인천공항 제1터미널", en: "Incheon Airport T1", ja: "仁川空港第1ターミナル", zh: "仁川机场1号航站楼" },
    arrival: { ko: "서울역", en: "Seoul Station", ja: "ソウル駅", zh: "首尔站" },
    fare: { ko: "11,000원", en: "₩11,000", ja: "11,000ウォン", zh: "11,000韩元" },
    duration: "43",
    schedule: ["05:20", "06:08", "06:45", "07:17", "07:48", "08:18", "08:50", "09:20"],
    color: "bg-blue-600",
  },
  {
    id: 21,
    type: "train",
    icon: "🚇",
    routeName: "AREX All-Stop",
    detail: {
      ko: "공항철도 일반열차 인천공항 → 서울역 (각역정차)",
      en: "AREX All-Stop: Incheon Airport → Seoul Station",
      ja: "空港鉄道一般 仁川空港 → ソウル駅（各駅停車）",
      zh: "机场铁路普通 仁川机场 → 首尔站（每站停车）",
    },
    departure: { ko: "인천공항 제1터미널", en: "Incheon Airport T1", ja: "仁川空港第1ターミナル", zh: "仁川机场1号航站楼" },
    arrival: { ko: "서울역", en: "Seoul Station", ja: "ソウル駅", zh: "首尔站" },
    fare: { ko: "4,850원 (T-money)", en: "₩4,850 (T-money)", ja: "4,850ウォン(T-money)", zh: "4,850韩元(T-money)" },
    duration: "66",
    schedule: ["05:18", "05:42", "06:03", "06:18", "06:33", "06:48", "07:03", "07:18"],
    color: "bg-sky-500",
  },
  {
    id: 22,
    type: "bus",
    icon: "🚌",
    routeName: "Airport Bus 6015",
    detail: {
      ko: "공항버스 6015번 인천공항 → 명동",
      en: "Airport Bus 6015: Incheon Airport → Myeongdong",
      ja: "空港バス6015番 仁川空港 → 明洞",
      zh: "机场大巴6015路 仁川机场 → 明洞",
    },
    departure: { ko: "인천공항 버스정류장", en: "Incheon Airport Bus Stop", ja: "仁川空港バス停", zh: "仁川机场公交站" },
    arrival: { ko: "명동역", en: "Myeongdong Station", ja: "明洞駅", zh: "明洞站" },
    fare: { ko: "17,000원", en: "₩17,000", ja: "17,000ウォン", zh: "17,000韩元" },
    duration: "80",
    schedule: ["05:35", "06:10", "06:40", "07:00", "07:25", "07:50", "08:15", "08:40"],
    color: "bg-amber-600",
  },
  {
    id: 23,
    type: "taxi",
    icon: "🚕",
    routeName: "Airport Taxi",
    detail: {
      ko: "인천공항 → 서울 시내 (일반택시)",
      en: "Incheon Airport → Seoul City (Regular Taxi)",
      ja: "仁川空港 → ソウル市内（一般タクシー）",
      zh: "仁川机场 → 首尔市区（普通出租车）",
    },
    departure: { ko: "인천공항 택시승강장", en: "Incheon Airport Taxi Stand", ja: "仁川空港タクシー乗り場", zh: "仁川机场出租车站" },
    arrival: { ko: "서울 시내", en: "Seoul City Center", ja: "ソウル市内", zh: "首尔市区" },
    fare: { ko: "약 65,000~80,000원", en: "~₩65,000~80,000", ja: "約65,000~80,000ウォン", zh: "约65,000~80,000韩元" },
    duration: "70",
    schedule: ["24h"],
    color: "bg-yellow-500",
  },
];

type FilterType = "all" | "subway" | "bus" | "train" | "taxi";

export default function TransportPage() {
  const locale = useLocale();
  const t = useTranslations();
  const tTransport = useTranslations("transport");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [results, setResults] = useState<TransportResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const getText = (textMap: Record<string, string>) => {
    return textMap[locale] || textMap.en || Object.values(textMap)[0] || "";
  };

  const handleSearch = () => {
    if (!from || !to) return;

    const fromLower = from.toLowerCase();
    const toLower = to.toLowerCase();

    // Simulate route matching
    if ((fromLower.includes("서울") || fromLower.includes("seoul")) &&
        (toLower.includes("경복") || toLower.includes("gyeong"))) {
      setResults(sampleResults);
    } else if ((fromLower.includes("서울") || fromLower.includes("seoul")) &&
               (toLower.includes("부산") || toLower.includes("busan"))) {
      setResults(ktxResults);
    } else if ((fromLower.includes("인천") || fromLower.includes("공항") || fromLower.includes("incheon") || fromLower.includes("airport")) &&
               (toLower.includes("서울") || toLower.includes("seoul") || toLower.includes("명동") || toLower.includes("myeong"))) {
      setResults(airportResults);
    } else {
      setResults(sampleResults);
    }
    setHasSearched(true);
    setActiveFilter("all");
  };

  const handlePopularRoute = (fromText: Record<string, string>, toText: Record<string, string>) => {
    setFrom(getText(fromText));
    setTo(getText(toText));
    
    const fromVal = fromText.en.toLowerCase();
    const toVal = toText.en.toLowerCase();
    
    if (fromVal.includes("seoul") && toVal.includes("gyeong")) {
      setResults(sampleResults);
    } else if (fromVal.includes("seoul") && toVal.includes("busan")) {
      setResults(ktxResults);
    } else if (fromVal.includes("incheon") || fromVal.includes("airport")) {
      setResults(airportResults);
    } else {
      setResults(sampleResults);
    }
    setHasSearched(true);
    setActiveFilter("all");
  };

  const filteredResults = activeFilter === "all" 
    ? results 
    : results.filter(r => r.type === activeFilter);

  const filters: { key: FilterType; icon: string; label: string }[] = [
    { key: "all", icon: "📍", label: locale === "ko" ? "전체" : "All" },
    { key: "subway", icon: "🚇", label: tTransport("subway") },
    { key: "bus", icon: "🚌", label: tTransport("bus") },
    { key: "train", icon: "🚄", label: tTransport("train") },
    { key: "taxi", icon: "🚕", label: tTransport("taxi") },
  ];

  const formatDuration = (min: string) => {
    const m = parseInt(min);
    if (m >= 60) {
      const h = Math.floor(m / 60);
      const rm = m % 60;
      return `${h}h ${rm > 0 ? rm + "min" : ""}`;
    }
    return `${m}min`;
  };

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white px-4 pt-12 pb-6">
        <h1 className="text-xl font-bold mb-4">🚌 {tTransport("bus")} / 🚇 {tTransport("subway")} / 🚄 {tTransport("train")}</h1>

        {/* Search inputs */}
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder={tTransport("departure")}
              className="w-full pl-12 pr-4 py-3 bg-white/95 text-gray-800 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>

          {/* Swap button */}
          <div className="flex justify-center -my-1 relative z-10">
            <button
              onClick={() => { setFrom(to); setTo(from); }}
              className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">B</span>
            </div>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder={tTransport("arrival")}
              className="w-full pl-12 pr-4 py-3 bg-white/95 text-gray-800 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>

          <button
            onClick={handleSearch}
            className="w-full py-3 bg-white text-green-700 rounded-xl text-sm font-bold hover:bg-green-50 transition-colors shadow-md mt-1"
          >
            🔍 {locale === "ko" ? "경로 검색" : "Search Routes"}
          </button>
        </div>
      </div>

      {/* Popular Routes */}
      {!hasSearched && (
        <div className="px-4 mt-4">
          <h2 className="text-sm font-bold text-gray-700 mb-2">
            {locale === "ko" ? "🔥 인기 경로" : "🔥 Popular Routes"}
          </h2>
          <div className="space-y-2">
            {popularRoutes.map((route, idx) => (
              <button
                key={idx}
                onClick={() => handlePopularRoute(route.from, route.to)}
                className="w-full flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <span className="text-2xl">{route.icon}</span>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-800">{getText(route.from)}</span>
                    <span className="text-gray-400">→</span>
                    <span className="font-medium text-gray-800">{getText(route.to)}</span>
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>

          {/* T-money Info */}
          <div className="bg-blue-50 rounded-xl p-4 mt-4 flex items-start gap-3">
            <span className="text-2xl">💳</span>
            <div>
              <p className="font-bold text-blue-800 text-sm">T-money Card</p>
              <p className="text-xs text-blue-600 mt-1">
                {locale === "ko"
                  ? "편의점(CU, GS25, 세븐일레븐)에서 구입 가능. 버스/지하철 할인 + 환승 무료!"
                  : "Available at convenience stores (CU, GS25, 7-Eleven). Discounted fares + free transfers!"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {hasSearched && (
        <div>
          {/* Filters */}
          <div className="px-4 pt-3 pb-2">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeFilter === filter.key
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-white text-gray-600 border border-gray-200"
                  }`}
                >
                  <span>{filter.icon}</span>
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="px-4 py-1">
            <p className="text-xs text-gray-500">
              {filteredResults.length} {locale === "ko" ? "개 결과" : "results"}
            </p>
          </div>

          {/* Result Cards */}
          <div className="px-4 space-y-2 pb-4">
            {filteredResults.map((result) => (
              <div
                key={result.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                {/* Main card */}
                <button
                  onClick={() => setExpandedId(expandedId === result.id ? null : result.id)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-start gap-3">
                    {/* Icon & type */}
                    <div className={`w-10 h-10 ${result.color} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
                      {result.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-800 text-sm">{result.routeName}</h3>
                        {result.transfers !== undefined && result.transfers > 0 && (
                          <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded text-[10px] font-bold">
                            {locale === "ko" ? `환승 ${result.transfers}회` : `${result.transfers} transfer`}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{getText(result.detail)}</p>
                    </div>

                    {/* Duration & Fare */}
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-green-600 text-sm">{formatDuration(result.duration)}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{getText(result.fare).split("/")[0]}</p>
                    </div>
                  </div>
                </button>

                {/* Expanded detail */}
                {expandedId === result.id && (
                  <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                    <div className="space-y-2.5">
                      {/* Route detail */}
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-gray-400 w-16 flex-shrink-0 pt-0.5">
                          {locale === "ko" ? "경로" : "Route"}
                        </span>
                        <p className="text-xs text-gray-700">{getText(result.detail)}</p>
                      </div>

                      {/* Departure */}
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-gray-400 w-16 flex-shrink-0 pt-0.5">{tTransport("departure")}</span>
                        <p className="text-xs text-gray-700 font-medium">{getText(result.departure)}</p>
                      </div>

                      {/* Arrival */}
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-gray-400 w-16 flex-shrink-0 pt-0.5">{tTransport("arrival")}</span>
                        <p className="text-xs text-gray-700 font-medium">{getText(result.arrival)}</p>
                      </div>

                      {/* Fare */}
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-gray-400 w-16 flex-shrink-0 pt-0.5">{tTransport("fare")}</span>
                        <p className="text-xs text-green-700 font-bold">{getText(result.fare)}</p>
                      </div>

                      {/* Duration */}
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-gray-400 w-16 flex-shrink-0 pt-0.5">{tTransport("duration")}</span>
                        <p className="text-xs text-gray-700">{formatDuration(result.duration)}</p>
                      </div>

                      {/* Schedule */}
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-gray-400 w-16 flex-shrink-0 pt-0.5">{tTransport("schedule")}</span>
                        <div className="flex flex-wrap gap-1">
                          {result.schedule.map((time, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                time === "~" || time === "24h" || time.includes("min")
                                  ? "text-gray-500"
                                  : "bg-white border border-gray-200 text-gray-700"
                              }`}
                            >
                              {time}
                            </span>
                          ))}
                          <span className="text-xs text-gray-400 pt-0.5">...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Back to search */}
          <div className="px-4 pb-4">
            <button
              onClick={() => { setHasSearched(false); setResults([]); setFrom(""); setTo(""); }}
              className="w-full py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              ← {locale === "ko" ? "새 검색" : "New Search"}
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
