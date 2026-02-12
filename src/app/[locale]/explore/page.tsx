"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import {
  getAreaBasedList,
  getLocationBasedList,
  searchKeyword,
  CONTENT_TYPES,
  AREA_CODES,
  AREA_NAMES,
  getCategoryIcon,
  getCategoryName,
  type TourItem,
} from "@/lib/tourApi";

type CategoryKey = keyof typeof CONTENT_TYPES;

const categoryTabs: { key: CategoryKey; icon: string }[] = [
  { key: "attractions", icon: "🏛️" },
  { key: "restaurants", icon: "🍽️" },
  { key: "culture", icon: "🎭" },
  { key: "shopping", icon: "🛍️" },
  { key: "festivals", icon: "🎉" },
  { key: "accommodation", icon: "🏨" },
];

const areaList = [
  { code: 0, name: { ko: "전체", en: "All", ja: "全体", zh: "全部" } },
  { code: 1, name: AREA_NAMES[1] },
  { code: 6, name: AREA_NAMES[6] },
  { code: 39, name: AREA_NAMES[39] },
  { code: 31, name: AREA_NAMES[31] },
  { code: 32, name: AREA_NAMES[32] },
  { code: 4, name: AREA_NAMES[4] },
  { code: 5, name: AREA_NAMES[5] },
  { code: 2, name: AREA_NAMES[2] },
  { code: 3, name: AREA_NAMES[3] },
];

export default function ExplorePage() {
  const locale = useLocale();
  const t = useTranslations();
  const tCat = useTranslations("categories");
  const searchParams = useSearchParams();

  const initialCategory = (searchParams.get("type") as CategoryKey) || "attractions";

  const [activeCategory, setActiveCategory] = useState<CategoryKey>(initialCategory);
  const [activeArea, setActiveArea] = useState(0);
  const [items, setItems] = useState<TourItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [useLocation, setUseLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const getText = (textMap: Record<string, string>) => {
    return textMap[locale] || textMap.en || Object.values(textMap)[0] || "";
  };

  // Fetch data
  const fetchData = async (resetPage = true) => {
    setLoading(true);
    const currentPage = resetPage ? 1 : page;
    if (resetPage) setPage(1);

    try {
      let result: TourItem[];

      if (searchQuery.trim()) {
        result = await searchKeyword({
          keyword: searchQuery.trim(),
          contentTypeId: CONTENT_TYPES[activeCategory],
          areaCode: activeArea || undefined,
          numOfRows: 20,
          pageNo: currentPage,
        });
      } else if (useLocation && userLocation) {
        result = await getLocationBasedList({
          mapX: userLocation.lng,
          mapY: userLocation.lat,
          radius: 20000,
          contentTypeId: CONTENT_TYPES[activeCategory],
          numOfRows: 20,
          pageNo: currentPage,
        });
      } else {
        result = await getAreaBasedList({
          contentTypeId: CONTENT_TYPES[activeCategory],
          areaCode: activeArea || undefined,
          numOfRows: 20,
          pageNo: currentPage,
          arrange: "Q",
        });
      }

      if (resetPage) {
        setItems(result);
      } else {
        setItems((prev) => [...prev, ...result]);
      }
      setHasMore(result.length >= 20);
      setTotalCount(result.length);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
  }, [activeCategory, activeArea, useLocation, userLocation]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchData(true);
    }
  };

  const handleLoadMore = () => {
    setPage((p) => p + 1);
    fetchData(false);
  };

  const handleLocationToggle = () => {
    if (!useLocation && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setUseLocation(true);
        },
        () => {
          alert(locale === "ko" ? "위치 정보를 가져올 수 없습니다." : "Unable to get location.");
        }
      );
    } else {
      setUseLocation(!useLocation);
    }
  };

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-4 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">
            {locale === "ko" ? "🇰🇷 한국 관광 탐색" : "🇰🇷 Explore Korea"}
          </h1>
          <button
            onClick={handleLocationToggle}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              useLocation
                ? "bg-green-500 text-white"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            📍 {useLocation ? (locale === "ko" ? "내 주변" : "Near Me") : (locale === "ko" ? "위치 사용" : "Use Location")}
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={locale === "ko" ? "관광지, 식당, 축제 검색..." : "Search places, food, festivals..."}
              className="w-full pl-10 pr-4 py-3 bg-white/95 text-gray-800 rounded-xl text-sm placeholder-gray-400 focus:outline-none"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold transition-colors"
          >
            🔍
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b border-gray-200 px-2">
        <div className="flex overflow-x-auto scrollbar-hide">
          {categoryTabs.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-1 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeCategory === cat.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{tCat(cat.key === "festivals" ? "culture" : cat.key === "accommodation" ? "attractions" : cat.key)}</span>
              {cat.key === "festivals" && <span className="text-[10px]">{locale === "ko" ? "축제" : "Festival"}</span>}
              {cat.key === "accommodation" && <span className="text-[10px]">{locale === "ko" ? "숙박" : "Stay"}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Area Filter */}
      <div className="px-3 py-2 bg-white border-b border-gray-100">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {areaList.map((area) => (
            <button
              key={area.code}
              onClick={() => setActiveArea(area.code)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeArea === area.code
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {getText(area.name)}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-4 pt-3">
        {/* Loading */}
        {loading && items.length === 0 && (
          <div className="flex flex-col items-center py-12">
            <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mb-3" />
            <p className="text-gray-500 text-sm">{t("common.loading")}</p>
          </div>
        )}

        {/* No results */}
        {!loading && items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-2">🔍</p>
            <p className="text-gray-500 text-sm">{t("common.noResults")}</p>
          </div>
        )}

        {/* Item List */}
        <div className="space-y-3">
          {items.map((item) => (
            <Link
              key={item.contentid}
              href={`/${locale}/detail/${item.contentid}?type=${item.contenttypeid}`}
              className="flex bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="w-28 h-28 flex-shrink-0 bg-gray-100 relative overflow-hidden">
                {item.firstimage ? (
                  <img
                    src={item.firstimage}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-blue-50 to-blue-100">
                    {getCategoryIcon(item.contenttypeid)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 p-3 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{item.title}</h3>
                  <span className="text-lg flex-shrink-0">{getCategoryIcon(item.contenttypeid)}</span>
                </div>

                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.addr1 || ""}</p>

                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-semibold">
                    {getCategoryName(item.contenttypeid, locale)}
                  </span>
                  {item.areacode && AREA_NAMES[Number(item.areacode)] && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium">
                      📍 {getText(AREA_NAMES[Number(item.areacode)])}
                    </span>
                  )}
                  {item.dist && (
                    <span className="text-[10px] text-gray-400">
                      {(Number(item.dist) / 1000).toFixed(1)}km
                    </span>
                  )}
                </div>

                {item.tel && (
                  <p className="text-[10px] text-gray-400 mt-1 truncate">📞 {item.tel}</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Load More */}
        {hasMore && items.length > 0 && !loading && (
          <button
            onClick={handleLoadMore}
            className="w-full py-3 mt-4 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            {locale === "ko" ? "더 보기 ↓" : "Load More ↓"}
          </button>
        )}

        {loading && items.length > 0 && (
          <div className="flex justify-center py-4">
            <div className="animate-spin w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
