"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
  getLocationBasedList,
  searchKeyword,
  getCategoryIcon,
  getCategoryName,
  type TourItem,
} from "@/lib/tourApi";

declare global {
  interface Window {
    kakao: any;
  }
}

const categoryFilters = [
  { key: "all", icon: "📍", contentTypeId: 0 },
  { key: "attractions", icon: "🏛️", contentTypeId: 12 },
  { key: "restaurants", icon: "🍽️", contentTypeId: 39 },
  { key: "shopping", icon: "🛍️", contentTypeId: 38 },
  { key: "culture", icon: "🎭", contentTypeId: 14 },
  { key: "accommodation", icon: "🏨", contentTypeId: 32 },
];

interface KakaoMapProps {
  initialCategory?: string;
  initialSearch?: string;
  initialRadius?: number;
  useGPS?: boolean;
}

export default function KakaoMap({
  initialCategory,
  initialSearch,
  initialRadius,
  useGPS = false,
}: KakaoMapProps = {}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [selectedPlace, setSelectedPlace] = useState<TourItem | null>(null);
  const [activeFilter, setActiveFilter] = useState(initialCategory || "all");
  const [overlays, setOverlays] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [places, setPlaces] = useState<TourItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 });
  const [searchQuery, setSearchQuery] = useState(initialSearch || "");
  const [radius] = useState(initialRadius || 20000);
  const locale = useLocale();
  const t = useTranslations();
  const tCat = useTranslations("categories");
  const router = useRouter();

  // Load Kakao Maps SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        setIsLoaded(true);
      });
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780),
      level: 7,
    };

    const newMap = new window.kakao.maps.Map(mapRef.current, options);
    setMap(newMap);

    const zoomControl = new window.kakao.maps.ZoomControl();
    newMap.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

    // Reload markers when map drag ends
    window.kakao.maps.event.addListener(newMap, "dragend", () => {
      const center = newMap.getCenter();
      setMapCenter({ lat: center.getLat(), lng: center.getLng() });
    });

    // GPS 초기화 (useGPS가 true일 때 자동으로 내 위치로 이동)
    if (useGPS) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setMapCenter({ lat, lng });
          newMap.setCenter(new window.kakao.maps.LatLng(lat, lng));
        },
        () => {
          // GPS 실패 시 기본 위치(서울) 사용
        }
      );
    }
  }, [isLoaded]);

  // 두 좌표 간 거리 계산 (km)
  const calcDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // 카카오 장소 검색 (약국, 병원, ATM 등 생활시설용)
  const searchKakaoPlaces = (keyword: string): Promise<TourItem[]> => {
    return new Promise((resolve) => {
      if (!window.kakao?.maps?.services) {
        resolve([]);
        return;
      }
      const ps = new window.kakao.maps.services.Places();
      const location = new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng);

      ps.keywordSearch(keyword, (data: any[], status: string) => {
        if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
          const converted: TourItem[] = data.map((item: any) => ({
            contentid: item.id || String(Math.random()),
            contenttypeid: "0",
            title: item.place_name || "",
            addr1: item.road_address_name || item.address_name || "",
            addr2: "",
            mapx: item.x || "0",
            mapy: item.y || "0",
            firstimage: "",
            firstimage2: "",
            tel: item.phone || "",
            dist: item.distance || "",
          }));
          resolve(converted);
        } else {
          resolve([]);
        }
      }, {
        location,
        radius: Math.min(radius, 20000),
        sort: window.kakao.maps.services.SortBy.DISTANCE,
        size: 15,
      });
    });
  };

  // Fetch places from Tour API
  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const contentTypeId = categoryFilters.find(f => f.key === activeFilter)?.contentTypeId || 0;

      let result: TourItem[];

      if (searchQuery.trim()) {
        result = await searchKeyword({
          keyword: searchQuery.trim(),
          contentTypeId: contentTypeId || undefined,
          numOfRows: 30,
        });

        // GPS 모드일 때: 내 위치 기준으로 가까운 순 정렬 + radius 내만 표시
        if (useGPS && result.length > 0) {
          const maxDistKm = radius / 1000;
          result = result
            .filter(p => p.mapx && p.mapy && Number(p.mapx) > 0 && Number(p.mapy) > 0)
            .map(p => ({
              ...p,
              _dist: calcDistance(mapCenter.lat, mapCenter.lng, Number(p.mapy), Number(p.mapx))
            }))
            .filter((p: any) => p._dist <= maxDistKm)
            .sort((a: any, b: any) => a._dist - b._dist);
        }

        // Tour API 결과가 없거나 적으면 카카오 장소 검색으로 보충
        if (useGPS && result.length < 3) {
          const kakaoResults = await searchKakaoPlaces(searchQuery.trim());
          if (kakaoResults.length > 0) {
            // 카카오 결과를 Tour 결과 뒤에 추가 (중복 제거)
            const existingIds = new Set(result.map(r => r.title));
            const newResults = kakaoResults.filter(k => !existingIds.has(k.title));
            result = [...result, ...newResults];
          }
        }
      } else {
        result = await getLocationBasedList({
          mapX: mapCenter.lng,
          mapY: mapCenter.lat,
          radius: radius,
          contentTypeId: contentTypeId || undefined,
          numOfRows: 30,
          arrange: "E",
        });
      }

      const validPlaces = result.filter(p => p.mapx && p.mapy && Number(p.mapx) > 0 && Number(p.mapy) > 0);
      setPlaces(validPlaces);
    } catch (error) {
      console.error("Map fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when filter or map center changes
  useEffect(() => {
    if (map) {
      fetchPlaces();
    }
  }, [activeFilter, mapCenter, map]);

  // Add markers to map
  useEffect(() => {
    if (!map) return;

    // Clear existing overlays
    overlays.forEach((o) => o.setMap(null));

    if (places.length === 0) {
      setOverlays([]);
      return;
    }

    const newOverlays = places.map((place) => {
      const lat = Number(place.mapy);
      const lng = Number(place.mapx);
      const position = new window.kakao.maps.LatLng(lat, lng);

      const icon = getCategoryIcon(place.contenttypeid);
      const name = place.title.length > 10 ? place.title.substring(0, 10) + "..." : place.title;

      const content = document.createElement("div");
      content.innerHTML = `
        <div style="
          background: white;
          border-radius: 20px;
          padding: 5px 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: 2px solid #3B82F6;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        ">
          <span>${icon}</span>
          <span style="color: #1F2937;">${name}</span>
        </div>
        <div style="
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid #3B82F6;
          margin: 0 auto;
        "></div>
      `;

      content.addEventListener("click", () => {
        setSelectedPlace(place);
        map.panTo(position);
      });

      const overlay = new window.kakao.maps.CustomOverlay({
        content,
        position,
        yAnchor: 1.3,
      });

      overlay.setMap(map);
      return overlay;
    });

    setOverlays(newOverlays);

    // 검색 결과 표시 후 지도 위치 조정
    if (searchQuery.trim() && places.length > 0) {
      if (useGPS) {
        // GPS 모드: 내 위치 유지, 적절한 줌만 조정
        map.setLevel(5);
      } else {
        // 일반 검색: 첫 번째 결과로 이동
        const firstPlace = places[0];
        const firstPos = new window.kakao.maps.LatLng(Number(firstPlace.mapy), Number(firstPlace.mapx));
        map.setCenter(firstPos);
        map.setLevel(5);
      }
    }
  }, [map, places, locale]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchPlaces();
    }
  };

  const goToDetail = (place: TourItem) => {
    router.push(`/${locale}/detail/${place.contentid}?type=${place.contenttypeid}`);
  };

  const goToDirections = (place: TourItem) => {
    window.open(
      `https://map.kakao.com/link/to/${place.title},${place.mapy},${place.mapx}`,
      "_blank"
    );
  };

  return (
    <div className="relative h-full">
      {/* Search Bar */}
      <div className="absolute top-3 left-3 right-3 z-10">
        <div className="flex gap-2 mb-2">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={locale === "ko" ? "장소 검색..." : "Search places..."}
              className="w-full pl-9 pr-4 py-2.5 bg-white/95 backdrop-blur-sm text-gray-800 rounded-xl text-sm placeholder-gray-400 shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-3 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-md hover:bg-blue-700 transition-colors"
          >
            🔍
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categoryFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${
                activeFilter === filter.key
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white/90 backdrop-blur-sm text-gray-600 border-gray-200"
              }`}
            >
              <span>{filter.icon}</span>
              <span>{filter.key === "all" ? (locale === "ko" ? "전체" : "All") : tCat(filter.key)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md flex items-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
            <span className="text-xs text-gray-600">{t("common.loading")}</span>
          </div>
        </div>
      )}

      {/* Place count */}
      {!loading && places.length > 0 && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm text-xs text-gray-600">
            📍 {places.length} {locale === "ko" ? "개 장소" : "places"}
          </div>
        </div>
      )}

      {/* GPS + Reload buttons */}
      <div className="absolute bottom-28 right-3 z-10 flex flex-col gap-2">
        <button
          onClick={() => {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setMapCenter({ lat, lng });
                if (map) {
                  map.setCenter(new window.kakao.maps.LatLng(lat, lng));
                }
              },
              () => alert(locale === "ko" ? "위치 정보를 가져올 수 없습니다" : "Unable to get location")
            );
          }}
          className="w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
        >
          📍
        </button>
        <button
          onClick={fetchPlaces}
          className="w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
        >
          🔄
        </button>
      </div>

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-gray-500 text-sm">{t("common.loading")}</p>
          </div>
        </div>
      )}

      {/* Selected Place Card */}
      {selectedPlace && (
        <div className="absolute bottom-4 left-3 right-3 z-10">
          <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
            <button
              onClick={() => setSelectedPlace(null)}
              className="absolute top-3 right-3 w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200"
            >
              ✕
            </button>

            <div
              className="flex items-start gap-3 cursor-pointer"
              onClick={() => goToDetail(selectedPlace)}
            >
              <div className="w-16 h-16 bg-blue-50 rounded-xl flex-shrink-0 overflow-hidden">
                {selectedPlace.firstimage ? (
                  <img
                    src={selectedPlace.firstimage}
                    alt={selectedPlace.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">
                    {getCategoryIcon(selectedPlace.contenttypeid)}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 text-sm line-clamp-1">
                  {selectedPlace.title}
                </h3>
                <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">
                  {selectedPlace.addr1}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-semibold">
                    {getCategoryName(selectedPlace.contenttypeid, locale)}
                  </span>
                  {selectedPlace.dist && (
                    <span className="text-[10px] text-gray-400">
                      📍 {(Number(selectedPlace.dist) / 1000).toFixed(1)}km
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => goToDetail(selectedPlace)}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5"
              >
                ℹ️ {t("common.info")}
              </button>
              <button
                onClick={() => goToDirections(selectedPlace)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
              >
                🗺️ {t("common.directions")}
              </button>
              {selectedPlace.tel && (
                <a
                  href={`tel:${selectedPlace.tel}`}
                  className="py-2.5 px-4 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  📞
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
