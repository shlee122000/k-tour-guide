"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import LanguageSelector from "@/components/LanguageSelector";
import BottomNav from "@/components/BottomNav";
import { useState } from "react";

const categories = [
  { key: "attractions", icon: "🏛️", color: "bg-blue-100 text-blue-600", mapCategory: "attractions" },
  { key: "restaurants", icon: "🍽️", color: "bg-orange-100 text-orange-600", mapCategory: "restaurants" },
  { key: "transport", icon: "🚌", color: "bg-green-100 text-green-600", route: "/transport" },
  { key: "culture", icon: "🎭", color: "bg-purple-100 text-purple-600", mapCategory: "culture" },
  { key: "shopping", icon: "🛍️", color: "bg-pink-100 text-pink-600", mapCategory: "shopping" },
  { key: "emergency", icon: "🆘", color: "bg-red-100 text-red-600", route: "/emergency" },
];

const popularPlaces = [
  { id: 1, searchName: "경복궁",
    name: { ko: "경복궁", en: "Gyeongbokgung Palace", ja: "景福宮", zh: "景福宫", es: "Palacio Gyeongbokgung", fr: "Palais Gyeongbokgung", th: "พระราชวังคยองบกกุง", vi: "Cung điện Gyeongbokgung", id: "Istana Gyeongbokgung", de: "Gyeongbokgung-Palast" },
    image: "🏯", rating: 4.8, city: "Seoul" },
  { id: 2, searchName: "해운대해수욕장",
    name: { ko: "해운대 해수욕장", en: "Haeundae Beach", ja: "海雲台ビーチ", zh: "海云台海水浴场", es: "Playa Haeundae", fr: "Plage Haeundae", th: "หาดแฮอุนแด", vi: "Bãi biển Haeundae", id: "Pantai Haeundae", de: "Haeundae-Strand" },
    image: "🏖️", rating: 4.6, city: "Busan" },
  { id: 3, searchName: "성산일출봉",
    name: { ko: "제주 성산일출봉", en: "Seongsan Sunrise Peak", ja: "城山日出峰", zh: "城山日出峰", es: "Pico Seongsan", fr: "Pic Seongsan", th: "ยอดเขาซองซาน", vi: "Đỉnh Seongsan", id: "Puncak Seongsan", de: "Seongsan-Gipfel" },
    image: "🌋", rating: 4.7, city: "Jeju" },
  { id: 4, searchName: "남산타워",
    name: { ko: "남산타워", en: "N Seoul Tower", ja: "Nソウルタワー", zh: "南山塔", es: "Torre N Seoul", fr: "Tour N Seoul", th: "หอคอยเอ็นโซล", vi: "Tháp N Seoul", id: "Menara N Seoul", de: "N Seoul Tower" },
    image: "🗼", rating: 4.5, city: "Seoul" },
];

// K-Pop 핫스팟 - 카카오맵 직접 링크 (위치 정확)
const kpopSpots = [
  { icon: "🎤", bgColor: "#e9d5ff", textColor: "#7c3aed",
    name: { ko: "하이커 그라운드", en: "HiKR GROUND" },
    mapUrl: "https://map.kakao.com/link/search/하이커그라운드" },
  { icon: "💜", bgColor: "#ddd6fe", textColor: "#6d28d9",
    name: { ko: "광야 서울", en: "KWANGYA Seoul" },
    mapUrl: "https://map.kakao.com/link/search/광야 서울 성수" },
  { icon: "💿", bgColor: "#fbcfe8", textColor: "#be185d",
    name: { ko: "Ktown4u 코엑스", en: "Ktown4u COEX" },
    mapUrl: "https://map.kakao.com/link/search/케이타운포유 코엑스" },
  { icon: "🍜", bgColor: "#fed7aa", textColor: "#c2410c",
    name: { ko: "유정식당 (BTS)", en: "Yujeong (BTS)" },
    mapUrl: "https://map.kakao.com/link/search/유정식당 서울 마포" },
  { icon: "⭐", bgColor: "#fde68a", textColor: "#b45309",
    name: { ko: "K-Star Road", en: "K-Star Road" },
    mapUrl: "https://map.kakao.com/link/search/K스타로드 강남" },
];

// K-Beauty
const kbeautyItems = [
  { icon: "🏥", bgColor: "#a5f3fc", textColor: "#0e7490",
    name: { ko: "성형외과 정보", en: "Plastic Surgery" },
    url: "https://my-doctor.io/hospital/deptHub/region/%EC%84%B1%ED%98%95%EC%99%B8%EA%B3%BC-%EC%84%9C%EC%9A%B8" },
  { icon: "💄", bgColor: "#bbf7d0", textColor: "#15803d",
    name: { ko: "올리브영", en: "Olive Young" },
    mapUrl: "https://map.kakao.com/link/search/올리브영 명동" },
  { icon: "📋", bgColor: "#fecdd3", textColor: "#be123c",
    name: { ko: "시술 후기 참고", en: "Reviews" },
    url: "https://www.babitalk.com" },
];

export default function HomePage() {
  const t = useTranslations();
  const tCat = useTranslations("categories");
  const tHome = useTranslations("home");
  const tApp = useTranslations("app");
  const [searchQuery, setSearchQuery] = useState("");
  const [radius, setRadius] = useState(50);
  const locale = useLocale();
  const router = useRouter();

  const handleCategoryClick = (cat: typeof categories[0]) => {
    if (cat.route) { router.push(`/${locale}${cat.route}`); }
    else if (cat.mapCategory) { router.push(`/${locale}/map?category=${cat.mapCategory}&radius=${radius}&gps=true`); }
  };
  const handleSearch = () => {
    if (searchQuery.trim()) { router.push(`/${locale}/map?search=${encodeURIComponent(searchQuery.trim())}&radius=${radius}&gps=true`); }
  };
  const handlePlaceClick = (place: { searchName: string }) => {
    router.push(`/${locale}/map?search=${encodeURIComponent(place.searchName)}`);
  };
  const getName = (nameObj: Record<string, string>) => nameObj[locale] || nameObj.en || "";

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="px-4 pt-12 pb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{tApp("title")}</h1>
              <p className="text-blue-200 text-sm mt-0.5">{tApp("subtitle")}</p>
            </div>
            <LanguageSelector />
          </div>
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder={tApp("search")} value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-12 pr-14 py-3.5 bg-white/95 backdrop-blur-sm text-gray-800 rounded-2xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg" />
            <button onClick={handleSearch} className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors">🔍</button>
          </div>
          <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-blue-100">📍 {t("radius.title")}</span>
              <span className="text-sm font-bold text-white">{radius}km</span>
            </div>
            <input type="range" min="30" max="300" step="10" value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white" />
            <div className="flex justify-between text-xs text-blue-200 mt-1">
              <span>30km</span><span>150km</span><span>300km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 -mt-1">
        <div className="bg-white rounded-2xl shadow-md p-4">
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button key={cat.key} onClick={() => handleCategoryClick(cat)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl ${cat.color} hover:scale-105 transition-transform active:scale-95`}>
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-semibold">{tCat(cat.key)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ★ K-Pop Hot Spots */}
      <div className="px-4 mt-5">
        <div className="bg-purple-50 rounded-2xl shadow-md p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-gray-800">🎤 K-Pop Hot Spots</span>
            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">HOT</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-2">
            {kpopSpots.slice(0, 3).map((spot, idx) => (
              <div key={idx} onClick={() => window.open(spot.mapUrl, "_blank")}
                style={{ backgroundColor: spot.bgColor, color: spot.textColor }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:scale-105 transition-transform active:scale-95 cursor-pointer">
                <span className="text-2xl">{spot.icon}</span>
                <span className="text-[11px] font-semibold text-center leading-tight">{getName(spot.name)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-3">
            {kpopSpots.slice(3).map((spot, idx) => (
              <div key={idx + 3} onClick={() => window.open(spot.mapUrl, "_blank")}
                style={{ backgroundColor: spot.bgColor, color: spot.textColor, width: "calc(33.333% - 4px)" }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:scale-105 transition-transform active:scale-95 cursor-pointer">
                <span className="text-2xl">{spot.icon}</span>
                <span className="text-[11px] font-semibold text-center leading-tight">{getName(spot.name)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ★ K-Beauty */}
      <div className="px-4 mt-4">
        <div className="bg-rose-50 rounded-2xl shadow-md p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-gray-800">💄 K-Beauty</span>
            <span className="px-2 py-0.5 bg-pink-500 text-white text-[10px] font-bold rounded-full">TREND</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {kbeautyItems.map((item, idx) => (
              <div key={idx} onClick={() => {
                  if (item.url) { window.open(item.url, "_blank"); }
                  else if (item.mapUrl) { window.open(item.mapUrl, "_blank"); }
                }}
                style={{ backgroundColor: item.bgColor, color: item.textColor }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:scale-105 transition-transform active:scale-95 cursor-pointer">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[11px] font-semibold text-center leading-tight">{getName(item.name)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Places */}
      <div className="px-4 mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">{tHome("popular")}</h2>
          <button onClick={() => router.push(`/${locale}/explore`)} className="text-sm text-blue-600 font-medium hover:text-blue-800">{tHome("seeAll")} →</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {popularPlaces.map((place) => {
            const name = place.name[locale as keyof typeof place.name] || place.name.en;
            return (
              <div key={place.id} onClick={() => handlePlaceClick(place)}
                className="flex-shrink-0 w-44 bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer active:scale-[0.98]">
                <div className="h-28 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <span className="text-5xl">{place.image}</span>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-gray-800 truncate">{name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-500 text-xs">⭐</span>
                    <span className="text-xs text-gray-500">{place.rating}</span>
                    <span className="text-xs text-gray-400 ml-1">• {place.city}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 도시별 관광가이드 */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">{locale === "ko" ? "🗺️ 도시별 관광가이드" : "🗺️ City Tour Guide"}</h2>
        <div className="flex gap-3">
          <div onClick={() => router.push(`/${locale}/tour`)}
            className="flex-1 rounded-2xl p-4 cursor-pointer hover:scale-[0.98] transition-transform active:scale-95"
            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
            <span className="text-3xl">🏙️</span>
            <h3 className="text-white font-bold text-sm mt-2">{locale === "ko" ? "서울 투어" : "Seoul Tour"}</h3>
            <p className="text-blue-100 text-[10px] mt-1">{locale === "ko" ? "코스·맛집·포토·교통" : "Courses·Food·Photo·Transport"}</p>
          </div>
          <div onClick={() => router.push(`/${locale}/tour`)}
            className="flex-1 rounded-2xl p-4 cursor-pointer hover:scale-[0.98] transition-transform active:scale-95"
            style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)" }}>
            <span className="text-3xl">🏖️</span>
            <h3 className="text-white font-bold text-sm mt-2">{locale === "ko" ? "부산 투어" : "Busan Tour"}</h3>
            <p className="text-cyan-100 text-[10px] mt-1">{locale === "ko" ? "코스·맛집·포토·교통" : "Courses·Food·Photo·Transport"}</p>
          </div>
        </div>
      </div>

      {/* 시티투어버스 */}
      <div className="px-4 mt-4">
        <h2 className="text-lg font-bold text-gray-800 mb-3">{locale === "ko" ? "🚌 시티투어버스" : "🚌 City Tour Bus"}</h2>
        <div className="flex gap-3">
          <a href="https://www.seoulcitytourbus.co.kr" target="_blank" rel="noopener noreferrer"
            className="flex-1 rounded-2xl p-4 cursor-pointer hover:scale-[0.98] transition-transform active:scale-95 no-underline"
            style={{ background: "linear-gradient(135deg, #ef4444, #f97316)" }}>
            <div className="flex items-center gap-1">
              <span className="text-3xl">🚌</span>
              <span className="px-1.5 py-0.5 bg-yellow-400 text-red-800 text-[8px] font-bold rounded-full">HOT</span>
            </div>
            <h3 className="text-white font-bold text-sm mt-2">{locale === "ko" ? "서울 시티투어" : "Seoul City Tour"}</h3>
            <p className="text-red-100 text-[10px] mt-1">{locale === "ko" ? "2층버스·코스예약" : "Double-decker·Book"}</p>
          </a>
          <a href="https://www.citytourbusan.com" target="_blank" rel="noopener noreferrer"
            className="flex-1 rounded-2xl p-4 cursor-pointer hover:scale-[0.98] transition-transform active:scale-95 no-underline"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)" }}>
            <div className="flex items-center gap-1">
              <span className="text-3xl">🚌</span>
              <span className="px-1.5 py-0.5 bg-yellow-400 text-purple-800 text-[8px] font-bold rounded-full">NEW</span>
            </div>
            <h3 className="text-white font-bold text-sm mt-2">{locale === "ko" ? "부산 시티투어" : "Busan City Tour"}</h3>
            <p className="text-purple-100 text-[10px] mt-1">{locale === "ko" ? "레드·그린·오렌지라인" : "Red·Green·Orange Line"}</p>
          </a>
        </div>
      </div>

      {/* 네이버·쿠팡 투어상품 */}
      <div className="px-4 mt-4">
        <div className="flex gap-2">
          <a href="https://m.search.naver.com/search.naver?query=%EC%84%9C%EC%9A%B8+%EC%8B%9C%ED%8B%B0%ED%88%AC%EC%96%B4+%EC%98%88%EC%95%BD"
            target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-green-50 border-2 border-green-300 rounded-xl hover:bg-green-100 transition-colors active:scale-[0.98]">
            <span className="text-lg">🟢</span>
            <span className="text-xs font-bold text-green-700">{locale === "ko" ? "네이버 투어상품" : "Naver Tour"}</span>
          </a>
          <a href="https://www.coupang.com/np/search?q=%EC%84%9C%EC%9A%B8+%EC%8B%9C%ED%8B%B0%ED%88%AC%EC%96%B4"
            target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-red-50 border-2 border-red-300 rounded-xl hover:bg-red-100 transition-colors active:scale-[0.98]">
            <span className="text-lg">🔴</span>
            <span className="text-xs font-bold text-red-700">{locale === "ko" ? "쿠팡 투어상품" : "Coupang Tour"}</span>
          </a>
        </div>
      </div>

      {/* SOS */}
      <div className="px-4 mt-6">
        <div onClick={() => router.push(`/${locale}/emergency`)}
          className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-4 text-white shadow-md cursor-pointer hover:from-red-600 hover:to-red-700 transition-colors active:scale-[0.99]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"><span className="text-2xl">🆘</span></div>
            <div className="flex-1">
              <h3 className="font-bold text-sm">Emergency / 긴급상황</h3>
              <p className="text-red-100 text-xs mt-0.5">Police 112 · Fire 119 · Tourism 1330</p>
            </div>
            <button className="px-4 py-2 bg-white text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors">SOS</button>
          </div>
        </div>
      </div>

      {/* Nearby */}
      <div className="px-4 mt-6 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">{tHome("nearby")}</h2>
          <button onClick={() => router.push(`/${locale}/map?gps=true&radius=${radius}`)} className="text-sm text-blue-600 font-medium hover:text-blue-800">{tHome("seeAll")} →</button>
        </div>
        <div onClick={() => router.push(`/${locale}/map?gps=true&radius=${radius}`)}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors active:scale-[0.99] border border-blue-100">
          <div className="text-4xl mb-2">📍</div>
          <p className="text-gray-700 text-sm font-medium">{tApp("nearMe")}</p>
          <p className="text-gray-400 text-xs mt-1">{locale === "ko" ? "탭하여 내 주변 관광지 보기" : "Tap to find places near you"}</p>
          <button className="mt-3 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
            {locale === "ko" ? "🗺️ 주변 탐색" : "🗺️ Explore Nearby"}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
