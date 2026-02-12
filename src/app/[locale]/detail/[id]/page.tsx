"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import BottomNav from "@/components/BottomNav";
import {
  getDetailCommon,
  getDetailIntro,
  getCategoryIcon,
  getCategoryName,
  AREA_NAMES,
  type TourDetailItem,
  type TourDetailIntro,
} from "@/lib/tourApi";

export default function DetailPage() {
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const t = useTranslations();

  const contentId = params.id as string;
  const contentTypeId = Number(searchParams.get("type") || 12);

  const [detail, setDetail] = useState<TourDetailItem | null>(null);
  const [intro, setIntro] = useState<TourDetailIntro | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "map">("info");

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const [detailData, introData] = await Promise.all([
          getDetailCommon(contentId),
          getDetailIntro(contentId, contentTypeId),
        ]);
        setDetail(detailData);
        setIntro(introData);
      } catch (error) {
        console.error("Detail fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (contentId) {
      fetchDetail();
    }
  }, [contentId, contentTypeId]);

  const getText = (textMap: Record<string, string>) => {
    return textMap[locale] || textMap.en || Object.values(textMap)[0] || "";
  };

  // Extract useful info from intro based on content type
  const getInfoItems = () => {
    if (!intro) return [];
    const items: { icon: string; label: string; value: string }[] = [];

    // Attraction (12)
    if (contentTypeId === 12) {
      if (intro.usetime) items.push({ icon: "🕐", label: locale === "ko" ? "이용시간" : "Hours", value: intro.usetime.replace(/<[^>]*>/g, "") });
      if (intro.restdate) items.push({ icon: "📅", label: locale === "ko" ? "휴무일" : "Closed", value: intro.restdate.replace(/<[^>]*>/g, "") });
      if (intro.infocenter) items.push({ icon: "📞", label: locale === "ko" ? "문의처" : "Contact", value: intro.infocenter.replace(/<[^>]*>/g, "") });
      if (intro.parking) items.push({ icon: "🅿️", label: locale === "ko" ? "주차" : "Parking", value: intro.parking.replace(/<[^>]*>/g, "") });
    }

    // Restaurant (39)
    if (contentTypeId === 39) {
      if (intro.opentimefood) items.push({ icon: "🕐", label: locale === "ko" ? "영업시간" : "Hours", value: intro.opentimefood.replace(/<[^>]*>/g, "") });
      if (intro.firstmenu) items.push({ icon: "⭐", label: locale === "ko" ? "대표메뉴" : "Main Menu", value: intro.firstmenu.replace(/<[^>]*>/g, "") });
      if (intro.treatmenu) items.push({ icon: "📋", label: locale === "ko" ? "취급메뉴" : "Menu", value: intro.treatmenu.replace(/<[^>]*>/g, "") });
      if (intro.packing) items.push({ icon: "📦", label: locale === "ko" ? "포장" : "Takeout", value: intro.packing.replace(/<[^>]*>/g, "") });
    }

    // Culture (14)
    if (contentTypeId === 14) {
      if (intro.usetimeculture) items.push({ icon: "🕐", label: locale === "ko" ? "이용시간" : "Hours", value: intro.usetimeculture.replace(/<[^>]*>/g, "") });
      if (intro.usefee) items.push({ icon: "🎟️", label: locale === "ko" ? "이용요금" : "Fee", value: intro.usefee.replace(/<[^>]*>/g, "") });
      if (intro.restdateculture) items.push({ icon: "📅", label: locale === "ko" ? "휴무일" : "Closed", value: intro.restdateculture.replace(/<[^>]*>/g, "") });
      if (intro.infocenterculture) items.push({ icon: "📞", label: locale === "ko" ? "문의처" : "Contact", value: intro.infocenterculture.replace(/<[^>]*>/g, "") });
    }

    // Shopping (38)
    if (contentTypeId === 38) {
      if (intro.opentime) items.push({ icon: "🕐", label: locale === "ko" ? "영업시간" : "Hours", value: intro.opentime.replace(/<[^>]*>/g, "") });
      if (intro.restdateshopping) items.push({ icon: "📅", label: locale === "ko" ? "휴무일" : "Closed", value: intro.restdateshopping.replace(/<[^>]*>/g, "") });
      if (intro.infocentershopping) items.push({ icon: "📞", label: locale === "ko" ? "문의처" : "Contact", value: intro.infocentershopping.replace(/<[^>]*>/g, "") });
    }

    return items;
  };

  // Strip HTML tags from overview
  const cleanHtml = (html: string) => {
    return html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .trim();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-gray-500 text-sm">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-4xl mb-2">😕</p>
          <p className="text-gray-500 text-sm">{t("common.error")}</p>
          <button onClick={() => router.back()} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm">
            {t("common.back")}
          </button>
        </div>
      </div>
    );
  }

  const infoItems = getInfoItems();

  return (
    <div className="pb-20 bg-white min-h-screen">
      {/* Header Image */}
      <div className="relative h-64 bg-gradient-to-br from-blue-100 to-blue-200">
        {detail.firstimage && !imageError ? (
          <img
            src={detail.firstimage}
            alt={detail.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-8xl">{getCategoryIcon(contentTypeId)}</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-10 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md z-10"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start gap-2">
          <span className="text-2xl">{getCategoryIcon(contentTypeId)}</span>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{detail.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{detail.addr1} {detail.addr2 || ""}</p>
          </div>
        </div>

        {/* Category & Area tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
            {getCategoryName(contentTypeId, locale)}
          </span>
          {detail.tel && (
            <a href={`tel:${detail.tel}`} className="px-2.5 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
              📞 {detail.tel}
            </a>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          {detail.mapx && detail.mapy && (
            <a
              href={`https://map.kakao.com/link/to/${detail.title},${detail.mapy},${detail.mapx}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5"
            >
              🗺️ {t("common.directions")}
            </a>
          )}
          {detail.tel && (
            <a
              href={`tel:${detail.tel}`}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
            >
              📞 {t("common.phone")}
            </a>
          )}
          {detail.homepage && (
            <a
              href={detail.homepage.match(/href="([^"]+)"/)?.[1] || detail.homepage.replace(/<[^>]*>/g, "")}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              🌐
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 px-4">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "info" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
            }`}
          >
            ℹ️ {t("common.info")}
          </button>
          {detail.mapx && detail.mapy && (
            <button
              onClick={() => setActiveTab("map")}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "map" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
              }`}
            >
              🗺️ {locale === "ko" ? "지도" : "Map"}
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-4">
        {activeTab === "info" && (
          <div className="space-y-4">
            {/* Overview */}
            {detail.overview && (
              <div>
                <h2 className="font-bold text-gray-800 text-sm mb-2">
                  {locale === "ko" ? "소개" : "Overview"}
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {cleanHtml(detail.overview)}
                </p>
              </div>
            )}

            {/* Detail Info */}
            {infoItems.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                {infoItems.map((item, idx) => (
                  <div key={idx}>
                    {idx > 0 && <div className="border-t border-gray-200 mb-3" />}
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 font-medium">{item.label}</p>
                        <p className="text-sm text-gray-800 mt-0.5">{item.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Address */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-lg">📍</span>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{locale === "ko" ? "주소" : "Address"}</p>
                  <p className="text-sm text-gray-800 mt-0.5">{detail.addr1} {detail.addr2 || ""}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "map" && detail.mapx && detail.mapy && (
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden border border-gray-200 h-72">
              <iframe
                src={`https://map.kakao.com/link/map/${detail.title},${detail.mapy},${detail.mapx}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>

            <a
              href={`https://map.kakao.com/link/to/${detail.title},${detail.mapy},${detail.mapx}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors text-center"
            >
              🗺️ {locale === "ko" ? "카카오맵에서 길찾기" : "Get Directions in Kakao Map"}
            </a>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
