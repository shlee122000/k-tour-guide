"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import BottomNav from "@/components/BottomNav";
import { useState } from "react";

interface PlaceDetail {
  id: number;
  name: Record<string, string>;
  description: Record<string, string>;
  lat: number;
  lng: number;
  category: string;
  icon: string;
  rating: number;
  reviewCount: number;
  address: Record<string, string>;
  phone: string;
  website: string;
  hours: Record<string, string>;
  admission: Record<string, string>;
  photos: string[];
  tags: Record<string, string[]>;
  transport: {
    type: string;
    icon: string;
    name: Record<string, string>;
    detail: Record<string, string>;
    fare: Record<string, string>;
    duration: Record<string, string>;
  }[];
  nearbyRestaurants: {
    id: number;
    name: Record<string, string>;
    cuisine: Record<string, string>;
    rating: number;
    distance: string;
    priceRange: string;
    icon: string;
    hasEnglishMenu: boolean;
  }[];
}

const placesData: Record<number, PlaceDetail> = {
  1: {
    id: 1,
    name: { ko: "경복궁", en: "Gyeongbokgung Palace", ja: "景福宮", zh: "景福宫", es: "Palacio Gyeongbokgung", fr: "Palais Gyeongbokgung", th: "พระราชวังคยองบกกุง", vi: "Cung điện Gyeongbokgung", id: "Istana Gyeongbokgung", de: "Gyeongbokgung-Palast" },
    description: {
      ko: "경복궁은 1395년에 세워진 조선 왕조의 정궁으로, 서울에서 가장 크고 아름다운 궁궐입니다. 근정전, 경회루, 향원정 등 아름다운 건축물이 있으며, 수문장 교대식도 볼 수 있습니다.",
      en: "Gyeongbokgung Palace, built in 1395, was the main royal palace of the Joseon Dynasty. It is the largest and most beautiful palace in Seoul, featuring stunning architecture including Geunjeongjeon Hall, Gyeonghoeru Pavilion, and Hyangwonjeong Pavilion. You can also witness the Royal Guard Changing Ceremony.",
      ja: "景福宮は1395年に建てられた朝鮮王朝の正宮で、ソウルで最も大きく美しい宮殿です。勤政殿、慶会楼、香遠亭など美しい建築物があり、守門将交代式も見られます。",
      zh: "景福宫建于1395年，是朝鲜王朝的正宫，是首尔最大最美的宫殿。这里有勤政殿、庆会楼、香远亭等美丽建筑，还可以观看守门将换岗仪式。",
    },
    lat: 37.5796,
    lng: 126.9770,
    category: "attractions",
    icon: "🏯",
    rating: 4.8,
    reviewCount: 12847,
    address: { ko: "서울 종로구 사직로 161", en: "161 Sajik-ro, Jongno-gu, Seoul", ja: "ソウル市鍾路区社稷路161", zh: "首尔市钟路区社稷路161号" },
    phone: "+82-2-3700-3900",
    website: "http://www.royalpalace.go.kr",
    hours: {
      ko: "09:00 ~ 18:00 (화요일 휴궁)",
      en: "09:00 ~ 18:00 (Closed Tuesdays)",
      ja: "09:00 ~ 18:00 (火曜休館)",
      zh: "09:00 ~ 18:00 (周二闭馆)",
    },
    admission: {
      ko: "성인 3,000원 / 어린이 1,500원 (한복 착용 시 무료)",
      en: "Adult ₩3,000 / Child ₩1,500 (Free with Hanbok)",
      ja: "大人 3,000ウォン / 子供 1,500ウォン (韓服着用時無料)",
      zh: "成人 3,000韩元 / 儿童 1,500韩元 (穿韩服免费)",
    },
    photos: ["🏯", "⛩️", "🏛️", "🌸", "👘"],
    tags: {
      ko: ["역사", "궁궐", "전통문화", "수문장 교대식", "한복체험"],
      en: ["History", "Palace", "Traditional Culture", "Guard Ceremony", "Hanbok"],
      ja: ["歴史", "宮殿", "伝統文化", "守門将交代", "韓服体験"],
      zh: ["历史", "宫殿", "传统文化", "换岗仪式", "韩服体验"],
    },
    transport: [
      {
        type: "subway",
        icon: "🚇",
        name: { ko: "지하철 3호선", en: "Subway Line 3", ja: "地下鉄3号線", zh: "地铁3号线" },
        detail: { ko: "경복궁역 5번 출구 (도보 3분)", en: "Gyeongbokgung Stn. Exit 5 (3 min walk)", ja: "景福宮駅5番出口（徒歩3分）", zh: "景福宫站5号出口（步行3分钟）" },
        fare: { ko: "1,400원~", en: "₩1,400~", ja: "1,400ウォン~", zh: "1,400韩元起" },
        duration: { ko: "서울역에서 약 15분", en: "~15 min from Seoul Stn.", ja: "ソウル駅から約15分", zh: "从首尔站约15分钟" },
      },
      {
        type: "bus",
        icon: "🚌",
        name: { ko: "버스", en: "Bus", ja: "バス", zh: "公交车" },
        detail: { ko: "경복궁앞 정류장 (109, 171, 272, 602번)", en: "Gyeongbokgung Stop (Bus 109, 171, 272, 602)", ja: "景福宮前停留所 (109, 171, 272, 602番)", zh: "景福宫前站 (109, 171, 272, 602路)" },
        fare: { ko: "1,200원 (카드) / 1,300원 (현금)", en: "₩1,200 (Card) / ₩1,300 (Cash)", ja: "1,200ウォン(カード) / 1,300ウォン(現金)", zh: "1,200韩元(卡) / 1,300韩元(现金)" },
        duration: { ko: "서울역에서 약 20분", en: "~20 min from Seoul Stn.", ja: "ソウル駅から約20分", zh: "从首尔站约20分钟" },
      },
      {
        type: "taxi",
        icon: "🚕",
        name: { ko: "택시", en: "Taxi", ja: "タクシー", zh: "出租车" },
        detail: { ko: "서울역에서 경복궁까지", en: "Seoul Stn. to Gyeongbokgung", ja: "ソウル駅から景福宮まで", zh: "从首尔站到景福宫" },
        fare: { ko: "약 6,000~8,000원", en: "~₩6,000~8,000", ja: "約6,000~8,000ウォン", zh: "约6,000~8,000韩元" },
        duration: { ko: "약 10~15분", en: "~10-15 min", ja: "約10~15分", zh: "约10-15分钟" },
      },
    ],
    nearbyRestaurants: [
      {
        id: 101,
        name: { ko: "토속촌 삼계탕", en: "Tosokchon Samgyetang", ja: "土俗村サムゲタン", zh: "土俗村参鸡汤" },
        cuisine: { ko: "한식 (삼계탕)", en: "Korean (Samgyetang)", ja: "韓国料理（サムゲタン）", zh: "韩餐（参鸡汤）" },
        rating: 4.5,
        distance: "350m",
        priceRange: "₩15,000~",
        icon: "🍲",
        hasEnglishMenu: true,
      },
      {
        id: 102,
        name: { ko: "서촌 수제비", en: "Seochon Sujebi", ja: "西村スジェビ", zh: "西村手擀面" },
        cuisine: { ko: "한식 (수제비)", en: "Korean (Sujebi)", ja: "韓国料理（スジェビ）", zh: "韩餐（手擀面）" },
        rating: 4.3,
        distance: "500m",
        priceRange: "₩8,000~",
        icon: "🍜",
        hasEnglishMenu: false,
      },
      {
        id: 103,
        name: { ko: "통인시장 기름떡볶이", en: "Tongin Market Tteokbokki", ja: "通仁市場トッポッキ", zh: "通仁市场炒年糕" },
        cuisine: { ko: "분식 (떡볶이)", en: "Street Food (Tteokbokki)", ja: "粉食（トッポッキ）", zh: "小吃（炒年糕）" },
        rating: 4.4,
        distance: "600m",
        priceRange: "₩5,000~",
        icon: "🍢",
        hasEnglishMenu: true,
      },
      {
        id: 104,
        name: { ko: "광화문 미진", en: "Gwanghwamun Mijin", ja: "光化門ミジン", zh: "光化门美珍" },
        cuisine: { ko: "한식 (냉면)", en: "Korean (Naengmyeon)", ja: "韓国料理（冷麺）", zh: "韩餐（冷面）" },
        rating: 4.2,
        distance: "700m",
        priceRange: "₩12,000~",
        icon: "🍝",
        hasEnglishMenu: true,
      },
    ],
  },
};

// Default place for demo
const defaultPlace = placesData[1];

export default function AttractionDetailPage() {
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<"info" | "transport" | "food" | "reviews">("info");
  const [activePhoto, setActivePhoto] = useState(0);

  const placeId = Number(params.id) || 1;
  const place = placesData[placeId] || defaultPlace;

  const getText = (textMap: Record<string, string>) => {
    return textMap[locale] || textMap.en || Object.values(textMap)[0] || "";
  };

  const getArray = (arrMap: Record<string, string[]>) => {
    return arrMap[locale] || arrMap.en || Object.values(arrMap)[0] || [];
  };

  const tabs = [
    { key: "info" as const, label: t("common.info"), icon: "ℹ️" },
    { key: "transport" as const, label: t("transport.bus").split("/")[0] || "Transport", icon: "🚌" },
    { key: "food" as const, label: locale === "ko" ? "맛집" : "Food", icon: "🍽️" },
    { key: "reviews" as const, label: t("common.reviews"), icon: "⭐" },
  ];

  return (
    <div className="pb-20 bg-white min-h-screen">
      {/* Header with back button */}
      <div className="relative">
        {/* Photo Gallery */}
        <div className="relative h-64 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden">
          <div className="flex h-full transition-transform duration-300" style={{ transform: `translateX(-${activePhoto * 100}%)` }}>
            {place.photos.map((photo, idx) => (
              <div key={idx} className="flex-shrink-0 w-full h-full flex items-center justify-center">
                <span className="text-8xl">{photo}</span>
              </div>
            ))}
          </div>
          {/* Photo dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {place.photos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhoto(idx)}
                className={`w-2 h-2 rounded-full transition-all ${activePhoto === idx ? "bg-white w-5" : "bg-white/50"}`}
              />
            ))}
          </div>
          {/* Photo arrows */}
          {activePhoto > 0 && (
            <button onClick={() => setActivePhoto(activePhoto - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white">‹</button>
          )}
          {activePhoto < place.photos.length - 1 && (
            <button onClick={() => setActivePhoto(activePhoto + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white">›</button>
          )}
        </div>

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-10 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md z-10"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Share button */}
        <button className="absolute top-10 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md z-10">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>

      {/* Place Info Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{getText(place.name)}</h1>
            <p className="text-sm text-gray-500 mt-1">{getText(place.address)}</p>
          </div>
          <div className="flex flex-col items-center ml-3">
            <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1 rounded-lg">
              <span className="text-yellow-500">⭐</span>
              <span className="font-bold text-gray-800">{place.rating}</span>
            </div>
            <span className="text-xs text-gray-400 mt-0.5">{place.reviewCount.toLocaleString()}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {getArray(place.tags).map((tag, idx) => (
            <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5">
            🗺️ {t("common.directions")}
          </button>
          <button className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5">
            📞 {t("common.phone")}
          </button>
          <button className="py-2.5 px-4 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
            ❤️
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 px-4">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-4">
        {/* INFO TAB */}
        {activeTab === "info" && (
          <div className="space-y-4">
            <p className="text-gray-700 text-sm leading-relaxed">{getText(place.description)}</p>

            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-lg">🕐</span>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{t("common.hours")}</p>
                  <p className="text-sm text-gray-800 font-medium">{getText(place.hours)}</p>
                </div>
              </div>
              <div className="border-t border-gray-200" />
              <div className="flex items-start gap-3">
                <span className="text-lg">🎟️</span>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{locale === "ko" ? "입장료" : "Admission"}</p>
                  <p className="text-sm text-gray-800 font-medium">{getText(place.admission)}</p>
                </div>
              </div>
              <div className="border-t border-gray-200" />
              <div className="flex items-start gap-3">
                <span className="text-lg">📞</span>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{t("common.phone")}</p>
                  <p className="text-sm text-blue-600 font-medium">{place.phone}</p>
                </div>
              </div>
              <div className="border-t border-gray-200" />
              <div className="flex items-start gap-3">
                <span className="text-lg">🌐</span>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{t("common.website")}</p>
                  <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 font-medium underline">
                    {place.website}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TRANSPORT TAB */}
        {activeTab === "transport" && (
          <div className="space-y-3">
            {place.transport.map((tr, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{tr.icon}</span>
                  <h3 className="font-bold text-gray-800">{getText(tr.name)}</h3>
                </div>

                <div className="space-y-2 ml-9">
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-gray-400 w-14 flex-shrink-0 pt-0.5">{locale === "ko" ? "노선" : "Route"}</span>
                    <p className="text-sm text-gray-700">{getText(tr.detail)}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-gray-400 w-14 flex-shrink-0 pt-0.5">{t("transport.fare")}</span>
                    <p className="text-sm text-gray-700 font-semibold">{getText(tr.fare)}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-gray-400 w-14 flex-shrink-0 pt-0.5">{t("transport.duration")}</span>
                    <p className="text-sm text-gray-700">{getText(tr.duration)}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* T-money tip */}
            <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
              <span className="text-xl">💳</span>
              <div>
                <p className="font-semibold text-blue-800 text-sm">T-money Card</p>
                <p className="text-xs text-blue-600 mt-1">
                  {locale === "ko"
                    ? "T-money 카드를 사용하면 버스/지하철 요금 할인 및 환승 할인을 받을 수 있습니다. 편의점에서 구입 가능합니다."
                    : "Use T-money card for discounted bus/subway fares and free transfers. Available at convenience stores."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* FOOD TAB */}
        {activeTab === "food" && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-2">
              {locale === "ko"
                ? `${getText(place.name)} 주변 인기 맛집`
                : `Popular restaurants near ${getText(place.name)}`}
            </p>

            {place.nearbyRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                    {restaurant.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-800 text-sm truncate">{getText(restaurant.name)}</h3>
                      {restaurant.hasEnglishMenu && (
                        <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold flex-shrink-0">
                          🌐 EN
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{getText(restaurant.cuisine)}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-yellow-600 font-medium">⭐ {restaurant.rating}</span>
                      <span className="text-xs text-gray-400">📍 {restaurant.distance}</span>
                      <span className="text-xs text-gray-600 font-medium">{restaurant.priceRange}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            {/* Rating Summary */}
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-4xl font-bold text-gray-800">{place.rating}</div>
              <div className="flex justify-center gap-0.5 my-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`text-lg ${star <= Math.round(place.rating) ? "text-yellow-400" : "text-gray-300"}`}>⭐</span>
                ))}
              </div>
              <p className="text-xs text-gray-500">{place.reviewCount.toLocaleString()} {t("common.reviews")}</p>
            </div>

            {/* Sample Reviews */}
            {[
              {
                user: "Sarah M.",
                country: "🇺🇸",
                rating: 5,
                date: "2026-01-15",
                text: { ko: "정말 아름다운 궁궐입니다! 한복을 입으면 무료 입장이라 꼭 체험해보세요.", en: "Absolutely stunning palace! Wearing Hanbok gets you free entry - definitely try it!", ja: "本当に美しい宮殿です！韓服を着ると無料入場できます。", zh: "非常美丽的宫殿！穿韩服可以免费入场，一定要试试！" },
              },
              {
                user: "田中太郎",
                country: "🇯🇵",
                rating: 5,
                date: "2026-01-10",
                text: { ko: "수문장 교대식이 인상적이었습니다. 아침 일찍 가면 사진 찍기 좋아요.", en: "The guard changing ceremony was impressive. Going early morning is great for photos.", ja: "守門将交代式が印象的でした。朝早く行くと写真撮影に最適です。", zh: "换岗仪式很令人印象深刻。早上去拍照最好。" },
              },
              {
                user: "Maria G.",
                country: "🇪🇸",
                rating: 4,
                date: "2025-12-28",
                text: { ko: "역사적인 장소로 매우 감동적이었습니다. 오디오 가이드를 추천합니다.", en: "Very moving historical site. I recommend the audio guide for a deeper experience.", ja: "歴史的な場所で感動的でした。オーディオガイドがおすすめです。", zh: "非常感人的历史遗址。推荐语音导览。" },
              },
            ].map((review, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                      {review.user[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{review.country} {review.user}</p>
                      <p className="text-xs text-gray-400">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={`text-xs ${star <= review.rating ? "text-yellow-400" : "text-gray-300"}`}>⭐</span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{getText(review.text)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
