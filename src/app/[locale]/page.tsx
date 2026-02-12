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
  {
    id: 1,
    searchName: "경복궁",
    name: { ko: "경복궁", en: "Gyeongbokgung Palace", ja: "景福宮", zh: "景福宫", es: "Palacio Gyeongbokgung", fr: "Palais Gyeongbokgung", th: "พระราชวังคยองบกกุง", vi: "Cung điện Gyeongbokgung", id: "Istana Gyeongbokgung", de: "Gyeongbokgung-Palast" },
    image: "🏯",
    rating: 4.8,
    city: "Seoul",
  },
  {
    id: 2,
    searchName: "해운대해수욕장",
    name: { ko: "해운대 해수욕장", en: "Haeundae Beach", ja: "海雲台ビーチ", zh: "海云台海水浴场", es: "Playa Haeundae", fr: "Plage Haeundae", th: "หาดแฮอุนแด", vi: "Bãi biển Haeundae", id: "Pantai Haeundae", de: "Haeundae-Strand" },
    image: "🏖️",
    rating: 4.6,
    city: "Busan",
  },
  {
    id: 3,
    searchName: "성산일출봉",
    name: { ko: "제주 성산일출봉", en: "Seongsan Sunrise Peak", ja: "城山日出峰", zh: "城山日出峰", es: "Pico Seongsan", fr: "Pic Seongsan", th: "ยอดเขาซองซาน", vi: "Đỉnh Seongsan", id: "Puncak Seongsan", de: "Seongsan-Gipfel" },
    image: "🌋",
    rating: 4.7,
    city: "Jeju",
  },
  {
    id: 4,
    searchName: "남산타워",
    name: { ko: "남산타워", en: "N Seoul Tower", ja: "Nソウルタワー", zh: "南山塔", es: "Torre N Seoul", fr: "Tour N Seoul", th: "หอคอยเอ็นโซล", vi: "Tháp N Seoul", id: "Menara N Seoul", de: "N Seoul Tower" },
    image: "🗼",
    rating: 4.5,
    city: "Seoul",
  },
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

  // 카테고리 클릭 → 지도 또는 해당 페이지로 이동 (GPS + 반경 포함)
  const handleCategoryClick = (cat: typeof categories[0]) => {
    if (cat.route) {
      router.push(`/${locale}${cat.route}`);
    } else if (cat.mapCategory) {
      router.push(`/${locale}/map?category=${cat.mapCategory}&radius=${radius}&gps=true`);
    }
  };

  // 검색 실행 → 지도 페이지로 이동
  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/${locale}/map?search=${encodeURIComponent(searchQuery.trim())}&radius=${radius}&gps=true`);
    }
  };

  // 인기 관광지 카드 클릭 → 지도에서 검색
  const handlePlaceClick = (place: typeof popularPlaces[0]) => {
    router.push(`/${locale}/map?search=${encodeURIComponent(place.searchName)}`);
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="px-4 pt-12 pb-6">
          {/* Top bar */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{tApp("title")}</h1>
              <p className="text-blue-200 text-sm mt-0.5">{tApp("subtitle")}</p>
            </div>
            <LanguageSelector />
          </div>

          {/* Search bar */}
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={tApp("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-12 pr-14 py-3.5 bg-white/95 backdrop-blur-sm text-gray-800 rounded-2xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              🔍
            </button>
          </div>

          {/* Radius slider */}
          <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-blue-100">📍 {t("radius.title")}</span>
              <span className="text-sm font-bold text-white">{radius}km</span>
            </div>
            <input
              type="range"
              min="30"
              max="300"
              step="10"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
            />
            <div className="flex justify-between text-xs text-blue-200 mt-1">
              <span>30km</span>
              <span>150km</span>
              <span>300km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 -mt-1">
        <div className="bg-white rounded-2xl shadow-md p-4">
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => handleCategoryClick(cat)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl ${cat.color} hover:scale-105 transition-transform active:scale-95`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-semibold">{tCat(cat.key)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Places */}
      <div className="px-4 mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">{tHome("popular")}</h2>
          <button
            onClick={() => router.push(`/${locale}/explore`)}
            className="text-sm text-blue-600 font-medium hover:text-blue-800"
          >
            {tHome("seeAll")} →
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {popularPlaces.map((place) => {
            const locale = (typeof window !== "undefined" 
              ? window.location.pathname.split("/")[1] 
              : "en") as keyof typeof place.name;
            const name = place.name[locale] || place.name.en;

            return (
              <div
                key={place.id}
                onClick={() => handlePlaceClick(place)}
                className="flex-shrink-0 w-44 bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer active:scale-[0.98]"
              >
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

      {/* Quick Access - SOS */}
      <div className="px-4 mt-6">
        <div
          onClick={() => router.push(`/${locale}/emergency`)}
          className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-4 text-white shadow-md cursor-pointer hover:from-red-600 hover:to-red-700 transition-colors active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🆘</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm">Emergency / 긴급상황</h3>
              <p className="text-red-100 text-xs mt-0.5">Police 112 · Fire 119 · Tourism 1330</p>
            </div>
            <button className="px-4 py-2 bg-white text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors">
              SOS
            </button>
          </div>
        </div>
      </div>

      {/* Nearby section */}
      <div className="px-4 mt-6 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">{tHome("nearby")}</h2>
          <button
            onClick={() => router.push(`/${locale}/map?gps=true&radius=${radius}`)}
            className="text-sm text-blue-600 font-medium hover:text-blue-800"
          >
            {tHome("seeAll")} →
          </button>
        </div>
        <div
          onClick={() => router.push(`/${locale}/map?gps=true&radius=${radius}`)}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors active:scale-[0.99] border border-blue-100"
        >
          <div className="text-4xl mb-2">📍</div>
          <p className="text-gray-700 text-sm font-medium">{tApp("nearMe")}</p>
          <p className="text-gray-400 text-xs mt-1">
            {locale === "ko" ? "탭하여 내 주변 관광지 보기" : "Tap to find places near you"}
          </p>
          <button className="mt-3 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
            {locale === "ko" ? "🗺️ 주변 탐색" : "🗺️ Explore Nearby"}
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
